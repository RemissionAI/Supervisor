import type { Document } from 'langchain/document'
import { KnowledgeRepository } from '~/core/repositories/knowledge.repository'
import type { TrainingTaskModel } from '~/core/models/train.model'
import { TrainingTaskRepository } from '~/core/repositories/train.repository'
import type {
  SitemapType,
} from '~/lib/validations/train.validation'
import {
  LoadFileSchema,
  LoadWebSchema,
} from '~/lib/validations/train.validation'
import type { Bindings } from '~/common/interfaces/common.interface'
import { addDocumentsToStore } from '~/lib/utils/ai/embeddings'
import DataLoader from '~/lib/utils/ai/data-loader'
import { generateRandomString } from '~/lib/utils/strings'
import { BATCH_DELAY_SECONDS, BATCH_SIZE } from '~/config/constants'
import { chunkArray } from '~/lib/utils/arrays'

async function handleKnowledge(
  env: Bindings,
  taskId: number,
  type: 'url' | 'pdf',
  source: string | File,
): Promise<void> {
  const knowledgeRepo = new KnowledgeRepository(env)
  const documents = await fetchSourceDocuments(env, type, source, { taskId })
  await addDocumentsToStore(env, documents)

  await knowledgeRepo.insert({
    type,
    taskId,
    content: documents.map(doc => doc.pageContent).join('\n\n'),
    source: typeof source === 'string' ? source : source.name,
    createdAt: new Date(),
  })
}

export async function getSitemapBatches(
  sitemaps: SitemapType[],
  batchSize: number = BATCH_SIZE,
): Promise<string[][]> {
  const batches: string[][] = []

  for (const sitemap of sitemaps) {
    const elements = await DataLoader.sitemap(sitemap.source)
    const links = elements.map(element => element.loc)
    batches.push(...chunkArray(links, batchSize))
  }

  return batches
}
export async function processWeb(
  env: Bindings,
  inputData: unknown,
): Promise<void> {
  const validatedData = LoadWebSchema.parse(inputData)
  const taskRepo = new TrainingTaskRepository(env)

  const urlLinks = validatedData.data
    .filter(data => data.type === 'url')
    .map(link => link.source)

  const sitemaps = validatedData.data.filter(data => data.type === 'sitemap')
  const sitemapBatches = await getSitemapBatches(sitemaps)

  const totalUrlBatches = urlLinks.length
  const totalSitemapBatches = sitemapBatches.length
  const totalBatches = totalUrlBatches + totalSitemapBatches

  if (totalBatches === 0) {
    throw new Error('No valid links or sitemaps to process')
  }

  const newTask = await taskRepo.insert({
    data: validatedData.data,
    status: 'queued',
    startedAt: new Date(),
    details: { totalBatches, batchesCompleted: [], failedLinks: [] },
  })

  if (urlLinks.length > 0) {
    await queueBatch(env, newTask.id, urlLinks)
  }

  if (sitemapBatches.length > 0) {
    for (let i = 0; i < sitemapBatches.length; i++) {
      const delaySeconds = (i + 1) * BATCH_DELAY_SECONDS + 5
      await queueBatch(env, newTask.id, sitemapBatches[i], delaySeconds)
    }
  }
}

async function queueBatch(
  env: Bindings,
  taskId: number,
  links: string[],
  delaySeconds?: number,
): Promise<void> {
  await env.SUPERVISOR_TRAINING_QUEUE.send(
    {
      taskId,
      links,
      batchIndex: generateRandomString(4),
    },
    { delaySeconds },
  )
}

export async function processQueueTask(
  env: Bindings,
  taskId: number,
  links: string[],
  batchIndex: string,
): Promise<void> {
  const taskRepo = new TrainingTaskRepository(env)
  await taskRepo.update(taskId, { status: 'processing' })

  const results = await Promise.allSettled(
    links.map(link => handleKnowledge(env, taskId, 'url', link)),
  )

  const failedLinks = getFailedLinks(results, links)
  const existingTask = await taskRepo.get(taskId)

  if (!existingTask) {
    throw new Error('Task not found')
  }

  const updatedDetails = updateTaskDetails(
    existingTask,
    batchIndex,
    failedLinks,
  )
  const isCompleted = updatedDetails.batchesCompleted.length === existingTask.details?.totalBatches

  await taskRepo.update(taskId, {
    details: updatedDetails,
    status: isCompleted ? 'completed' : existingTask.status,
    finishedAt: isCompleted ? new Date() : null,
  })

  if (failedLinks.length > 0) {
    console.error('Failed to process some links in sitemap', {
      taskId,
      failedLinks,
    })
  }
}

async function fetchSourceDocuments(
  env: Bindings,
  type: 'url' | 'pdf',
  source: string | File,
  customMetadata?: Record<string, any>,
): Promise<Document[]> {
  try {
    const documents = await loadDocuments(env, type, source)
    return documents.map(doc => ({
      pageContent: doc.pageContent,
      metadata: {
        docMeta: JSON.stringify(doc.metadata),
        ...customMetadata,
      },
    }))
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Failed to load documents of type ${type}`, {
      type,
      source,
      error: errorMessage,
    })
    throw new Error(`Failed to load documents of type ${type}: ${errorMessage}`)
  }
}

async function loadDocuments(
  env: Bindings,
  type: 'url' | 'pdf',
  source: string | File,
): Promise<Document[]> {
  switch (type) {
    case 'url':
      return await DataLoader.jinaUrlReader(source as string, {
        apiToken: env.JINA_TOKEN,
      })
    case 'pdf':
      return await DataLoader.pdf(source as File)
    default:
      throw new Error(`Unsupported document type: ${type}`)
  }
}

export async function processFile(env: Bindings, body: unknown): Promise<void> {
  const data = LoadFileSchema.parse(body)
  const file = data.source

  const taskRepo = new TrainingTaskRepository(env)
  const knowledgeRepo = new KnowledgeRepository(env)

  const newTask = await taskRepo.insert({
    data: [{ type: data.type, source: file.name as unknown as File }],
    status: 'processing',
    startedAt: new Date(),
  })

  try {
    const documents = await fetchSourceDocuments(env, data.type, file, {
      taskId: newTask.id,
    })
    await addDocumentsToStore(env, documents)

    await knowledgeRepo.insert({
      type: data.type,
      taskId: newTask.id,
      content: documents.map(doc => doc.pageContent).join('\n\n'),
      source: file.name,
      createdAt: new Date(),
    })

    await taskRepo.update(newTask.id, {
      status: 'completed',
      finishedAt: new Date(),
    })
  }
  catch (error) {
    await handleProcessFileError(taskRepo, newTask.id, error)
  }
}

function getFailedLinks(
  results: PromiseSettledResult<void>[],
  links: string[],
): Array<{ url: string, reason: string }> {
  return results
    .map((result, index) => ({ result, url: links[index] }))
    .filter(
      (item): item is { result: PromiseRejectedResult, url: string } =>
        item.result.status === 'rejected',
    )
    .map(item => ({
      url: item.url,
      reason: item.result.reason instanceof Error
        ? item.result.reason.message
        : String(item.result.reason),
    }))
}

function updateTaskDetails(
  existingTask: TrainingTaskModel,
  batchIndex: string,
  failedLinks: Array<{ url: string, reason: string }>,
) {
  return {
    ...existingTask.details,
    batchesCompleted: [
      ...(existingTask.details?.batchesCompleted || []),
      batchIndex,
    ],
    failedLinks: [...(existingTask.details?.failedLinks || []), ...failedLinks],
  }
}

async function handleProcessFileError(
  taskRepo: TrainingTaskRepository,
  taskId: number,
  error: unknown,
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const existingTask = await taskRepo.get(taskId)
  await taskRepo.update(taskId, {
    status: 'failed',
    details: {
      ...existingTask?.details,
      error: errorMessage,
    },
    finishedAt: new Date(),
  })

  console.error(`Failed to train with single PDF for task ${taskId}`, {
    taskId,
    error: errorMessage,
  })
  throw error
}

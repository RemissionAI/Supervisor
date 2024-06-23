import type { Document } from 'langchain/document'
import { KnowledgeRepository } from '../repositories/knowledge.repository'
import type { SitemapType } from '~/lib/validations/train.validation'
import {
  LoadKnowledgeSchema,
  PdfLoadSchema,
} from '~/lib/validations/train.validation'
import type { Bindings } from '~/common/interfaces/common.interface'
import { addDocumentsToStore } from '~/lib/utils/ai/embeddings'
import DataLoader from '~/lib/utils/ai/data-loader'
import { TrainingTaskRepository } from '~/core/repositories/train.repository'
import { generateRandomString } from '~/lib/utils/str'

async function handleKnowledge(
  env: Bindings,
  taskId: number,
  type: 'url' | 'pdf',
  source: string | File,
) {
  const knowledgeRepo = new KnowledgeRepository(env)
  const documents = await fetchSourceDocuments(env, type, source, { taskId })
  await addDocumentsToStore(env, documents)

  await knowledgeRepo.insert({
    type,
    taskId,
    content: documents.map(content => content.pageContent).join('\n--\n'),
    source: typeof source === 'string' ? source : source.name,
    createdAt: new Date(),
  })
}

export async function getSitemapBatches(
  sitemaps: SitemapType[],
  batchSize: number = 20,
) {
  const batches: string[][] = []

  for (const sitemap of sitemaps) {
    const elements = await DataLoader.sitemap(sitemap.source)
    const links = elements.map(element => element.loc)

    for (let i = 0; i < links.length; i += batchSize) {
      batches.push(links.slice(i, i + batchSize))
    }
  }

  return batches
}

export async function process(env: Bindings, inputData: unknown) {
  const validatedData = LoadKnowledgeSchema.parse(inputData)
  const taskRepo = new TrainingTaskRepository(env)

  const newTask = await taskRepo.insert({
    data: validatedData.data,
    status: 'queued',
    startedAt: new Date(),
  })

  const linksArr = validatedData.data
    .filter(data => data.type === 'url')
    .map(link => link.source)

  await env.SUPERVISOR_TRAINING_QUEUE.send({
    taskId: newTask.id,
    links: linksArr,
    batchIndex: generateRandomString(4),
  })

  const sitemapArr = validatedData.data.filter(
    data => data.type === 'sitemap',
  )
  const batches = await getSitemapBatches(sitemapArr)

  for (let i = 0; i < batches.length; i++) {
    const delaySeconds = (i + 1) * 60 + 5
    const batch = batches[i]

    await env.SUPERVISOR_TRAINING_QUEUE.send(
      {
        taskId: newTask.id,
        links: batch,
        batchIndex: generateRandomString(4),
      },
      {
        delaySeconds,
      },
    )
  }
}

export async function processQueueTask(
  env: Bindings,
  taskId: number,
  links: string[],
  batchIndex: string,
) {
  const taskRepo = new TrainingTaskRepository(env)

  await taskRepo.update(taskId, {
    status: 'processing',
  })

  const results = await Promise.allSettled(
    links.map(link =>
      handleKnowledge(env, taskId, 'url', link).catch(error => ({
        link,
        reason: error.message || String(error),
      })),
    ),
  )

  const failedLinks = results
    .filter(result => result.status === 'rejected')
    .map((result, index) => ({
      url: links[index],
      reason: (result as PromiseRejectedResult).reason,
    }))

  const existingTask = await taskRepo.get(taskId)

  if (!existingTask)
    throw new Error('task not found')

  const updatedDetails = {
    ...existingTask.details,
    batchesCompleted: [
      ...(existingTask.details?.batchesCompleted || []),
      batchIndex,
    ],
    failedLinks: [...(existingTask.details?.failedLinks || []), ...failedLinks],
  }

  if (failedLinks.length > 0) {
    console.error(`Failed to process some links in sitemap`, {
      taskId,
      failedLinks,
    })
  }

  await taskRepo.update(taskId, {
    details: updatedDetails,
    status: updatedDetails.batchesCompleted.length === existingTask.details?.totalBatches ? 'completed' : existingTask.status,
    finishedAt: updatedDetails.batchesCompleted.length === existingTask.details?.totalBatches ? new Date() : null,
  })
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
    default: {
      const errorMsg = `Unsupported document type: ${type}`
      console.error(errorMsg, { type, source })
      throw new Error(errorMsg)
    }
  }
}

export async function trainWithSinglePdf(env: Bindings, body: unknown) {
  const data = PdfLoadSchema.parse(body)
  const pdfFile = data.source

  const taskRepo = new TrainingTaskRepository(env)
  const knowledgeRepo = new KnowledgeRepository(env)

  const newTask = await taskRepo.insert({
    data: [
      {
        type: 'pdf',
        source: pdfFile.name as unknown as File,
      },
    ],
    status: 'processing',
    startedAt: new Date(),
  })

  try {
    const documents = await fetchSourceDocuments(env, 'pdf', pdfFile, {
      taskId: newTask.id,
    })
    await addDocumentsToStore(env, documents)

    await knowledgeRepo.insert({
      type: 'pdf',
      taskId: newTask.id,
      content: documents.map(content => content.pageContent).join('\n---\n'),
      source: pdfFile.name,
      createdAt: new Date(),
    })

    await taskRepo.update(newTask.id, {
      status: 'completed',
      finishedAt: new Date(),
    })
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const existingTask = await taskRepo.get(newTask.id)
    await taskRepo.update(newTask.id, {
      status: 'failed',
      details: {
        ...existingTask?.details,
        error: errorMessage,
      },
      finishedAt: new Date(),
    })

    console.error(`Failed to train with single PDF for task ${newTask.id}`, {
      taskId: newTask.id,
      error: errorMessage,
    })

    throw error
  }
}

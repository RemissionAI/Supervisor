import type { Document } from 'langchain/document'
import { KnowledgeRepository } from '../repositories/knowledge.repository'
import type { KnowledgeMeta } from '~/lib/validations/train.validation'
import { LoadKnowledgeSchema } from '~/lib/validations/train.validation'
import type { Bindings } from '~/common/interfaces/common.interface'
import { addDocumentsToStore } from '~/lib/utils/ai/embeddings'
import DataLoader from '~/lib/utils/ai/data-loader'
import { TrainingTaskRepository } from '~/core/repositories/train.repository'

export async function processTask(
  env: Bindings,
  taskId: number,
  metadata: KnowledgeMeta,
) {
  const taskRepo = new TrainingTaskRepository(env)

  console.log(`Starting processing task ${taskId}`, { taskId, metadata })

  await taskRepo.update(taskId, { status: 'processing' })

  try {
    await handleTaskByType(env, taskId, metadata)
    await taskRepo.update(taskId, {
      status: 'completed',
      finishedAt: new Date(),
    })
    console.log(`Completed processing task ${taskId}`, { taskId })
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    await taskRepo.update(taskId, {
      status: 'failed',
      details: {
        error: errorMessage,
      },
      finishedAt: new Date(),
    })
    console.error(`Failed to process task ${taskId}`, {
      taskId,
      error: errorMessage,
    })
  }
}

async function handleTaskByType(
  env: Bindings,
  taskId: number,
  metadata: KnowledgeMeta,
) {
  console.log(`Handling task by type ${metadata.type}`, {
    taskId,
    type: metadata.type,
  })

  switch (metadata.type) {
    case 'url':
    case 'pdf':
      await handleKnowledge(env, taskId, metadata.type, metadata.source)
      break
    case 'sitemap':
      await handleSitemap(env, taskId, metadata.source)
      break
    default:
      const errorMsg = `Unsupported data type`
      console.error(errorMsg, { taskId })
      throw new Error(errorMsg)
  }
}

async function handleKnowledge(
  env: Bindings,
  taskId: number,
  type: 'url' | 'pdf',
  source: string | File,
) {
  const knowledgeRepo = new KnowledgeRepository(env)
  console.log(`Handling knowledge of type ${type}`, { taskId, type, source })

  const documents = await fetchSourceDocuments(type, source, { taskId })
  await addDocumentsToStore(env, documents)

  await knowledgeRepo.insert({
    type,
    taskId,
    content: documents.map(content => content.pageContent).join('\n---\n'),
    source: typeof source === 'string' ? source : source.name,
    createdAt: new Date(),
  })

  console.log(`Inserted documents into repository for task ${taskId}`, {
    taskId,
    documentCount: documents.length,
  })
}

async function handleSitemap(
  env: Bindings,
  taskId: number,
  sitemapUrl: string,
) {
  const taskRepo = new TrainingTaskRepository(env)
  console.log(`Handling sitemap ${sitemapUrl}`, { taskId, sitemapUrl })

  const links = await DataLoader.sitemap(sitemapUrl)
  const results = await Promise.allSettled(
    links.map(link =>
      handleKnowledge(env, taskId, 'url', link.loc).catch((error) => {
        return { link: link.loc, reason: error.message || String(error) }
      }),
    ),
  )

  const failedLinks = results
    .filter(result => result.status === 'rejected')
    .map((result, index) => ({
      url: links[index].loc,
      reason: (result as PromiseRejectedResult).reason,
    }))

  if (failedLinks.length > 0) {
    console.error(`Failed to process some links in sitemap`, {
      taskId,
      failedLinks,
    })
    await taskRepo.update(taskId, {
      details: {
        failedLinks,
      },
    })
  }
}

export async function queueTask(env: Bindings, inputData: unknown) {
  const validatedData = LoadKnowledgeSchema.parse(inputData)
  const taskRepo = new TrainingTaskRepository(env)

  console.log(`Queueing new task`, { validatedData })

  const newTask = await taskRepo.insert({
    data: validatedData.data,
    status: 'queued',
    startedAt: new Date(),
  })

  await env.SUPERVISOR_TRAINING_QUEUE.send({
    taskId: newTask.id,
    data: validatedData.data,
  })

  console.log(`Queued task ${newTask.id}`, { taskId: newTask.id })
}

export async function processTaskQueue(
  env: Bindings,
  taskId: number,
  data: KnowledgeMeta[],
) {
  console.log(`Processing task queue`, { taskId, dataLength: data.length })

  await Promise.all(data.map(data => processTask(env, taskId, data)))
}

async function fetchSourceDocuments(
  type: 'url' | 'pdf',
  source: string | File,
  customMetadata?: Record<string, any>,
): Promise<Document[]> {
  console.log(`Fetching source documents of type ${type}`, { type, source })

  try {
    const documents = await loadDocuments(type, source)
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
    throw new Error(
			`Failed to load documents of type ${type}: ${errorMessage}`,
    )
  }
}

async function loadDocuments(
  type: 'url' | 'pdf',
  source: string | File,
): Promise<Document[]> {
  console.log(`Loading documents of type ${type}`, { type, source })

  switch (type) {
    case 'url':
      return await DataLoader.url(source as string)
    case 'pdf':
      return await DataLoader.pdf(source as File)
    default:
      const errorMsg = `Unsupported document type: ${type}`
      console.error(errorMsg, { type, source })
      throw new Error(errorMsg)
  }
}

import type { Document } from 'langchain/document'
import type {
  KnowledgeMeta,
} from '~/lib/validations/train.validation'
import {
  LoadKnowledgeSchema,
} from '~/lib/validations/train.validation'
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

  await taskRepo.update(taskId, { status: 'processing' })

  try {
    await handleTaskByType(env, taskId, metadata)
    await taskRepo.update(taskId, {
      status: 'completed',
      finishedAt: new Date(),
    })
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    await taskRepo.update(taskId, {
      status: 'failed',
      details: {
        error: errorMessage,
      },
      finishedAt: new Date()
    })
  }
}

async function handleTaskByType(
  env: Bindings,
  taskId: number,
  metadata: KnowledgeMeta,
) {
  switch (metadata.type) {
    case 'url':
    case 'pdf':
      await handleKnowledge(env, taskId, metadata.type, metadata.source)
      break
    case 'sitemap':
      await handleSitemap(env, taskId, metadata.source)
      break
    default:
      throw new Error(`Unsupported data type`)
  }
}

async function handleKnowledge(
  env: Bindings,
  taskId: number,
  type: 'url' | 'pdf',
  source: string | File,
) {
  const documents = await fetchSourceDocuments(type, source, { taskId })
  await addDocumentsToStore(env, documents)
}

async function handleSitemap(
  env: Bindings,
  taskId: number,
  sitemapUrl: string,
) {
  const links = await DataLoader.sitemap(sitemapUrl)
  const fetchPromises = links.map(link =>
    handleKnowledge(env, taskId, 'url', link.loc),
  )
  await Promise.all(fetchPromises)
}

export async function queueTask(env: Bindings, inputData: unknown) {
  const validatedData = LoadKnowledgeSchema.parse(inputData)
  const taskRepo = new TrainingTaskRepository(env)

  const newTask = await taskRepo.insert({
    data: validatedData.data,
    status: 'queued',
    startedAt: new Date(),
  })

  await env.SUPERVISOR_TRAINING_QUEUE.send({
    taskId: newTask.id,
    data: validatedData.data,
  })
}

export async function processTaskQueue(env: Bindings, taskId: number, data: KnowledgeMeta[]){
  await Promise.all(data.map((data) => processTask(env, taskId, data)));
}

async function fetchSourceDocuments(
  type: 'url' | 'pdf',
  source: string | File,
  customMetadata?: Record<string, any>,
): Promise<Document[]> {
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
    throw new Error(
			`Failed to load documents of type ${type}: ${errorMessage}`,
    )
  }
}

async function loadDocuments(
  type: 'url' | 'pdf',
  source: string | File,
): Promise<Document[]> {
  switch (type) {
    case 'url':
      return await DataLoader.url(source as string)
    case 'pdf':
      return await DataLoader.pdf(source as File)
    default:
      throw new Error(`Unsupported document type: ${type}`)
  }
}

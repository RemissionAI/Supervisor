import type { Document } from 'langchain/document'
import {
  CloudflareVectorizeStore,
  CloudflareWorkersAIEmbeddings,
} from '@langchain/cloudflare'
import { AddKnowledgeSchema } from '~/lib/validations/train.validation'
import KnowledgeLoader from '~/lib/utils/KnowledgeLoader'
import type { Bindings } from '~/common/interfaces/common.interface'

export async function loadKnowledge(
  env: Bindings,
  inputData: unknown,
): Promise<boolean> {
  const parsedData = AddKnowledgeSchema.parse(inputData)

  const documents: Document[] = await loadDocuments(
    parsedData.type,
    parsedData.source,
  )

  const embeddings = createEmbeddings(env.AI)
  const vectorStore = createVectorStore(embeddings, env.KNOWLEDGE_INDEX)

  const formattedDocuments = formatDocuments(documents)

  await addDocumentsToStore(vectorStore, formattedDocuments)

  return true
}

async function loadDocuments(
  type: string,
  source: string | File,
): Promise<Document[]> {
  try {
    switch (type) {
      case 'url':
        return await KnowledgeLoader.loadUrl(source as string)
      case 'pdf':
        return await KnowledgeLoader.loadPdf(source as File)
      default:
        throw new Error('Unsupported knowledge type')
    }
  }
  catch (error) {
    throw new Error('Failed to load documents')
  }
}

function createEmbeddings(binding: any): CloudflareWorkersAIEmbeddings {
  return new CloudflareWorkersAIEmbeddings({
    binding,
    model: '@cf/baai/bge-small-en-v1.5',
  })
}

function createVectorStore(
  embeddings: CloudflareWorkersAIEmbeddings,
  index: VectorizeIndex,
): CloudflareVectorizeStore {
  return new CloudflareVectorizeStore(embeddings, {
    index,
  })
}

function formatDocuments(documents: Document[]): Document[] {
  return documents.map(doc => ({
    pageContent: doc.pageContent,
    metadata: {},
  }))
}

async function addDocumentsToStore(
  store: CloudflareVectorizeStore,
  documents: Document[],
): Promise<void> {
  try {
    await store.addDocuments(documents)
  }
  catch (error) {
    throw new Error('Failed to add documents to the store')
  }
}

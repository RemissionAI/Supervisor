import type { Document } from 'langchain/document'
import {
  CloudflareVectorizeStore,
  CloudflareWorkersAIEmbeddings,
} from '@langchain/cloudflare'
import { AddKnowledgeSchema } from '~/lib/validations/train.validation'
import KnowledgeLoader from '~/lib/utils/KnowledgeLoader'
import type { Bindings } from '~/shared/interfaces/common.interface'

export async function train(env: Bindings, data: unknown) {
  const knowledge = AddKnowledgeSchema.parse(data)

  let docs: Document[]

  switch (knowledge.type) {
    case 'url':
      docs = await KnowledgeLoader.loadUrl(knowledge.source)
    case 'pdf':
      docs = await KnowledgeLoader.loadPdf(knowledge.source as File)
  }

  const embeddings = new CloudflareWorkersAIEmbeddings({
    binding: env.AI,
    model: '@cf/baai/bge-small-en-v1.5',
  })
  const store = new CloudflareVectorizeStore(embeddings, {
    index: env.KNOWLEDGE_INDEX,
  })

  await store.addDocuments(docs)

  return true;
}

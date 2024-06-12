import {
  CloudflareVectorizeStore,
  CloudflareWorkersAIEmbeddings,
} from '@langchain/cloudflare'
import type { Bindings } from '~/common/interfaces/common.interface'
import { EMBEDDINGS_MODEL } from '~/config/constants'

export default function (env: Bindings) {
  switch (EMBEDDINGS_MODEL) {
    case '@cf/baai/bge-base-en-v1.5': {
      const embeddings = new CloudflareWorkersAIEmbeddings({
        binding: env.AI as unknown as Fetcher,
        model: EMBEDDINGS_MODEL,
      })
      return new CloudflareVectorizeStore(embeddings, {
        index: env.KNOWLEDGE_INDEX,
      })
    }
    default:
      throw new Error(`Unsupported embeddings model: ${EMBEDDINGS_MODEL}`)
  }
}

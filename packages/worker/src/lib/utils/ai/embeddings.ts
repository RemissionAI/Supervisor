import type { Document } from 'langchain/document'
import VectorStore from './store'
import type { Bindings } from '~/common/interfaces/common.interface'

export async function addDocumentsToStore(
  env: Bindings,
  documents: Document[],
) {
  try {
    const store = VectorStore(env)
    await store.addDocuments(documents)
  }
  catch (error) {
    throw new Error(`Failed to store documents ${error}`)
  }
}

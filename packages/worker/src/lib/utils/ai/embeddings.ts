import type { Document } from 'langchain/document'
import VectorStore from './store'
import type { Bindings } from '~/common/interfaces/common.interface'

export async function addDocumentsToStore(
  env: Bindings,
  documents: Document[],
) {
  try {
    const store = VectorStore(env)
    return await store.addDocuments(documents)
  }
  catch (error) {
    throw new Error(`Failed to store documents ${error}`)
  }
}

export async function deleteDocumentsFromStore(env: Bindings, ids: string[]) {
  try {
    const store = VectorStore(env)
    await store.delete({ ids })
  }
  catch (error) {
    throw new Error(`Failed to delete documents ${error}`)
  }
}

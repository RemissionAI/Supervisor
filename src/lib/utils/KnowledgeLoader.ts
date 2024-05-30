import type { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { HtmlToTextTransformer } from '@langchain/community/document_transformers/html_to_text'

export interface IKnowledgeLoader {
  /**
   * Loads documents from the given URL.
   * @param url - The URL to load documents from.
   * @returns A promise that resolves to an array of documents.
   */
  loadUrl: (url: string) => Promise<Document[]>
}

/**
 * Loads content from different sources (URL, PDF) to be used for embeddings.
 */
class KnowledgeLoader implements IKnowledgeLoader {
  async loadUrl(url: string): Promise<Document[]> {
    const loader = new CheerioWebBaseLoader(url)
    const docs = await loader.load()

    const splitter = RecursiveCharacterTextSplitter.fromLanguage('html')
    const transformer = new HtmlToTextTransformer()

    const sequence = splitter.pipe(transformer)
    return await sequence.invoke(docs)
  }
}

export default new KnowledgeLoader()

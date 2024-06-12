import type { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { HtmlToTextTransformer } from '@langchain/community/document_transformers/html_to_text'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import { SitemapLoader } from '@langchain/community/document_loaders/web/sitemap'

export interface Loader {
  /**
   * Loads documents from the given URL.
   * @param url - The URL to load documents from.
   * @returns A promise that resolves to an array of documents.
   */
  url: (url: string) => Promise<Document[]>
  /**
   * Loads documents from the given PDF.
   * @param blob - The PDF blob to load documents from.
   * @returns A promise that resolves to an array of documents.
   */
  pdf: (file: File) => Promise<Document[]>
}

/**
 * Loads content from different sources (URL, PDF) to be used for embeddings.
 */
class DataLoader implements Loader {
  async url(url: string): Promise<Document[]> {
    const loader = new CheerioWebBaseLoader(url)
    const rawDocs = await loader.load()

    const splitter = RecursiveCharacterTextSplitter.fromLanguage('html')
    const transformer = new HtmlToTextTransformer()

    const sequence = splitter.pipe(transformer)
    return await sequence.invoke(rawDocs)
  }

  async pdf(file: File): Promise<Document[]> {
    const loader = new WebPDFLoader(file, {
      parsedItemSeparator: '',
      pdfjs: async () => {
        // @ts-expect-error
        await import('pdfjs-dist/build/pdf.worker.min.mjs')
        // @ts-expect-error
        return await import('pdfjs-dist/build/pdf.min.mjs')
      },
    })

    const rawDocs = await loader.load()
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 200,
    })

    return await splitter.splitDocuments(rawDocs)
  }

  async sitemap(url: string) {
    const loader = new SitemapLoader(url)

    return await loader.parseSitemap()
  }
}

export default new DataLoader()

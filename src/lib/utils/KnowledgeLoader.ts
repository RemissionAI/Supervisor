import type { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { HtmlToTextTransformer } from '@langchain/community/document_transformers/html_to_text'
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

export interface IKnowledgeLoader {
	/**
	 * Loads documents from the given URL.
	 * @param url - The URL to load documents from.
	 * @returns A promise that resolves to an array of documents.
	 */
	loadUrl: (url: string) => Promise<Document[]>;
	/**
	 * Loads documents from the given PDF.
	 * @param blob - The PDF blob to load documents from.
	 * @returns A promise that resolves to an array of documents.
	 */
	loadPdf: (file: File) => Promise<Document[]>;
}

/**
 * Loads content from different sources (URL, PDF) to be used for embeddings.
 */
class KnowledgeLoader implements IKnowledgeLoader {
  async loadUrl(url: string): Promise<Document[]> {
    const loader = new CheerioWebBaseLoader(url)
    const rawDocs = await loader.load()

    const splitter = RecursiveCharacterTextSplitter.fromLanguage('html')
    const transformer = new HtmlToTextTransformer()

    const sequence = splitter.pipe(transformer)
    return await sequence.invoke(rawDocs);
  }

  async loadPdf(file: File): Promise<Document[]>{ 
    const loader = new WebPDFLoader(file, {
			pdfjs: async () => {
				// @ts-expect-error
				const pdfjs = await import("pdfjs-dist/build/pdf.min.mjs");
				// Import worker
				await import(
					// @ts-expect-error
					"pdfjs-dist/build/pdf.worker.min.mjs"
				);

				return pdfjs;
			},
		});

	const rawDocs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});
  
	return await splitter.splitDocuments(rawDocs);
  }
}

export default new KnowledgeLoader()

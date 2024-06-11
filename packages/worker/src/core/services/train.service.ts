import type { Document } from "langchain/document";

import { LoadKnowledgeSchema } from "~/lib/validations/train.validation";
import type { Bindings } from "~/common/interfaces/common.interface";
import { addDocumentsToStore } from "~/lib/utils/ai/embeddings";
import DataLoader from "~/lib/utils/ai/data-loader";

export async function load(
	env: Bindings,
	inputData: unknown
): Promise<boolean> {
	const parsedData = LoadKnowledgeSchema.parse(inputData);

	const documents: Document[] = await getSourceDocuments(
		parsedData.type,
		parsedData.source
	);


	await addDocumentsToStore(env, formattedDocuments);

	return true;
}

async function processSitemap(env: Bindings, sitemap: string) {}

async function getSourceDocuments(
	type: string,
	source: string | File,
	customMetadata?: Record<string, any>
): Promise<Document[]> {
	try {
		let documents: Document[] = [];

		switch (type) {
			case "url":
				documents = await DataLoader.url(source as string);
			case "pdf":
				documents = await DataLoader.pdf(source as File);
		}

		return documents.map((doc) => ({
			pageContent: doc.pageContent,
			metadata: {
				...doc.metadata,
        ...customMetadata
			},
		}));
	} catch (error) {
		throw new Error("Failed to load documents");
	}
}

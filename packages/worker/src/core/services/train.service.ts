import type { Document } from "langchain/document";
import {
	KnowledgeMeta,
	LoadKnowledgeSchema,
} from "~/lib/validations/train.validation";
import type { Bindings } from "~/common/interfaces/common.interface";
import { addDocumentsToStore } from "~/lib/utils/ai/embeddings";
import DataLoader from "~/lib/utils/ai/data-loader";
import { TrainingTaskRepository } from "~/core/repositories/train.repository";

export async function processTask(
	env: Bindings,
	taskId: number,
	data: KnowledgeMeta
) {
	switch (data.type) {
		case "url":
		case "pdf":
			return await handleKnowledge(env, taskId, data.type, data.source);
		case "sitemap":
			return await handleSitemap(env, taskId, data.source);
		default:
			throw new Error("Unsupported data type");
	}
}

export async function handleKnowledge(
	env: Bindings,
	taskId: number,
	type: "url" | "pdf",
	source: string | File
) {
	const documents = await fetchSourceDocuments(type, source, { taskId });
	await addDocumentsToStore(env, documents);
}

export async function handleSitemap(
	env: Bindings,
	taskId: number,
	sitemap: string
) {
	const links = await DataLoader.sitemap(sitemap);
	const promises = links.map((link) =>
		handleKnowledge(env, taskId, "url", link.loc)
	);
	await Promise.all(promises);
}

export async function loadKnowledgeData(env: Bindings, inputData: unknown) {
	const body = LoadKnowledgeSchema.parse(inputData);
	const trainingTaskRepo = new TrainingTaskRepository(env);

	const task = await trainingTaskRepo.insert({
		data: body.data,
		status: "queued",
		startedAt: new Date(),
	});

	await Promise.all(body.data.map((data) => processTask(env, task.id, data)));
}

async function fetchSourceDocuments(
	type: "url" | "pdf",
	source: string | File,
	customMetadata?: Record<string, any>
): Promise<Document[]> {
	let documents: Document[] = [];
	try {
		switch (type) {
			case "url":
				documents = await DataLoader.url(source as string);
				break;
			case "pdf":
				documents = await DataLoader.pdf(source as File);
				break;
			default:
				throw new Error("Unsupported document type");
		}

		return documents.map((doc) => ({
			pageContent: doc.pageContent,
			metadata: {
				...doc.metadata,
				...customMetadata,
			},
		}));
	} catch (error) {
		throw new Error(`Failed to load documents: ${error}`);
	}
}

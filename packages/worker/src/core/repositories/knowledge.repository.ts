import { asc, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { knowledge } from "~/config/db/schema";
import type { Bindings } from "~/common/interfaces/common.interface";
import { InsertKnowledge } from "~/common/interfaces/knowledge.interface";
import { KnowledgeModel } from "../models/knowledge.model";

export class KnowledgeRepository extends BaseRepository {
	private readonly table = knowledge;

	/**
	 * Constructor for KnowledgeRepository.
	 * @param env - Environment bindings.
	 */
	constructor(env: Bindings) {
		super(env);
	}

	/**
	 * Inserts a new knowledge source
	 * @param knowledge - The knowledge to be inserted.
	 * @returns The knowledge.
	 */
	async insert(
		data: InsertKnowledge
	): Promise<KnowledgeModel> {
		try {
			const result = await this.db
				.insert(this.table)
				.values(data)
				.returning()
				.get();

			return new KnowledgeModel(result);
		} catch (err) {
			throw new Error(`Error inserting knowledge: ${err}`);
		}
	}

	/**
	 * Lists knowledge with pagination.
	 * @param page - The page number to retrieve.
	 * @param pageSize - The number of knowlege source per page.
	 * @returns A list of knowlege data for the specified page.
	 */
	async list(
        taskId: number,
		page: number,
		pageSize: number
	): Promise<KnowledgeModel[]> {
		try {
			const query = this.db.select().from(this.table).where(eq(this.table.taskId, taskId));

			const paginatedResults = await this.withPagination(
				query.$dynamic(),
				asc(this.table.id),
				page,
				pageSize
			);

			return paginatedResults.map((result) => new KnowledgeModel(result));
		} catch (err) {
			throw new Error(`Error fetching knowledge list: ${err}`);
		}
	}
}

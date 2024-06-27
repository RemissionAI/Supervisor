import { asc, count, eq } from 'drizzle-orm'
import { KnowledgeModel } from '../models/knowledge.model'
import { BaseRepository } from './base.repository'
import { knowledge } from '~/config/db/schema'
import type { Bindings } from '~/common/interfaces/common.interface'
import type { InsertKnowledge, UpdateKnowledge } from '~/common/interfaces/knowledge.interface'

export class KnowledgeRepository extends BaseRepository {
  private readonly table = knowledge

  /**
   * Constructor for KnowledgeRepository.
   * @param env - Environment bindings.
   */
  constructor(env: Bindings) {
    super(env)
  }

  /**
   * Inserts a new knowledge source
   * @param knowledge - The knowledge to be inserted.
   * @returns The knowledge.
   */
  async insert(data: InsertKnowledge): Promise<KnowledgeModel> {
    try {
      const result = await this.db
        .insert(this.table)
        .values(data)
        .returning()
        .get()

      return new KnowledgeModel(result)
    }
    catch (err) {
      throw new Error(`Error inserting knowledge: ${err}`)
    }
  }

  /**
   * get a knowledge by id
   * @param id - The knowledge id
   * @returns The knowledge item.
   */
  async get(id: number): Promise<KnowledgeModel | null> {
    try {
      const result = await this.db
        .select()
        .from(this.table)
        .where(eq(knowledge.id, id))
        .get()

      return result ? new KnowledgeModel(result) : null
    }
    catch (err) {
      throw new Error(`Error fetching knowledge item: ${err}`)
    }
  }

  /**
   * get a knowledge by source
   * @param source - The knowledge source
   * @returns The knowledge item.
   */
  async getBySource(source: string): Promise<KnowledgeModel | null> {
    try {
      const result = await this.db
        .select()
        .from(this.table)
        .where(eq(knowledge.source, source))
        .get()

      return result ? new KnowledgeModel(result) : null
    }
    catch (err) {
      throw new Error(`Error fetching knowledge item: ${err}`)
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
    pageSize: number,
  ): Promise<KnowledgeModel[]> {
    try {
      const query = this.db
        .select()
        .from(this.table)
        .where(eq(this.table.taskId, taskId))

      const paginatedResults = await this.withPagination(
        query.$dynamic(),
        asc(this.table.id),
        page,
        pageSize,
      )

      return paginatedResults.map(result => new KnowledgeModel(result))
    }
    catch (err) {
      throw new Error(`Error fetching knowledge list: ${err}`)
    }
  }

  async getCount(taskId: number): Promise<{ count: number }> {
    try {
      const [result] = await this.db
        .select({ count: count() })
        .from(this.table)
        .where(eq(this.table.taskId, taskId))

      return result
    }
    catch (err) {
      throw new Error(`Error getting knowledge items count`)
    }
  }

  async update(
    id: number,
    data: UpdateKnowledge,
  ): Promise<KnowledgeModel | null> {
    try {
      const result = await this.db
        .update(this.table)
        .set(data)
        .where(eq(this.table.id, id))
        .returning()
        .get()
      return result ? new KnowledgeModel(result) : null
    }
    catch (err) {
      throw new Error(`Error updating knowledge: ${err}`)
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.db
        .delete(this.table)
        .where(eq(this.table.id, id))
        .returning()
        .get()
      return !!result
    }
    catch (err) {
      throw new Error(`Error deleting knowledge: ${err}`)
    }
  }
}

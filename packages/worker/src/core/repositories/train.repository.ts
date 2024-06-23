import { asc, count, desc, eq } from 'drizzle-orm'
import { TrainingTaskModel } from '../models/train.model'
import { BaseRepository } from './base.repository'
import { trainingTasks } from '~/config/db/schema'
import type { Bindings } from '~/common/interfaces/common.interface'
import type { InsertTrainingTask, UpdateTrainingTask } from '~/common/interfaces/train.interface'

export class TrainingTaskRepository extends BaseRepository {
  private readonly trainingTaskTable = trainingTasks

  /**
   * Constructor for TrainingTaskRepository.
   * @param env - Environment bindings.
   */
  constructor(env: Bindings) {
    super(env)
  }

  /**
   * Inserts a new training task
   * @param task - The training task to be inserted.
   * @returns The inserted training task.
   */
  async insert(task: InsertTrainingTask): Promise<TrainingTaskModel> {
    try {
      const result = await this.db
        .insert(this.trainingTaskTable)
        .values(task)
        .returning()
        .get()

      return new TrainingTaskModel(result)
    }
    catch (err) {
      throw new Error(`Error creating training task: ${err}`)
    }
  }

  /**
   * get a training task by id
   * @param taskId - The training task id
   * @returns The training task.
   */
  async get(taskId: number): Promise<TrainingTaskModel | null> {
    try {
      const result = await this.db
        .select()
        .from(this.trainingTaskTable)
        .where(eq(trainingTasks.id, taskId))
        .get()

      return result ? new TrainingTaskModel(result) : null
    }
    catch (err) {
      throw new Error(`Error fetching training task: ${err}`)
    }
  }

  /**
   * Lists training tasks with pagination.
   * @param page - The page number to retrieve.
   * @param pageSize - The number of tasks per page.
   * @returns A list of training tasks for the specified page.
   */
  async list(page: number, pageSize: number): Promise<TrainingTaskModel[]> {
    try {
      const query = this.db.select().from(this.trainingTaskTable)

      const paginatedResults = await this.withPagination(
        query.$dynamic(),
        desc(this.trainingTaskTable.id),
        page,
        pageSize,
      )

      return paginatedResults.map(result => new TrainingTaskModel(result))
    }
    catch (err) {
      throw new Error(`Error fetching training tasks: ${err}`)
    }
  }

  async getCount(): Promise<{ count: number }> {
    try {
      const [result] = await this.db.select({ count: count() }).from(this.trainingTaskTable)

      return result
    }
    catch (err) {
      throw new Error(`Error getting training tasks count`)
    }
  }

  /**
   * Updates an existing training task in the database.
   * @param id - The ID of the training task to be updated.
   * @param updatedTask - The updated training task data.
   * @returns The updated training task.
   */
  async update(
    id: number,
    updatedTask: Partial<UpdateTrainingTask>,
  ): Promise<TrainingTaskModel> {
    try {
      const result = await this.db
        .update(this.trainingTaskTable)
        .set(updatedTask)
        .where(eq(trainingTasks.id, id))
        .returning()
        .get()

      return new TrainingTaskModel(result)
    }
    catch (err) {
      throw new Error(`Error updating training task: ${err}`)
    }
  }
}

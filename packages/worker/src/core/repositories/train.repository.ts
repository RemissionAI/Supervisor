import { asc, eq } from 'drizzle-orm'
import { TrainingTask } from '../models/train.model'
import { BaseRepository } from './base.repository'
import { trainingTasks } from '~/config/db/schema'
import type { Bindings } from '~/common/interfaces/common.interface'
import type { IInsertTrainingTask, IUpdateTrainingTask } from '~/common/interfaces/train.interface'

export class TrainingTaskRepository extends BaseRepository {
	private readonly trainingTaskTable = trainingTasks;

	/**
	 * Constructor for TrainingTaskRepository.
	 * @param env - Environment bindings.
	 */
	constructor(env: Bindings) {
		super(env);
	}

	/**
	 * Inserts a new training task
	 * @param task - The training task to be inserted.
	 * @returns The inserted training task.
	 */
	async insertTrainingTask(task: IInsertTrainingTask): Promise<TrainingTask> {
		try {
			const result = await this.db
				.insert(this.trainingTaskTable)
				.values(task)
				.returning()
				.get();

			return new TrainingTask(result);
		} catch (err) {
			throw new Error(`Error creating training task: ${err}`);
		}
	}

	/**
	 * Lists training tasks with pagination.
	 * @param page - The page number to retrieve.
	 * @param pageSize - The number of tasks per page.
	 * @returns A list of training tasks for the specified page.
	 */
	async listTrainingTasks(
		page: number,
		pageSize: number
	): Promise<TrainingTask[]> {
		try {
			const query = this.db.select().from(this.trainingTaskTable);

			const paginatedResults = await this.withPagination(
				query.$dynamic(),
				asc(this.trainingTaskTable.id),
				page,
				pageSize
			);

			return paginatedResults.map((result) => new TrainingTask(result));
		} catch (err) {
			throw new Error(`Error fetching training tasks: ${err}`);
		}
	}

	/**
	 * Updates an existing training task in the database.
	 * @param id - The ID of the training task to be updated.
	 * @param updatedTask - The updated training task data.
	 * @returns The updated training task.
	 */
	async updateTrainingTask(
		id: number,
		updatedTask: Partial<IUpdateTrainingTask>
	): Promise<TrainingTask> {
		try {
			const result = await this.db
				.update(this.trainingTaskTable)
				.set(updatedTask)
				.where(eq(trainingTasks.id, id))
				.returning()
				.get();

			return new TrainingTask(result);
		} catch (err) {
			throw new Error(`Error updating training task: ${err}`);
		}
	}
}

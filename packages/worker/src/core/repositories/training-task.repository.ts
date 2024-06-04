import { trainingTasks } from "~/config/db/schema";
import { BaseRepository } from "./base.repository";
import { Bindings } from "~/common/interfaces/common.interface";
import { IInsertTrainingTask, ITrainingTask } from "~/common/interfaces/train.interface";
import { TrainingTask } from "../models/training-task.model";

export class TrainingTaskRepository extends BaseRepository {
	private readonly table = trainingTasks;

	constructor(env: Bindings) {
		super(env);
	}

	async insert(task: IInsertTrainingTask): Promise<ITrainingTask> {
		try {
			const res = await this.db
				.insert(this.table)
				.values(task)
				.returning()
				.get();

			return new TrainingTask(res);
		} catch (err) {
			throw new Error(`Error creating generation: ${err}`);
		}
	}
}
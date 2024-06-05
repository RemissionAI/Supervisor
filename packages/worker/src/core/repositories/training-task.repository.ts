import { TrainingTask } from '../models/training-task.model'
import { BaseRepository } from './base.repository'
import { trainingTasks } from '~/config/db/schema'
import type { Bindings } from '~/common/interfaces/common.interface'
import type { IInsertTrainingTask, ITrainingTask } from '~/common/interfaces/train.interface'

export class TrainingTaskRepository extends BaseRepository {
  private readonly table = trainingTasks

  constructor(env: Bindings) {
    super(env)
  }

  async insert(task: IInsertTrainingTask): Promise<ITrainingTask> {
    try {
      const res = await this.db
        .insert(this.table)
        .values(task)
        .returning()
        .get()

      return new TrainingTask(res)
    }
    catch (err) {
      throw new Error(`Error creating generation: ${err}`)
    }
  }
}

import { BaseModel } from './base.model'
import type { IAllowedTrainingSource, ITrainingTask, ITrainingTaskDetails } from '~/common/interfaces/train.interface'

export class TrainingTask extends BaseModel {
  id: number
  type: IAllowedTrainingSource
  source: string
  status: string
  details: ITrainingTaskDetails
  startedAt: Date
  finishedAt: Date

  private_fields = []

  constructor(task: ITrainingTask) {
    super()
    this.id = task.id
    this.type = task.type
    this.source = task.source
    this.status = task.status
    this.details = task.details
    this.startedAt = task.startedAt
    this.finishedAt = task.finishedAt
  }
}

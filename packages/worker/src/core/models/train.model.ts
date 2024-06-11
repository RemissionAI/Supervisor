import { BaseModel } from './base.model'
import type { AllowedTrainingSource, TrainingTask, TrainingTaskDetails} from '~/common/interfaces/train.interface'

export class TrainingTaskModel extends BaseModel {
  id: number
  type: AllowedTrainingSource
  source: string
  status: string
  details: TrainingTaskDetails | null
  startedAt: Date
  finishedAt: Date | null

  private_fields = []

  constructor(task: TrainingTask) {
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

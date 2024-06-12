import { BaseModel } from './base.model'
import type { KnowledgeMeta } from '~/lib/validations/train.validation'
import type { TrainingTask, TrainingTaskDetails } from '~/common/interfaces/train.interface'

export class TrainingTaskModel extends BaseModel {
  id: number
  data: KnowledgeMeta[]
  status: string
  details: TrainingTaskDetails | null
  startedAt: Date
  finishedAt: Date | null

  private_fields = []

  constructor(task: TrainingTask) {
    super()
    this.id = task.id
    this.data = task.data
    this.status = task.status
    this.details = task.details
    this.startedAt = task.startedAt
    this.finishedAt = task.finishedAt
  }
}

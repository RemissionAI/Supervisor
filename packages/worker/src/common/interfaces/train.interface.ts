import type { z } from 'zod'
import { BaseTrainingTaskSchema, InsertTrainingTaskSchema, type AddKnowledgeSchema } from '~/lib/validations/train.validation'

export enum TaskStatus {
  Queued = 'queued',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export type AllowedTrainingSource = 'url' | 'sitemap' | 'pdf' | string[]

export type ITrainingTask = z.infer<typeof BaseTrainingTaskSchema>
export type IInsertTrainingTask = z.infer<typeof InsertTrainingTaskSchema>
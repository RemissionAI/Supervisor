import type { z } from 'zod'
import type { BaseTrainingTaskSchema, InsertTrainingTaskSchema } from '~/lib/validations/train.validation'

export enum TaskStatus {
  Queued = 'queued',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export interface ITrainingTaskDetails {
  error?: string
}

export type IAllowedTrainingSource = 'url' | 'sitemap' | 'pdf' | string[]

export type ITrainingTask = z.infer<typeof BaseTrainingTaskSchema>
export type IInsertTrainingTask = z.infer<typeof InsertTrainingTaskSchema>

import type { z } from 'zod'
import type { BaseTrainingTaskSchema, InsertTrainingTaskSchema, UpdateTrainingTaskSchema } from '~/lib/validations/train.validation'

export enum TaskStatus {
  Queued = 'queued',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export interface TrainingTaskDetails {
  error?: string
}

export type AllowedTrainingSource = 'url' | 'sitemap' | 'pdf' | string[]

export interface PushQueueTrainingTask {
  type: AllowedTrainingSource
  source: string
}

export type TrainingTask = z.infer<typeof BaseTrainingTaskSchema>
export type InsertTrainingTask = z.infer<typeof InsertTrainingTaskSchema>
export type UpdateTrainingTask = z.infer<typeof UpdateTrainingTaskSchema>

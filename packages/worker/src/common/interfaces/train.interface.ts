import type { trainingTasks } from '~/config/db/schema'
import type { KnowledgeMeta } from '~/lib/validations/train.validation'

export enum TaskStatus {
  Queued = 'queued',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export const TaskStatusTypes = ['queued', 'processing', 'completed', 'failed'] as const

export interface TrainingTaskDetails {
  error?: string
  failedLinks?: { url: string, reason?: string }[]
}

export type AllowedTrainingSource = 'url' | 'sitemap' | 'pdf' | string[]

export interface PushQueueTrainingTask {
  taskId: number
  data: KnowledgeMeta[]
}

export type TrainingTask = typeof trainingTasks.$inferSelect
export type InsertTrainingTask = typeof trainingTasks.$inferInsert
export type UpdateTrainingTask = Pick<TrainingTask, 'status' | 'details' | 'finishedAt'>

import type { trainingTasks } from '~/config/db/schema'

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
  batchesCompleted?: string[]
  totalBatches?: number
}

export type AllowedTrainingSource = 'url' | 'sitemap' | 'pdf' | string[]

export interface PushQueueTrainingTask {
  taskId: number
  batchIndex: string
  links: string[]
}

export type TrainingTask = typeof trainingTasks.$inferSelect
export type InsertTrainingTask = typeof trainingTasks.$inferInsert
export type UpdateTrainingTask = Pick<TrainingTask, 'status' | 'details' | 'finishedAt'>

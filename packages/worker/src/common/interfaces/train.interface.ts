import type { z } from 'zod'
import type { AddKnowledgeSchema } from '~/lib/validations/train.validation'

export enum TaskStatus {
  Queued = 'queued',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export type AllowedTrainingSource = 'url' | 'sitemap' | 'pdf' | string[]

export type IAddKnowledgeSchema = z.infer<typeof AddKnowledgeSchema>

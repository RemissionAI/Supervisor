import type { AllowedTrainingSource } from './train.interface'
import type { knowledge } from '~/config/db/schema'

export interface KnowledgeMeta {
  source: string
  type: AllowedTrainingSource
}

export type Knowledge = typeof knowledge.$inferSelect
export type InsertKnowledge = typeof knowledge.$inferInsert

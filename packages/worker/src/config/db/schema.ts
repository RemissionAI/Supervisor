import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ALLOWED_TRAINING_SOURCES, TASK_STATUS } from '~/config/constants'

export const training_tasks = sqliteTable('training_tasks', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  type: text('text', { enum: ALLOWED_TRAINING_SOURCES }).notNull(),
  source: text('source').notNull(),
  status: text('status', { enum: TASK_STATUS }).notNull(),
  details: text('details', { mode: 'json' }),
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  finishedAt: integer('finisehd_at', { mode: 'timestamp' }).notNull(),
})

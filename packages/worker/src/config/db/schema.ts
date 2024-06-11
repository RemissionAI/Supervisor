import { sql } from 'drizzle-orm/sql';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { KnowledgeMeta } from '~/common/interfaces/knowledge.interface';
import type { TrainingTaskDetails } from '~/common/interfaces/train.interface'
import { ALLOWED_TRAINING_SOURCES, TASK_STATUS } from '~/config/constants'

export const trainingTasks = sqliteTable("training_tasks", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	type: text("text", { enum: ALLOWED_TRAINING_SOURCES }).notNull(),
	data: text("data", { mode: "json" }).notNull().$type<KnowledgeMeta[]>().default(sql`'[]'`),
	status: text("status", { enum: TASK_STATUS }).notNull(),
	details: text("details", { mode: "json" }).$type<TrainingTaskDetails>(),
	startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
	finishedAt: integer("finisehd_at", { mode: "timestamp" }),
});

export const knowledge = sqliteTable("knowledge", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	taskId: integer("task_id")
		.notNull()
		.references(() => trainingTasks.id),
	type: text("type").notNull(),
	source: text('source').notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
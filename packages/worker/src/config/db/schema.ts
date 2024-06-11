import { sql } from 'drizzle-orm/sql';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { TaskStatusTypes, type TrainingTaskDetails } from '~/common/interfaces/train.interface'
import { TASK_STATUS } from '~/config/constants'
import { KnowledgeMeta } from '~/lib/validations/train.validation';

export const trainingTasks = sqliteTable("training_tasks", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	data: text("data", { mode: "json" })
		.notNull()
		.$type<KnowledgeMeta[]>()
		.default(sql`'[]'`),
	status: text("status", { enum: TaskStatusTypes }).notNull(),
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
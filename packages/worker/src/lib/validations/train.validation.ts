import z from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import validPDF from './refines/validPDF.refine'
import { trainingTasks } from '~/config/db/schema'

export const AddKnowledgeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('url'),
    source: z.string().url(),
  }),
  z.object({
    type: z.literal('pdf'),
    source: validPDF,
  }),
])

export const BaseTrainingTaskSchema = createSelectSchema(trainingTasks)
export const InsertTrainingTaskSchema = createInsertSchema(trainingTasks)

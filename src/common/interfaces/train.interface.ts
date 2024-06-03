import type { z } from 'zod'
import type { AddKnowledgeSchema } from '~/lib/validations/train.validation'

export type IAddKnowledgeSchema = z.infer<typeof AddKnowledgeSchema>

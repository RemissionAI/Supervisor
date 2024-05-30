import type { z } from 'zod'
import type { AddKnowledgeSchema } from '~/validations/train.validation'

export type IAddKnowledgeSchema = z.infer<typeof AddKnowledgeSchema>

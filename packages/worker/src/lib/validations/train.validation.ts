import z from 'zod'
import validPDF from './refines/validPDF.refine'

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

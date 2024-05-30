import z from 'zod'
import { pdfBlob } from './refines/pdfBlob.refine'

export const AddKnowledgeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('url'),
    source: z.string().url(),
  }),
  z.object({
    type: z.literal('pdf'),
    source: pdfBlob,
  }),
])

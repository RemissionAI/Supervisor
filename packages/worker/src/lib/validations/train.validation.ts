import z from 'zod'
import validPDF from './refines/validPDF.refine'

export const KnowledgeTypeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('url'),
    source: z.string().url(),
  }),
  z.object({
    type: z.literal('pdf'),
    source: validPDF,
  }),
  z.object({
    type: z.literal('sitemap'),
    source: z.string().url(),
  }),
])

export type KnowledgeMeta = z.infer<typeof KnowledgeTypeSchema>

export const LoadKnowledgeSchema = z.object({
  data: z.array(KnowledgeTypeSchema),
})

import z from 'zod'
import validPDF from './refines/validPDF.refine'

const UrlTypeSchema = z.object({
  type: z.literal('url'),
  source: z.string().url(),
})

const PdfTypeSchema = z.object({
  type: z.literal('pdf'),
  source: validPDF,
})

const SitemapFiltersSchema = z.object({
  start: z.number().min(0),
  maxUrls: z.number().max(999),
})

export type SitemapFilters = z.infer<typeof SitemapFiltersSchema>

const SitemapTypeSchema = z.object({
  type: z.literal('sitemap'),
  source: z.string().url(),
  filters: SitemapFiltersSchema.optional(),
})

export const KnowledgeTypeSchema = z.discriminatedUnion('type', [
  UrlTypeSchema,
  PdfTypeSchema,
  SitemapTypeSchema,
])

export type KnowledgeMeta = z.infer<typeof KnowledgeTypeSchema>

export const LoadKnowledgeSchema = z.object({
  data: z.array(
    z.discriminatedUnion('type', [UrlTypeSchema, SitemapTypeSchema]),
  ),
})

export const PdfLoadSchema = PdfTypeSchema

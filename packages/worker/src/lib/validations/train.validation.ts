import z from 'zod'
import validPDF from './refines/validPDF.refine'

const UrlTypeSchema = z.object({
  type: z.literal('url'),
  source: z.string().url(),
})
export type UrlType = z.infer<typeof UrlTypeSchema>

const PdfTypeSchema = z.object({
  type: z.literal('pdf'),
  source: validPDF,
})
export type PdfType = z.infer<typeof PdfTypeSchema>

const SitemapTypeSchema = z.object({
  type: z.literal('sitemap'),
  source: z.string().url(),
})
export type SitemapType = z.infer<typeof SitemapTypeSchema>

export const KnowledgeTypeSchema = z.discriminatedUnion('type', [
  UrlTypeSchema,
  PdfTypeSchema,
  SitemapTypeSchema,
])

export type KnowledgeMeta = z.infer<typeof KnowledgeTypeSchema>

export const LoadWebSchema = z.object({
  data: z.array(
    z.discriminatedUnion('type', [UrlTypeSchema, SitemapTypeSchema]),
  ),
})

export const LoadFileSchema = z.discriminatedUnion('type', [PdfTypeSchema])

export const idSchema = z.number({ coerce: true })

export const BatchDeleteKnowledgeSchema = z.object({
  ids: z.array(idSchema),
})

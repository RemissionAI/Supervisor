import z from 'zod'

const UrlTypeSchema = z.object({
  type: z.literal('url'),
  source: z.string().url(),
})

const SitemapTypeSchema = z.object({
  type: z.literal('sitemap'),
  source: z.string().url(),
})

export const WebKnowledgeSchema = z.object({
  data: z.array(
    z.discriminatedUnion('type', [UrlTypeSchema, SitemapTypeSchema]),
  ),
})

export type LoadWebKnowledge = z.infer<typeof WebKnowledgeSchema>

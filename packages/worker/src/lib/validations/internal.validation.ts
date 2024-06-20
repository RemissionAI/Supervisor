import z from 'zod'

export const modelSettingsSchema = z.object({
  model: z.object({
    provider: z.enum(['workers-ai', 'openai']),
    id: z.string(),
  }).optional(),
  openaiKey: z.string().optional(),
  systemPrompt: z.string().optional(),
})

export const updateModelSettingsSchema = modelSettingsSchema.partial()

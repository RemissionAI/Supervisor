import z from 'zod'

export const settingsSchema = z.object({
  model: z
    .object({
      provider: z.enum(['workers-ai', 'openai']),
      id: z.string(),
    })
    .optional(),
  openaiKey: z.string().optional(),
  systemPrompt: z.string().optional(),
})

export const updateSettingsSchema = settingsSchema.partial()

export type Settings = z.output<typeof settingsSchema>
export type UpdateSettings = z.infer<typeof updateSettingsSchema>

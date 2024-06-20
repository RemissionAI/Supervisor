import type z from 'zod'
import type { modelSettingsSchema } from '~/lib/validations/internal.validation'

export type ModelSettings = z.infer<typeof modelSettingsSchema>

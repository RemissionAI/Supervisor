import type { Bindings } from '~/common/interfaces/common.interface'
import { updateModelSettingsSchema } from '~/lib/validations/internal.validation'
import { KvCache } from '~/lib/utils/kv-cache'
import type { ModelSettings } from '~/common/interfaces/internal.interface'
import { KV_SETTINGS_KEY, SUPPORTED_TEXT_GENERATION_MODELS } from '~/config/constants'

export async function getSettings(
  env: Bindings,
): Promise<ModelSettings | null> {
  const cache = new KvCache(env.SUPERVISOR_KV)
  const settings = await cache.read<ModelSettings>(KV_SETTINGS_KEY, 'json')

  return settings || null
}

export function getSupportedTextGenerationModels() {
  return SUPPORTED_TEXT_GENERATION_MODELS
}

export async function updateSettings(env: Bindings, body: unknown) {
  const updates = updateModelSettingsSchema.parse(body)

  const cache = new KvCache(env.SUPERVISOR_KV)
  const oldSettings = await cache.read<ModelSettings>(KV_SETTINGS_KEY, 'json')

  if (!oldSettings)
    return await cache.write(KV_SETTINGS_KEY, JSON.stringify(updates))

  const newSettings = { ...oldSettings, ...updates }

  return cache.write(KV_SETTINGS_KEY, JSON.stringify(newSettings))
}

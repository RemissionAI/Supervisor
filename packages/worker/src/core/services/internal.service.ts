import type { Bindings } from '~/common/interfaces/common.interface'
import { updateModelSettingsSchema } from '~/lib/validations/internal.validation'
import { KvCache } from '~/lib/utils/kv-cache'
import type { ModelSettings } from '~/common/interfaces/internal.interface'

const SETTINGS_KEY = 'internal:model-settings'

export async function getSettings(
  env: Bindings,
): Promise<ModelSettings | null> {
  const cache = new KvCache(env.SUPERVISOR_KV)
  const settings = await cache.read<ModelSettings>(SETTINGS_KEY, 'json')

  return settings || null
}

export async function updateSettings(env: Bindings, body: unknown) {
  const updates = updateModelSettingsSchema.parse(body)

  const cache = new KvCache(env.SUPERVISOR_KV)
  const oldSettings = await cache.read<ModelSettings>(SETTINGS_KEY, 'json')

  if (!oldSettings)
    return await cache.write(SETTINGS_KEY, JSON.stringify(updates))

  const newSettings = { ...oldSettings, ...updates }

  return cache.write(SETTINGS_KEY, JSON.stringify(newSettings))
}

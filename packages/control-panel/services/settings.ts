import client from '~/helpers/http'
import type { Settings, UpdateSettings } from '~/lib/validation/settings'

export type AllowedTextGenerationModels = { label: string, id: string, provider: string }[]

class SettingsService {
  private resource = '/internal/settings'
  private client = client

  async getModels() {
    return await this.client.get<AllowedTextGenerationModels>(`${this.resource}/models`)
  }

  async getSettings() {
    return await this.client.get<Settings>(this.resource)
  }

  async updateSettings(updates: UpdateSettings) {
    return await this.client.put(this.resource, updates)
  }
}

export default new SettingsService()

import type { Settings, UpdateSettings } from "~/lib/validation/settings";
import SettingsService, { type AllowedTextGenerationModels } from "~/services/settings";

export const useSettingsStore = defineStore("settings", () => {
  const textGenerationModels = ref<AllowedTextGenerationModels>([]);
  const settings = ref<Settings | null>();

  const getModels = async () => {
    const { data, errors } = await SettingsService.getModels();

    if(!errors)
        textGenerationModels.value = data!
  };

  const getSettings = async () => {
    const { data, errors } = await SettingsService.getSettings();
    
    if(!errors)
        settings.value = data!
  }

  const updateSettings = async (updates: UpdateSettings) => {
    return await SettingsService.updateSettings(updates)
  }

  return {
    textGenerationModels,
    settings,
    getSettings,
    getModels,
    updateSettings
  };
});

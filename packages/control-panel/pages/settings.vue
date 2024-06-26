<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { useSettingsStore } from '~/stores/settings'
import { settingsSchema } from '~/lib/validation/settings'
import type { Settings } from '~/lib/validation/settings'

const settingsStore = useSettingsStore()
const toast = useToast()

const { textGenerationModels, settings } = storeToRefs(settingsStore)

await settingsStore.getSettings()
await settingsStore.getModels()

const selectedModel = ref(settings.value?.model || textGenerationModels.value[0])

const state = reactive({
  model: settings.value?.model,
  openaiKey: settings.value?.openaiKey,
  anthropicKey: settings.value?.anthropicKey,
  systemPrompt: settings.value?.systemPrompt,
})

async function onSubmit(event: FormSubmitEvent<Settings>) {
  toast.add({
    id: 'update-settings',
    title: 'Updating settings...',
  })

  const { errors } = await settingsStore.updateSettings(event.data)

  if (errors) {
    return toast.update('update-settings', {
      color: 'red',
      title: 'Failed to update settings',
    })
  }

  await settingsStore.getSettings()

  toast.update('update-settings', {
    color: 'green',
    title: 'Settings have been updated!',
  })
}
</script>

<template>
  <UContainer>
    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight mb-5">
      Settings
    </h2>

    <UForm :schema="settingsSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Model" name="model">
        <UInputMenu v-model="state.model" :options="textGenerationModels" :selected="selectedModel" />
      </UFormGroup>

      <UFormGroup label="OpenAI key" name="openaiKey">
        <UInput v-model="state.openaiKey" type="openaiKey" />
      </UFormGroup>

      <UFormGroup label="Anthropic key" name="anthropicKey">
        <UInput v-model="state.anthropicKey" type="anthropicKey" />
      </UFormGroup>

      <UFormGroup label="System Prompt" name="systemPrompt">
        <UTextarea v-model="state.systemPrompt" :autoresize="true" placeholder="Model system prompt" />
      </UFormGroup>

      <UButton type="submit">
        Save Settings
      </UButton>
    </UForm>
  </UContainer>
</template>

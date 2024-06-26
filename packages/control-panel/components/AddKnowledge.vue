<script setup lang="ts">
import { useTrainStore } from '@/stores/train'

const trainStore = useTrainStore()
const toast = useToast()

const tabs = [
  {
    slot: 'web',
    label: 'Links',
  },
  {
    slot: 'pdf',
    label: 'Upload a pdf',
  },
]

const webKnowledge = reactive({ data: [] })

async function loadWebKnowledge() {
  toast.add({ id: 'load-web', title: 'Loading....' })

  const { errors } = await trainStore.loadWebKnowledge(webKnowledge)

  if (errors?.length) {
    toast.update('load-web', {
      title: String(errors[0]?.message),
    })
  }
  else {
    toast.update('load-web', {
      title: 'Task Queued',
    })
  }
}
</script>

<template>
  <div class="add-knowledge">
    <UTabs :items="tabs">
      <template #web>
        <WebKnowledgeInput v-model="webKnowledge" />
        <UButton v-show="webKnowledge.data.length > 0" label="Load Knowledge" size="lg" block icon="i-heroicons-arrow-up-on-square-stack" @click="loadWebKnowledge" />
      </template>
      <template #pdf>
        <div class="my-10">
          <UInput type="file" size="xl" icon="i-heroicons-folder" label="Upload" />
        </div>
      </template>
    </UTabs>
    <UDivider />
  </div>
</template>

<style lang="scss" scoped></style>

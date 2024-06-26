<script setup lang="ts">
import { defineEmits, defineProps, reactive, watch } from 'vue'
import type { LoadWebKnowledge } from '~/lib/validation/train'
import { SitemapTypeSchema, UrlTypeSchema } from '~/lib/validation/train'

const props = defineProps<{ modelValue: LoadWebKnowledge }>()
const emit = defineEmits(['update:modelValue'])

const webKnowledge = reactive<LoadWebKnowledge>({ data: props.modelValue.data })

watch(
  () => webKnowledge.data,
  (newValue) => {
    emit('update:modelValue', { data: newValue })
  },
  { deep: true },
)

const formState = reactive({
  url: '',
})

const isXmlUrl = (url: string) => !!url?.endsWith('.xml')

async function addUrl() {
  const url = formState.url.trim()
  if (!url)
    return

  const newItem = {
    type: isXmlUrl(url) ? 'sitemap' : 'url',
    source: url,
  }

  const validatedItem = isXmlUrl(url) ? SitemapTypeSchema.parse(newItem) : UrlTypeSchema.parse(newItem)

  webKnowledge.data.push(validatedItem)
  formState.url = ''
}

function removeUrl(index: number) {
  webKnowledge.data.splice(index, 1)
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-6 shadow-lg rounded-lg">
    <UForm :state="formState" class="mb-8 flex gap-2 items-center" @submit="addUrl">
      <UInput v-model="formState.url" placeholder="Enter URL or sitemap" class="w-full" />
      <UButton type="submit" color="primary" variant="ghost" class="w-43" icon="i-heroicons-plus-circle">
        Add
      </UButton>
    </UForm>

    <div v-if="webKnowledge.data.length > 0">
      <ul class="space-y-3 text-sm">
        <li
          v-for="(item, index) in webKnowledge.data" :key="index"
          class="flex items-center justify-between bg-gray-800 p-3 rounded-md shadow-sm"
        >
          <div class="flex items-center space-x-3">
            <UBadge :color="item.type === 'sitemap' ? 'green' : 'pink'" class="uppercase text-xs ">
              {{ item.type }}
            </UBadge>
            <span class="text-gray-100 truncate max-w-xs">{{ item.source }}</span>
          </div>
          <UButton size="xs" color="red" variant="soft" icon="i-heroicons-trash" @click="removeUrl(index)" />
        </li>
      </ul>
    </div>

    <p v-else class="text-center text-gray-500 mt-4">
      No URLs added yet.
    </p>
  </div>
</template>

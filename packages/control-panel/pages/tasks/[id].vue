<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useInfiniteScroll } from '@vueuse/core'
import { useTrainStore } from '~/stores/train'
import type { Knowledge } from '~/services/train'

const trainStore = useTrainStore()
const route = useRoute()

const result = ref<Knowledge[]>([])
const page = ref(1)
const knowledgeCount = ref(0)
const pageCount = ref(20)
const loading = ref(false)
const hasMore = ref(true)
const isOpen = ref(false)
const itemContent = ref<string>('')

const target = ref(null)

async function fetchData() {
  if (loading.value || !hasMore.value)
    return

  loading.value = true
  try {
    const { errors, data } = await trainStore.listKnowledge(Number(route.params.id), page.value, pageCount.value)
    if (!errors && data) {
      result.value = [...result.value, ...data]
      if (data.length < pageCount.value) {
        hasMore.value = false
      }
      else {
        page.value++
      }
    }

    const { data: total } = await trainStore.getKnowledgeCount(Number(route.params.id))
    knowledgeCount.value = total?.count || 0
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
  finally {
    loading.value = false
  }
}

useInfiniteScroll(
  target,
  () => {
    fetchData()
  },
  { distance: 10 },
)

function getIconName(type: string): string {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'i-heroicons-document'
    case 'url':
      return 'i-heroicons-globe-alt'
    default:
      return 'i-heroicons-url'
  }
}

function showContent(content: string) {
  itemContent.value = content

  isOpen.value = true
}

fetchData()
</script>

<template>
  <div class="container mx-auto px-4">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Task: {{ route.params.id }} Total: {{ knowledgeCount }}
    </h2>
    <UModal v-model="isOpen">
      <div class="p-4">
        <MarkdownRenderer :source="itemContent" />
      </div>
    </UModal>
    <ul class="space-y-4">
      <li v-for="item in result" :key="item.id" class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div class="p-4 flex items-start">
          <UIcon :name="getIconName(item.type)" class="text-3xl mt-1 mr-4 text-primary-400" />
          <div class="flex-grow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ item.content?.slice(0, 60) }}...
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Source: {{ item.source }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Created: {{ new Date(item.createdAt!).toLocaleString() }}
            </p>
          </div>
          <UButton variant="solid" color="gray" label="View Content" @click="showContent(item.content!)" />
        </div>
      </li>
    </ul>
    <div v-show="hasMore" ref="target" class="text-center py-8">
      <p v-if="loading" class="text-gray-600 dark:text-gray-300">
        Loading documents...
      </p>
      <p v-else class="text-gray-500 dark:text-gray-400">
        Scroll for more
      </p>
    </div>
  </div>
</template>

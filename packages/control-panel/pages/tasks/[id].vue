<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { useTrainStore } from '~/stores/train'
import type { Knowledge, TrainingTask } from '~/services/train'

const trainStore = useTrainStore()
const route = useRoute()
const toast = useToast()

const result = ref<Knowledge[]>([])
const page = ref(1)
const knowledgeCount = ref(0)
const pageCount = ref(20)
const loading = ref(false)
const hasMore = ref(true)
const isOpen = ref(false)
const itemContent = ref<string>('')
const task = ref<TrainingTask>()
const selectedItems = ref<Set<number>>(new Set())
const isConfirmDeleteOpen = ref(false)

const tabs = [{ slot: 'knowledge', label: 'Knowledge' }, { slot: 'failedLinks', label: 'Failed Links' }]
const target = ref(null)

const hasSelectedItems = computed(() => selectedItems.value.size > 0)

async function fetchData() {
  if (loading.value || !hasMore.value)
    return

  loading.value = true
  try {
    const { errors, data } = await trainStore.listKnowledge(Number(route.params.id), page.value, pageCount.value)
    if (!errors && data) {
      result.value = [...result.value, ...data]
      hasMore.value = data.length === pageCount.value
      if (hasMore.value)
        page.value++
    }
  }
  catch (error) {
    console.error('Error fetching data:', error)
    toast.add({ title: 'Failed to fetch data', color: 'red' })
  }
  finally {
    loading.value = false
  }
}

async function confirmDelete() {
  isConfirmDeleteOpen.value = true
}

async function batchDeleteKnowledge() {
  if (selectedItems.value.size === 0)
    return

  isConfirmDeleteOpen.value = false
  toast.add({ id: 'delete-knowledge', title: 'Deleting items...' })

  try {
    const { errors } = await trainStore.batchDeleteKnowledge(Array.from(selectedItems.value))
    if (errors) {
      throw new Error(errors[0].message)
    }
    result.value = result.value.filter(item => !selectedItems.value.has(item.id!))
    knowledgeCount.value -= selectedItems.value.size
    selectedItems.value.clear()
    toast.update('delete-knowledge', { color: 'green', title: 'Items deleted successfully' })
  }
  catch (error) {
    toast.update('delete-knowledge', { color: 'red', title: String(error) })
  }
}

async function getTaskData() {
  const taskId = Number(route.params.id)

  try {
    const { errors, data } = await trainStore.getTask(taskId)
    if (errors)
      throw new Error(errors[0].message)
    task.value = data!

    const { data: total } = await trainStore.getKnowledgeCount(taskId)
    knowledgeCount.value = total?.count || 0
  }
  catch (error) {
    console.error('Error fetching task data:', error)
    toast.add({ title: 'Failed to fetch task data', color: 'red' })
  }
}

function toggleItemSelection(id: number) {
  if (selectedItems.value.has(id)) {
    selectedItems.value.delete(id)
  }
  else {
    selectedItems.value.add(id)
  }
}

function getIconName(type: string): string {
  const iconMap: Record<string, string> = {
    pdf: 'i-heroicons-document',
    url: 'i-heroicons-globe-alt',
  }
  return iconMap[type.toLowerCase()] || 'i-heroicons-url'
}

function showContent(content: string) {
  itemContent.value = content
  isOpen.value = true
}

useInfiniteScroll(target, fetchData, { distance: 10 })

fetchData()
getTaskData()
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
    <UModal v-model="isConfirmDeleteOpen">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">
          Confirm Deletion
        </h3>
        <p class="mb-4">
          Are you sure you want to delete {{ selectedItems.size }} selected item(s)?
        </p>
        <div class="flex justify-end space-x-2">
          <UButton variant="solid" color="gray" label="Cancel" @click="isConfirmDeleteOpen = false" />
          <UButton variant="solid" color="red" label="Delete" @click="batchDeleteKnowledge" />
        </div>
      </div>
    </UModal>
    <UTabs :items="tabs">
      <template v-if="task?.details?.failedLinks" #failedLinks>
        <ul class="space-y-4">
          <li
            v-for="item in task.details.failedLinks" :key="item.url"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
          >
            <div class="p-4 flex items-start">
              <div class="flex-grow">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  url: {{ item.url }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  reason: {{ item.reason }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </template>
      <template v-if="result" #knowledge>
        <div class="mb-4 flex justify-between items-center">
          <UButton v-if="hasSelectedItems" variant="solid" color="red" label="Delete Selected" @click="confirmDelete" />
          <p v-if="hasSelectedItems" class="text-sm text-gray-600 dark:text-gray-300">
            {{ selectedItems.size }} item(s) selected
          </p>
        </div>
        <ul class="space-y-4">
          <li
            v-for="item in result" :key="item.id"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
          >
            <div class="p-4 flex items-start">
              <UCheckbox
                :model-value="selectedItems.has(item.id!)" class="mr-4 mt-1"
                @change="toggleItemSelection(item.id!)"
              />
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
              <div class="flex items-center">
                <UButton v-if="item.type === 'url'" variant="solid" color="gray" label="Retrain" class="mr-2" />
                <UButton variant="solid" color="gray" label="View Content" @click="showContent(item.content!)" />
              </div>
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
      </template>
    </UTabs>
  </div>
</template>

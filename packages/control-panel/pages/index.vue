<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTrainStore } from '~/stores/train'
import type { TrainingTask } from '~/services/train'

const trainStore = useTrainStore()

const result = ref<TrainingTask[]>([])
const sort = ref({ column: 'status', direction: 'asc' as const })
const page = ref(1)
const pageCount = ref(8)
const pageTotal = ref(0)
const loading = ref(false)
const isAddKnowledgeModalOpen = ref(false)

const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

const config = {
  td: {
    base: 'max-w-[0] truncate',
    padding: 'py-5',
    color: 'text-blue-500 dark:text-gray-400',
    font: '',
    size: 'text-xs',
  },
}

const columns = [
  { key: 'id', label: '#', sortable: true },
  { key: 'data', label: 'Data', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'details', label: 'Details', sortable: false },
  { key: 'startedAt', label: 'Started at', sortable: false },
  { key: 'finishedAt', label: 'Finished at', sortable: false },
]

async function fetchData() {
  loading.value = true
  try {
    const { errors, data } = await trainStore.list(page.value, pageCount.value)
    if (!errors) {
      result.value = data!
    }
    const { data: tableCount } = await trainStore.getCount()
    pageTotal.value = tableCount?.count || 0
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
  finally {
    loading.value = false
  }
}

watch(page, () => {
  fetchData()
})

fetchData()
</script>

<template>
  <div class="flex items-center mb-10">
    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
      Knowledge
    </h2>
    <UButton class="ml-auto" label="Add knowledge" size="xs" @click="isAddKnowledgeModalOpen = !isAddKnowledgeModalOpen" />
  </div>

  <UModal v-model="isAddKnowledgeModalOpen">
    <div class="p-4">
      <AddKnowledge />
      <Placeholder class="h-48" />
    </div>
  </UModal>

  <UTable
    v-model:sort="sort" :columns="columns" :rows="result" :ui="config" sort-asc-icon="i-heroicons-arrow-up"
    sort-desc-icon="i-heroicons-arrow-down" sort-mode="manual" :loading="loading"
  >
    <template #id-data="{ row }">
      <NuxtLink :to="`/tasks/${row.id}`">
        {{ row.id }}
      </NuxtLink>
    </template>

    <template #data-data="{ row }">
      <UPopover>
        <UButton class="px-0" size="xs" variant="soft" color="white" label="show data" />
        <template #panel>
          <ul class="p-4">
            <li v-for="data in row.data" :key="data.type" class="block">
              <UBadge size="xs" :label="data.type" color="gray" variant="subtle" />: {{ data.source }}
            </li>
          </ul>
        </template>
      </UPopover>
    </template>
    <template #status-data="{ row }">
      <UBadge
        size="xs" :label="row.status" :color="row.status === 'completed' ? 'emerald' : 'orange'"
        variant="subtle"
      />
    </template>
    <template #details-data="{ row }">
      <UBadge
        v-if="row.details?.error" size="xs" :label="row.details?.error" color="red" variant="subtle"
        class="text-xs"
      />
    </template>
  </UTable>
  <div class="flex flex-wrap justify-between items-center">
    <div>
      <span class="text-sm leading-5">
        Showing
        <span class="font-medium">{{ pageFrom }}</span>
        to
        <span class="font-medium">{{ pageTo }}</span>
        of
        <span class="font-medium">{{ pageTotal }}</span>
        results
      </span>
    </div>
    <UPagination
      v-model="page" :page-count="pageCount" :total="pageTotal" :ui="{
        wrapper: 'flex items-center gap-1',
        rounded: '!rounded-full min-w-[32px] justify-center',
        default: {
          activeButton: {
            variant: 'outline',
          },
        },
      }"
    />
  </div>
</template>

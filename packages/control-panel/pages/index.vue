<script setup lang="ts">
import { useTrainStore } from '~/stores/train';
import type { TrainingTask } from '~/services/train';

const result = ref<TrainingTask[]>([])
const trainStore = useTrainStore()

const config = {
    td: {
        base: 'max-w-[0] truncate',
        padding: 'py-5',
        color: 'text-blue-500 dark:text-gray-400',
        font: '',
        size: 'text-xs',
    },
}

const { errors, data } = await trainStore.list(1, 10)

if (!errors)
    result.value = data!

// Columns
const columns = [{
    key: 'id',
    label: '#',
    sortable: true
}, {
    key: 'data',
    label: 'Data',
    sortable: true
}, {
    key: 'status',
    label: 'Status',
    sortable: true
}, {
    key: 'details',
    label: 'Details',
    sortable: false
}, {
    key: 'startedAt',
    label: 'Started at',
    sortable: false,
}, {
    key: 'finishedAt',
    label: 'Finished at',
    sortable: false
}]

// Pagination
const sort = ref({ column: 'status', direction: 'asc' as const })
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(200)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

</script>

<template>
    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
        Training tasks
    </h2>
    <UTable v-model:sort="sort" :columns="columns" :rows="result" :ui="config" sort-asc-icon="i-heroicons-arrow-up"
        sort-desc-icon="i-heroicons-arrow-down" sort-mode="manual">
        <template #data-data="{ row }">
            <UPopover>
                <UButton class="px-0" size="xs" variant="soft" color="white" label="show data" />
                <template #panel>
                    <ul class="p-4">
                        <li class="block" v-for="data in row.data">
                            <UBadge size="xs" :label="data.type" color="gray" variant="subtle" />: {{ data.source }}
                        </li>
                    </ul>
                </template>
            </UPopover>

        </template>
        <template #status-data="{ row }">
            <UBadge size="xs" :label="row.status" :color="row.status === 'completed' ? 'emerald' : 'orange'"
                variant="subtle" />
        </template>

        <template #details-data="{ row }">
            <UBadge v-if="row.details?.['error']" size="xs" :label="row.details?.['error']" color="red" variant="subtle"
                class="text-xs" />
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

        <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" :ui="{
        wrapper: 'flex items-center gap-1',
        rounded: '!rounded-full min-w-[32px] justify-center',
        default: {
            activeButton: {
                variant: 'outline'
            }
        }
    }" />
    </div>
</template>
<script setup lang="ts">
import { useTrainStore } from '~/stores/train';
import type { TrainingTask } from '~/services/train';

const result = ref<TrainingTask[]>([])
const trainStore = useTrainStore()

const {errors, data} =await trainStore.list(1,100)

if(!errors)
    result.value = data!

</script>

<template>
    <h1>Supervisor</h1>
    <UTable :rows="result" />
</template>
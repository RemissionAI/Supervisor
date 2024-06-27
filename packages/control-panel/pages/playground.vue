<script setup lang="ts">
import { useStreamingFetch } from '~/composables/useStreamingFetch'

const { result, input, handleSubmit, isLoading, stop } = useStreamingFetch(`${useRuntimeConfig().public.apiBaseUrl}/ask/stream`)
</script>

<template>
  <UContainer>
    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight mb-5">
      Playground
    </h2>
    <UCard>
      <div class="flex items-center w-full justify-start ">
        <UInput
          ref="inputRef" v-model="input" class="w-5/6" icon="i-heroicons-sparkles-20-solid"
          size="xl" :color="isLoading ? 'green' : 'white'" :trailing="false"
          placeholder="Ask a question" focus :disabled="isLoading" @keyup.enter="handleSubmit"
        />

        <UButton v-if="isLoading" class="ml-5" @click="stop">
          Stop
        </UButton>
      </div>

      <div v-show="result" class="w-full text-base mt-12">
        <MarkdownRenderer :source="result" />
      </div>
    </UCard>
  </UContainer>
</template>

<style scoped>
.container {
    padding: 20px;
}

.input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

pre {
    background: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
}
</style>

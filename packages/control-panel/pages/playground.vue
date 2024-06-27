<script setup lang="ts">
import { useStreamingFetch } from '~/composables/useStreamingFetch'

const { result, input, handleSubmit, isLoading, stop } = useStreamingFetch(`${useRuntimeConfig().public.apiBaseUrl}/ask/stream`)

const clockConfig = {
  size: 300,
  faceColor: '#f0f0f0',
  markColor: '#333',
  hourHandColor: 'red',
  minuteHandColor: 'blue',
  secondHandColor: '#e74c3c',
  centerDotColor: '#333',
}

const buttonConfig = ref({
  label: 'Click me!',
  size: 'medium',
  color: '#3498db',
  textColor: '#ffffff',
  hoverColor: '#2980b9',
  hoverTextColor: '#ffffff',
  rounded: true,
  disabled: false,
  icon: '🚀',
  iconPosition: 'right',
})

function handleButtonClick() {
  console.log('Button clicked!')
}
</script>

<template>
  <UContainer>
    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight mb-5">
      Playground
    </h2>
    <AnalogClock :config="clockConfig" />
    <CustomButton :config="buttonConfig" @click="handleButtonClick" />
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

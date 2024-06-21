<script setup lang="ts">
import { useStreamingFetch } from '~/composables/useStreamingFetch';

const { result, input, handleSubmit, isLoading, stop} = useStreamingFetch(`${useRuntimeConfig().public.apiBaseUrl}/ask/stream`);

</script>

<template>
    <UContainer>
        <UCard>
            <template #header>
                <h1 class="text-3xl my-3 font-bold">Lupus AI Supervisor</h1>
                <p class="text-base mb-10">I'm here to help with any question concerning lupus disease.</p>
            </template>

            <div class="flex items-center w-full justify-start ">
                <UInput class="w-4/6" ref="inputRef" icon="i-heroicons-sparkles-20-solid" @keyup.enter="handleSubmit" size="xl"
                    :color="isLoading ? 'green' : 'white'" :trailing="false" placeholder="Ask a question" focus
                    v-model="input" :disabled="isLoading" />

                <UButton v-if="isLoading" @click="stop">
                    Stop
                </UButton>
            </div>


            <div class="max-w-full text-base mt-12" v-show="result">
                <MarkdownRenderer :source="result" />
            </div>

            <template #footer></template>
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
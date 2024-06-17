<script setup lang="ts">
import { useAskStore } from '~/stores/ask'

const askStore = useAskStore()
const query = ref('');
const response = ref('');
const isLoading = ref(false);
const inputRef = ref(null);

const askQuestion = async () => {
    isLoading.value = true;

    try {
        const res = await askStore.question(query.value)

        if (res.errors![0])
            throw new Error(res.errors![0].message)

    } catch (error) {
        response.value = error instanceof Error ? error.message : String(error)
    } finally {
        query.value = '';
        isLoading.value = false;

        nextTick(() => {
            inputRef.value!.focus();
        });
    }
};
</script>

<template>
    <UContainer>
        <UCard>
            <template #header>
                <h1 class="text-3xl my-3 font-bold">Lupus AI Supervisor</h1>
                <p class="text-base mb-10">I'm here to help with any question concerning lupus disease.</p>
            </template>

            <UInput ref="inputRef" icon="i-heroicons-sparkles-20-solid" @keyup.enter="askQuestion" size="xl"
                :color="isLoading ? 'green' : 'white'" :trailing="false" placeholder="Ask a question" focus
                v-model="query" :disabled="isLoading" />

            <div class="max-w-full text-base mt-12" v-show="response">
                <MarkdownRenderer :source="response" />
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
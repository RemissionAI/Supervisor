<script lang="ts" setup>
import { ref, nextTick } from 'vue';

const query = ref('');
const response = ref('');
const isLoading = ref(false);
const inputRef = ref(null);

const askQuestion = async () => {
  isLoading.value = true;

  try {
    const res = await fetch('https://remission-supervisor-service-staging.remissionaiorg.workers.dev/supervisor/v1/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ type: 'human', content: query.value }]
      }),
    });
    const data = await res.json();
    response.value = data.data.kwargs.content;
  } catch (error) {
    response.value = 'Error fetching response';
  } finally {
    query.value = '';
    isLoading.value = false;
    nextTick(() => {
      inputRef.value.focus();
    });
  }
};
</script>

<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-3xl my-3 font-bold">Lupus AI Supervisor</h1>
        <p class="text-base mb-10">I'm an AI trained on dataset</p>
      </template>

      <UInput ref="inputRef" icon="i-heroicons-sparkles-20-solid" @keyup.enter="askQuestion" size="xl"
        :color="isLoading ? 'green' : 'white'" :trailing="false" placeholder="Ask a question" focus v-model="query"
        :disabled="isLoading" />

      <div class="max-w-full text-base mt-12" v-show="response">
        <MarkdownRenderer :source="response"/>
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
<template>
  <UContainer>

    <UCard>
      <template #header>
        <h1 class="text-3xl my-3 font-bold">Lupus AI Supervisor</h1>
        <p class="text-base mb-10">I'm an AI trained on dataset</p>
      </template>

      <UInput icon="i-heroicons-sparkles-20-solid" @keyup.enter="askQuestion" size="xl" color="white" :trailing="false"
        placeholder="Ask a question" focus />
        
      <pre v-if="response">{{ response }}</pre>

      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UCard>



  </UContainer>
</template>

<script setup>
import { ref } from 'vue';

const query = ref('');
const response = ref('');

const askQuestion = async () => {
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
    console.error('Error:', error);
    response.value = 'Error fetching response';
  }
};
</script>

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
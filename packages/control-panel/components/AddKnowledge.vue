<script setup lang="ts">
const tabs = [{
  slot: 'pdf',
  label: 'Upload a pdf',
}, {
  slot: 'web',
  label: 'Links',
  disabled: true,

}]
</script>

<template>
  <div class="add-knowledge">
    <UTabs :items="tabs">
      <template #web>
        tobe
      </template>
      <template #pdf>
        <div class="my-10">
          <UInput type="file" size="xl" icon="i-heroicons-folder" label="Upload" />
        </div>
      </template>
    </UTabs>
  </div>
</template>

<style lang="scss" scoped>

</style>

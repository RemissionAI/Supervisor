<script setup lang="ts">

const links = ref([{
    label: 'Knowledge',
    icon: 'i-heroicons-home',
    to: '/'
}, {
    label: 'Playground',
    icon: 'i-heroicons-command-line',

    to: '/sse'
}, {
    icon: 'i-heroicons-home',
    label: 'Settings',
    to: '/settings'
}])
</script>

<template>
    <div class="flex w-full h-screen gap-4">
        <div class="w-80 p-3">
            <h1 class="text-2xl mb-5 font-bold">Lupus AI</h1>
            <UVerticalNavigation :links="links" />
        </div>
        <div class="w-full h-full py-12 px-24 overflow-auto">
            <slot />
        </div>
    </div>
</template>
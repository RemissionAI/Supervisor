<script setup lang="ts">

const links = ref([{
    label: 'Knowledge',
    icon: 'i-heroicons-circle-stack',
    to: '/'
}, {
    label: 'Playground',
    icon: 'i-heroicons-command-line',

    to: '/playground'
}, {
    icon: 'i-heroicons-cog-6-tooth',
    label: 'Settings',
    to: '/settings'
}])
</script>

<template>
    <div class="flex w-full h-screen gap-4">
        <div class="w-80 p-3">
            <h1 class="text-2xl mb-5 font-bold">Supervisor</h1>
            <UVerticalNavigation :links="links" />
        </div>
        <div class="w-full h-full py-12 px-24 overflow-auto">
            <slot />
        </div>
    </div>
</template>
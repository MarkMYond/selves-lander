<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <NuxtLoadingIndicator color="#d9e8f0" />
    <main class="flex-1 relative px-3">
      <NuxtPage />
    </main>
    <TheFooter v-if="showFooter" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Determine if the footer should be shown
const showFooter = computed(() => {
  return !route.path.startsWith('/wiki') && !route.path.startsWith('/registry')
})
</script>

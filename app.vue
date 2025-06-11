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

// Set default SEO meta tags at app level
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'theme-color', content: '#2563eb' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/favicon-v2.png' },
  ],
})
</script>

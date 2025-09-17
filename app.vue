<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <NuxtLoadingIndicator color="#d9e8f0" />
    <main class="flex-1 relative px-3">
      <NuxtPage />
    </main>
    <TheFooter v-if="showFooter" />
  <!-- GTM noscript moved to useHead for SSR compatibility -->
  </div>
</template>

<script setup lang="ts">
// GTM script injection removed for SSR/client hydration match. Use useHead or Nuxt module for GTM.
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Determine if the footer should be shown
const showFooter = computed(() => {
  return !route.path.startsWith('/wiki') && !route.path.startsWith('/registry') && !route.path.startsWith('/guide')
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
  ],
  noscript: [
    {
      innerHTML: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MS2DN2ZJ" height="0" width="0" style="display:none;visibility:hidden"></iframe>'
    }
  ]
})
</script>

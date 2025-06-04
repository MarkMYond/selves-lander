<template>
  <div class="home-page"> <!-- Removed mt-10 -->
    <!-- Render blocks fetched from Payload -->
    <BlockRenderer v-if="pageData?.layout" :blocks="pageData.layout" />
    <!-- Add loading/error state handling -->
    <div v-else-if="pending">Loading homepage content...</div>
    <div v-else-if="error">Error loading homepage: {{ error.message }}</div>
    <div v-else>
      Homepage content not found. Please ensure a page with slug 'home' is
      published in Payload.
    </div>
  </div>
</template>

<script setup lang="ts">
// Import the specific WebPage type from generated types
import type { WebPage } from '../src/payload-types'

// --- Fetch Homepage Data ---
// Construct the API URL to fetch the 'home' page from the 'web-pages' collection
const apiUrl = `/web-pages?where[slug][equals]=home&limit=1&depth=2` // Removed leading /api
const runtimeConfig = useRuntimeConfig()

const {
  data: pageResponse,
  pending,
  error,
} = await useFetch<{ docs: WebPage[] }>(apiUrl, {
  baseURL: runtimeConfig.public.payloadApiFullUrl, // Use full API URL that already includes /api
  key: 'homepage-data', // Unique cache key
  cache: 'no-cache', // Disable cache to force re-fetch on navigation
})

// Extract the page data (the first doc in the response)
const pageData = computed(() => pageResponse.value?.docs?.[0])

// Use watch to apply SEO when pageData changes
watch(
  pageData,
  (newPageData) => {
    useSeo(newPageData, 'website')
  },
  { immediate: true }
)
</script>

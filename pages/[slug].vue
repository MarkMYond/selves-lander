<template>
  <div :class="['page-slug', pageSpecificClass]">
    <div v-if="pending">
      Loading...
      <!-- Or replace with a proper loading skeleton component -->
    </div>
    <div
      v-else-if="error || !pageData"
      class="container mx-auto py-8 space-y-4"
    >
      <!-- Basic error handling - consider a dedicated 404 component -->
      <h1 class="text-xl">404: Page not found</h1>
      <p>Sorry, we couldn't find the page you were looking for.</p>
      <NuxtLink to="/" class="underline block">Go back home</NuxtLink>
    </div>
    <div v-else>
      <!-- Render the blocks directly -->
      <BlockRenderer :blocks="filteredBlocks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WebPage } from '../src/payload-types' // Import the specific page type from the correct path

const route = useRoute()
const config = useRuntimeConfig() // Get runtime config
const payloadApiFullUrl = config.public.payloadApiFullUrl // Use full API URL that already includes /api
// Join slug parts if it's an array (for [slug].vue)
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug

// Fetch page data based on the slug
// Construct the API path (relative to /api on the backend)
const apiPath = computed(
  () => `/web-pages?where[slug][equals]=${slug}&depth=2&limit=1`
) // depth=2 to populate layout blocks, limit=1, removed leading /api

// Use useAsyncData with $fetch to get the page data
const {
  data: pageResult,
  pending,
  error,
  refresh,
} = await useAsyncData<{ docs: WebPage[] }>(
  `page-${slug}`, // Unique key for caching
  async () => {
    if (!payloadApiFullUrl) {
      console.error(
        `[...slug].vue: Payload API URL is not configured for slug: ${slug}`
      )
      throw createError({
        statusCode: 500,
        statusMessage: 'API URL not configured',
      })
    }
    try {
      return await $fetch(apiPath.value, {
        // Use apiPath.value
        baseURL: payloadApiFullUrl, // Use the full API URL with /api
      })
    } catch (e: any) {
      console.error(
        `Error fetching page data for slug ${slug} from ${payloadApiFullUrl}${apiPath.value}:`,
        e
      ) // Use apiPath.value in log
      // Optionally, re-throw or handle specific errors to show a 404 or other error page
      throw createError({
        statusCode: e.statusCode || 500,
        statusMessage: e.statusMessage || 'Failed to fetch page data',
      })
    }
  },
  { watch: [apiPath] } // Re-fetch if the slug changes, watch apiPath
)

// Extract the single page document from the 'docs' array
const pageData = computed(() => pageResult.value?.docs?.[0])

// Filter blocks for 'get-in-touch' page and ensure 'id' is not null
const filteredBlocks = computed(() => {
  const processBlock = (block: any) => ({
    ...block,
    id: block.id === null ? undefined : block.id,
  })

  if (slug === 'get-in-touch' && pageData.value?.layout) {
    return pageData.value.layout
      .filter((block) => block.blockType === 'scheduleCallSection')
      .map(processBlock)
  }
  return pageData.value?.layout?.map(processBlock) || []
})

// Apply SEO data
useSeo(pageData.value, 'website')

const pageSpecificClass = computed(() => {
  if (slug === 'about') {
    return 'page-about';
  }
  return '';
});

// Handle case where page is not found (API returns empty docs array)
if (process.server && !pending.value && !pageData.value) {
  // Use Nuxt's error handling for 404
  // throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  console.error(`Page not found for slug: ${slug}`)
  // Temporary console log, consider implementing throw createError above
}
</script>

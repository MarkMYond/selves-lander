<template>
  <main>
    <BlockRenderer v-if="pageData?.layout" :blocks="pageData.layout" />
    <div v-else-if="!pending && !pageData" class="container mx-auto py-12 text-center">
      <p class="text-xl text-gray-500">Pricing page content not found or failed to load.</p>
      <p v-if="error" class="text-red-500 mt-2">Error: {{ error.message }}</p>
    </div>
    <div v-if="pending" class="container mx-auto py-12 text-center">
      <p class="text-xl text-gray-500">Loading pricing page...</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAsyncData, useRuntimeConfig, useError } from 'nuxt/app';
import type { WebPage as PageType } from '@/src/payload-types';
import BlockRenderer from '@/components/BlockRenderer.vue';
import { useSeo } from '@/composables/useSeo'; // Import useSeo

// Fetch page data from Payload for the 'pricing' page
const config = useRuntimeConfig();
const { PAYLOAD_API_URL } = config.public;
const { data: pageData, pending, error } = await useAsyncData<PageType | null>(
  'pricing-page',
  async () => {
    try {
      const response = await $fetch(`${PAYLOAD_API_URL}/web-pages?where[slug][equals]=pricing&depth=2`);
      const page = (response as any)?.docs?.[0] as PageType | undefined;
      if (!page) {
        console.warn("Pricing page data not found in Payload response or response format unexpected.");
        // Consider throwing an error here to be caught by Nuxt's error handling
        // throw createError({ statusCode: 404, statusMessage: 'Pricing page not found', fatal: true });
        return null; // Return null if page not found
      }
      return page;
    } catch (fetchError: any) {
      console.error('Failed to fetch pricing page data:', fetchError);
      // Use Nuxt's error handling for fatal errors
      // throw createError({ statusCode: 500, statusMessage: 'Failed to load pricing page', fatal: true });
      return null; // Return null on error
    }
  }
);

// SEO Meta
// The useSeo composable expects the page data object directly.
// It will extract title, meta.title, meta.description, and meta.image from it.
// We also need to ensure pageData.value is defined before calling useSeo.
watchEffect(() => {
  if (pageData.value) {
    useSeo(pageData.value as PageType, 'website'); // Cast to PageType which should match SeoPageData
  } else {
    // Set default SEO for when pageData is not available (e.g., on error or initial load)
    useHead({
      title: 'Our Pricing Plans - TaskHub',
      meta: [{ name: 'description', content: 'Find the perfect plan for your needs.' }],
    });
  }
});

// Handle cases where pageData might be null after fetch (e.g., page not found or fetch error)
if (!pending.value && !pageData.value && process.client) { // Check on client to avoid SSR issues with createError
  // This is a simple client-side alert, for more robust handling, use Nuxt's error page
  // console.warn('No data for pricing page, consider redirecting or showing a specific error component.');
}
</script>

<style scoped>
/* Add any page-specific styles if needed */
main {
  /* Ensures main content area takes up available space if footer is fixed or sticky */
  flex-grow: 1; 
}
</style>

<template>
  <div>
    <BlockRenderer
      v-if="pageData?.layout"
      :blocks="pageData.layout"
    />
    <div v-else-if="pending">
      Loading homepage content...
    </div>
    <div v-else-if="error">
      Error loading homepage: {{ error.message }}
    </div>
    <div v-else>
      Homepage content not found. Please ensure a page with slug 'home' is
      published in Payload.
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { WebPage } from '../src/payload-types'
import type { SeoPageData } from '../composables/useSeo' // Import SeoPageData

const apiUrl = `/web-pages?where[slug][equals]=home&limit=1&depth=2`
const runtimeConfig = useRuntimeConfig()

const {
  data: pageResponse,
  pending,
  error,
} = await useFetch<{ docs: WebPage[] }>(apiUrl, {
  baseURL: runtimeConfig.public.payloadApiFullUrl,
  key: 'homepage-data',
  cache: 'no-cache',
  retry: 2,
  retryDelay: 500,
  // Guard against hanging requests
  timeout: 10000,
})

const pageData = computed(() => pageResponse.value?.docs?.[0])

// If SSR failed or returned empty, try a client-side refresh after hydration
onMounted(async () => {
  if (!pageData.value) {
    try {
      await refreshNuxtData('homepage-data')
    } catch (e) {
      console.error('Homepage: client refresh failed', e)
    }
  }
})

watch(
  pageData,
  (newPageData) => {
    if (newPageData) {
      let processedJsonLD: Record<string, any> | null = null;
      if (newPageData.meta && newPageData.meta.jsonLD) {
        if (typeof newPageData.meta.jsonLD === 'string') {
          try {
            processedJsonLD = JSON.parse(newPageData.meta.jsonLD);
          } catch (e) {
            console.error('Failed to parse jsonLD string from pageData.meta:', e);
            // Keep processedJsonLD as null
          }
        } else if (typeof newPageData.meta.jsonLD === 'object') {
          // Ensures it's an object, not an array or other primitives
          processedJsonLD = newPageData.meta.jsonLD as Record<string, any>;
        }
      }

      // Construct the object for useSeo, ensuring the meta structure is compatible
      const seoDataForComposable: SeoPageData = {
        // Map fields from WebPage to SeoPageData
        title: newPageData.title || '', // Ensure title is always a string
        slug: newPageData.slug,
        updatedAt: newPageData.updatedAt,
        createdAt: newPageData.createdAt,
        layout: newPageData.layout, // WebPage uses 'layout'
        // pageBuilder: newPageData.pageBuilder, // Remove this line as WebPage doesn't have it
        meta: newPageData.meta ? {
          title: newPageData.meta.title,
          description: newPageData.meta.description,
          // Handle image type difference if necessary, SeoPageData expects { url?: string | null } | string | null
          // Assuming newPageData.meta.image (Media type) has a URL property if it's an object
          image: typeof newPageData.meta.image === 'object' && newPageData.meta.image !== null && 'url' in newPageData.meta.image ? 
                 (newPageData.meta.image as { url?: string | null }).url : 
                 (typeof newPageData.meta.image === 'string' ? newPageData.meta.image : null),
          keywords: newPageData.meta.keywords,
          schemaType: newPageData.meta.schemaType,
          noIndex: newPageData.meta.noIndex,
          jsonLD: processedJsonLD, // Use the processed jsonLD
        } : null, // If newPageData.meta is null/undefined, pass null for meta
      };
      useSeo(seoDataForComposable, 'website');
    }
    // If newPageData is undefined, useSeo itself has a check and will return early.
  },
  { immediate: true }
)
</script>

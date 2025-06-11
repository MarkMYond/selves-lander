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

    <!-- Temporary debug link -->
    <div style="position: fixed; bottom: 10px; left: 10px; background: yellow; padding: 5px; z-index: 9999;">
      <a href="/favicon-v2.png" target="_blank">Test Favicon Link</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WebPage } from '../src/payload-types'

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
})

const pageData = computed(() => pageResponse.value?.docs?.[0])

watch(
  pageData,
  (newPageData) => {
    useSeo(newPageData, 'website')
  },
  { immediate: true }
)
</script>

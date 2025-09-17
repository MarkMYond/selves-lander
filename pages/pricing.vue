<template>
  <main>
    <BlockRenderer
      v-if="pageData?.layout"
      :blocks="pageData.layout"
    />
    <div
      v-else-if="!pending && !pageData"
      class="container mx-auto py-12 text-center"
    >
      <p class="text-xl text-gray-500">
        Pricing page content not found or failed to load.
      </p>
      <p
        v-if="error"
        class="text-red-500 mt-2"
      >
        Error: {{ error.message }}
      </p>
    </div>
    <div
      v-if="pending"
      class="container mx-auto py-12 text-center"
    >
      <p class="text-xl text-gray-500">
        Loading pricing page...
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAsyncData, useRuntimeConfig, useError } from 'nuxt/app'
import type { WebPage as PageType } from '../src/payload-types'
import BlockRenderer from '@/components/BlockRenderer.vue'
import { useSeo } from '@/composables/useSeo'

const config = useRuntimeConfig()
// Ensure payloadApiFullUrl is a valid string, with a safe generic fallback.
const rawApiUrl = config.public.payloadApiFullUrl
const safeApiUrl = (typeof rawApiUrl === 'string' && rawApiUrl.length > 0)
  ? rawApiUrl
  : (process.env.NUXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/$/, '') || 'http://localhost:3333') + '/api'

if (typeof rawApiUrl !== 'string' || rawApiUrl.length === 0) {
  console.warn(`Pricing Page: config.public.payloadApiFullUrl was not a valid string ('${rawApiUrl}'), using fallback '${safeApiUrl}'`);
}

const {
  data: pageData,
  pending,
  error,
} = await useAsyncData<PageType | null>('pricing-page', async () => {
  try {
    const response = await $fetch(
      `${safeApiUrl}/web-pages?where[slug][equals]=pricing&depth=2` // Use safeApiUrl
    )
    const page = (response as any)?.docs?.[0] as PageType | undefined
    if (!page) {
      console.warn(
        'Pricing page data not found in Payload response or response format unexpected.'
      )
      return null
    }
    return page
  } catch (fetchError: any) {
    console.error('Failed to fetch pricing page data:', fetchError)
    // Set error for display
    // Note: useError() must be called at the top level of setup, not conditionally or in async
    // So, we return null and let the template handle the error display based on the 'error' ref from useAsyncData
    return null
  }
})

watchEffect(() => {
  if (pageData.value) {
    useSeo(pageData.value as PageType, 'website')
  } else {
    // Fallback SEO if pageData fails to load or is null
    useHead({
      title: 'Our Pricing Plans - TaskHub',
      meta: [
        {
          name: 'description',
          content: 'Find the perfect plan for your needs.',
        },
      ],
    })
  }
})

// This condition was empty, can be removed or used for specific client-side logic if needed.
// if (!pending.value && !pageData.value && process.client) {
// }
</script>

<style scoped>
main {
  flex-grow: 1; /* Ensure main content takes up available space */
}
</style>

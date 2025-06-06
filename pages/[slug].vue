<template>
  <div :class="['page-slug', pageSpecificClass]">
    <div v-if="pending">
      Loading...
    </div>
    <div
      v-else-if="error || !pageData"
      class="container mx-auto py-8 space-y-4"
    >
      <h1 class="text-xl">
        404: Page not found
      </h1>
      <p>Sorry, we couldn't find the page you were looking for.</p>
      <NuxtLink
        to="/"
        class="underline block"
      >
        Go back home
      </NuxtLink>
    </div>
    <BlockRenderer
      v-else-if="pageData"
      :blocks="filteredBlocks"
    />
    <div v-else>
      Content not available.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WebPage } from '../src/payload-types'

const route = useRoute()
const config = useRuntimeConfig()
const payloadApiFullUrl = config.public.payloadApiFullUrl
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug

const apiPath = computed(
  () => `/web-pages?where[slug][equals]=${slug}&depth=2&limit=1`
)

const {
  data: pageResult,
  pending,
  error,
  refresh,
} = await useAsyncData<{ docs: WebPage[] }>(
  `page-${slug}`,
  async () => {
    if (!payloadApiFullUrl) {
      // console.error(
      //   `[...slug].vue: Payload API URL is not configured for slug: ${slug}`
      // )
      throw createError({
        statusCode: 500,
        statusMessage: 'API URL not configured',
      })
    }
    try {
      return await $fetch(apiPath.value, {
        baseURL: payloadApiFullUrl,
      })
    } catch (e: any) {
      // console.error(
      //   `Error fetching page data for slug ${slug} from ${payloadApiFullUrl}${apiPath.value}:`,
      //   e
      // )
      throw createError({
        statusCode: e.statusCode || 500,
        statusMessage: e.statusMessage || 'Failed to fetch page data',
      })
    }
  },
  { watch: [apiPath] }
)

const pageData = computed(() => pageResult.value?.docs?.[0])

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
    return 'page-about'
  }
  return ''
})

if (process.server && !pending.value && !pageData.value) {
  // console.error(`Page not found for slug: ${slug}`)
}
</script>

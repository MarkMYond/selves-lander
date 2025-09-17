<template>
  <WikiLayout
    :nav-parent-id="null"
    nav-title="Wiki Home"
    :toc-items="[]"
    :is-right-sidebar-open="isRightSidebarOpen"
    :toggle-right-sidebar="toggleRightSidebar"
    :is-left-sidebar-open="isLeftSidebarOpen"
    @close-left-sidebar="isLeftSidebarOpen = false"
  >
    <div
      v-if="error || !homepageData"
      class="py-12 text-center"
    >
      <div class="w-24 h-24 mx-auto mb-6 text-4xl">
        📖
      </div>
      <h1 class="text-3xl font-semibold text-gray-700 mb-3">
        Wiki Homepage Not Set
      </h1>
      <p class="mt-3 text-gray-500 max-w-md mx-auto mb-6">
        No page has been designated as the Wiki homepage in the CMS. Please set
        one in the 'wiki-pages' collection.
      </p>
    </div>

    <div v-else>
      <div class="max-w-3xl mx-auto px-6 pt-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 mr-1 lg:hidden"
              aria-label="Toggle navigation"
              @click="toggleLeftSidebar"
            >
              <Icon
                name="ph:list"
                size="16"
              />
            </button>
            <div class="text-sm text-brand-primary dark:text-primary-300">
              Wiki Home
            </div>
          </div>
        </div>
      </div>

      <template v-if="showMicroHeader">
        <div
          :class="[
            'mt-5 mb-16 mx-5 rounded-lg relative overflow-visible',
            headerBgClass,
          ]"
        >
          <div class="max-w-3xl mx-auto h-40 md:h-48 relative overflow-visible">
            <img
              v-if="backgroundImageUrl"
              :src="backgroundImageUrl"
              alt="Page Icon"
              class="absolute left-8 -bottom-10 h-52 w-52 md:h-60 md:w-60 object-contain z-10"
            >
            <Icon
              v-else
              name="ph:book-open-duotone"
              class="absolute left-8 -bottom-10 text-white z-10 h-52 w-52 md:h-60 md:w-60"
            />
          </div>
        </div>
      </template>

      <div
        class="max-w-3xl mx-auto px-6 pb-8"
        :class="{ 'pt-8': !showMicroHeader }"
      >
        <h1
          class="text-brandNeutral-04 dark:text-brand-100 tracking-tight text-7xl leading-[86px] max-md:text-6xl max-sm:text-4xl max-sm:leading-10 mt-8 mb-10 border-b border-brand-50 dark:border-primary-700 pb-4"
        >
          {{ homepageData.title }}
        </h1>
        <div class="prose prose-slate max-w-none dark:prose-invert">
          <BlockRenderer :blocks="homepageData.pageBuilder || []" />
        </div>
        <div
          v-if="lastUpdated"
          class="mt-8 pt-4 border-t border-brand-50 dark:border-primary-700 text-sm text-brand-primary dark:text-primary-300"
        >
          Last updated: {{ lastUpdated }}
        </div>
      </div>
    </div>
  </WikiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import type { WikiPage, Media } from '../../src/payload-types'
import BlockRenderer from '../../components/BlockRenderer.vue'
import WikiLayout from '../../components/wiki/WikiLayout.vue'
import { useSeo } from '../../composables/useSeo'
import { useMediaUrl } from '../../composables/useMediaUrl'

type FetchedHomepage = Omit<WikiPage, 'pageBuilder' | 'backgroundSettings'> & {
  pageBuilder?: any[]
  backgroundSettings?: {
    backgroundImage?: Media | string
    backgroundOverlay?: string
  }
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const payloadApiFullUrl = config.public.payloadApiFullUrl

const wikiHomepageApiUrlPath = `/wiki-pages?where[isSectionHomepage][equals]=true&limit=1&depth=2`

const {
  data: homepageResponse,
  pending,
  error,
  refresh,
} = await useFetch<{ docs: FetchedHomepage[] }>(wikiHomepageApiUrlPath, {
  baseURL: payloadApiFullUrl,
  key: 'wiki-homepage',
  async transform(response) {
    if (!payloadApiFullUrl) {
      // console.error('Wiki Index: Payload API URL is not configured.')
      return { docs: [] }
    }
    if (!response || !response.docs) {
      // console.warn(
      //   'Wiki Index: No docs found in homepage response or response is null.'
      // )
      return { docs: [] }
    }
    return response
  },
  onRequestError({ request, options, error: requestError }) {
    // console.error(
    //   `Wiki Index: Error fetching homepage data from ${options.baseURL}${request}:`,
    //   requestError
    // )
  },
})

const homepageData = computed(() => homepageResponse.value?.docs?.[0])

const { getMediaUrl } = useMediaUrl()
const backgroundImageUrl = computed(() => {
  const bgSettings = homepageData.value?.backgroundSettings
  const bgImage = bgSettings?.backgroundImage

  if (
    typeof bgImage === 'object' &&
    bgImage !== null &&
    'url' in bgImage &&
    bgImage.url
  ) {
    if (
      bgImage.url.startsWith('http://') ||
      bgImage.url.startsWith('https://')
    ) {
      return bgImage.url
    }
    return getMediaUrl(bgImage)
  }

  if (typeof bgImage === 'string') {
    if (bgImage.startsWith('http://') || bgImage.startsWith('https://')) {
      return bgImage
    }
    return getMediaUrl(bgImage)
  }

  return undefined
})

const backgroundOverlayValue = computed(
  () => homepageData.value?.backgroundSettings?.backgroundOverlay
)

const headerBgClass = computed(() => {
  const overlay = backgroundOverlayValue.value
  const validBgValues =
    /^(brandTheme-(01|02|03|04)|brandNeutral-(01|02|03|04)|light-grey)$/
  if (overlay && validBgValues.test(overlay)) {
    return `bg-${overlay}`
  }
  return 'bg-gradient-to-r from-indigo-500 to-purple-600'
})

const showMicroHeader = computed(() => {
  const overlay = backgroundOverlayValue.value
  const isPrimaryColorSelected =
    overlay &&
    /^primary-(25|50|100|200|300|400|500|600|700|800|900|950)$/.test(overlay)
  return !!backgroundImageUrl.value || isPrimaryColorSelected
})

const formatDate = (dateString?: string | null): string | null => {
  if (!dateString) return null
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    // console.error('Error formatting date:', e)
    return null
  }
}
const lastUpdated = computed(() => formatDate(homepageData.value?.updatedAt))

useSeo(homepageData.value as any, 'article')

const isRightSidebarOpen = ref(false)
const toggleRightSidebar = () => {
  isRightSidebarOpen.value = !isRightSidebarOpen.value
}

const isLeftSidebarOpen = ref(false)
const toggleLeftSidebar = () => {
  // console.log('toggleLeftSidebar')
  isLeftSidebarOpen.value = !isLeftSidebarOpen.value
}

onMounted(() => {
  if (window.innerWidth >= 1024) {
    isLeftSidebarOpen.value = true
  }
})
</script>

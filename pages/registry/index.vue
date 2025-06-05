<template>
  <RegistryLayout
    :nav-parent-id="null"
    nav-title="Registry Home"
    :isLeftSidebarOpen="isLeftSidebarOpen"
    @closeLeftSidebar="isLeftSidebarOpen = false"
  >
    <!-- Page states handling -->
    <!-- Error State -->
    <div v-if="error || !homepageData" class="py-12 text-center">
      <div class="w-24 h-24 mx-auto mb-6 text-4xl">📚</div>
      <h1 class="text-3xl font-bold text-gray-700 mb-3">
        Registry Homepage Not Set
      </h1>
      <p class="mt-3 text-gray-500 max-w-md mx-auto mb-6">
        No page has been designated as the Registry homepage in the CMS. Please
        set one in the 'registry-pages' collection.
      </p>
    </div>

    <!-- Render Homepage Content (Reverted) -->
    <div v-else>
      <!-- Breadcrumbs/History container (Constrained) -->
      <div class="max-w-3xl mx-auto px-6 pt-8">
        <div class="flex items-center gap-2">
          <!-- Mobile hamburger menu for left sidebar -->
          <button
            @click="isLeftSidebarOpen = true"
            class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 mr-1 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Icon name="ph:list" size="16" />
          </button>
          <div class="text-sm text-brand-primary dark:text-primary-300">
            Registry Home
          </div>
        </div>
      </div>

      <!-- Micro-header -->
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
            />
            <Icon
              name="ph:squares-four"
              v-else
              class="absolute left-8 -bottom-10 text-white z-10 h-52 w-52 md:h-60 md:w-60"
            />
          </div>
        </div>
      </template>

      <!-- Container for constrained content - Apply conditional top padding -->
      <div
        class="max-w-3xl mx-auto px-6 pb-8"
        :class="{ 'pt-8': !showMicroHeader }"
      >
        <h1
          class="text-brandNeutral-04 dark:text-brand-100 tracking-tight text-7xl leading-[86px] max-md:text-6xl max-sm:text-4xl max-sm:leading-10 mt-8 mb-10 border-b border-brand-50 dark:border-primary-700 pb-4"
        >
          {{ homepageData.title }}
        </h1>
        <!-- dark:border-brand-900 to dark:border-primary-700 -->
        <div class="prose prose-slate max-w-none dark:prose-invert">
          <BlockRenderer :blocks="homepageData.pageBuilder || []" />
        </div>
        <div
          v-if="lastUpdated"
          class="mt-8 pt-4 border-t border-brand-50 dark:border-primary-700 text-sm text-brand-primary dark:text-primary-300"
        >
          <!-- dark:border-brand-900 to dark:border-primary-700 -->
          Last updated: {{ lastUpdated }}
        </div>
      </div>
      <!-- Close constrained content container -->
    </div>
    <!-- Close v-else wrapper -->
  </RegistryLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue' // Added onMounted
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app' // Import useRuntimeConfig
import type { RegistryPage, Media } from '../../src/payload-types'
import BlockRenderer from '../../components/BlockRenderer.vue'
import RegistryLayout from '../../components/registry/RegistryLayout.vue' // Changed import
import { useSeo } from '../../composables/useSeo'
import { useMediaUrl } from '../../composables/useMediaUrl' // Import useMediaUrl composable

// Define type for fetched homepage data
type FetchedHomepage = Omit<
  RegistryPage,
  'pageBuilder' | 'backgroundSettings'
> & {
  pageBuilder?: any[]
  backgroundSettings?: {
    backgroundImage?: Media | string
    backgroundOverlay?: string
  }
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig() // Get runtime config
const payloadApiFullUrl = config.public.payloadApiFullUrl // Use full API URL that already includes /api

// API path (relative to /api on the backend)
const registryHomepageApiUrlPath = `/registry-pages?where[isSectionHomepage][equals]=true&limit=1&depth=2` // Removed leading /api

const {
  data: homepageResponse,
  pending,
  error,
  refresh,
} = await useFetch<{ docs: FetchedHomepage[] }>(registryHomepageApiUrlPath, {
  baseURL: payloadApiFullUrl, // Use the full API URL with /api
  key: 'registry-homepage',
  async transform(response) {
    // Handle cases where response might not be as expected or payloadBaseUrl is missing
    if (!payloadApiFullUrl) {
      console.error('Registry Index: Payload API URL is not configured.')
      // Potentially throw an error or return a specific structure to indicate failure
      return { docs: [] } // Return empty docs to avoid breaking computed props
    }
    if (!response || !response.docs) {
      console.warn(
        'Registry Index: No docs found in homepage response or response is null.'
      )
      return { docs: [] }
    }
    return response
  },
  onRequestError({ request, options, error: requestError }) {
    console.error(
      `Registry Index: Error fetching homepage data from ${options.baseURL}${request}:`,
      requestError
    )
  },
})

const homepageData = computed(() => homepageResponse.value?.docs?.[0])

// Background Settings
const { getMediaUrl } = useMediaUrl() // Get the getMediaUrl function

const backgroundImageUrl = computed(() => {
  const bgSettings = homepageData.value?.backgroundSettings
  const bgImage = bgSettings?.backgroundImage

  // First, check if we have an object with a URL that's already a full URL (CDN)
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
      return bgImage.url // Return CDN URL directly
    }
    // Otherwise use the getMediaUrl function to construct the URL properly
    return getMediaUrl(bgImage)
  }

  // Handle string paths
  if (typeof bgImage === 'string') {
    if (bgImage.startsWith('http://') || bgImage.startsWith('https://')) {
      return bgImage // Return direct URL
    }
    return getMediaUrl(bgImage)
  }

  return undefined // No image
})

const backgroundOverlayValue = computed(
  () => homepageData.value?.backgroundSettings?.backgroundOverlay
)

const headerBgClass = computed(() => {
  const overlay = backgroundOverlayValue.value
  // Check if the overlay value is one of the defined background class values
  const validBgValues =
    /^(brandTheme-(01|02|03|04)|brandNeutral-(01|02|03|04)|light-grey)$/
  if (overlay && validBgValues.test(overlay)) {
    return `bg-${overlay}` // Apply the dynamic background class
  }
  // Fallback to brandNeutral-01 if value is 'default-gradient' or invalid/not set
  return 'bg-brandNeutral-01' // Fallback to Neutral White
})

// Determine if the header should be shown (only if image exists or a specific primary color is selected)
const showMicroHeader = computed(() => {
  const overlay = backgroundOverlayValue.value
  const isPrimaryColorSelected =
    overlay &&
    /^primary-(25|50|100|200|300|400|500|600|700|800|900|950)$/.test(overlay)
  return !!backgroundImageUrl.value || isPrimaryColorSelected
})

// Date Formatting
const formatDate = (dateString?: string | null): string | null => {
  if (!dateString) return null
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return null
  }
}
const lastUpdated = computed(() => formatDate(homepageData.value?.updatedAt))

// Apply SEO with our new composable - cast to any to fix type issues
useSeo(homepageData.value as any, 'article') // Use 'article' type for registry pages

// Right Sidebar
const isRightSidebarOpen = ref(false)
const toggleRightSidebar = () => {
  isRightSidebarOpen.value = !isRightSidebarOpen.value
}

// Left Sidebar
const isLeftSidebarOpen = ref(false) // Default to closed on mobile
const toggleLeftSidebar = () => {
  isLeftSidebarOpen.value = !isLeftSidebarOpen.value
}

// Ensure left sidebar is open on larger screens initially
onMounted(() => {
  if (window.innerWidth >= 1024) {
    // lg breakpoint
    isLeftSidebarOpen.value = true
  }
})
</script>

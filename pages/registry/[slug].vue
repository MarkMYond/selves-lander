<template>
  <RegistryLayout
    :nav-parent-id="null"
    nav-title="Registry Menu"
    :isLeftSidebarOpen="isLeftSidebarOpen"
    @closeLeftSidebar="isLeftSidebarOpen = false"
  >
    <!-- Error State -->
    <div v-if="error || !pageData" class="py-12 text-center">
      <div class="w-24 h-24 mx-auto mb-6 text-4xl">🔩</div>
      <h1 class="text-3xl font-bold text-gray-700 mb-3">
        Registry Page Not Found
      </h1>
      <p class="mt-3 text-gray-500 max-w-md mx-auto mb-6">
        The registry page you're looking for doesn't exist or has been moved.
        (Slug: {{ pageSlug }})
      </p>
      <NuxtLink
        to="/registry"
        class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        <span class="mr-1">←</span> Back to Registry Home
      </NuxtLink>
    </div>

    <!-- Page Content -->
    <div v-else>
      <!-- Breadcrumbs/History -->
      <div class="max-w-3xl mx-auto px-6 pt-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="flex items-center">
              <button
                @click="$router.back()"
                class="p-1 rounded hover:bg-brand-100 dark:hover:bg-slate-700 text-brand-400 hover:text-brand-500 dark:hover:text-brand-300"
                aria-label="Go back"
              >
                <Icon name="ph:arrow-left" size="16" />
              </button>
              <button
                @click="$router.forward()"
                class="p-1 rounded hover:bg-brand-100 dark:hover:bg-slate-700 text-brand-400 hover:text-brand-500 dark:hover:text-brand-300"
                aria-label="Go forward"
              >
                <Icon name="ph:arrow-right" size="16" />
              </button>
            </div>
            <!-- Simplified Breadcrumb -->
            <div class="text-sm text-brand-primary dark:text-primary-300">
              <NuxtLink
                to="/registry"
                class="hover:text-brand-primary/80 dark:hover:text-primary-200"
                >Registry</NuxtLink
              >
              <span
                v-if="
                  pageData.category && typeof pageData.category === 'object'
                "
                class="mx-1"
                >/</span
              >
              <span
                v-if="
                  pageData.category && typeof pageData.category === 'object'
                "
                >{{ pageData.category.name }}</span
              >
              <span class="mx-1">/</span>
              <span
                class="font-medium text-brand-primary dark:text-primary-300"
                >{{ pageData.title }}</span
              >
            </div>
          </div>
          <button
            @click="isLeftSidebarOpen = true"
            class="p-1 rounded hover:bg-brand-100 text-gray-500 hover:text-gray-600 ml-auto lg:hidden"
            aria-label="Toggle table of contents"
          >
            <Icon name="ph:list" size="16" />
          </button>
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

      <!-- Container for constrained content -->
      <div
        class="max-w-3xl mx-auto px-6 pb-8"
        :class="{ 'pt-8': !showMicroHeader }"
      >
        <article>
          <h1
            class="text-brandNeutral-04 dark:text-brand-100 tracking-tight text-7xl leading-[86px] max-md:text-6xl max-sm:text-4xl max-sm:leading-10 mt-8 mb-10 border-b border-brand-50 dark:border-primary-700 pb-4"
          >
            {{ pageData.title }}
          </h1>
          <div class="prose prose-slate max-w-none dark:prose-invert">
            <BlockRenderer :blocks="pageData.pageBuilder || []" />
          </div>
          <div
            v-if="lastUpdated"
            class="mt-8 pt-4 border-t border-brand-50 dark:border-primary-700 text-sm text-brand-primary dark:text-primary-300"
          >
            Last updated: {{ lastUpdated }}
          </div>
        </article>
        <PagePrevNextNav
          v-if="
            registryNavData &&
            registryNavData.length > 0 &&
            pageData &&
            pageSlug
          "
          :nav-data="registryNavData"
          :current-page-slug="pageSlug"
          section="registry"
        />
      </div>
    </div>
  </RegistryLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue' // Added onMounted
import { useRoute, useRouter } from 'vue-router'
// Phosphor Icons replaced with Nuxt Icon component
import slugify from 'slugify'
import type { RegistryPage, Category, Media } from '../../src/payload-types'
import BlockRenderer from '../../components/BlockRenderer.vue'
import RegistryLayout from '../../components/registry/RegistryLayout.vue' // Changed import
import { useSeo } from '../../composables/useSeo'
import { useMediaUrl } from '../../composables/useMediaUrl' // Import useMediaUrl
import { useRuntimeConfig } from 'nuxt/app'
// PagePrevNextNav component and usePayloadNavigation composable are expected to be auto-imported by Nuxt.
// ref from 'vue' is also auto-imported.

// Type Definitions
type SectionHeaderBlock = {
  id: string
  blockType: 'sectionHeaderBlock'
  title: string
  level?: 'h1' | 'h2' | 'h3' | 'h4'
  anchorId?: string
}
type GenericBlock = { id: string; blockType: string; [key: string]: any }
type PageBuilderBlock = SectionHeaderBlock | GenericBlock
interface TocItem {
  id: string
  text: string
  level: string
}
type FetchedRegistryPage = Omit<
  RegistryPage,
  'category' | 'pageBuilder' | 'backgroundSettings'
> & {
  pageBuilder?: PageBuilderBlock[]
  category?: Category | string
  backgroundSettings?: {
    backgroundImage?: Media | string
    backgroundOverlay?: string
  }
}

// Component Logic
const { getMediaUrl } = useMediaUrl() // Destructure getMediaUrl
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const payloadApiFullUrl = config.public.payloadApiFullUrl // Use full API URL that already includes /api

// Fetch navigation data for the 'registry' section
const registrySectionSlug = ref('registry')
const {
  navData: registryNavData,
  loading: navLoading,
  error: navError,
} = usePayloadNavigation(registrySectionSlug)

const pageSlug = computed(() => {
  const slugParam = route.params.slug
  return Array.isArray(slugParam) ? slugParam[slugParam.length - 1] : slugParam
})

// Use a unique key for useFetch that includes the full path to force refetching on navigation
const fetchKey = computed(() => `registry-page-${route.fullPath}`)
const {
  data: pageResponse,
  pending,
  error,
} = await useFetch<{ docs: FetchedRegistryPage[] }>(
  () => `/registry-pages?where[slug][equals]=${pageSlug.value}&depth=2&limit=1`, // Removed leading /api from path
  {
    baseURL: payloadApiFullUrl, // Use the full API URL with /api
    key: fetchKey.value,
    async transform(response) {
      if (!payloadApiFullUrl) {
        console.error(
          `Registry Slug Page: Payload API URL is not configured for slug ${pageSlug.value}.`
        )
        return { docs: [] }
      }
      if (!response || !response.docs) {
        console.warn(
          `Registry Slug Page: No docs found in page response for slug ${pageSlug.value} or response is null.`
        )
        return { docs: [] }
      }
      return response
    },
    onRequestError({ request, options, error: requestError }) {
      console.error(
        `Registry Slug Page: Error fetching page data for slug ${pageSlug.value} from ${options.baseURL}${request}:`,
        requestError
      )
    },
    // Disable caching to ensure fresh content on navigation
    cache: 'no-cache',
    // Disable automatic refetching to give us full control
    watch: false,
  }
)

const pageData = computed(() => pageResponse.value?.docs?.[0])

// Background Settings
const backgroundImageUrl = computed(() => {
  const bgSettings = pageData.value?.backgroundSettings
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
  () => pageData.value?.backgroundSettings?.backgroundOverlay
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
const lastUpdated = computed(() => formatDate(pageData.value?.updatedAt))

// Table of Contents
const tableOfContents = computed((): TocItem[] => {
  if (!pageData.value?.pageBuilder) return []
  return pageData.value.pageBuilder
    .filter(
      (block): block is SectionHeaderBlock =>
        block.blockType === 'sectionHeaderBlock' &&
        typeof block.title === 'string' &&
        ['h1', 'h2', 'h3'].includes(block.level || '')
    )
    .map((block) => {
      const text = block.title
      const id = block.anchorId
        ? slugify(block.anchorId, { lower: true, strict: true })
        : slugify(text, { lower: true, strict: true })
      return { id, text, level: block.level || 'h2' }
    })
})

// Apply SEO with our new composable
useSeo(pageData.value, 'article') // Use 'article' type for registry pages

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

<template>
  <WikiLayout
    :nav-parent-id="navParentId"
    :nav-title="navTitle"
    :isLeftSidebarOpen="isLeftSidebarOpen"
    @closeLeftSidebar="isLeftSidebarOpen = false"
  >
    <!-- Error State (Simplified condition) -->
    <div v-if="pageError" class="py-12 text-center">
      <div class="w-24 h-24 mx-auto mb-6 text-4xl">🔍</div>
      <h1 class="text-3xl font-bold text-gray-700 mb-3">Error Loading Page</h1>
      <p class="mt-3 text-gray-500 max-w-md mx-auto mb-6">
        Could not load the requested page. Please try again later.
      </p>
      <!-- Debug Info -->
      <div
        class="text-xs text-left bg-red-100 p-4 rounded max-w-xl mx-auto mb-4 border border-red-300"
      >
        <p><strong>Debug Info:</strong></p>
        <p>
          Requested Slug: <code>{{ pageSlug }}</code>
        </p>
        <p>
          Fetch Error Message: <code>{{ pageError?.message || 'None' }}</code>
        </p>
        <p>
          Fetch Status Code: <code>{{ pageError?.statusCode || 'N/A' }}</code>
        </p>
        <p>Error Data:</p>
        <pre
          class="mt-1 text-xs whitespace-pre-wrap break-all bg-white p-2 border rounded"
          >{{ JSON.stringify(pageError?.data, null, 2) || 'N/A' }}</pre
        >
      </div>
      <NuxtLink
        to="/wiki"
        class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        <span class="mr-1">←</span> Back to Wiki Home
      </NuxtLink>
    </div>

    <!-- Page Not Found State -->
    <div v-else-if="!pageData && !pagePending" class="py-12 text-center">
      <div class="w-24 h-24 mx-auto mb-6 text-4xl">🤷</div>
      <h1 class="text-3xl font-bold text-gray-700 mb-3">Page Not Found</h1>
      <p class="mt-3 text-gray-500 max-w-md mx-auto mb-6">
        The wiki page you're looking for doesn't exist or has been moved. (Slug:
        <code>{{ pageSlug }}</code
        >)
      </p>
      <NuxtLink
        to="/wiki"
        class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        <span class="mr-1">←</span> Back to Wiki Home
      </NuxtLink>
    </div>

    <!-- Page Content -->
    <div v-if="pageData">
      <div class="max-w-3xl mx-auto px-6 pt-8">
        <div class="flex items-center justify-between">
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
            <div class="text-sm text-brand-primary dark:text-primary-300">
              <NuxtLink
                to="/wiki"
                prefetch
                class="hover:text-brand-primary/80 dark:hover:text-primary-200"
                >Wiki</NuxtLink
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

            <button
              @click="isLeftSidebarOpen = true"
              class="p-1 rounded hover:bg-brand-100 text-gray-500 hover:text-gray-600 ml-auto lg:hidden"
              aria-label="Toggle table of contents"
            >
              <Icon name="ph:list" size="16" />
            </button>
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
            />
            <Icon
              name="ph:book-open"
              v-else
              class="absolute left-8 -bottom-10 text-white z-10 h-52 w-52 md:h-60 md:w-60"
            />
          </div>
        </div>
      </template>

      <div
        class="max-w-3xl mx-auto px-6 pb-8"
        :class="{ 'pt-8': !showMicroHeader }"
      >
        <article>
          <h1
            class="text-brandNeutral-04 dark:text-brand-100 tracking-tight text-7xl leading-[86px] max-md:text-6xl max-md:leading-[66px] max-sm:text-4xl max-sm:leading-10 mt-8 mb-10 border-b border-brand-50 dark:border-primary-700 pb-4"
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
            siblingNavData &&
            siblingNavData.length > 0 &&
            siblingNavData[0] &&
            siblingNavData[0].pages &&
            siblingNavData[0].pages.length > 1 &&
            pageData &&
            pageSlug
          "
          :nav-data="siblingNavData"
          :current-page-slug="pageSlug"
          section="wiki"
        />
      </div>
    </div>
  </WikiLayout>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// Phosphor icons replaced with Nuxt Icon component
import type { WikiPage, Category, Media } from '../../src/payload-types'
import BlockRenderer from '../../components/BlockRenderer.vue'
import WikiLayout from '../../components/wiki/WikiLayout.vue'
import { useSeo } from '../../composables/useSeo'
import { useMediaUrl } from '../../composables/useMediaUrl'
import PagePrevNextNav from '../../components/wiki/PagePrevNextNav.vue' // Ensure this is imported

interface PopulatedParent {
  id: string
  title: string
}
type SectionHeaderBlock = {
  id: string
  blockType: 'sectionHeaderBlock'
  title: string
  level?: 'h1' | 'h2' | 'h3' | 'h4'
  anchorId?: string
}
type GenericBlock = { id: string; blockType: string; [key: string]: any }
type PageBuilderBlock = SectionHeaderBlock | GenericBlock
type FetchedWikiPage = Omit<
  WikiPage,
  'category' | 'pageBuilder' | 'backgroundSettings' | 'parent'
> & {
  title: string // Ensure title is explicitly part of the type
  pageBuilder?: PageBuilderBlock[]
  category?: Category | string
  parent?: PopulatedParent | string
  backgroundSettings?: {
    backgroundImage?: Media | string
    backgroundOverlay?: string
  }
}
interface SiblingNavItem {
  // For PagePrevNextNav
  slug: string
  title: string
  id: string // PagePrevNextNav might need id from FlattenedNavPage
  // icon?: string; // Add if PagePrevNextNav uses it
  // hasChildren?: boolean; // Add if PagePrevNextNav uses it
}

// Define NavCategoryGroup structure if not globally available or to be explicit
interface NavCategoryGroup {
  id: string
  name: string
  pages: SiblingNavItem[]
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const pageSlug = computed(() => {
  const slugParam = route.params.slug
  return Array.isArray(slugParam) ? slugParam[slugParam.length - 1] : slugParam
})

const payloadApiFullUrl = config.public.payloadApiFullUrl // Use full API URL which already includes /api
const { getMediaUrl } = useMediaUrl()

const fetchKey = computed(() => `wiki-page-${route.fullPath}`)
const {
  data: pageResponse,
  pending: pagePending,
  error: pageError,
} = await useFetch<{ docs: FetchedWikiPage[] }>(
  () => {
    if (!payloadApiFullUrl) {
      console.error(
        `Wiki Slug Page: Payload API URL is not configured for slug ${pageSlug.value}.`
      )
      // Throw an error or return a value that indicates failure,
      // which can be caught by the error handling in the template.
      // This specific fetch doesn't have its own try/catch, relying on useFetch's error state.
      // To ensure pageError is populated correctly, we might need to throw.
      throw createError({
        statusCode: 500,
        statusMessage: 'API URL not configured',
      })
    }
    // payloadApiFullUrl already includes /api, so we just append the collection and query
    return `${payloadApiFullUrl}/wiki-pages?where[slug][equals]=${pageSlug.value}&limit=1`
  },
  {
    key: fetchKey.value,
    cache: 'no-cache',
    // Add onRequestError for better logging, though pageError should capture it
    onRequestError({ request, options, error: requestError }) {
      console.error(
        `Wiki Slug Page: Error in useFetch for slug ${pageSlug.value} from ${request}:`,
        requestError
      )
    },
  }
)

const pageData = computed(() => pageResponse.value?.docs?.[0])

const navParentId = null
const navTitle = 'Wiki Home'

// Fetch sibling navigation data for PagePrevNextNav
const siblingNavData = ref<NavCategoryGroup[]>([])
watchEffect(async () => {
  if (
    pageData.value &&
    pageData.value.parent &&
    typeof pageData.value.parent === 'object' &&
    pageData.value.parent.id
  ) {
    const parentObject = pageData.value.parent as PopulatedParent
    const parentIdForSiblings = parentObject.id
    const parentTitleForGroup = parentObject.title || 'Related Pages'

    try {
      const itemsFromApi = await $fetch<SiblingNavItem[]>(
        `/api/wiki-nav?parentId=${parentIdForSiblings}`
      )
      siblingNavData.value = [
        {
          id: parentIdForSiblings,
          name: parentTitleForGroup,
          pages: itemsFromApi.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
          })),
        },
      ]
    } catch (e) {
      console.error(
        'Failed to fetch sibling navigation data for PagePrevNextNav:',
        e
      )
      siblingNavData.value = []
    }
  } else {
    siblingNavData.value = []
  }
})

// Background Settings
const backgroundImageUrl = computed(() => {
  const bgSettings = pageData.value?.backgroundSettings
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
  () => pageData.value?.backgroundSettings?.backgroundOverlay || null
)

const headerBgClass = computed(() => {
  const overlay = backgroundOverlayValue.value
  const validBgValues =
    /^(brandTheme-(01|02|03|04)|brandNeutral-(01|02|03|04)|light-grey)$/
  if (overlay && validBgValues.test(overlay)) {
    return `bg-${overlay}`
  }
  return 'bg-brandNeutral-01' // Fallback to Neutral White
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
    console.error('Error formatting date:', e)
    return null
  }
}
const lastUpdated = computed(() => formatDate(pageData.value?.updatedAt))

// Left Sidebar
const isLeftSidebarOpen = ref(false) // Default to closed on mobile
const toggleLeftSidebar = () => {
  console.log('toggleLeftSidebar')
  isLeftSidebarOpen.value = !isLeftSidebarOpen.value
}

useSeo(pageData.value, 'article')
</script>

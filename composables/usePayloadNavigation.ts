import { ref, watch } from 'vue' // Revert to standard vue import
import { onMounted } from 'vue'
// Removed Ref import again
import { useFetch } from 'nuxt/app'
import { $fetch } from 'ofetch' // Import $fetch directly from ofetch

// Type definitions for navigation data
export interface NavPage {
  id: string
  title: string
  slug: string
  icon?: string // Added icon property
  children?: NavPage[]
}

export interface NavCategoryGroup {
  id: string
  name: string
  pages: NavPage[]
}

/**
 * Composable for fetching and managing wiki/registry navigation data
 * @param sectionSlug - Ref to the current section (wiki or registry)
 * @returns Navigation data, loading state, and error state
 */
export function usePayloadNavigation(sectionSlug: Ref<string | undefined>) {
  const navData = ref<NavCategoryGroup[] | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)

  // Track if component is mounted
  const isMounted = ref(false)
  onMounted(() => {
    isMounted.value = true
  })

  // Function to fetch navigation data based on section
  const fetchNavData = async (section: string) => {
    if (!section) return // Skip if section is empty

    loading.value = true
    error.value = null

    try {
      // Using the Payload CMS API endpoint structure
      const endpoint = `/api/navigation?section=${section}`
      const cacheKey = `navigation-${section}-${Date.now()}`

      // Use useFetch for consistent API behavior and better error handling
      const { data, error: fetchError } = await useFetch(endpoint, {
        key: cacheKey, // Unique key to prevent caching issues
        headers: {
          'Cache-Control': 'no-cache',
        },
        // Only catch true errors, not "no data found" responses
        onResponseError(ctx) {
          if (ctx.response.status !== 404) {
            throw new Error(`API Error: ${ctx.response.statusText}`)
          }
        },
        // Disable suspense to prevent component tree errors
        suspense: false,
      })

      // Handle fetch errors
      if (fetchError.value) {
        throw fetchError.value
      }

      // Check if data exists and has the expected format
      if (data.value && Array.isArray(data.value)) {
        navData.value = data.value as NavCategoryGroup[]
      } else {
        // Return empty array but don't treat as error
        navData.value = []

        if (process.env.NODE_ENV !== 'production') {
          console.warn(`No navigation data returned for section: ${section}`)
        }
      }
    } catch (err) {
      // Handle errors gracefully
      console.error(`Navigation fetch error for section ${section}:`, err)
      error.value =
        err instanceof Error
          ? err
          : new Error('Unknown error fetching navigation')
      // Set empty data to prevent UI errors
      navData.value = []
    } finally {
      loading.value = false
    }
  }

  // Watch for section changes and update data
  watch(
    sectionSlug,
    (newSection: string | undefined, oldSection: string | undefined) => {
      if (newSection && newSection !== oldSection) {
        fetchNavData(newSection)
      }
    },
    { immediate: true }
  )

  // Function to manually refresh the navigation data
  const refresh = () => {
    if (sectionSlug.value) {
      fetchNavData(sectionSlug.value)
    }
  }

  return {
    navData,
    loading,
    error,
    refresh,
  }
}

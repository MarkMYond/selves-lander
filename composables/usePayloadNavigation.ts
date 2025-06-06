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
      const cacheKey = `navigation-${section}` // Removed Date.now() for proper caching

      // Use useFetch for consistent API behavior and better error handling
      // Typed useFetch and improved error message in onResponseError
      const { data, error: fetchError } = await useFetch<NavCategoryGroup[]>(endpoint, {
        key: cacheKey, // Unique key based on section
        // headers: { // Removed aggressive no-cache header
        //   'Cache-Control': 'no-cache',
        // },
        // Only catch true errors, not "no data found" responses
        onResponseError(ctx) {
          if (ctx.response.status !== 404) {
            throw new Error(`API Error: ${ctx.response.statusText} (status: ${ctx.response.status})`)
          }
          // For 404s, we don't throw here. data.value will likely be null or the error body.
        },
      })

      // Handle fetch errors (e.g. network issues, or errors thrown from onResponseError)
      if (fetchError.value) {
        throw fetchError.value
      }

      // Check if data.value is an array (it should be NavCategoryGroup[] if successful and data exists)
      // data.value could be null if the API returns 204, or if a 404 occurred and onResponseError didn't throw.
      if (data.value && Array.isArray(data.value)) {
        navData.value = data.value // Cast 'as NavCategoryGroup[]' is no longer needed
      } else {
        // Return empty array but don't treat as error
        navData.value = []

        if (process.env.NODE_ENV !== 'production') {
          console.warn(`No navigation data returned for section: ${section}`)
        }
      }
    } catch (err: unknown) { // Typed the error object
      // Handle errors gracefully
      console.error(`Navigation fetch error for section ${section}:`, err)
      if (err instanceof Error) {
        error.value = err
      } else if (typeof err === 'string') {
        error.value = new Error(err)
      } else {
        error.value = new Error('An unknown error occurred while fetching navigation data.')
      }
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

import { defineEventHandler, getQuery, createError } from 'h3'
import { useRuntimeConfig } from '#imports' // Correct import for Nuxt 3 server routes
import type { Category, WikiPage, RegistryPage } from '../../src/payload-types' // Updated import path

// Define the structure expected by the frontend
interface NavPage {
  id: string
  title: string
  slug: string
  icon?: string | null // Added icon property
  children?: NavPage[]
}

interface NavCategoryGroup {
  id: string
  name: string
  pages: NavPage[]
}

// Helper function to build the hierarchy
function buildHierarchy(pages: (WikiPage | RegistryPage)[]): NavPage[] {
  const pagesById: Record<
    string,
    NavPage & { parentId?: string | null; sort?: number | null }
  > = {} // Added sort
  const childrenByParentId: Record<string, NavPage[]> = {}

  // First pass: Create map and identify children
  pages.forEach((page) => {
    const navPage: NavPage & {
      parentId?: string | null
      sort?: number | null
    } = {
      id: page.id,
      title: page.title,
      slug: page.slug,
      icon: page.icon, // Use the icon field from Payload
      sort: page.sort, // Keep sort order if needed for child sorting
      children: [], // Initialize children array
    }
    pagesById[page.id] = navPage

    // Handle parent relationship (can be ID string or object)
    const parent = page.parent
    const parentId =
      typeof parent === 'object' && parent !== null ? parent.id : parent
    navPage.parentId = parentId

    if (parentId) {
      if (!childrenByParentId[parentId]) {
        childrenByParentId[parentId] = []
      }
      childrenByParentId[parentId].push(navPage)
    }
  })

  // Second pass: Attach children to parents and sort children
  Object.values(pagesById).forEach((page) => {
    if (childrenByParentId[page.id]) {
      // Sort children based on their 'sort' field
      page.children = childrenByParentId[page.id].sort(
        (a, b) => ((a as any).sort || 0) - ((b as any).sort || 0)
      )
    } else {
      delete page.children // Remove empty children array if no children
    }
  })

  // Filter for root pages (no parent)
  const rootPages = Object.values(pagesById).filter((page) => !page.parentId)
  // Sort root pages by their sort order
  rootPages.sort((a, b) => (a.sort || 0) - (b.sort || 0))
  return rootPages
}

export default defineEventHandler(
  async (event): Promise<NavCategoryGroup[]> => {
    const query = getQuery(event)
    const section = query.section?.toString() // 'wiki' or 'registry'

    if (!section || !['wiki', 'registry'].includes(section)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[navigation.get.ts] Invalid or missing section query parameter.');
      }
      return [] // Return empty if section is invalid
    }

    const collectionSlug = section === 'wiki' ? 'wiki-pages' : 'registry-pages'
    // Use runtime config or environment variables for Payload URL
    const config = useRuntimeConfig(event) // Pass event to useRuntimeConfig on server
    const payloadApiUrl =
      config.public.payloadApiFullUrl || 'http://localhost:3333/api' // Using the full API URL with /api

    try {
      // 1. Fetch all relevant published pages, sorted, with category populated
      const pagesApiUrl = `${payloadApiUrl}/${collectionSlug}`
      const pagesParams = new URLSearchParams({
        limit: '1000', // Adjust if more pages are expected
        depth: '1', // Populate category and parent objects
        'where[status][equals]': 'published',
        // Sorting will be handled after hierarchy build for root, and during build for children
        // sort: 'category,sort',
      }).toString()

      if (process.env.NODE_ENV === 'development') {
        console.log(`[navigation.get.ts] Fetching pages from: ${pagesApiUrl}?${pagesParams}`);
      }

      let allPages: (WikiPage | RegistryPage)[] = []
      try {
        const pagesResponse = await $fetch<{
          docs: (WikiPage | RegistryPage)[]
        }>(`${pagesApiUrl}?${pagesParams}`, {
          retry: 1, // Try once more if it fails
          timeout: 5000, // 5 second timeout
        })

        if (!pagesResponse || !Array.isArray(pagesResponse.docs)) {
          console.error('[navigation.get.ts] Invalid pages response format from Payload.');
          if (process.env.NODE_ENV === 'development') {
            console.log('[navigation.get.ts] Using empty pages array as fallback.');
          }
        } else {
          allPages = pagesResponse.docs
          if (process.env.NODE_ENV === 'development') {
            console.log(`[navigation.get.ts] Fetched ${allPages.length} pages for section ${section}.`);
          }
        }
      } catch (err: any) {
        console.error(`[navigation.get.ts] Error fetching pages from Payload: ${err?.message || 'Unknown error'}`);
        if (process.env.NODE_ENV === 'development') {
          console.log('[navigation.get.ts] Using empty pages array as fallback.');
        }
        // Continue with empty pages rather than failing
      }

      // 2. Fetch all categories, sorted
      const categoriesApiUrl = `${payloadApiUrl}/categories`
      const categoriesParams = new URLSearchParams({
        limit: '100',
        sort: 'sort', // Sort categories by their sort field
        depth: '0', // No need to populate relations for categories themselves
      }).toString()

      if (process.env.NODE_ENV === 'development') {
        console.log(`[navigation.get.ts] Fetching categories from: ${categoriesApiUrl}?${categoriesParams}`);
      }

      let allCategories: Category[] = []
      let categoriesById: Record<string, Category> = {}

      try {
        const categoriesResponse = await $fetch<{ docs: Category[] }>(
          `${categoriesApiUrl}?${categoriesParams}`,
          {
            retry: 1, // Try once more if it fails
            timeout: 5000, // 5 second timeout
          }
        )

        if (!categoriesResponse || !Array.isArray(categoriesResponse.docs)) {
          console.error('[navigation.get.ts] Invalid categories response format from Payload.');
          if (process.env.NODE_ENV === 'development') {
            console.log('[navigation.get.ts] Using empty categories array as fallback.');
          }
        } else {
          allCategories = categoriesResponse.docs
          categoriesById = Object.fromEntries(
            allCategories.map((cat) => [cat.id, cat])
          )
          if (process.env.NODE_ENV === 'development') {
            console.log(`[navigation.get.ts] Fetched ${allCategories.length} categories.`);
          }
        }
      } catch (err: any) {
        console.error(`[navigation.get.ts] Error fetching categories from Payload: ${err?.message || 'Unknown error'}`);
        if (process.env.NODE_ENV === 'development') {
          console.log('[navigation.get.ts] Using empty categories array as fallback.');
        }
        // Continue with empty categories rather than failing
      }

      // 3. Build hierarchy from pages (includes sorting children and root pages)
      const rootPages = buildHierarchy(allPages)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[navigation.get.ts] Built hierarchy with ${rootPages.length} root pages.`);
      }

      // 4. Group root pages by category
      const pagesByCategory: Record<string, NavPage[]> = {}
      rootPages.forEach((page) => {
        // Find the original page data to get the category ID
        const originalPage = allPages.find((p) => p.id === page.id)
        const category = originalPage?.category
        // Category can be null, an ID string, or a Category object if depth=1
        const categoryId =
          typeof category === 'object' && category !== null
            ? category.id
            : category

        if (categoryId && categoriesById[categoryId]) {
          // Ensure category exists
          if (!pagesByCategory[categoryId]) {
            pagesByCategory[categoryId] = []
          }
          // Exclude section homepages from the list
          if (!originalPage?.isSectionHomepage) {
            pagesByCategory[categoryId].push(page)
          }
        } else {
          // Handle pages without a valid category
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[navigation.get.ts] Page "${page.title}" (ID: ${page.id}) has no valid category or category not found.`);
          }
          const defaultCategoryId = 'uncategorized'
          if (!pagesByCategory[defaultCategoryId])
            pagesByCategory[defaultCategoryId] = []
          if (!originalPage?.isSectionHomepage) {
            pagesByCategory[defaultCategoryId].push(page)
          }
        }
      })

      // 5. Format into NavCategoryGroup[] using sorted categories, filtering empty ones
      const result: NavCategoryGroup[] = allCategories
        .map((category) => {
          const categoryPages = pagesByCategory[category.id] // Get pages for this category
          // Only include the category if it was fetched AND has pages after filtering
          if (
            categoriesById[category.id] &&
            categoryPages &&
            categoryPages.length > 0
          ) {
            return {
              id: category.id,
              name: categoriesById[category.id].name, // Use fetched category name
              pages: categoryPages, // Pages are already sorted and filtered
            }
          }
          return null // Category is empty or wasn't fetched
        })
        .filter((group): group is NavCategoryGroup => group !== null) // Filter out the nulls

      // Add uncategorized group only if it exists AND has pages after filtering
      if (
        pagesByCategory['uncategorized'] &&
        pagesByCategory['uncategorized'].length > 0
      ) {
        result.push({
          id: 'uncategorized',
          name: 'Other', // Or any suitable name
          pages: pagesByCategory['uncategorized'], // Pages are already sorted and filtered
        })
      }
      if (process.env.NODE_ENV === 'development') {
        console.log(`[navigation.get.ts] Formatted navigation data with ${result.length} category groups.`);
      }
      return result
    } catch (error: any) {
      console.error(`[navigation.get.ts] Error in navigation API handler for section "${section}":`, error.message || error);
      // Log the actual error response if available from $fetch
      if (process.env.NODE_ENV === 'development') { // More detailed logging for dev
        if (error.data) {
          // Nuxt $fetch error structure
          console.error('[navigation.get.ts] Payload API Error Response:', error.statusCode, error.statusMessage, error.data);
        } else if (error.response) {
          // Generic fetch error structure
          console.error('[navigation.get.ts] Fetch Error Response:', error.response.status, error.response.statusText);
        }
      }
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: `Server error fetching navigation data for ${section}. ${error.message || ''}`,
        data: error.data, // Forward error details if available
      })
    }
  }
)

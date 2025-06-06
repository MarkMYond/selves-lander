import { defineEventHandler, getQuery, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

/**
 * API endpoint to fetch wiki navigation data from the NavigationCache collection
 * This replaces the previous approach of using static JSON files
 *
 * @route GET /api/wiki-nav
 * @query parentId - (optional) ID of parent page to fetch children for
 * @returns Wiki navigation structure
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const parentId = query.parentId?.toString()
  const config = useRuntimeConfig(event)
  const payloadApiFullUrl =
    config.public.payloadApiFullUrl || 'https://taash-payld.vercel.app/api'

  try {
    // If parentId is provided, fetch children for that specific page
    if (parentId) {
      // Fetch children for a specific parent page
      const url = `${payloadApiFullUrl}/wiki-pages?where[parent][equals]=${parentId}&where[status][equals]=published&sort=sort`
      console.log(
        `Fetching wiki page children for parent ID ${parentId} from: ${url}`
      )

      const response = await $fetch<{ docs: any[] }>(url)

      if (!response || !response.docs) {
        console.error(`No children found for parent ID: ${parentId}`)
        return []
      }

      // Transform the response docs to match the expected structure
      return response.docs.map((page: any) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        icon: page.icon,
        hasChildren: false, // We don't check for grandchildren for simplicity
        isCategory: false,
      }))
    }

    // For top-level navigation, query Payload for the navigation data in MongoDB
    const cacheUrl = `${payloadApiFullUrl}/navigation-cache?where[section][equals]=wiki&limit=1`
    console.log(`Fetching wiki navigation from Payload cache: ${cacheUrl}`)

    const cacheResponse = await $fetch<{ docs: any[] }>(cacheUrl)
    if (
      !cacheResponse ||
      !cacheResponse.docs ||
      cacheResponse.docs.length === 0
    ) {
      console.warn(
        'No wiki navigation cache found in Payload, falling back to direct navigation API'
      )

      // Fall back to the standard navigation endpoint
      return await $fetch('/api/navigation?section=wiki')
    }

    // Return the navigation data from cache
    return cacheResponse.docs[0].navigationData || []
  } catch (error: any) {
    console.error('Error fetching wiki navigation:', error.message || error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Error fetching wiki navigation: ${error.message || 'Unknown error'}`,
    })
  }
})

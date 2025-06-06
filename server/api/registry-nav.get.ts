import { defineEventHandler, getQuery, createError } from 'h3'
import type { FetchError } from 'ofetch'

interface PayloadDoc {
  id: string
  title: string
  slug: string
  icon?: string
  // Add other fields if needed by nav, like _status if directly querying
}

interface NavItem {
  id: string
  title: string
  slug: string
  icon?: string
  hasChildren?: boolean // New property
  children?: NavItem[] // For client-side fetched children, not populated by this API directly
}

// Helper function to build Payload query URLs
const buildPayloadQueryUrl = (
  baseApiUrl: string,
  collection: string,
  params: Record<string, string | number | Record<string, any>>
): string => {
  const endpoint = `${baseApiUrl.replace(/\/api\/?$/, '')}/api/${collection}`
  const apiQuery = new URLSearchParams()

  for (const key in params) {
    if (key === 'where') {
      // Special handling for 'where' clauses
      const whereClauses = params[key] as Record<string, any>
      for (const field in whereClauses) {
        const condition = whereClauses[field]
        for (const operator in condition) {
          apiQuery.append(
            `where[${field}][${operator}]`,
            String(condition[operator])
          )
        }
      }
    } else {
      apiQuery.append(key, String(params[key]))
    }
  }
  return `${endpoint}?${apiQuery.toString()}`
}

export default defineEventHandler(async (event): Promise<NavItem[]> => {
  console.log('[/api/registry-nav] TRACE: Handler invoked (hierarchical logic)') // Changed log prefix
  const queryParams = getQuery(event)
  const parentId = queryParams.parentId as string | undefined
  console.log(`[/api/registry-nav] TRACE: parentId from query: ${parentId}`) // Changed log prefix

  const runtimeConfig = useRuntimeConfig()
  const payloadApiUrl = runtimeConfig.public.payloadApiUrl // This should be the base URL, e.g., http://localhost:3333
  console.log(
    `[/api/registry-nav] TRACE: runtimeConfig.public.payloadApiUrl: ${payloadApiUrl}`
  ) // Changed log prefix

  if (!payloadApiUrl) {
    console.error(
      '[/api/registry-nav] FATAL: payloadApiUrl is not defined in runtime config.'
    ) // Changed log prefix
    throw createError({
      statusCode: 500,
      statusMessage: 'Payload API URL is not configured.',
    })
  }

  const whereClauses: Record<string, any> = {
    status: { equals: 'published' },
    isSectionHomepage: { not_equals: true },
  }

  if (parentId) {
    whereClauses.parent = { equals: parentId }
  } else {
    whereClauses.parent = { exists: false }
  }

  const requestUrl = buildPayloadQueryUrl(payloadApiUrl, 'registry-pages', {
    // Changed collection to 'registry-pages'
    where: whereClauses,
    sort: 'sort',
    limit: 100,
    depth: 0, // Set depth to 0 as we only need IDs to check for children, parent info is via parentId query
  })

  console.log(
    `[/api/registry-nav] TRACE: Attempting to fetch parent/sibling items from: ${requestUrl}`
  ) // Changed log prefix

  try {
    const response = await $fetch<{ docs: PayloadDoc[]; totalDocs: number }>(
      requestUrl,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    if (!response || !response.docs) {
      console.warn(
        '[/api/registry-nav] WARN: No docs in response or invalid response from Payload API for parent/siblings.'
      ) // Changed log prefix
      return [] // Return empty array if no items found
    }

    console.log(
      `[/api/registry-nav] TRACE: Received ${response.docs.length} parent/sibling docs from Payload API.`
    ) // Changed log prefix

    const navItemsPromises = response.docs.map(async (doc: PayloadDoc) => {
      // For each doc, check if it has children
      const childrenCheckUrl = buildPayloadQueryUrl(
        payloadApiUrl,
        'registry-pages',
        {
          // Changed collection to 'registry-pages'
          where: {
            parent: { equals: doc.id },
            status: { equals: 'published' },
            isSectionHomepage: { not_equals: true },
          },
          limit: 1,
          depth: 0, // We only need to know if at least one child exists
        }
      )

      console.log(
        `[/api/registry-nav] TRACE: Checking children for doc ID ${doc.id} from: ${childrenCheckUrl}`
      ) // Changed log prefix
      const childrenResponse = await $fetch<{
        docs: PayloadDoc[]
        totalDocs: number
      }>(childrenCheckUrl)
      const hasChildren = childrenResponse && childrenResponse.totalDocs > 0
      console.log(
        `[/api/registry-nav] TRACE: Doc ID ${doc.id} hasChildren: ${hasChildren}`
      ) // Changed log prefix

      return {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        icon: doc.icon,
        hasChildren: hasChildren,
      }
    })

    const navItems = await Promise.all(navItemsPromises)
    console.log(
      '[/api/registry-nav] TRACE: Processed navItems with hasChildren:',
      navItems.length
    ) // Changed log prefix
    return navItems
  } catch (err: any) {
    const fetchError = err as FetchError
    console.error(
      `[/api/registry-nav] ERROR: Error during registry navigation data processing. Initial URL: ${requestUrl}`,
      fetchError.message
    ) // Changed log prefix and message
    if (fetchError.response) {
      console.error(
        '[/api/registry-nav] ERROR: Payload API Response Status:',
        fetchError.response.status
      ) // Changed log prefix
      console.error(
        '[/api/registry-nav] ERROR: Payload API Response Data:',
        fetchError.response._data
      ) // Changed log prefix
    }

    throw createError({
      statusCode: fetchError.response?.status || 500,
      statusMessage:
        'Failed to fetch or process navigation data from Payload API.',
      data: {
        requestUrlSent: requestUrl, // Log the first request URL
        originalErrorMessage: fetchError.message,
        payloadApiResponseStatus: fetchError.response?.status,
      },
    })
  }
})

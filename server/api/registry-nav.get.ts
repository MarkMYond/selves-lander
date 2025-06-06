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
  const queryParams = getQuery(event)
  const parentId = queryParams.parentId as string | undefined

  const runtimeConfig = useRuntimeConfig()
  const payloadApiUrl = runtimeConfig.public.payloadApiUrl

  if (!payloadApiUrl) {
    console.error('[registry-nav.get.ts] FATAL: payloadApiUrl is not defined in runtime config.')
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
    // If no parentId, fetch top-level items (category is not directly used here for parent/child, but for structure)
    // This logic assumes registry pages can be nested under other registry pages OR be top-level under a category.
    // For this specific API, we are fetching children of a given registry page, or top-level registry pages.
    whereClauses.parent = { exists: false } // Fetch items with no parent (top-level for registry pages)
  }

  const requestUrl = buildPayloadQueryUrl(payloadApiUrl, 'registry-pages', {
    where: whereClauses,
    sort: 'sort',
    limit: 100, // Consider pagination if more than 100 items are expected at any level
    depth: 0,   // We only need basic fields for the nav items themselves
  })

  try {
    const response = await $fetch<{ docs: PayloadDoc[]; totalDocs: number }>(
      requestUrl,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    if (!response || !response.docs || response.docs.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[registry-nav.get.ts] No docs found for parentId '${parentId}'. URL: ${requestUrl}`)
      }
      return []
    }

    const pageIds = response.docs.map(doc => doc.id)
    let parentIdsWithChildren = new Set<string>()

    if (pageIds.length > 0) {
      const childrenCheckRequestUrl = buildPayloadQueryUrl(payloadApiUrl, 'registry-pages', {
        where: {
          parent: { in: pageIds.join(',') }, // Query for children of all fetched pages
          status: { equals: 'published' },
          isSectionHomepage: { not_equals: true },
        },
        limit: 0, // We only need counts or existence, but fetching parent ID is useful
        depth: 0, // Only need parent ID
        select: ['parent'], // Select only the parent field
      })
      
      // Actually, to get counts per parent, a more complex aggregation or fetching parent IDs is better.
      // Let's fetch minimal data for all children and process in memory.
      const allChildrenResponse = await $fetch<{ docs: { id: string; parent: string | { id: string } }[]; totalDocs: number }>(
        buildPayloadQueryUrl(payloadApiUrl, 'registry-pages', {
          where: {
            parent: { in: pageIds.join(',') },
            status: { equals: 'published' },
            isSectionHomepage: { not_equals: true },
          },
          limit: 1000, // Adjust if a parent can have many children
          depth: 0, // parent will be ID string
          select: ['parent'], 
        })
      )
      
      if (allChildrenResponse && allChildrenResponse.docs) {
        allChildrenResponse.docs.forEach(childDoc => {
          if (childDoc.parent) {
            const pId = typeof childDoc.parent === 'string' ? childDoc.parent : childDoc.parent.id;
            parentIdsWithChildren.add(pId);
          }
        });
      }
    }

    const navItems: NavItem[] = response.docs.map((doc: PayloadDoc) => {
      return {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        icon: doc.icon,
        hasChildren: parentIdsWithChildren.has(doc.id),
      }
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[registry-nav.get.ts] Processed ${navItems.length} navItems for parentId '${parentId}'.`)
    }
    return navItems

  } catch (err: any) {
    const fetchError = err as FetchError
    console.error(
      `[registry-nav.get.ts] ERROR: Processing registry navigation. Initial URL: ${requestUrl}`,
      fetchError.message
    )
    if (fetchError.response) {
      console.error('[registry-nav.get.ts] ERROR: Payload API Response Status:', fetchError.response.status)
      console.error('[registry-nav.get.ts] ERROR: Payload API Response Data:', fetchError.response._data)
    }

    throw createError({
      statusCode: fetchError.response?.status || 500,
      statusMessage: 'Failed to fetch or process registry navigation data.',
      data: {
        requestUrlSent: requestUrl,
        originalErrorMessage: fetchError.message,
        payloadApiResponseStatus: fetchError.response?.status,
      },
    })
  }
})

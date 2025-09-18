import { defineEventHandler, getQuery, createError } from 'h3'
import type { FetchError } from 'ofetch'

interface PayloadCategoryDoc {
  id: string
  name: string
  slug: string
  sort?: number
}

interface PayloadWikiPageDoc {
  id: string
  title: string
  slug: string
  icon?: string
  iconBackgroundColor?: string; // Added field
  sort?: number
  category?: string | PayloadCategoryDoc
  parent?: string | PayloadWikiPageDoc
  isSectionHomepage?: boolean
  status?: string
}

interface NavItem {
  id: string
  title: string
  slug?: string
  icon?: string
  iconBackgroundColor?: string; // Added field
  isCategory?: boolean
  children?: NavItem[]
  hasChildren?: boolean
  // pageId, pageSlug, pageIcon were redundant as id, slug, icon cover pages too
}

// Simple fetch with retry/timeout to handle sporadic network hiccups
async function fetchWithRetry<T>(url: string, opts?: { attempts?: number; timeout?: number }): Promise<T> {
  const attempts = opts?.attempts ?? 2
  const timeout = opts?.timeout ?? 10000
  let lastErr: any
  for (let i = 0; i < attempts; i++) {
    try {
      return await $fetch<T>(url, { timeout })
    } catch (e) {
      lastErr = e
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 300))
      }
    }
  }
  throw lastErr
}

const buildPayloadQueryUrl = (
  baseApiUrl: string,
  collection: string,
  params: Record<string, string | number | boolean | Record<string, any>>
): string => {
  const endpoint = `${baseApiUrl.replace(/\/api\/?$/, '')}/api/${collection}`
  const apiQuery = new URLSearchParams()

  for (const key in params) {
    if (key === 'where') {
      const whereClauses = params[key] as Record<string, any>
      for (const field in whereClauses) {
        const condition = whereClauses[field]
        // Handle operators like 'equals', 'in', 'exists', 'not_equals'
        if (typeof condition === 'object' && condition !== null) {
          for (const operator in condition) {
            apiQuery.append(
              `where[${field}][${operator}]`,
              String(condition[operator]) // Value for the operator
            )
          }
        } else {
           // Default to 'equals' if condition is not an object (though less common for complex queries)
          apiQuery.append(`where[${field}][equals]`, String(condition))
        }
      }
    } else {
      apiQuery.append(key, String(params[key]))
    }
  }
  return `${endpoint}?${apiQuery.toString()}`
}

// Fetches pages (either children of a parentId or top-level for a category)
// and determines their `hasChildren` status efficiently.
async function fetchPagesAndDetermineChildren(
  payloadApiUrl: string,
  whereClausesForPages: Record<string, any>
): Promise<NavItem[]> {
  const pagesUrl = buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
    where: whereClausesForPages,
    sort: 'sort',
    limit: 200, // Increased limit for pages within a category or parent
    depth: 0,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log(`[wiki-nav.get.ts] Fetching pages from: ${pagesUrl}`);
  }
  const pagesResponse = await $fetch<{ docs: PayloadWikiPageDoc[] }>(pagesUrl);
  // replaced by retrying version
  // const pagesResponse = await $fetch<{ docs: PayloadWikiPageDoc[] }>(pagesUrl);
  const pagesResponseRetry = await fetchWithRetry<{ docs: PayloadWikiPageDoc[] }>(pagesUrl, { attempts: 2, timeout: 10000 })

  const pagesDocs = pagesResponseRetry?.docs
  if (!pagesDocs || pagesDocs.length === 0) {
    return [];
  }

  const pageIds = pagesDocs.map(doc => doc.id);
  const parentIdsWithChildren = new Set<string>();

  if (pageIds.length > 0) {
    const childrenOfPagesUrl = buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
      where: {
        parent: { in: pageIds.join(',') },
        status: { equals: 'published' },
        isSectionHomepage: { not_equals: true },
      },
      limit: 2000, // Fetch all potential children to map back
      depth: 0,
      select: ['parent'], // Only need parent ID to determine who has children
    });
    if (process.env.NODE_ENV === 'development') {
      console.log(`[wiki-nav.get.ts] Checking children for multiple pages from: ${childrenOfPagesUrl}`);
    }
    // Restore original fetch for allChildrenResponse
    const allChildrenResponse = await fetchWithRetry<{ docs: { id: string; parent: string | {id: string} }[] }>( // Ensure 'id' is expected for safety, though parent is key
       buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
        where: {
          parent: { in: pageIds.join(',') },
          status: { equals: 'published' },
          isSectionHomepage: { not_equals: true },
        },
        limit: 2000, // Fetch all potential children to map back
        depth: 0, // Keep depth 0, parent will be ID string
        // select: ['parent'], // Remove select to fetch all default depth 0 fields
      }),
      { attempts: 2, timeout: 10000 }
    );
    // Removed debugging logs for allChildrenResponse.docs content
    
    if (allChildrenResponse && allChildrenResponse.docs) {
      allChildrenResponse.docs.forEach(childDoc => {
        if (childDoc.parent) {
          const pId = typeof childDoc.parent === 'string' ? childDoc.parent : childDoc.parent.id;
          parentIdsWithChildren.add(pId);
        }
      });
      // Removed debugging log for parentIdsWithChildren
    }
  }

  return pagesDocs.map(pageDoc => ({
    id: pageDoc.id,
    title: pageDoc.title,
    slug: pageDoc.slug,
    icon: pageDoc.icon,
    iconBackgroundColor: pageDoc.iconBackgroundColor, // Added field
    hasChildren: parentIdsWithChildren.has(pageDoc.id),
    isCategory: false, // These are page items
  }));
}


export default defineEventHandler(async (event): Promise<NavItem[]> => {
  const queryParams = getQuery(event)
  const parentId = queryParams.parentId as string | undefined

  const runtimeConfig = useRuntimeConfig()
  const payloadApiUrl = runtimeConfig.public.payloadApiUrl
  if (process.env.NODE_ENV !== 'development') {
    // Minimal prod diagnostics (once per request) to identify misconfigurations
    console.info('[wiki-nav.get.ts] Using payloadApiUrl:', payloadApiUrl)
  }

  if (!payloadApiUrl) {
    console.error('[wiki-nav.get.ts] FATAL: payloadApiUrl is not defined.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Payload API URL not configured.',
    })
  }

  try {
    // Case 1: Fetching children for a specific parent page
    if (parentId) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[wiki-nav.get.ts] Fetching children for parentId: ${parentId}`);
      }
      return fetchPagesAndDetermineChildren(payloadApiUrl, {
        parent: { equals: parentId },
        status: { equals: 'published' },
        isSectionHomepage: { not_equals: true },
      });
    }

    // Case 2: Fetching top-level navigation (categories and their first-level pages)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[wiki-nav.get.ts] Fetching top-level categories and pages.`);
    }
    const categoriesUrl = buildPayloadQueryUrl(payloadApiUrl, 'categories', {
      sort: 'sort',
      limit: 50, // Assuming not too many categories
      depth: 0,
    })
    if (process.env.NODE_ENV === 'development') {
      console.log(`[wiki-nav.get.ts] Fetching categories from: ${categoriesUrl}`);
    } else {
      console.info('[wiki-nav.get.ts] Categories endpoint:', categoriesUrl)
    }
  const categoriesResponse = await fetchWithRetry<{ docs: PayloadCategoryDoc[] }>(categoriesUrl, { attempts: 2, timeout: 10000 });

    if (!categoriesResponse || !categoriesResponse.docs || categoriesResponse.docs.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[wiki-nav.get.ts] No categories found.');
      }
      return [];
    }

    const categorizedNavItemsPromises = categoriesResponse.docs.map(
      async (categoryDoc) => {
        const pageNavItems = await fetchPagesAndDetermineChildren(payloadApiUrl, {
          category: { equals: categoryDoc.id },
          parent: { exists: false }, // Top-level pages for this category
          status: { equals: 'published' },
          isSectionHomepage: { not_equals: true },
        });

        return {
          id: categoryDoc.id,
          title: categoryDoc.name,
          slug: categoryDoc.slug, // Restore category slug
          isCategory: true,
          children: pageNavItems,
          hasChildren: pageNavItems.length > 0,
        };
      }
    );

    const finalNavItems = await Promise.all(categorizedNavItemsPromises);
    // Filter out categories that have no children pages
    const finalNavItemsFiltered = finalNavItems.filter(
      (item) => item.hasChildren
    );
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[wiki-nav.get.ts] Processed ${finalNavItemsFiltered.length} top-level nav items (categories with pages).`);
    }
    return finalNavItemsFiltered;

  } catch (err: unknown) { // Changed to unknown
    const fetchError = err as FetchError; // Attempt to cast for FetchError specific properties
    const originalErrorMessage = err instanceof Error ? err.message : 'An unknown error occurred';

    console.error(
      `[wiki-nav.get.ts] ERROR: Processing wiki navigation. ParentId: ${parentId}. Message: ${originalErrorMessage}`,
      err // Log the full error object for more details in dev
    );
    if (fetchError.response && process.env.NODE_ENV === 'development') {
      console.error('[wiki-nav.get.ts] ERROR: Payload API Response Status:', fetchError.response.status);
      console.error('[wiki-nav.get.ts] ERROR: Payload API Response Data:', fetchError.response._data);
    }

    throw createError({
      statusCode: fetchError.response?.status || 500,
      statusMessage: 'Failed to fetch or process wiki navigation data.',
      data: {
        parentIdUsed: parentId,
        originalErrorMessage,
        payloadApiResponseStatus: fetchError.response?.status,
      },
    });
  }
})

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
  isCategory?: boolean
  children?: NavItem[]
  hasChildren?: boolean
  pageId?: string
  pageSlug?: string
  pageIcon?: string
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
        if (typeof condition === 'object' && condition !== null) {
          for (const operator in condition) {
            apiQuery.append(
              `where[${field}][${operator}]`,
              String(condition[operator])
            )
          }
        } else {
          apiQuery.append(`where[${field}][equals]`, String(condition))
        }
      }
    } else {
      apiQuery.append(key, String(params[key]))
    }
  }
  return `${endpoint}?${apiQuery.toString()}`
}

async function getPageChildren(
  pageId: string,
  payloadApiUrl: string
): Promise<NavItem[]> {
  const childrenUrl = buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
    where: {
      parent: { equals: pageId },
      status: { equals: 'published' },
      isSectionHomepage: { not_equals: true },
    },
    sort: 'sort',
    limit: 100,
    depth: 0,
  })

  const childrenResponse = await $fetch<{ docs: PayloadWikiPageDoc[] }>(
    childrenUrl
  )

  if (!childrenResponse || !childrenResponse.docs) return []

  const childNavItemsPromises = childrenResponse.docs.map(async (childDoc) => {
    const grandChildrenResponse = await $fetch<{ totalDocs: number }>(
      buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
        where: {
          parent: { equals: childDoc.id },
          status: { equals: 'published' },
          isSectionHomepage: { not_equals: true },
        },
        limit: 1,
        depth: 0,
      })
    )
    return {
      id: childDoc.id,
      title: childDoc.title,
      slug: childDoc.slug,
      icon: childDoc.icon,
      hasChildren: grandChildrenResponse.totalDocs > 0,
      isCategory: false,
    }
  })
  return Promise.all(childNavItemsPromises)
}

export default defineEventHandler(async (event): Promise<NavItem[]> => {
  const queryParams = getQuery(event)
  const parentId = queryParams.parentId as string | undefined

  const runtimeConfig = useRuntimeConfig()
  const payloadApiUrl = runtimeConfig.public.payloadApiUrl

  if (!payloadApiUrl) {
    console.error('[/api/wiki-nav] FATAL: payloadApiUrl is not defined.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Payload API URL not configured.',
    })
  }

  try {
    if (parentId) {
      return getPageChildren(parentId, payloadApiUrl)
    }

    const categoriesUrl = buildPayloadQueryUrl(payloadApiUrl, 'categories', {
      sort: 'sort',
      limit: 50,
      depth: 0,
    })
    const categoriesResponse = await $fetch<{ docs: PayloadCategoryDoc[] }>(
      categoriesUrl
    )

    if (!categoriesResponse || !categoriesResponse.docs) {
      console.warn(
        '[/api/wiki-nav] WARN: No categories found or invalid response.'
      )
      return []
    }

    const categorizedNavItemsPromises = categoriesResponse.docs.map(
      async (categoryDoc) => {
        const pagesUrl = buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
          where: {
            category: { equals: categoryDoc.id },
            parent: { exists: false },
            status: { equals: 'published' },
            isSectionHomepage: { not_equals: true },
          },
          sort: 'sort',
          limit: 100,
          depth: 0,
        })
        const pagesResponse = await $fetch<{ docs: PayloadWikiPageDoc[] }>(
          pagesUrl
        )

        let pageNavItems: NavItem[] = []
        if (pagesResponse && pagesResponse.docs) {
          const pageNavItemPromises = pagesResponse.docs.map(
            async (pageDoc) => {
              const childrenCheckUrl = buildPayloadQueryUrl(
                payloadApiUrl,
                'wiki-pages',
                {
                  where: {
                    parent: { equals: pageDoc.id },
                    status: { equals: 'published' },
                    isSectionHomepage: { not_equals: true },
                  },
                  limit: 1,
                  depth: 0,
                }
              )
              const childrenResponse = await $fetch<{ totalDocs: number }>(
                childrenCheckUrl
              )
              return {
                id: pageDoc.id,
                title: pageDoc.title,
                slug: pageDoc.slug,
                icon: pageDoc.icon,
                hasChildren: childrenResponse.totalDocs > 0,
                isCategory: false,
              }
            }
          )
          pageNavItems = await Promise.all(pageNavItemPromises)
        }

        return {
          id: categoryDoc.id,
          title: categoryDoc.name,
          isCategory: true,
          children: pageNavItems,
          hasChildren: pageNavItems.length > 0,
        }
      }
    )

    const finalNavItems = await Promise.all(categorizedNavItemsPromises)
    const finalNavItemsFiltered = finalNavItems.filter(
      (item) => item.isCategory && item.children && item.children.length > 0
    )

    return finalNavItemsFiltered
  } catch (err: any) {
    const fetchError = err as FetchError
    console.error(
      `[/api/wiki-nav] ERROR: Processing wiki navigation. ParentId: ${parentId}.`,
      fetchError.message
    )
    if (fetchError.response) {
      console.error(
        '[/api/wiki-nav] ERROR: Payload API Response Status:',
        fetchError.response.status
      )
      console.error(
        '[/api/wiki-nav] ERROR: Payload API Response Data:',
        fetchError.response._data
      )
    }
    throw createError({
      statusCode: fetchError.response?.status || 500,
      statusMessage: 'Failed to fetch or process wiki navigation data.',
      data: {
        parentIdUsed: parentId,
        originalErrorMessage: fetchError.message,
        payloadApiResponseStatus: fetchError.response?.status,
      },
    })
  }
})

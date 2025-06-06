import { computed } from 'vue'
import type { Ref } from 'vue'
import type { NavPage, NavCategoryGroup } from './usePayloadNavigation'

export interface FlattenedNavPage extends NavPage {
  parentId?: string
  depth: number
  categoryName: string
  categoryId: string
}

/**
 * Flattens the hierarchical navigation data into a single list,
 * preserving order and adding parent/depth information.
 */
function flattenNavigation(
  navData: NavCategoryGroup[] | null
): FlattenedNavPage[] {
  if (!navData || !Array.isArray(navData) || navData.length === 0) return []

  const flattened: FlattenedNavPage[] = []

  function recurse(
    pages: NavPage[],
    depth: number,
    categoryName: string,
    categoryId: string,
    parentId?: string
  ) {
    if (!Array.isArray(pages)) return

    pages.forEach((page) => {
      if (page && page.id) {
        flattened.push({
          ...page,
          parentId,
          depth,
          categoryName: categoryName || 'Uncategorized',
          categoryId: categoryId || 'uncategorized',
        })

        if (
          page.children &&
          Array.isArray(page.children) &&
          page.children.length > 0
        ) {
          recurse(page.children, depth + 1, categoryName, categoryId, page.id)
        }
      }
    })
  }

  navData.forEach((category) => {
    if (category && category.pages) {
      recurse(
        category.pages,
        0,
        category.name || 'Uncategorized',
        category.id || 'uncategorized'
      )
    }
  })

  return flattened
}

export function usePrevNextNavigation(
  navData: Ref<NavCategoryGroup[] | null>,
  currentPageSlug: Ref<string | undefined>
) {
  const flattenedNav = computed(() => {
    if (!navData.value) return []
    try {
      return flattenNavigation(navData.value)
    } catch (error) {
      console.error('Error flattening navigation:', error)
      return []
    }
  })

  const currentPageIndex = computed(() => {
    if (
      !currentPageSlug.value ||
      !Array.isArray(flattenedNav.value) ||
      flattenedNav.value.length === 0
    )
      return -1
    return flattenedNav.value.findIndex((p) => p.slug === currentPageSlug.value)
  })

  const currentPage = computed(() => {
    if (currentPageIndex.value === -1 || !Array.isArray(flattenedNav.value))
      return null
    return flattenedNav.value[currentPageIndex.value] || null
  })

  const findOriginalPage = (
    pageId: string,
    categories: NavCategoryGroup[] | null
  ): NavPage | null => {
    if (!categories || !Array.isArray(categories)) return null

    for (const category of categories) {
      if (!category || !Array.isArray(category.pages)) continue

      const findInChildren = (pages: NavPage[]): NavPage | null => {
        if (!Array.isArray(pages)) return null

        for (const page of pages) {
          if (!page) continue
          if (page.id === pageId) return page

          if (page.children && Array.isArray(page.children)) {
            const found = findInChildren(page.children)
            if (found) return found
          }
        }
        return null
      }

      const found = findInChildren(category.pages)
      if (found) return found
    }
    return null
  }

  const getSiblingsAndIndex = (
    page: FlattenedNavPage,
    originalNavData: NavCategoryGroup[] | null
  ): { siblings: NavPage[]; currentIndex: number } | null => {
    if (!page || !originalNavData) return null

    // Find the original parent page or category that contains this page
    let siblings: NavPage[] = []
    let currentIndex = -1

    // If the page has a parent, find the parent's children
    if (page.parentId) {
      const parentPage = findOriginalPage(page.parentId, originalNavData)
      if (parentPage && parentPage.children) {
        siblings = parentPage.children
        currentIndex = siblings.findIndex((p) => p.id === page.id)
      }
    } else {
      // If no parent, the page is at the top level of its category
      const category = originalNavData.find((cat) => cat.id === page.categoryId)
      if (category) {
        siblings = category.pages
        currentIndex = siblings.findIndex((p) => p.id === page.id)
      }
    }

    return { siblings, currentIndex }
  }

  const prevPage = computed((): FlattenedNavPage | null => {
    if (!currentPage.value || !navData.value) return null

    const context = getSiblingsAndIndex(currentPage.value, navData.value)
    if (context && context.currentIndex > 0) {
      const prevSiblingOriginal = context.siblings[context.currentIndex - 1]
      return (
        flattenedNav.value.find((p) => p.id === prevSiblingOriginal.id) || null
      )
    }
    return null
  })

  const nextPage = computed((): FlattenedNavPage | null => {
    if (!currentPage.value || !navData.value) return null

    const context = getSiblingsAndIndex(currentPage.value, navData.value)
    if (context && context.currentIndex < context.siblings.length - 1) {
      const nextSiblingOriginal = context.siblings[context.currentIndex + 1]
      return (
        flattenedNav.value.find((p) => p.id === nextSiblingOriginal.id) || null
      )
    }
    return null
  })

  return {
    currentPage,
    prevPage,
    nextPage,
    flattenedNav, // Exposing for debugging or other uses
  }
}

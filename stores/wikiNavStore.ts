import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

interface WikiApiNavItem {
  id: string
  title: string
  slug?: string
  icon?: string
  isCategory?: boolean
  children?: WikiApiNavItem[]
  hasChildren?: boolean
}

export interface WikiProcessedNavItem extends Omit<WikiApiNavItem, 'children'> {
  expanded: boolean
  loadingChildren: boolean
  children: WikiProcessedNavItem[]
}

export const useWikiNavStore = defineStore('wikiNav', () => {
  const processedNavigationItems: Ref<WikiProcessedNavItem[]> = ref([])
  const pending: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)
  const isInitialized: Ref<boolean> = ref(false)

  const staticNavUrl = '/wiki-navigation.json'

  const processApiItemsRecursive = (
    apiItems: WikiApiNavItem[]
  ): WikiProcessedNavItem[] => {
    return apiItems.map((item) => {
      const processedItem: WikiProcessedNavItem = {
        ...item,
        slug: item.slug,
        icon: item.icon,
        expanded: !!item.isCategory,
        loadingChildren: false,
        children: item.children ? processApiItemsRecursive(item.children) : [],
      }
      return processedItem
    })
  }

  const fetchNavItems = async (
    parentId: string | null | undefined
  ): Promise<WikiProcessedNavItem[]> => {
    if (parentId) {
      try {
        const url = `/api/wiki-nav?parentId=${parentId}`
        console.log(
          `[wikiNavStore] Fetching children for page ID ${parentId} from navigation cache: ${url}`
        )

        const navItems = await $fetch<WikiApiNavItem[]>(url)
        if (navItems && navItems.length > 0) {
          console.log(
            `[wikiNavStore] Successfully fetched ${navItems.length} child items from MongoDB cache`
          )
          return processApiItemsRecursive(navItems)
        }

        console.warn(
          `[wikiNavStore] No children found for parent ID ${parentId} in MongoDB cache, falling back to direct API`
        )

        const fallbackUrl = `/api/payload/wiki-pages?where[parent][equals]=${parentId}&where[status][equals]=published&sort=sort`
        console.log(`[wikiNavStore] Falling back to direct API: ${fallbackUrl}`)

        const response = await $fetch<any>(fallbackUrl)
        if (!response || !response.docs) {
          return []
        }

        const transformedItems = response.docs.map((page: any) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          icon: page.icon,
          isCategory: false,
          hasChildren: false,
        }))

        return processApiItemsRecursive(transformedItems)
      } catch (error) {
        console.error(
          `[wikiNavStore] Error fetching children for page ${parentId}:`,
          error
        )
        return []
      }
    }

    try {
      const url = '/api/wiki-nav'

      const navItems = await $fetch<WikiApiNavItem[]>(url)
      if (navItems && navItems.length > 0) {
        return processApiItemsRecursive(navItems)
      }
      console.warn(
        '[wikiNavStore] MongoDB cache returned empty navigation data'
      )
    } catch (cacheError) {
      console.error(
        '[wikiNavStore] Failed to fetch from MongoDB cache:',
        cacheError
      )
    }

    try {
      const url = '/api/navigation?section=wiki'
      console.log(`[wikiNavStore] Falling back to navigation API: ${url}`)

      const apiResponse = await $fetch<any[]>(url)

      const transformedItems = apiResponse.map((category) => ({
        id: category.id,
        title: category.name,
        isCategory: true,
        children: category.pages.map((page: any) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          icon: page.icon,
          hasChildren: !!page.children?.length,
          children: page.children || [],
        })),
        hasChildren: category.pages.length > 0,
      }))

      return processApiItemsRecursive(transformedItems)
    } catch (apiError) {
      console.error('[wikiNavStore] Navigation API also failed:', apiError)
      return []
    }
  }

  const ensureInitialized = async () => {
    if (!isInitialized.value && !pending.value) {
      pending.value = true
      error.value = null
      try {
        processedNavigationItems.value = await fetchNavItems(null)
        isInitialized.value = true
      } catch (e: any) {
        console.error('Failed to fetch wiki navigation:', e)
        error.value = e
        processedNavigationItems.value = []
      } finally {
        pending.value = false
      }
    }
  }

  const findItemById = (
    items: WikiProcessedNavItem[],
    id: string
  ): WikiProcessedNavItem | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children && item.children.length > 0) {
        const foundInChildren = findItemById(item.children, id)
        if (foundInChildren) return foundInChildren
      }
    }
    return null
  }

  const toggleExpand = async (itemId: string) => {
    const item = findItemById(processedNavigationItems.value, itemId)
    if (!item) {
      console.warn(`[wikiNavStore] Item not found for toggleExpand: ${itemId}`)
      return
    }

    item.expanded = !item.expanded

    if (
      !item.isCategory &&
      item.expanded &&
      item.hasChildren &&
      item.children.length === 0 &&
      !item.loadingChildren
    ) {
      item.loadingChildren = true
      try {
        item.children = await fetchNavItems(item.id)
      } catch (e: any) {
        console.error(
          `[wikiNavStore] Failed to fetch children for page ${item.title}:`,
          e
        )
        item.expanded = false
      } finally {
        item.loadingChildren = false
      }
    }
  }

  return {
    processedNavigationItems,
    pending,
    error,
    isInitialized,
    ensureInitialized,
    toggleExpand,
  }
})

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { $fetch } from 'ofetch';

// Generic API Nav Item (can be extended by specific stores if needed)
export interface ApiNavItem {
  id: string;
  title: string;
  slug?: string;
  icon?: string;
  isCategory?: boolean;
  hasChildren?: boolean;
  children?: ApiNavItem[]; // Children from API might be pre-fetched
}

// Generic Processed Nav Item for client-side state
export interface ProcessedNavItem extends Omit<ApiNavItem, 'children'> {
  expanded: boolean;
  loadingChildren: boolean;
  children: ProcessedNavItem[];
}

interface HierarchicalNavigationStoreOptions {
  storeId: string;
  primaryNavEndpoint: string; // e.g., /api/wiki-nav or /api/registry-nav
  childrenNavEndpointPattern: (parentId: string) => string; // e.g., (id) => `/api/wiki-nav?parentId=${id}`
  // Fallback if primary/children endpoints fail or return no data
  directApiFallbackPattern: (parentId: string | null | undefined) => string; // e.g., (id) => id ? `/api/payload/collection?parent=${id}` : `/api/payload/collection?topLevel`
  collectionSlug: string; // e.g., 'wiki-pages' or 'registry-pages' for fallback
  staticJsonFallbackUrl?: string; // Optional: e.g., /wiki-navigation.json
}

export function createHierarchicalNavigationStore(options: HierarchicalNavigationStoreOptions) {
  return defineStore(options.storeId, () => {
    const processedNavigationItems: Ref<ProcessedNavItem[]> = ref([]);
    const pending: Ref<boolean> = ref(false);
    const error: Ref<Error | null> = ref(null);
    const isInitialized: Ref<boolean> = ref(false);

    const processApiItemsRecursive = (
      apiItems: ApiNavItem[],
      // level = 0 // Debugging parameter removed
    ): ProcessedNavItem[] => {
      // Debugging logs removed
      if (!apiItems || apiItems.length === 0) {
        return [];
      }
      return apiItems.map((item) => {
        // Debugging logs removed
        
        const processedChildren = item.children ? processApiItemsRecursive(item.children /*, level + 1 */) : []; // Debugging parameter removed
        
        const processedItem: ProcessedNavItem = {
          ...item,
          slug: item.slug,
          icon: item.icon,
          expanded: !!item.isCategory, // Categories expanded by default
          loadingChildren: false,
          children: processedChildren,
        };
        // Debugging logs removed
        return processedItem;
      });
    };

    const fetchNavItems = async (
      parentId: string | null | undefined,
    ): Promise<ProcessedNavItem[]> => {
      let endpointUrl: string;
      let isFetchingChildren = false;

      if (parentId) {
        endpointUrl = options.childrenNavEndpointPattern(parentId);
        isFetchingChildren = true;
      } else {
        endpointUrl = options.primaryNavEndpoint;
      }

      try {
        const apiItems = await $fetch<ApiNavItem[]>(endpointUrl);
        if (apiItems && apiItems.length > 0) {
          return processApiItemsRecursive(apiItems);
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${options.storeId}] Endpoint ${endpointUrl} returned empty or no data. Attempting fallbacks.`);
        }
      } catch (e) {
        console.error(`[${options.storeId}] Failed to fetch from ${endpointUrl}. Attempting fallbacks. Error:`, e);
      }

      // Fallback to direct API call if primary/children endpoint fails or returns no data
      try {
        const fallbackUrl = options.directApiFallbackPattern(parentId);
        // Define a more specific type for Payload documents if available, using a generic one for now
        interface PayloadPageDoc {
          id: string;
          title: string;
          slug?: string;
          icon?: string;
          children?: { id: string }[]; // Assuming children might be an array of objects with id
        }
        const response = await $fetch<{ docs: PayloadPageDoc[] }>(fallbackUrl);
        
        if (response && response.docs && response.docs.length > 0) {
          const transformedItems = response.docs.map((page: PayloadPageDoc): ApiNavItem => ({
            id: page.id,
            title: page.title,
            slug: page.slug,
            icon: page.icon,
            isCategory: false, 
            hasChildren: !!(page.children && page.children.length > 0),
          }));
          return processApiItemsRecursive(transformedItems);
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${options.storeId}] Direct API fallback ${fallbackUrl} returned no data.`);
        }
      } catch (e) {
        console.error(`[${options.storeId}] Direct API fallback failed for ${options.directApiFallbackPattern(parentId)}. Error:`, e);
      }
      
      // Fallback to static JSON if provided and all else fails (typically for top-level only)
      if (!isFetchingChildren && options.staticJsonFallbackUrl) {
        try {
          const staticItems = await $fetch<ApiNavItem[]>(options.staticJsonFallbackUrl);
          return processApiItemsRecursive(staticItems);
        } catch (e) {
          console.error(`[${options.storeId}] Static JSON fallback failed for ${options.staticJsonFallbackUrl}. Error:`, e);
        }
      }
      
      return []; // Return empty if all fallbacks fail
    };

    const ensureInitialized = async () => {
      if (!isInitialized.value && !pending.value) {
        pending.value = true;
        error.value = null;
        try {
          processedNavigationItems.value = await fetchNavItems(null);
          isInitialized.value = true;
        } catch (e: unknown) { // Changed to unknown
          console.error(`[${options.storeId}] Failed to fetch initial navigation:`, e);
          if (e instanceof Error) {
            error.value = e;
          } else {
            error.value = new Error('An unknown error occurred during initialization.');
          }
          processedNavigationItems.value = [];
        } finally {
          pending.value = false;
        }
      }
    };

    const findItemById = (
      items: ProcessedNavItem[],
      id: string,
    ): ProcessedNavItem | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children && item.children.length > 0) {
          const foundInChildren = findItemById(item.children, id);
          if (foundInChildren) return foundInChildren;
        }
      }
      return null;
    };

    const toggleExpand = async (itemId: string) => {
      const item = findItemById(processedNavigationItems.value, itemId);
      if (!item) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${options.storeId}] Item not found for toggleExpand: ${itemId}`);
        }
        return;
      }

      item.expanded = !item.expanded;
      if (
        item.expanded &&
        item.hasChildren &&
        item.children.length === 0 &&
        !item.loadingChildren
      ) {
        item.loadingChildren = true;
        try {
          item.children = await fetchNavItems(item.id);
        } catch (e: unknown) { // Changed to unknown
          console.error(`[${options.storeId}] Failed to fetch children for ${item.title} (ID: ${item.id}):`, e);
          item.expanded = false; // Collapse on error
        } finally {
          item.loadingChildren = false;
        }
      }
    };

    return {
      processedNavigationItems,
      pending,
      error,
      isInitialized,
      ensureInitialized,
      toggleExpand,
      findItemById, // Expose findItemById if needed externally
    };
  });
}

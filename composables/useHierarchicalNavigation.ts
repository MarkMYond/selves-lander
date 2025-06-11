import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { $fetch } from 'ofetch';
import { useRuntimeConfig } from '#app'; 

// Generic API Nav Item
export interface ApiNavItem {
  id: string;
  title: string;
  slug?: string;
  icon?: string;
  iconBackgroundColor?: string;
  isCategory?: boolean;
  hasChildren?: boolean;
  children?: ApiNavItem[];
}

// Generic Processed Nav Item
export interface ProcessedNavItem extends Omit<ApiNavItem, 'children'> {
  iconBackgroundColor?: string;
  expanded: boolean;
  loadingChildren: boolean;
  children: ProcessedNavItem[];
}

interface HierarchicalNavigationStoreOptions {
  storeId: string;
  primaryNavEndpoint: string;
  childrenNavEndpointPattern?: (parentId: string) => string;
  directApiFallbackPattern?: (parentId: string | null | undefined) => string;
  collectionSlug: string;
  staticJsonFallbackUrl?: string;
}

export function createHierarchicalNavigationStore(options: HierarchicalNavigationStoreOptions) {
  return defineStore(options.storeId, () => {
    const processedNavigationItems: Ref<ProcessedNavItem[]> = ref([]);
    const pending: Ref<boolean> = ref(false);
    const error: Ref<Error | null> = ref(null);
    const isInitialized: Ref<boolean> = ref(false);

    const processApiItemsRecursive = (apiItems: ApiNavItem[]): ProcessedNavItem[] => {
      if (!apiItems || apiItems.length === 0) {
        return [];
      }
      return apiItems.map((item) => {
        const processedChildren = item.children ? processApiItemsRecursive(item.children) : [];
        return {
          ...item,
          slug: item.slug,
          icon: item.icon,
          iconBackgroundColor: item.iconBackgroundColor,
          expanded: !!item.isCategory, // Categories expanded by default, other items not.
          loadingChildren: false,
          children: processedChildren,
        };
      });
    };

    const fetchNavItems = async (parentId: string | null | undefined): Promise<ProcessedNavItem[]> => {
      const runtimeConfig = useRuntimeConfig();
      let relativeEndpointUrl: string;
      let isFetchingChildren = false;

      if (parentId) {
        if (!options.childrenNavEndpointPattern) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[${options.storeId}] fetchNavItems: childrenNavEndpointPattern not defined. Cannot fetch children for ${parentId}.`);
          }
          return [];
        }
        relativeEndpointUrl = options.childrenNavEndpointPattern(parentId);
        isFetchingChildren = true;
      } else {
        relativeEndpointUrl = options.primaryNavEndpoint;
      }

      const payloadApiFullUrl = runtimeConfig.public.payloadApiFullUrl || '';
      const payloadServerRoot = payloadApiFullUrl.endsWith('/api') ? payloadApiFullUrl.slice(0, -4) : payloadApiFullUrl;
      let fullEndpointUrl = relativeEndpointUrl;

      if (!relativeEndpointUrl.startsWith('/api/wiki-nav') && !relativeEndpointUrl.startsWith('/api/registry-nav')) {
        if (payloadServerRoot) {
          const rootEndsWithSlash = payloadServerRoot.endsWith('/');
          const relStartsWithSlash = relativeEndpointUrl.startsWith('/');
          if (rootEndsWithSlash && relStartsWithSlash) {
            fullEndpointUrl = payloadServerRoot + relativeEndpointUrl.substring(1);
          } else if (!rootEndsWithSlash && !relStartsWithSlash && relativeEndpointUrl) {
            fullEndpointUrl = payloadServerRoot + '/' + relativeEndpointUrl;
          } else {
            fullEndpointUrl = payloadServerRoot + relativeEndpointUrl;
          }
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${options.storeId}] Fetching nav items from: ${fullEndpointUrl}`);
      }

      try {
        const apiItems = await $fetch<ApiNavItem[]>(fullEndpointUrl);
        if (apiItems && apiItems.length > 0) {
          return processApiItemsRecursive(apiItems);
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${options.storeId}] Endpoint ${fullEndpointUrl} returned empty. Attempting fallbacks.`);
        }
      } catch (e) {
        console.error(`[${options.storeId}] Failed to fetch from ${fullEndpointUrl}. Error:`, e);
      }

      if (options.directApiFallbackPattern) {
        try {
          const relativeFallbackUrl = options.directApiFallbackPattern(parentId);
          const fallbackUrl = payloadServerRoot ? payloadServerRoot + relativeFallbackUrl : relativeFallbackUrl;
          if (process.env.NODE_ENV === 'development') {
            console.log(`[${options.storeId}] Attempting direct API fallback: ${fallbackUrl}`);
          }
          interface PayloadPageDoc { id: string; title: string; slug?: string; icon?: string; iconBackgroundColor?: string; children?: { id: string }[]; }
          const response = await $fetch<{ docs: PayloadPageDoc[] }>(fallbackUrl);
          if (response?.docs?.length > 0) {
            const transformedItems = response.docs.map((page): ApiNavItem => ({
              id: page.id, title: page.title, slug: page.slug, icon: page.icon, iconBackgroundColor: page.iconBackgroundColor,
              isCategory: false, hasChildren: !!(page.children && page.children.length > 0),
            }));
            return processApiItemsRecursive(transformedItems);
          }
        } catch (e) {
          console.error(`[${options.storeId}] Direct API fallback failed. Error:`, e);
        }
      }
      
      if (!isFetchingChildren && options.staticJsonFallbackUrl) {
        try {
          const staticUrl = options.staticJsonFallbackUrl.startsWith('http') ? options.staticJsonFallbackUrl : (runtimeConfig.app.baseURL || '') + options.staticJsonFallbackUrl;
          if (process.env.NODE_ENV === 'development') {
            console.log(`[${options.storeId}] Attempting static JSON fallback: ${staticUrl}`);
          }
          const staticItems = await $fetch<ApiNavItem[]>(staticUrl);
          return processApiItemsRecursive(staticItems);
        } catch (e) {
          console.error(`[${options.storeId}] Static JSON fallback failed. Error:`, e);
        }
      }
      return [];
    };

    const ensureInitialized = async () => {
      if (!isInitialized.value && !pending.value) {
        pending.value = true;
        error.value = null;
        try {
          processedNavigationItems.value = await fetchNavItems(null);
          isInitialized.value = true;
        } catch (e: any) {
          console.error(`[${options.storeId}] Failed to fetch initial navigation:`, e);
          error.value = e instanceof Error ? e : new Error('Unknown error during initialization.');
          processedNavigationItems.value = [];
        } finally {
          pending.value = false;
        }
      }
    };

    const findItemById = (items: ProcessedNavItem[], id: string): ProcessedNavItem | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children?.length) {
          const found = findItemById(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    // Internal helper to load children for an item if not already loaded.
    // Does NOT change the 'expanded' state by itself.
    const ensureChildrenLoaded = async (itemId: string): Promise<ProcessedNavItem[]> => {
      const item = findItemById(processedNavigationItems.value, itemId);
      if (!item) {
        if (process.env.NODE_ENV === 'development') console.warn(`[${options.storeId}] ensureChildrenLoaded: Item not found: ${itemId}`);
        return [];
      }
      // Only fetch if it has children, they aren't loaded, and not currently loading
      if (item.hasChildren && (!item.children || item.children.length === 0) && !item.loadingChildren) {
        item.loadingChildren = true;
        try {
          const children = await fetchNavItems(itemId);
          item.children = children; // Assign fetched children
          if (process.env.NODE_ENV === 'development') console.log(`[${options.storeId}] ensureChildrenLoaded: Fetched ${children.length} children for ${itemId}`);
          return children; // Return newly fetched children
        } catch (e) {
          console.error(`[${options.storeId}] ensureChildrenLoaded: Failed to fetch children for ${itemId}:`, e);
          item.children = []; // Set to empty on error
          return [];
        } finally {
          item.loadingChildren = false;
        }
      }
      return item.children || []; // Return existing children or empty array if hasChildren is false
    };

    const toggleExpand = async (itemId: string) => {
      const item = findItemById(processedNavigationItems.value, itemId);
      if (!item) {
        if (process.env.NODE_ENV === 'development') console.warn(`[${options.storeId}] toggleExpand: Item not found: ${itemId}`);
        return;
      }
      // If expanding for the first time (not yet expanded AND children not loaded), ensure children are loaded.
      if (!item.expanded && item.hasChildren && (!item.children || item.children.length === 0)) {
         await ensureChildrenLoaded(itemId);
      }
      item.expanded = !item.expanded; // Then toggle the state
    };

    const getPathAndEnsureExpanded = async (targetId: string): Promise<ProcessedNavItem[] | null> => {
      if (process.server && !isInitialized.value) {
        if (process.env.NODE_ENV === 'development') console.warn(`[${options.storeId}] getPathAndEnsureExpanded: Called on server, store not initialized. Aborting.`);
        return null;
      }
      if (!isInitialized.value) await ensureInitialized();

      async function findRecursive(currentItems: ProcessedNavItem[], idToFind: string, path: ProcessedNavItem[]): Promise<ProcessedNavItem[] | null> {
        for (const item of currentItems) {
          const currentPath = [...path, item];
          if (item.id === idToFind) { // Target found
            // Now, iterate over the determined path and ensure each node is expanded and children loaded.
            for (const nodeInPath of currentPath) {
              const storeNode = findItemById(processedNavigationItems.value, nodeInPath.id);
              if (storeNode && storeNode.hasChildren) {
                // Ensure children are loaded first. This won't change 'expanded' state.
                await ensureChildrenLoaded(storeNode.id); 
                if (!storeNode.expanded) { // Now, if it's not expanded, mark it so.
                  if (process.env.NODE_ENV === 'development') console.log(`[${options.storeId}] getPath: Setting node ${storeNode.title} (ID: ${storeNode.id}) to expanded as it is on the direct path.`);
                  storeNode.expanded = true; 
                }
              }
            }
            return currentPath;
          }

          if (item.hasChildren) {
            let childrenToExplore = item.children;
            // If children are needed for search but not loaded, fetch them using ensureChildrenLoaded.
            // This does NOT change the 'expanded' state of 'item' itself, only loads its children.
            if ((!childrenToExplore || childrenToExplore.length === 0) && !item.loadingChildren) {
              if (process.env.NODE_ENV === 'development') console.log(`[${options.storeId}] findRecursive: Item '${item.title}' (ID: ${item.id}) needs children for search. Ensuring they are loaded...`);
              childrenToExplore = await ensureChildrenLoaded(item.id);
              if (process.env.NODE_ENV === 'development') console.log(`[${options.storeId}] findRecursive: After ensureChildrenLoaded for '${item.title}', children count: ${childrenToExplore?.length || 0}`);
            }
            
            if (childrenToExplore && childrenToExplore.length > 0) {
              const foundPath = await findRecursive(childrenToExplore, idToFind, currentPath);
              if (foundPath) return foundPath;
            }
          }
        }
        return null;
      }
      if (process.env.NODE_ENV === 'development') console.log(`[${options.storeId}] getPathAndEnsureExpanded: Starting search for targetId: ${targetId}`);
      return findRecursive(processedNavigationItems.value, targetId, []);
    };

    return {
      processedNavigationItems,
      pending,
      error,
      isInitialized,
      ensureInitialized,
      toggleExpand,
      findItemById,
      getPathAndEnsureExpanded,
    };
  });
}

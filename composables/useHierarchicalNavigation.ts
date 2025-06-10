import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { $fetch } from 'ofetch';
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig

// Generic API Nav Item (can be extended by specific stores if needed)
export interface ApiNavItem {
  id: string;
  title: string;
  slug?: string;
  icon?: string;
  iconBackgroundColor?: string; // Added for icon background
  isCategory?: boolean;
  hasChildren?: boolean;
  children?: ApiNavItem[]; // Children from API might be pre-fetched
}

// Generic Processed Nav Item for client-side state
export interface ProcessedNavItem extends Omit<ApiNavItem, 'children'> {
  iconBackgroundColor?: string; // Added for icon background
  expanded: boolean;
  loadingChildren: boolean;
  children: ProcessedNavItem[];
}

interface HierarchicalNavigationStoreOptions {
  storeId: string;
  primaryNavEndpoint: string; // e.g., /api/wiki-nav or /api/registry-nav
  childrenNavEndpointPattern?: (parentId: string) => string; // e.g., (id) => `/api/wiki-nav?parentId=${id}` - Now optional
  // Fallback if primary/children endpoints fail or return no data
  directApiFallbackPattern?: (parentId: string | null | undefined) => string; // e.g., (id) => id ? `/api/payload/collection?parent=${id}` : `/api/payload/collection?topLevel` - Now optional
  collectionSlug: string; // e.g., 'wiki-pages' or 'registry-pages' for fallback (still useful for other potential features or if directApiFallbackPattern is used)
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
          iconBackgroundColor: item.iconBackgroundColor, // Carry over the new field
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
      const runtimeConfig = useRuntimeConfig();
      
      let relativeEndpointUrl: string;
      let isFetchingChildren = false;

      if (parentId) {
        if (!options.childrenNavEndpointPattern) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[${options.storeId}] fetchNavItems called with parentId but childrenNavEndpointPattern is not defined. Returning empty for children of ${parentId}.`);
          }
          return []; // Cannot fetch children if pattern is not defined
        }
        relativeEndpointUrl = options.childrenNavEndpointPattern(parentId);
        isFetchingChildren = true;
      } else {
        relativeEndpointUrl = options.primaryNavEndpoint;
      }

      // For frontend navigation endpoints (start with /api/), use them as-is (relative to current host)
      // For Payload endpoints, construct full URL using payloadApiFullUrl
      let fullEndpointUrl;
      const payloadApiFullUrl = runtimeConfig.public.payloadApiFullUrl || '';
      const payloadServerRoot = payloadApiFullUrl.endsWith('/api') 
                                 ? payloadApiFullUrl.slice(0, -4) // Remove /api
                                 : payloadApiFullUrl;
      
      if (relativeEndpointUrl.startsWith('/api/wiki-nav') || relativeEndpointUrl.startsWith('/api/registry-nav')) {
        // These are Nuxt frontend API endpoints, use as-is (relative to current host)
        fullEndpointUrl = relativeEndpointUrl;
      } else {
        // These are direct Payload API endpoints, construct full URL
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
        } else {
          // If no payloadServerRoot, assume relativeEndpointUrl is a full path or relative to current host
          fullEndpointUrl = relativeEndpointUrl; 
        }
      }
      
      if (process.env.NODE_ENV === 'development' && !payloadServerRoot && relativeEndpointUrl.startsWith('/api')) {
        console.warn(`[${options.storeId}] payloadApiFullUrl in runtimeConfig.public might be missing or incorrect. API calls will be relative to the Nuxt host.`);
      }
      
      try {
        // Ensure fullEndpointUrl is defined before fetching.
        if (process.env.NODE_ENV === 'development') {
          console.log(`[${options.storeId}] Fetching nav items from: ${fullEndpointUrl}`);
        }
        const apiItems = await $fetch<ApiNavItem[]>(fullEndpointUrl); 
        if (process.env.NODE_ENV === 'development') {
          console.log(`[${options.storeId}] Raw apiItems from ${fullEndpointUrl}:`, JSON.parse(JSON.stringify(apiItems || null)));
        }
        if (apiItems && apiItems.length > 0) {
          const processed = processApiItemsRecursive(apiItems);
          if (process.env.NODE_ENV === 'development') {
            console.log(`[${options.storeId}] Processed items from ${fullEndpointUrl}:`, JSON.parse(JSON.stringify(processed)));
          }
          return processed;
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${options.storeId}] Endpoint ${fullEndpointUrl} returned empty or no data (apiItems was null, undefined, or empty array). Attempting fallbacks.`);
        }
      } catch (e) {
        console.error(`[${options.storeId}] Failed to fetch from ${fullEndpointUrl}. Attempting fallbacks. Error:`, e);
      }

      // Fallback to direct API call if primary/children endpoint fails or returns no data
      // Only attempt this if directApiFallbackPattern is defined
      if (options.directApiFallbackPattern) {
        try {
          const relativeFallbackUrl = options.directApiFallbackPattern(parentId);
          // Construct full fallback URL using Payload API URL
          const fallbackUrl = payloadServerRoot ? payloadServerRoot + relativeFallbackUrl : relativeFallbackUrl;
          if (process.env.NODE_ENV === 'development') {
            console.log(`[${options.storeId}] Attempting direct API fallback from: ${fallbackUrl}`);
          }
          // Define a more specific type for Payload documents if available, using a generic one for now
          interface PayloadPageDoc {
          id: string;
          title: string;
          slug?: string;
          icon?: string;
          iconBackgroundColor?: string; // Add here for fallback data
          children?: { id: string }[]; // Assuming children might be an array of objects with id
        }
        const response = await $fetch<{ docs: PayloadPageDoc[] }>(fallbackUrl);
        
        if (response && response.docs && response.docs.length > 0) {
          const transformedItems = response.docs.map((page: PayloadPageDoc): ApiNavItem => ({
            id: page.id,
            title: page.title,
            slug: page.slug,
            icon: page.icon,
            iconBackgroundColor: page.iconBackgroundColor, // Add here
            isCategory: false, 
            hasChildren: !!(page.children && page.children.length > 0),
          }));
          return processApiItemsRecursive(transformedItems);
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${options.storeId}] Direct API fallback ${fallbackUrl} returned no data.`);
          }
        } catch (e) {
          // Check if options.directApiFallbackPattern exists before trying to call it in the error message
          const relativeFallbackUrl = options.directApiFallbackPattern ? options.directApiFallbackPattern(parentId) : 'undefined pattern';
          const fullFallbackUrl = payloadServerRoot ? payloadServerRoot + relativeFallbackUrl : relativeFallbackUrl;
          console.error(`[${options.storeId}] Direct API fallback failed for ${fullFallbackUrl}. Error:`, e);
        }
      }
      
      // Fallback to static JSON if provided and all else fails (typically for top-level only)
      // Static JSON fallback should use relative path to Nuxt server or be a full URL itself.
      if (!isFetchingChildren && options.staticJsonFallbackUrl) {
        try {
          // Assuming staticJsonFallbackUrl is relative to Nuxt server or a full URL
          const staticUrl = options.staticJsonFallbackUrl.startsWith('http') ? options.staticJsonFallbackUrl : (runtimeConfig.app.baseURL || '') + options.staticJsonFallbackUrl;
          if (process.env.NODE_ENV === 'development') {
            console.log(`[${options.storeId}] Attempting static JSON fallback from: ${staticUrl}`);
          }
          const staticItems = await $fetch<ApiNavItem[]>(staticUrl);
          if (process.env.NODE_ENV === 'development') {
             console.log(`[${options.storeId}] Raw staticItems from ${staticUrl}:`, JSON.parse(JSON.stringify(staticItems || null)));
          }
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

    // findItemAndItsAncestorsById removed.

    const toggleExpand = async (itemId: string) => {
      const item = findItemById(processedNavigationItems.value, itemId);
      if (!item) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${options.storeId}] Item not found for toggleExpand: ${itemId}`);
        }
        return;
      }

      // If expanding and item has children but children array is empty, fetch children
      if (!item.expanded && item.hasChildren && (!item.children || item.children.length === 0)) {
        item.loadingChildren = true;
        try {
          const children = await fetchNavItems(itemId);
          item.children = children;
          if (process.env.NODE_ENV === 'development') {
            console.log(`[${options.storeId}] Fetched ${children.length} children for item ${itemId}`);
          }
        } catch (e) {
          console.error(`[${options.storeId}] Failed to fetch children for item ${itemId}:`, e);
          // Set children to empty array to prevent repeated fetching attempts
          item.children = [];
        } finally {
          item.loadingChildren = false;
        }
      }

      item.expanded = !item.expanded;
    };

    const getPathAndEnsureExpanded = async (targetId: string): Promise<ProcessedNavItem[] | null> => {
      // If on server and store is not already initialized, abort.
      // This function's complex async operations are better suited for client-side.
      // Assumes that if pre-expanded state is needed for SSR, 'isInitialized' would be true
      // due to a Nuxt server plugin or similar server-side data fetching strategy.
      if (process.server && !isInitialized.value) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${options.storeId}] getPathAndEnsureExpanded: Called on server when store not initialized. Aborting SSR execution of this function to prevent potential issues. Navigation expansion will occur client-side.`);
        }
        return null; 
      }

      if (!isInitialized.value) {
        // This should now primarily run on the client, or if isInitialized was somehow true on server.
        await ensureInitialized();
      }

      async function findRecursive(
        currentLevelItems: ProcessedNavItem[],
        idToFind: string,
        pathAccumulator: ProcessedNavItem[]
      ): Promise<ProcessedNavItem[] | null> {
        for (const item of currentLevelItems) {
          const currentPath = [...pathAccumulator, item];

          if (item.id === idToFind) {
            // Target found. Now, iterate over the determined path and ensure each node is expanded.
            // toggleExpand will just flip the boolean, as child fetching is removed from it.
            // The children arrays are assumed to be populated from the initial full tree fetch.
            for (const nodeInPath of currentPath) {
              const storeNode = findItemById(processedNavigationItems.value, nodeInPath.id);
              if (storeNode && !storeNode.expanded) {
                // No await needed if toggleExpand is synchronous (which it is now)
                toggleExpand(storeNode.id); 
              }
              // No need to explicitly load children here if the tree is full from primaryNavEndpoint.
              // If storeNode.hasChildren is true but storeNode.children is empty,
              // it means the API provided it that way (e.g. an empty category).
            }
            return currentPath; // Return the path of ProcessedNavItems
          }

          // If not the target, and item has children, we need to search deeper.
          if (item.hasChildren) {
            // We search the item.children directly. It's assumed to be populated if hasChildren is true.
            // No dynamic fetching of children during search, rely on the initially loaded tree.
            const childrenToExplore = item.children; 
            
            if (childrenToExplore && childrenToExplore.length > 0) {
              const foundInChildren = await findRecursive(childrenToExplore, idToFind, currentPath);
              if (foundInChildren) {
                // If target was found deeper, the expansion of the path (including current 'item')
                // would have been handled when 'idToFind' was matched.
                return foundInChildren;
              }
            }
          }
        }
        return null; // Target not found in this branch
      }

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
      // findItemAndItsAncestorsById, // Removed
      getPathAndEnsureExpanded, // Added new function
    };
  });
}

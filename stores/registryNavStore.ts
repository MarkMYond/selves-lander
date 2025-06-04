import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

// Interface for items coming from API
interface RegistryApiNavItem {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  isCategory?: boolean; // Added to support category differentiation
  hasChildren?: boolean;
}

// Interface for items used in the store and template (includes client-side state)
export interface RegistryProcessedNavItem extends RegistryApiNavItem {
  expanded: boolean;
  loadingChildren: boolean;
  children: RegistryProcessedNavItem[];
}

export const useRegistryNavStore = defineStore('registryNav', () => {
  const processedNavigationItems: Ref<RegistryProcessedNavItem[]> = ref([]);
  const pending: Ref<boolean> = ref(false);
  const error: Ref<Error | null> = ref(null);
  const isInitialized: Ref<boolean> = ref(false);

  // Use the static JSON file for navigation
  const staticNavUrl = '/registry-navigation.json';

  // Recursive function to process API items into processed nav items with client-side state
  const processApiItemsRecursive = (apiItems: any[]): RegistryProcessedNavItem[] => {
    return apiItems.map(item => {
      const processedItem: RegistryProcessedNavItem = {
        ...item,
        slug: item.slug, // Ensure slug is passed
        icon: item.icon, // Ensure icon is passed
        expanded: !!item.isCategory, // Categories are expanded by default, pages are not
        loadingChildren: false,
        children: item.children ? processApiItemsRecursive(item.children) : [], // Recursively process children
      };
      return processedItem;
    });
  };

  const fetchNavItems = async (parentId: string | null | undefined): Promise<RegistryProcessedNavItem[]> => {
    if (parentId) {
      // For children requests, use our registry-nav endpoint which includes hierarchy information
      try {
        const url = `/api/registry-nav?parentId=${parentId}`;
        console.log(`[registryNavStore] Fetching children for page ID ${parentId} from navigation cache: ${url}`);
        
        const navItems = await $fetch<RegistryApiNavItem[]>(url);
        if (navItems && navItems.length > 0) {
          console.log(`[registryNavStore] Successfully fetched ${navItems.length} child items from MongoDB cache`);
          return processApiItemsRecursive(navItems);
        }
        
        console.warn(`[registryNavStore] No children found for parent ID ${parentId} in MongoDB cache, falling back to direct API`);
        
        // Fall back to direct API call if cache fails
        const fallbackUrl = `/api/payload/registry-pages?where[parent][equals]=${parentId}&where[status][equals]=published&sort=sort`;
        console.log(`[registryNavStore] Falling back to direct API: ${fallbackUrl}`);
        
        const response = await $fetch<any>(fallbackUrl);
        if (!response || !response.docs) {
          return [];
        }
        
        // Transform the response docs to match the expected structure
        const transformedItems = response.docs.map((page: any) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          icon: page.icon,
          hasChildren: false // Assumption: no grandchildren when using fallback
        }));
        
        return processApiItemsRecursive(transformedItems);
      } catch (error) {
        console.error(`[registryNavStore] Error fetching children for page ${parentId}:`, error);
        return [];
      }
    }
    
    // For top-level navigation, first try our MongoDB-based API endpoint
    try {
      const url = '/api/registry-nav';
      console.log(`[registryNavStore] Fetching from MongoDB cache API: ${url}`);
      const apiItems = await $fetch<RegistryApiNavItem[]>(url);
      if (apiItems && apiItems.length > 0) {
        console.log(`[registryNavStore] Successfully fetched ${apiItems.length} items from MongoDB cache`);
        return processApiItemsRecursive(apiItems);
      }
      console.warn('[registryNavStore] MongoDB cache returned empty navigation data');
    } catch (cacheError) {
      console.error('[registryNavStore] Failed to fetch from MongoDB cache:', cacheError);
    }
    
    // Fall back to the static file if MongoDB API fails
    try {
      console.log(`[registryNavStore] Falling back to static file: ${staticNavUrl}`);
      const staticItems = await $fetch<any[]>(staticNavUrl);
      return processApiItemsRecursive(staticItems);
    } catch (fallbackError) {
      console.error('[registryNavStore] Static navigation file also failed:', fallbackError);
      return [];
    }
  };

  const ensureInitialized = async () => {
    if (!isInitialized.value && !pending.value) {
      console.log('[registryNavStore] Initializing navigation store...');
      pending.value = true;
      error.value = null;
      try {
        // This will try the static JSON file first and fall back to API if needed
        processedNavigationItems.value = await fetchNavItems(null); 
        isInitialized.value = true;
        console.log('[registryNavStore] Navigation loaded successfully');
      } catch (e: any) {
        console.error('Failed to fetch registry navigation:', e);
        error.value = e;
        processedNavigationItems.value = []; // Reset on error
      } finally {
        pending.value = false;
      }
    }
  };

  const findItemById = (items: RegistryProcessedNavItem[], id: string): RegistryProcessedNavItem | null => {
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
      console.warn(`[registryNavStore] Item not found for toggleExpand: ${itemId}`); // Changed log prefix
      return;
    }

    item.expanded = !item.expanded;
    if (item.expanded && item.hasChildren && item.children.length === 0 && !item.loadingChildren) {
      item.loadingChildren = true;
      try {
        // console.log(`[registryNavStore] Fetching children for ${item.title} (ID: ${item.id})`); // Changed log prefix
        item.children = await fetchNavItems(item.id);
      } catch (e: any) {
        console.error(`[registryNavStore] Failed to fetch children for ${item.title}:`, e); // Changed log prefix
        // Optionally set an error state on the item itself
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
  }
})

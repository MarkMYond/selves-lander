import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

// Interface for items coming from the updated API
// It can represent a Category (with page children) or a Page (with potential sub-page children)
interface WikiApiNavItem {
  id: string; // Category ID or Page ID
  title: string; // Category Name or Page Title
  slug?: string; // Present for pages, undefined for categories
  icon?: string; // Present for pages
  isCategory?: boolean; // True if this item represents a category
  children?: WikiApiNavItem[]; // Pre-loaded child pages if it's a category, or sub-pages if fetched for a page
  hasChildren?: boolean; // True if a page has sub-pages OR a category has pages
}

// Interface for items used in the store and template (includes client-side state)
export interface WikiProcessedNavItem extends Omit<WikiApiNavItem, 'children'> {
  expanded: boolean;
  loadingChildren: boolean;
  children: WikiProcessedNavItem[]; // Children will always be WikiProcessedNavItem
}

export const useWikiNavStore = defineStore('wikiNav', () => {
  const processedNavigationItems: Ref<WikiProcessedNavItem[]> = ref([]);
  const pending: Ref<boolean> = ref(false);
  const error: Ref<Error | null> = ref(null);
  const isInitialized: Ref<boolean> = ref(false);

  // Use the static JSON file for navigation
  const staticNavUrl = '/wiki-navigation.json';

  // Recursive function to process API items (categories and pages) into WikiProcessedNavItems
  const processApiItemsRecursive = (apiItems: WikiApiNavItem[]): WikiProcessedNavItem[] => {
    return apiItems.map(item => {
      const processedItem: WikiProcessedNavItem = {
        ...item,
        slug: item.slug, // Ensure slug is passed, even if undefined for categories
        icon: item.icon, // Ensure icon is passed
        expanded: !!item.isCategory, // Categories are expanded by default, pages are not
        loadingChildren: false,
        children: item.children ? processApiItemsRecursive(item.children) : [], // Recursively process children
      };
      // If it's a category, its 'hasChildren' is based on its pre-loaded page children.
      // If it's a page, its 'hasChildren' indicates sub-pages to be fetched.
      // The API already sets hasChildren correctly for both cases.
      return processedItem;
    });
  };

  const fetchNavItems = async (parentId: string | null | undefined): Promise<WikiProcessedNavItem[]> => {
    if (parentId) {
      // For children requests, use our wiki-nav endpoint which includes hierarchy information
      try {
        const url = `/api/wiki-nav?parentId=${parentId}`;
        console.log(`[wikiNavStore] Fetching children for page ID ${parentId} from navigation cache: ${url}`);
        
        const navItems = await $fetch<WikiApiNavItem[]>(url);
        if (navItems && navItems.length > 0) {
          console.log(`[wikiNavStore] Successfully fetched ${navItems.length} child items from MongoDB cache`);
          return processApiItemsRecursive(navItems);
        }
        
        console.warn(`[wikiNavStore] No children found for parent ID ${parentId} in MongoDB cache, falling back to direct API`);
        
        // Fall back to direct API call if cache fails
        const fallbackUrl = `/api/payload/wiki-pages?where[parent][equals]=${parentId}&where[status][equals]=published&sort=sort`;
        console.log(`[wikiNavStore] Falling back to direct API: ${fallbackUrl}`);
        
        const response = await $fetch<any>(fallbackUrl);
        if (!response || !response.docs) {
          return [];
        }
        
        // Transform the response docs to match the expected WikiApiNavItem[] structure
        const transformedItems = response.docs.map((page: any) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          icon: page.icon,
          isCategory: false,
          // Check for children
          hasChildren: false // Assumption: no grandchildren when using fallback
        }));
        
        return processApiItemsRecursive(transformedItems);
      } catch (error) {
        console.error(`[wikiNavStore] Error fetching children for page ${parentId}:`, error);
        return [];
      }
    }
    
    // First try our new MongoDB-based navigation API endpoint
    try {
      const url = '/api/wiki-nav';
      
      const navItems = await $fetch<WikiApiNavItem[]>(url);
      if (navItems && navItems.length > 0) {
        return processApiItemsRecursive(navItems);
      }
      console.warn('[wikiNavStore] MongoDB cache returned empty navigation data');
    } catch (cacheError) {
      console.error('[wikiNavStore] Failed to fetch from MongoDB cache:', cacheError);
    }
    
    // Fall back to the standard navigation API if MongoDB cache fails
    try {
      const url = '/api/navigation?section=wiki';
      console.log(`[wikiNavStore] Falling back to navigation API: ${url}`);
      
      const apiResponse = await $fetch<any[]>(url);
      
      // Transform the response format to match the expected WikiApiNavItem[] structure
      const transformedItems = apiResponse.map(category => ({
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
        hasChildren: category.pages.length > 0
      }));
      
      return processApiItemsRecursive(transformedItems);
    } catch (apiError) {
      console.error('[wikiNavStore] Navigation API also failed:', apiError);
      return []; // Return empty array if all attempts fail
    }
  };

  const ensureInitialized = async () => {
    if (!isInitialized.value && !pending.value) {
      pending.value = true;
      error.value = null;
      try {
        // This will try the static JSON file first and fall back to API if needed
        processedNavigationItems.value = await fetchNavItems(null); 
        isInitialized.value = true;
      } catch (e: any) {
        console.error('Failed to fetch wiki navigation:', e);
        error.value = e;
        processedNavigationItems.value = []; // Reset on error
      } finally {
        pending.value = false;
      }
    }
  };

  const findItemById = (items: WikiProcessedNavItem[], id: string): WikiProcessedNavItem | null => {
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
      console.warn(`[wikiNavStore] Item not found for toggleExpand: ${itemId}`);
      return;
    }

    item.expanded = !item.expanded;

    // If it's a PAGE and has children that haven't been loaded yet
    if (!item.isCategory && item.expanded && item.hasChildren && item.children.length === 0 && !item.loadingChildren) {
      item.loadingChildren = true;
      try {
        // console.log(`[wikiNavStore] Fetching children for page ${item.title} (ID: ${item.id})`);
        // Children fetched for a page are also processed
        item.children = await fetchNavItems(item.id); 
      } catch (e: any) {
        console.error(`[wikiNavStore] Failed to fetch children for page ${item.title}:`, e);
        item.expanded = false; // Collapse on error
      } finally {
        item.loadingChildren = false;
      }
    }
    // If it's a CATEGORY, its children (pages) are already loaded by the initial fetch.
    // So, no need to fetch children here, just toggle 'expanded'.
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

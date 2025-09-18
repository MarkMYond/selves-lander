import { createHierarchicalNavigationStore } from '../composables/useHierarchicalNavigation';
import type { ApiNavItem as WikiApiNavItem, ProcessedNavItem as WikiProcessedNavItem } from '../composables/useHierarchicalNavigation';

// Export the specific types if they are used elsewhere
export type { WikiApiNavItem, WikiProcessedNavItem };

export const useWikiNavStore = createHierarchicalNavigationStore({
  storeId: 'wikiNav',
  primaryNavEndpoint: '/api/wiki-nav', // Endpoint for top-level wiki items
  childrenNavEndpointPattern: (parentId: string) => `/api/wiki-nav?parentId=${parentId}`,
  directApiFallbackPattern: (parentId: string | null | undefined) =>
    parentId
      ? `/api/wiki-pages?where[parent][equals]=${parentId}&where[status][equals]=published&sort=sort`
      : `/api/wiki-pages?where[parent][exists]=false&where[status][equals]=published&sort=sort`, // Top-level if no parentId
  collectionSlug: 'wiki-pages',
  staticJsonFallbackUrl: '/wiki-navigation.json', // If you have a static fallback for wiki
});

import { createHierarchicalNavigationStore } from '../composables/useHierarchicalNavigation';
import type { ApiNavItem as RegistryApiNavItem, ProcessedNavItem as RegistryProcessedNavItem } from '../composables/useHierarchicalNavigation';

// Export the specific types if they are used elsewhere, though often they can remain internal
// to the composable or be re-exported from there if truly needed by components.
export type { RegistryApiNavItem, RegistryProcessedNavItem };

export const useRegistryNavStore = createHierarchicalNavigationStore({
  storeId: 'registryNav',
  primaryNavEndpoint: '/api/registry-nav', // Endpoint for top-level registry items
  childrenNavEndpointPattern: (parentId: string) => `/api/registry-nav?parentId=${parentId}`,
  directApiFallbackPattern: (parentId: string | null | undefined) => 
    parentId 
      ? `/api/registry-pages?where[parent][equals]=${parentId}&where[status][equals]=published&sort=sort`
      : `/api/registry-pages?where[parent][exists]=false&where[status][equals]=published&sort=sort`, // Top-level if no parentId
  collectionSlug: 'registry-pages',
  staticJsonFallbackUrl: '/registry-navigation.json',
});

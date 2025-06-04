import { defineEventHandler, getQuery, createError } from 'h3'
import type { FetchError } from 'ofetch'

// Interface for raw documents fetched from Payload
interface PayloadCategoryDoc {
  id: string;
  name: string; // Category name
  slug: string; // Category slug (might not be used for nav link directly)
  sort?: number;
}

interface PayloadWikiPageDoc {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  sort?: number;
  category?: string | PayloadCategoryDoc; // Can be populated
  parent?: string | PayloadWikiPageDoc; // Can be populated
  isSectionHomepage?: boolean;
  status?: string;
}

// Interface for navigation items returned by the API
// This will now be a union type or have an explicit type property
// For now, we'll add properties and the frontend store/component will adapt
interface NavItem {
  id: string; // Can be category ID or page ID
  title: string; // Category name or Page title
  slug?: string; // Page slug (categories might not have a direct slug for navigation)
  icon?: string; // Page icon
  isCategory?: boolean; // Flag to identify category headers
  children?: NavItem[]; // Child pages or child categories (if nesting categories)
  hasChildren?: boolean; // For pages, to indicate they have sub-pages
  // Properties for pages loaded under a category or as children
  pageId?: string; 
  pageSlug?: string;
  pageIcon?: string;
}

// Helper function to build Payload query URLs (retained)
const buildPayloadQueryUrl = (
  baseApiUrl: string,
  collection: string,
  params: Record<string, string | number | boolean | Record<string, any>>
): string => {
  const endpoint = `${baseApiUrl.replace(/\/api\/?$/, '')}/api/${collection}`;
  const apiQuery = new URLSearchParams();

  for (const key in params) {
    if (key === 'where') {
      const whereClauses = params[key] as Record<string, any>;
      for (const field in whereClauses) {
        const condition = whereClauses[field];
        if (typeof condition === 'object' && condition !== null) {
          for (const operator in condition) {
            apiQuery.append(`where[${field}][${operator}]`, String(condition[operator]));
          }
        } else {
          // Handle simple equality if condition is not an object (e.g. where: { parent: parentId })
          // This case might not be used with the current structure but good for robustness
          apiQuery.append(`where[${field}][equals]`, String(condition));
        }
      }
    } else {
      apiQuery.append(key, String(params[key]));
    }
  }
  return `${endpoint}?${apiQuery.toString()}`;
};

// Helper to fetch children for a given page (retained and adapted)
async function getPageChildren(pageId: string, payloadApiUrl: string): Promise<NavItem[]> {
  const childrenUrl = buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
    where: {
      parent: { equals: pageId },
      status: { equals: 'published' },
      isSectionHomepage: { not_equals: true },
    },
    sort: 'sort',
    limit: 100, // Assuming max 100 children per page for nav
    depth: 0,
  });

  console.log(`[/api/wiki-nav] TRACE: Fetching children for page ${pageId} from: ${childrenUrl}`);
  const childrenResponse = await $fetch<{ docs: PayloadWikiPageDoc[] }>(childrenUrl);
  
  if (!childrenResponse || !childrenResponse.docs) return [];

  const childNavItemsPromises = childrenResponse.docs.map(async (childDoc) => {
    const grandChildrenResponse = await $fetch<{ totalDocs: number }>(buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
      where: { parent: { equals: childDoc.id }, status: { equals: 'published' }, isSectionHomepage: { not_equals: true } },
      limit: 1,
      depth: 0,
    }));
    return {
      id: childDoc.id,
      title: childDoc.title,
      slug: childDoc.slug, // pageSlug for clarity in NavItem
      icon: childDoc.icon, // pageIcon
      hasChildren: grandChildrenResponse.totalDocs > 0,
      isCategory: false, // Explicitly a page
    };
  });
  return Promise.all(childNavItemsPromises);
}


export default defineEventHandler(async (event): Promise<NavItem[]> => {
  console.log('[/api/wiki-nav] TRACE: Handler invoked');
  const queryParams = getQuery(event);
  const parentId = queryParams.parentId as string | undefined; // For expanding page children
  
  const runtimeConfig = useRuntimeConfig();
  const payloadApiUrl = runtimeConfig.public.payloadApiUrl;

  if (!payloadApiUrl) {
    console.error('[/api/wiki-nav] FATAL: payloadApiUrl is not defined.');
    throw createError({ statusCode: 500, statusMessage: 'Payload API URL not configured.' });
  }

  try {
    // If parentId is provided, fetch children of that page (existing logic for page hierarchy)
    if (parentId) {
      console.log(`[/api/wiki-nav] TRACE: parentId detected: ${parentId}. Fetching page children.`);
      return getPageChildren(parentId, payloadApiUrl);
    }

    // Top-level call: Fetch categories and their pages
    console.log('[/api/wiki-nav] TRACE: No parentId. Fetching categories and their top-level pages.');
    const categoriesUrl = buildPayloadQueryUrl(payloadApiUrl, 'categories', {
      sort: 'sort', // Sort categories by their 'sort' field
      limit: 50, // Assuming max 50 categories
      depth: 0, // We only need category IDs and names initially
    });
    console.log(`[/api/wiki-nav] TRACE: Fetching categories from: ${categoriesUrl}`);
    const categoriesResponse = await $fetch<{ docs: PayloadCategoryDoc[] }>(categoriesUrl);

    if (!categoriesResponse || !categoriesResponse.docs) {
      console.warn('[/api/wiki-nav] WARN: No categories found or invalid response.');
      return [];
    }
    console.log(`[/api/wiki-nav] TRACE: Found ${categoriesResponse.docs.length} categories.`);

    const categorizedNavItemsPromises = categoriesResponse.docs.map(async (categoryDoc) => {
      // Fetch top-level pages for this category
      const pagesUrl = buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
        where: {
          category: { equals: categoryDoc.id },
          parent: { exists: false }, // Top-level pages within the category
          status: { equals: 'published' },
          isSectionHomepage: { not_equals: true },
        },
        sort: 'sort', // Sort pages by their 'sort' field
        limit: 100, // Assuming max 100 pages per category for nav
        depth: 0, // Only need basic page info
      });
      console.log(`[/api/wiki-nav] TRACE: Fetching pages for category ${categoryDoc.name} (ID: ${categoryDoc.id}) from: ${pagesUrl}`);
      const pagesResponse = await $fetch<{ docs: PayloadWikiPageDoc[] }>(pagesUrl);

      let pageNavItems: NavItem[] = [];
      if (pagesResponse && pagesResponse.docs) {
        console.log(`[/api/wiki-nav] TRACE: Found ${pagesResponse.docs.length} pages for category ${categoryDoc.name}.`);
        const pageNavItemPromises = pagesResponse.docs.map(async (pageDoc) => {
          // Check if this page has children
          const childrenCheckUrl = buildPayloadQueryUrl(payloadApiUrl, 'wiki-pages', {
            where: { parent: { equals: pageDoc.id }, status: { equals: 'published' }, isSectionHomepage: { not_equals: true } },
            limit: 1,
            depth: 0,
          });
          const childrenResponse = await $fetch<{ totalDocs: number }>(childrenCheckUrl);
          return {
            id: pageDoc.id, // Page ID
            title: pageDoc.title,
            slug: pageDoc.slug, // Page slug
            icon: pageDoc.icon, // Page icon
            hasChildren: childrenResponse.totalDocs > 0,
            isCategory: false, // This is a page
          };
        });
        pageNavItems = await Promise.all(pageNavItemPromises);
      }

      // Return category item with its pages as children
      return {
        id: categoryDoc.id, // Category ID
        title: categoryDoc.name, // Category Name
        isCategory: true,
        children: pageNavItems,
        hasChildren: pageNavItems.length > 0, // Category has children if it has pages
        // slug and icon are not typically set for category headers in this model
      };
    });

    const finalNavItems = await Promise.all(categorizedNavItemsPromises);
    // Filter out categories that ended up with no visible pages
    const finalNavItemsFiltered = finalNavItems.filter(item => item.isCategory && item.children && item.children.length > 0);
    
    console.log(`[/api/wiki-nav] TRACE: Processed ${finalNavItemsFiltered.length} categorized nav items.`);
    return finalNavItemsFiltered;

  } catch (err: any) {
    const fetchError = err as FetchError;
    console.error(`[/api/wiki-nav] ERROR: Processing wiki navigation. ParentId: ${parentId}.`, fetchError.message);
    if (fetchError.response) {
      console.error('[/api/wiki-nav] ERROR: Payload API Response Status:', fetchError.response.status);
      console.error('[/api/wiki-nav] ERROR: Payload API Response Data:', fetchError.response._data);
    }
    throw createError({
      statusCode: fetchError.response?.status || 500,
      statusMessage: 'Failed to fetch or process wiki navigation data.',
      data: { 
        parentIdUsed: parentId,
        originalErrorMessage: fetchError.message,
        payloadApiResponseStatus: fetchError.response?.status,
      }
    });
  }
});

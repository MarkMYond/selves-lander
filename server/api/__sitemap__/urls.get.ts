import { defineEventHandler } from 'h3';
import { $fetch } from 'ofetch';

// Define a type for the page documents we expect from Payload
interface PayloadPage {
  id: string;
  slug: string;
  updatedAt: string;
  parent?: string | { id: string }; // Parent can be an ID string or an object with an ID
  // Add any other fields if needed by your logic, e.g., meta.noIndex
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  // add other sitemap properties if needed, like changefreq, priority
}

// Helper function to get full path for hierarchical collections
const getFullPath = (pageId: string, pagesMap: Map<string, PayloadPage>): string => {
  const page = pagesMap.get(pageId);
  if (!page) {
    console.warn(`[Sitemap API] getFullPath: Page not found in map for ID ${pageId}`);
    return '';
  }
  let pathSegments: string[] = [page.slug];
  let currentPage = page;
  let safetyNet = 0; // Prevent infinite loops

  while (currentPage.parent && safetyNet < 10) {
    safetyNet++;
    const parentField = currentPage.parent;
    const parentId = typeof parentField === 'string' ? parentField : parentField?.id;
    
    if (!parentId) {
      break; 
    }

    const parentPage = pagesMap.get(parentId);
    if (parentPage) {
      pathSegments.unshift(parentPage.slug);
      currentPage = parentPage;
    } else {
      console.warn(`[Sitemap API] getFullPath: Parent page with ID ${parentId} not found in map for child ${page.slug}. Path so far: ${pathSegments.join('/')}`);
      break; 
    }
  }
  if (safetyNet >= 10) {
    console.warn(`[Sitemap API] getFullPath: Exceeded safety net for page ${page.slug}, possible circular parent reference.`);
  }
  return pathSegments.join('/');
};

export default defineEventHandler(async (event) => {
  const SITEMAP_LOG_PREFIX = '[Sitemap API]';
  
  try {
    // Get runtime config for API URL
    const config = useRuntimeConfig(event);
    const payloadApiUrl = (config.public.payloadApiUrl || process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3333').replace(/\/$/, '');
    
    console.log(`${SITEMAP_LOG_PREFIX} === DEBUGGING SITEMAP ISSUES ===`);
    console.log(`${SITEMAP_LOG_PREFIX} Generating sitemap URLs via server route...`);
    console.log(`${SITEMAP_LOG_PREFIX} Using Payload API URL: ${payloadApiUrl}`);
    console.log(`${SITEMAP_LOG_PREFIX} Runtime config debug:`, {
      payloadApiUrl: config.public.payloadApiUrl,
      payloadApiFullUrl: config.public.payloadApiFullUrl,
      env_NUXT_PUBLIC_PAYLOAD_API_URL: process.env.NUXT_PUBLIC_PAYLOAD_API_URL,
      env_NODE_ENV: process.env.NODE_ENV
    });

    const dynamicRoutes: SitemapUrl[] = [];

    // Test API connectivity first
    console.log(`${SITEMAP_LOG_PREFIX} Testing API connectivity to ${payloadApiUrl}/api/wiki-pages?limit=1...`);
    
    try {
      const testResponse = await $fetch<any>(`${payloadApiUrl}/api/wiki-pages?limit=1`);
      console.log(`${SITEMAP_LOG_PREFIX} API test successful!`);
      console.log(`${SITEMAP_LOG_PREFIX} Test response doc count:`, testResponse?.docs?.length || 0);
      if (testResponse?.docs?.[0]) {
        console.log(`${SITEMAP_LOG_PREFIX} Sample doc:`, { 
          slug: testResponse.docs[0].slug, 
          id: testResponse.docs[0].id 
        });
      }
    } catch (apiError: any) {
      console.error(`${SITEMAP_LOG_PREFIX} API test failed:`, apiError.message);
      console.error(`${SITEMAP_LOG_PREFIX} API error details:`, apiError);
      return { error: 'API connectivity test failed', details: apiError.message };
    }

    const collectionsToFetch = [
      { slug: 'web-pages', pathPrefix: '', isHierarchical: false }, 
      { slug: 'wiki-pages', pathPrefix: '/wiki', isHierarchical: true },
      { slug: 'registry-pages', pathPrefix: '/registry', isHierarchical: true } 
    ];

    for (const collection of collectionsToFetch) {
      try {
        console.log(`${SITEMAP_LOG_PREFIX} Fetching data for collection: ${collection.slug}`);
        const queryParams = 'limit=0&depth=0' + 
                            '&where[meta.noIndex][not_equals]=true';
        
        const response = await $fetch<{ docs: PayloadPage[] }>(
          `${payloadApiUrl}/api/${collection.slug}?${queryParams}`
        );
        
        const numDocs = response.docs?.length || 0;
        console.log(`${SITEMAP_LOG_PREFIX} Fetched ${numDocs} documents for ${collection.slug}.`);

        if (response.docs && numDocs > 0) {
          if (collection.isHierarchical) {
            const pagesMap = new Map(response.docs.map(doc => [doc.id, doc]));
            console.log(`${SITEMAP_LOG_PREFIX} Built pagesMap for ${collection.slug} with ${pagesMap.size} entries.`);
          response.docs.forEach(page => {
            // For sitemap, use only the direct slug, not the full hierarchical path,
            // if the frontend routing is flat (e.g., /wiki/page-slug).
            // The getFullPath function correctly identifies the full path if needed elsewhere,
            // but for sitemap URLs matching flat frontend routes, we use page.slug directly.
            if (page.slug) { 
              const finalUrl = `${collection.pathPrefix}/${page.slug}`;
              dynamicRoutes.push({ 
                loc: finalUrl, 
                lastmod: page.updatedAt 
              });
            }
          });
        } else { // For non-hierarchical like web-pages (web-pages already use direct slug)
            response.docs.forEach(page => {
              const pageUrl = page.slug === 'home' ? '/' : `${collection.pathPrefix}/${page.slug}`;
              dynamicRoutes.push({ 
                loc: pageUrl, 
                lastmod: page.updatedAt 
              });
            });
          }
        }
      } catch (e: any) {
        console.error(`${SITEMAP_LOG_PREFIX} Error fetching sitemap data for ${collection.slug}:`, e.message);
        // Continue with other collections even if one fails
      }
    }
    
    console.log(`${SITEMAP_LOG_PREFIX} Generated ${dynamicRoutes.length} dynamic routes. Sample (first 10):`, JSON.stringify(dynamicRoutes.slice(0, 10), null, 2) + (dynamicRoutes.length > 10 ? '...' : ''));
    return dynamicRoutes;
  } catch (error: any) {
    console.error(`${SITEMAP_LOG_PREFIX} Error in sitemap generation:`, error.message);
    return [];
  }
});

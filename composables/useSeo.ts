// useHead is auto-imported by Nuxt 3
import type {
  WebPage, // Assuming these are defined in your payload-types
  WikiPage,
  RegistryPage,
} from '../src/payload-types'; // Adjusted import path

// Define a common interface for SEO-relevant fields
export interface SeoPageData { // Add export here
  title: string; // Main page title
  slug?: string; // Page slug for URL construction
  updatedAt?: string; // For dateModified
  createdAt?: string; // For datePublished
  // Assuming 'layout' or 'pageBuilder' contains the main content for articleBody
  layout?: any[]; 
  pageBuilder?: any[]; 
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: { url?: string | null } | string | null;
    keywords?: string | null; // Comma-separated string of keywords
    schemaType?: string | null; // e.g., "Article", "WebPage"
    noIndex?: boolean | null;
    jsonLD?: Record<string, any> | null; // Added jsonLD field to store the object
  } | null;
}

/**
 * Composable for setting SEO metadata
 * @param page - The page data containing SEO information (WebPage, WikiPage, RegistryPage, etc.)
 * @param type - The type of page ('website' or 'article')
 */
export function useSeo(
  page: SeoPageData | undefined,
  type: 'website' | 'article' = 'website'
) {
  if (!page) {
    return
  }

  // Extract SEO fields from the page
  const { meta } = page

  // Default values with better fallbacks
  const title = meta?.title || page.title || 'Taash - AI-Ready Hospitality Infrastructure'
  const description = meta?.description || 'Taash connects venues to AI agents, enabling seamless automated bookings and enhanced guest experiences through cutting-edge travel technology infrastructure.';
  const keywords = meta?.keywords || 'AI travel, hospitality technology, automated bookings, venue management';
  const schemaType = meta?.schemaType || 'WebPage'; // Default to WebPage if not specified
  const noIndex = meta?.noIndex || false;

  // Handle image being an object or potentially just a string ID (though URL is preferred)
  const imageUrl =
    typeof meta?.image === 'object' && meta.image?.url ? meta.image.url : '';
  const ogType = type;

  // Use Nuxt's useHead to set meta tags
  useHead({
    title,
    htmlAttrs: {
      lang: 'en', // Add language attribute for better SEO
    },
    meta: [
      // Essential meta tags
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'utf-8' },
      // Standard meta tags
      { name: 'description', content: description },
      // Robots meta tag
      { name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' },

      // Open Graph tags
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: imageUrl, key: 'og:image' },
      { property: 'og:url', content: `${useRuntimeConfig().public.siteUrl || 'https://taash.ai'}${useRoute().path}` },
      { property: 'og:site_name', content: 'Taash' },

      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl, key: 'twitter:image' },
    ],
    link: [
      // Canonical URL
      { rel: 'canonical', href: `${useRuntimeConfig().public.siteUrl || 'https://taash.ai'}${useRoute().path}` },
    ],
    script: [], // Initialize script array for JSON-LD
  });

  // JSON-LD Structured Data
  // This is a basic implementation; you'll need to expand it based on schemaType
  // and the specific properties required for each type.
  if (!noIndex) { // Only add JSON-LD if page is not noIndex
    let finalJsonLd: any;

    if (meta?.jsonLD && typeof meta.jsonLD === 'object' && Object.keys(meta.jsonLD).length > 0) {
      // If a pre-generated jsonLD object exists in meta, use it directly
      finalJsonLd = meta.jsonLD;
      // Ensure @context is present, default if not
      if (!finalJsonLd['@context']) {
        finalJsonLd['@context'] = 'https://schema.org';
      }
      // Ensure @type is present, use schemaType from meta if not, or default
      if (!finalJsonLd['@type']) {
        finalJsonLd['@type'] = schemaType; // schemaType defaults to 'WebPage'
      }
    } else {
      // Construct JSON-LD if not pre-generated
      const route = useRoute(); // Get current route for URL
      const siteUrl = useRuntimeConfig().public.siteUrl || 'https://taash.ai'; // Get base URL
      const pageUrl = `${siteUrl}${route.path}`;

      finalJsonLd = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: title,
        description: description,
        url: pageUrl,
      };

      if (imageUrl) {
        finalJsonLd.image = imageUrl;
      }
      
      if (keywords) {
        finalJsonLd.keywords = keywords;
      }

      if (schemaType === 'Article') {
        finalJsonLd.headline = title;
        finalJsonLd.datePublished = page.createdAt || new Date().toISOString();
        finalJsonLd.dateModified = page.updatedAt || new Date().toISOString();
        finalJsonLd.author = {
          '@type': 'Organization',
          name: 'Taash', 
        };
        finalJsonLd.publisher = {
          '@type': 'Organization',
          name: 'Taash',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.svg`, // Updated to use existing logo.svg
          },
        };
        // articleBody would ideally be generated or taken from a summary field
        // finalJsonLd.articleBody = description; 
      }
      // Add more specific structures for other schemaTypes here
    }

    // Update head with JSON-LD script
    if (finalJsonLd && Object.keys(finalJsonLd).length > 0) {
      useHead({
        script: [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(finalJsonLd, null, 2), 
          },
        ],
      });
    }
  }
}

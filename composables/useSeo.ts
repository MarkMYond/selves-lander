// useHead is auto-imported by Nuxt 3
import type {
  WebPage,
  WikiPage,
  RegistryPage,
} from '../../payload-cms/src/payload-types' // Import other page types

// Define a common interface for SEO-relevant fields
interface SeoPageData {
  title: string
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | string | null // Allow for Media object or string ID
  } | null
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

  // Default values
  const title = meta?.title || page.title || 'Taash Website'
  const description = meta?.description || ''
  // Handle image being an object or potentially just a string ID (though URL is preferred)
  const imageUrl =
    typeof meta?.image === 'object' && meta.image?.url ? meta.image.url : ''
  const ogType = type

  // Use Nuxt's useHead to set meta tags
  useHead({
    title,
    meta: [
      // Standard meta tags
      { name: 'description', content: description },

      // Open Graph tags
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: imageUrl, key: 'og:image' }, // Use key instead of hid

      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl, key: 'twitter:image' }, // Use key instead of hid
    ],
    link: [
      // Canonical URL - you might want to add logic for this
      // { rel: 'canonical', href: `https://yourdomain.com${route.path}` },
    ],
  })
}

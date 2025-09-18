// Helper composable to standardize media URL handling across the site
import { useRuntimeConfig } from 'nuxt/app'
// Use a loose Media type to avoid depending on generated payload types
type Media = {
  url?: string
  filename?: string
} | string | null | undefined

export function useMediaUrl() {
  const config = useRuntimeConfig()

  // Get the base URL and full API URL from the runtime config
  const getBaseUrl = (): string => {
    // Use the base URL (without /api)
    const payloadBaseUrl =
      config.public.payloadApiUrl || 'http://localhost:3333'
    return payloadBaseUrl.endsWith('/')
      ? payloadBaseUrl.slice(0, -1)
      : payloadBaseUrl
  }

  /**
   * Generate a proper URL for media files served locally by Payload.
   *
   * @param media - The media object or URL string
   * @returns The complete URL to the media file
   */
  const getMediaUrl = (media: Media): string => {
    if (!media) return '' // Return empty if no media provided

    let url: string | null | undefined = null

    // Extract URL based on input type
    if (typeof media === 'string') {
      // If it's just a string, assume it's an ID or relative path
      url = media
    } else if (media?.url) {
      // Prefer the 'url' property if the media object is provided
      url = media.url
    } else if (media?.filename) {
      // Fallback to filename if url isn't available - construct standard path
      url = `${media.filename}` // Changed to just use the filename directly
    }

    // Return empty if we still don't have a URL/filename
    if (!url) return ''

    // If we have a URL and it's already a full HTTP(S) URL, return it directly
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // WORKAROUND: Check for and remove the incorrect '-1.svg' suffix from specific DB records
    if (url.endsWith('-1.svg')) {
      url = url.replace(/-1\.svg$/, '.svg') // Remove the '-1' before the extension
    }

    // For relative URLs, prepend the appropriate base URL
    const baseUrl = getBaseUrl()

    // Normalize to Payload's static file convention: served from /media/*
    // Keep API routes as-is only if explicitly provided.

    // Fix common mis-formed Payload file paths: '/api/media/file/...'
    if (url.startsWith('/api/media/file/')) {
      return `${baseUrl}${url.replace(/^\/api\/media\//, '/media/')}`
    }
    if (url.startsWith('api/media/file/')) {
      return `${baseUrl}/${url.replace(/^api\/media\//, 'media/')}`
    }

    // Explicit API path - pass through (JSON endpoints etc.)
    if (url.startsWith('/api/')) return `${baseUrl}${url}`
    if (url.startsWith('api/')) return `${baseUrl}/${url}`

    // Static media paths
    if (url.startsWith('/media/')) return `${baseUrl}${url}`
    if (url.startsWith('media/')) return `${baseUrl}/${url}`

    // If it looks like a filename with an image extension, serve from /media/
    if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(url)) {
      const prefixed = url.startsWith('/') ? url : `/${url}`
      return `${baseUrl}/media${prefixed}`
    }

    // Fallback: if it contains slashes, treat as relative path
    if (url.includes('/')) return `${baseUrl}/${url}`

    // Last resort: assume it's a bare filename or id -> try static media
    return `${baseUrl}/media/${url}`
  }

  return {
    getMediaUrl,
  }
}

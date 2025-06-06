// Helper composable to standardize media URL handling across the site
import { useRuntimeConfig } from 'nuxt/app'
import type { Media } from '../src/payload-types'

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
  const getMediaUrl = (media: Media | string | null | undefined): string => {
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

    // Special case for the path format seen in wiki microheaders
    if (url.startsWith('api/media/file/')) {
      return `${baseUrl}/${url}`
    }

    // Handle different path formats
    if (url.startsWith('/')) {
      // If it already starts with a slash like /api/media/..., just prepend base URL
      if (url.includes('/api/media/')) {
        return `${baseUrl}${url}`
      }
      // If it starts with a slash but doesn't include /api/media/, add it
      if (url.startsWith('/media/')) {
        return `${baseUrl}/api${url}`
      }
      // Any other path starting with a slash
      return `${baseUrl}${url}`
    } else if (url.includes('/')) {
      // If it has slashes but doesn't start with one, it's likely a relative path
      // Check if it already includes 'media/'
      if (url.startsWith('media/')) {
        return `${baseUrl}/api/${url}`
      }
      // Check for api/ prefix but not starting with slash
      if (url.startsWith('api/')) {
        return `${baseUrl}/${url}`
      }
      return `${baseUrl}/api/media/${url}`
    } else {
      // If it's just an ID or filename without path, construct standard path
      return `${baseUrl}/api/media/${url}`
    }
  }

  return {
    getMediaUrl,
  }
}

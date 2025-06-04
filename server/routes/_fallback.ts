import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'

// This captures all requests that aren't handled by other routes
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // --- Explicitly ignore API routes ---
  // If the path starts with /api/, let it pass through without Nuxt page handling.
  // This assumes your Payload backend (or a proxy) is handling /api routes.
  if (path.startsWith('/api/')) {
    return // Do nothing, let the request pass through
  }
  // ------------------------------------

  // Focus specifically on direct access to dynamic wiki and registry routes
  if (
    (path.match(/^\/wiki\/[^\/]+$/) || path.match(/^\/registry\/[^\/]+$/)) &&
    !path.includes('.') // Exclude static files
  ) {
    // Allow Nuxt to handle these routes - this is effectively a no-op
    // but it ensures the request gets properly processed by Nuxt's SSR
    return
  }

  // For all other routes, let the regular handling continue
  return
})

import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  // Get the URL from the request
  const url = getRequestURL(event)
  const path = url.pathname
  
  // Focus specifically on wiki and registry routes
  if (
    // Match wiki and registry URLs but exclude api routes and static files
    (path.startsWith('/wiki/') || path.startsWith('/registry/')) &&
    !path.match(/\.(js|css|ico|png|jpg|jpeg|svg|woff|woff2|ttf|eot)$/)
  ) {
    // Let the request continue to be processed by Nuxt's SSR handler
    // This is effectively a no-op, but it ensures Nuxt picks up these routes
    return
  }
})
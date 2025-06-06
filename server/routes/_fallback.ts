import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  if (path.startsWith('/api/')) {
    return
  }

  if (
    (path.match(/^\/wiki\/[^\/]+$/) || path.match(/^\/registry\/[^\/]+$/)) &&
    !path.includes('.')
  ) {
    return
  }

  return
})

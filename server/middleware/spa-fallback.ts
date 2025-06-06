import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  if (
    (path.startsWith('/wiki/') || path.startsWith('/registry/')) &&
    !path.match(/\.(js|css|ico|png|jpg|jpeg|svg|woff|woff2|ttf|eot)$/)
  ) {
    return
  }
})

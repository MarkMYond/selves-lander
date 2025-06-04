import { defineEventHandler } from 'h3'

// This explicitly tells the server to handle wiki routes with SSR
export default defineEventHandler((event) => {
  // Let Nuxt's default handler take over
  // This simply ensures the route gets registered and processed by Nuxt
  return
})
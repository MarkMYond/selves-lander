export default defineNuxtPlugin(() => {
  // This runs on both client and server
  if (import.meta.server) {
    // Server-side HTML cleanup will be handled by Nitro config
  // log removed
  }
})

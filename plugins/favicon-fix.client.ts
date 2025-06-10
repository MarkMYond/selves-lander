// Ensure favicon is properly loaded and cached
export default defineNuxtPlugin({
  name: 'favicon-fix',
  setup() {
    if (process.client) {
      // Preload favicon to ensure it's cached properly
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = '/favicon-v2.png'
      link.as = 'image'
      link.type = 'image/png'
      document.head.appendChild(link)
    }
  }
})

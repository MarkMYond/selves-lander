// SEO Development Helper
export default defineNuxtPlugin(() => {
  // Only run in development
  if (process.env.NODE_ENV === 'development' && process.client) {
    const router = useRouter()
    
    // Run SEO audit after route changes
    router.afterEach((to) => {
      // Wait for page to fully load
      nextTick(() => {
        setTimeout(() => {
          // Import and run SEO audit
          import('@/composables/useSeoAudit').then(({ runSEOAudit }) => {
            runSEOAudit()
          })
        }, 1000) // Wait 1 second for page to fully render
      })
    })
  }
})

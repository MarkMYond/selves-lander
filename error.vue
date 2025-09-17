<!-- 404 Error Page with proper SEO -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-semibold text-gray-300">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p class="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      
      <div class="space-y-4">
        <NuxtLink 
          to="/"
          class="inline-block px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          Go Home
        </NuxtLink>
        
        <div class="flex justify-center space-x-4 text-sm">
          <NuxtLink to="/wiki" class="text-brand-primary hover:underline">
            Browse Wiki
          </NuxtLink>
          <NuxtLink to="/registry" class="text-brand-primary hover:underline">
            View Registry
          </NuxtLink>
          <NuxtLink to="/book-a-demo" class="text-brand-primary hover:underline">
            Book Demo
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set proper SEO for 404 page
const config = useRuntimeConfig()
const siteName = (config.public.siteName as string) || 'Site'
useHead({
  title: `404 - Page Not Found | ${siteName}`,
  meta: [
    { name: 'description', content: `The page you are looking for could not be found on ${siteName}.` },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

// Set 404 status code for SSR
if (process.server) {
  setResponseStatus(404)
}
</script>

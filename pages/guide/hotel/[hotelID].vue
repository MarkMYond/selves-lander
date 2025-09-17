<template>
  <div class="flex w-full min-h-screen">
    <!-- Left Sidebar -->
    <aside class="hidden lg:block w-64 bg-gray-50 border-r border-gray-200">
      <!-- Navigation menu placeholder -->
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Hotel Guide</h3>
        <nav class="space-y-2">
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Overview</a>
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Details</a>
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Media</a>
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Facilities</a>
        </nav>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="flex-1 min-w-0">
      <div class="max-w-2xl mx-auto px-6 py-8">
        <div v-if="hotel">
          <h1 class="text-3xl font-semibold mb-6">{{ hotel.name }}</h1>
          
          <HotelDetails :hotel="hotel" />
        </div>
        <div v-else>
          <p>Loading hotel data...</p>
        </div>
      </div>
    </main>
    
    <!-- Right Sidebar -->
    <aside class="hidden xl:block w-64 bg-gray-50 border-l border-gray-200">
      <!-- "On this page" navigation -->
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">On this page</h3>
        <nav class="space-y-2">
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900">Main Details</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900">Description</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="hotel?.media">Media</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="hotel?.vibe">Vibe</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="hotel?.facts">Facts</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="hotel?.facilities">Facilities</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="hotel?.reviews">Reviews</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="hotel?.poi">Points of Interest</a>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const config = useRuntimeConfig()
const { setHotelSEO } = useHotelSEO()
const { loadHotelSchema } = useExternalSchema()

// Server-side data fetching for better SEO
const hotelId = route.params.hotelID

const { data: hotel, error } = await useFetch(`${config.public.payloadApiUrl}/api/hotels/${hotelId}`, {
  server: true, // Ensure this runs on server-side for SEO
  default: () => null,
  transform: (data) => {
    // Handle both direct fetch and search results
    return data?.docs ? data.docs[0] : data
  }
})

// Fallback: try searching by registryId if direct fetch fails
if (!hotel.value && !error.value) {
  const { data: searchResult } = await useFetch(`${config.public.payloadApiUrl}/api/hotels`, {
    query: { 'where[registryId][equals]': hotelId },
    server: true,
    default: () => ({ docs: [] })
  })
  
  if (searchResult.value?.docs?.[0]) {
    hotel.value = searchResult.value.docs[0]
  }
}

// Hotel pages are now overview/navigation only - SEO focus is on room pages
if (hotel.value) {
  console.log('ℹ️ Hotel overview page - minimal SEO, rooms get the full treatment')
  
  // Set basic meta tags only
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl
  
  const siteName = (config.public.siteName && String(config.public.siteName)) || 'Site'
  useSeoMeta({
    title: `${hotel.value.name} | Hotel Guide | ${siteName}`,
    description: hotel.value.description || `Explore ${hotel.value.name} with detailed amenities, room options, and local insights.`,
    robots: 'index, follow',
    author: siteName
  })
  
  useHead({
    link: [
      { rel: 'canonical', href: `${baseUrl}/guide/hotel/${hotelId}` }
    ],
    meta: [
      { name: 'theme-color', content: '#1E0D43' }
    ]
  })
  
} else {
  console.log('⚠️ No hotel data available')
}
</script>

<style scoped>
@media (max-width: 768px) {
  aside {
    display: none !important;
  }
  main {
    width: 100% !important;
  }
}
</style>

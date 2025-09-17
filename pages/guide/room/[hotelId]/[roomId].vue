<template>
  <div class="flex w-full min-h-screen">
    <!-- Left Sidebar -->
    <aside class="hidden lg:block w-64 bg-gray-50 border-r border-gray-200">
      <!-- Navigation menu placeholder -->
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Room Guide</h3>
        <nav class="space-y-2">
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Room Details</a>
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Hotel Overview</a>
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Hotel Details</a>
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Media</a>
          <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Facilities</a>
        </nav>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="flex-1 min-w-0">
      <div class="max-w-2xl mx-auto px-6 py-8">
        <div v-if="roomData">
          <!-- Room Details at the top -->
          <RoomDetails :room="roomData.room" />
          
          <!-- Hotel Context Section -->
          <div class="border-t border-gray-200 pt-8">
            <h1 class="text-3xl font-semibold mb-6">{{ roomData.hotel.name }}</h1>
            <p class="text-gray-600 mb-6">Hotel context for this room</p>
            
            <HotelDetails :hotel="roomData.hotel" />
          </div>
        </div>
        <div v-else>
          <p>Loading room data...</p>
        </div>
      </div>
    </main>
    
    <!-- Right Sidebar -->
    <aside class="hidden xl:block w-64 bg-gray-50 border-l border-gray-200">
      <!-- "On this page" navigation -->
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">On this page</h3>
        <nav class="space-y-2">
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900">Room Details</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900">Hotel Overview</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900">Main Details</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900">Description</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="roomData?.hotel?.media">Media</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="roomData?.hotel?.vibe">Vibe</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="roomData?.hotel?.facts">Facts</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="roomData?.hotel?.facilities">Facilities</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="roomData?.hotel?.reviews">Reviews</a>
          <a href="#" class="block text-xs text-gray-600 hover:text-gray-900" v-if="roomData?.hotel?.poi">Points of Interest</a>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const config = useRuntimeConfig()

// Server-side data fetching for better SEO
const hotelId = route.params.hotelId
const roomId = route.params.roomId

const { data: hotel, error } = await useFetch(`${config.public.payloadApiUrl}/api/hotels/${hotelId}`, {
  server: true, // Ensure this runs on server-side for SEO
  default: () => null
})

// Find the specific room
const roomData = computed(() => {
  if (!hotel.value?.rooms) return null
  
  const room = hotel.value.rooms.find(r => 
    r.id === roomId || 
    r.roomId?.toString() === roomId || 
    r.name?.toLowerCase().replace(/\s+/g, '-') === roomId
  )
  
  if (room) {
    return {
      hotel: hotel.value,
      room: room
    }
  }
  return null
})

// Set room-focused SEO with external HotelRoom schema
if (roomData.value?.hotel && roomData.value?.room) {
  await setRoomSEO(roomData.value.hotel, roomData.value.room, hotelId, roomId)
}

// Room-focused SEO function
async function setRoomSEO(hotel, room, hotelId, roomId) {
  console.log('🏨 Setting room-focused SEO for:', room.name)
  
  // Try to load external schema first
  const { loadRoomSchema } = useExternalSchema()
  const externalSchema = await loadRoomSchema(hotelId, roomId)
  
  if (externalSchema) {
    console.log('✅ Successfully loaded external room schema')
  } else {
    console.log('ℹ️ No external schema found, using basic meta tags')
  }
  
  // Room-focused meta tags (always set regardless of schema)
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl
  
  const siteName = (config.public.siteName && String(config.public.siteName)) || 'Site'
  useSeoMeta({
    title: `${room.name || 'Room'} - ${hotel.name} | Room Guide | ${siteName}`,
    description: room.description || `Book ${room.name || 'this room'} at ${hotel.name}. ${room.basics?.[1] || 'Comfortable accommodation'} with modern amenities.`,
    robots: 'index, follow',
    author: siteName,
    ogTitle: `${room.name || 'Room'} - ${hotel.name}`,
    ogDescription: room.description || `Book ${room.name || 'this room'} at ${hotel.name}`,
    ogType: 'product',
    ogImage: hotel.media?.[1]?.url || '/logo.svg'
  })
  
  useHead({
    link: [
      { rel: 'canonical', href: `${baseUrl}/guide/room/${hotelId}/${roomId}` }
    ],
    meta: [
      { name: 'theme-color', content: '#1E0D43' }
    ]
  })
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

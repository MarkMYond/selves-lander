// useHead is auto-imported by Nuxt

interface HotelSchema {
  name: string
  description: string
  image?: string[]
  [key: string]: any
}

export const useExternalSchema = () => {
  const loadHotelSchema = async (hotelId: string, hotelData?: any): Promise<HotelSchema | null> => {
    try {
      // Use dynamic API endpoint - works fine in both SSR and client-side
      const schemaUrl = `/api/schema/hotel/${hotelId}`
      console.log('🔍 Loading dynamic hotel schema:', schemaUrl, process.server ? '(SSR)' : '(Client)')
      
      // Use $fetch with proper error handling for both SSR and client-side
      const schemaData = await $fetch<HotelSchema>(schemaUrl).catch((error) => {
        console.log(`❌ Dynamic hotel schema failed for hotel ${hotelId}:`, error.statusMessage || error.message || 'Not found')
        return null
      })
      
      if (schemaData && schemaData['@type'] === 'Hotel') {
        console.log('✅ Dynamic hotel schema loaded:', schemaData.name, process.server ? '(SSR)' : '(Client)')
        
        // Inject the JSON-LD into the page head
        useHead({
          script: [
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify(schemaData, null, 2),
              key: `external-hotel-schema-${hotelId}`
            }
          ]
        })
        
        // Set basic meta tags from the schema data
        if (hotelData) {
            const config = useRuntimeConfig()
            const siteName = (config.public?.siteName as string) || 'Site'
          useHead({
              title: `${schemaData.name} | Hotel Guide | ${siteName}`,
            meta: [
              { name: 'description', content: schemaData.description },
              { property: 'og:title', content: `${schemaData.name} | Hotel Guide` },
              { property: 'og:description', content: schemaData.description },
              { property: 'og:type', content: 'place' },
              { property: 'og:image', content: schemaData.image?.[0] || '/logo.svg' },
              { name: 'twitter:card', content: 'summary_large_image' },
              { name: 'twitter:title', content: `${schemaData.name} | Hotel Guide` },
              { name: 'twitter:description', content: schemaData.description },
              { name: 'twitter:image', content: schemaData.image?.[0] || '/logo.svg' }
            ]
          })
        }
        
        return schemaData
      } else {
        console.warn(`❌ Invalid or missing dynamic schema data for hotel ${hotelId}`)
        return null
      }
    } catch (error) {
      console.error('💥 Error loading dynamic hotel schema:', error)
      return null
    }
  }
  
  const loadRoomSchema = async (hotelId: string, roomId: string) => {
    try {
      // Use dynamic API endpoint - works fine in both SSR and client-side
      const schemaUrl = `/api/schema/room/${hotelId}/${roomId}`
      console.log('🔍 Loading dynamic room schema:', schemaUrl, process.server ? '(SSR)' : '(Client)')
      
      // Use $fetch with proper error handling for both SSR and client-side
      const schemaData = await $fetch<HotelSchema>(schemaUrl).catch((error) => {
        console.log(`❌ Dynamic room schema failed for room ${hotelId}-${roomId}:`, error.statusMessage || error.message || 'Not found')
        return null
      })
      
      if (schemaData && schemaData['@type'] === 'HotelRoom') {
        console.log('✅ Dynamic room schema loaded:', schemaData.name, process.server ? '(SSR)' : '(Client)')
        
        // Inject the JSON-LD into the page head
        useHead({
          script: [
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify(schemaData, null, 2),
              key: `room-schema-${hotelId}-${roomId}`
            }
          ]
        })
        
        return schemaData
      } else {
        console.warn(`No valid dynamic schema found for room ${hotelId}-${roomId}`)
        return null
      }
    } catch (error) {
      console.error('Error loading dynamic room schema:', error)
      return null
    }
  }
  
  return {
    loadHotelSchema,
    loadRoomSchema
  }
}

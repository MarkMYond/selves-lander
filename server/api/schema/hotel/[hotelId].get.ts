export default defineEventHandler(async (event) => {
  const { hotelId } = getRouterParams(event)
  const config = useRuntimeConfig()

  try {
    // Fetch hotel data from Payload CMS
    const hotel = await $fetch<any>(`${config.public.payloadApiUrl}/api/hotels/${hotelId}`)
    
    if (!hotel) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Hotel not found'
      })
    }

    // Generate Hotel schema dynamically
    const hotelSchema = {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": hotel.name,
      "description": hotel.description,
      
      // Geo coordinates
      ...(hotel.coordinates && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": hotel.coordinates.lat || hotel.coordinates.latitude,
          "longitude": hotel.coordinates.lng || hotel.coordinates.longitude
        }
      }),
      
      // Check-in/out times
      ...(hotel.checkin_time && { "checkinTime": hotel.checkin_time }),
      ...(hotel.checkout_time && { "checkoutTime": hotel.checkout_time }),
      
      // Price range
      ...(hotel.price_tier && { "priceRange": hotel.price_tier }),
      
      // Hotel images
      ...(hotel.media && hotel.media.length > 0 && {
        "image": hotel.media.slice(0, 5).map((media: any) => media.url)
      }),
      
      // Hotel amenities/facilities - comprehensive mapping
      ...(hotel.facilities && hotel.facilities.length > 0 && {
        "amenityFeature": hotel.facilities.map((facility: any) => ({
          "@type": "LocationFeatureSpecification",
          "name": facility.name || facility,
          "value": facility.available !== false
        }))
      }),
      
      // Reviews - comprehensive
      ...(hotel.reviews && hotel.reviews.average_score && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": hotel.reviews.average_score.toString(),
          "bestRating": "10",
          ...(hotel.reviews.score_breakdown && {
            "reviewAspect": Object.entries(hotel.reviews.score_breakdown).map(([key, value]) => `${key}: ${value}`)
          })
        }
      }),
      
      // Additional properties - comprehensive
      "additionalProperty": [
        // Walk score
        ...(hotel.walk_score ? [{ 
          "@type": "PropertyValue", 
          "name": "Walk Score", 
          "value": hotel.walk_score 
        }] : []),
        
        // Vibe tags
        ...(hotel.vibe && hotel.vibe.length > 0 ? hotel.vibe.map((v: string) => ({ 
          "@type": "PropertyValue", 
          "name": "Vibe", 
          "value": v 
        })) : []),
        
        // Facts
        ...(hotel.facts && Object.entries(hotel.facts).map(([key, value]) => ({ 
          "@type": "PropertyValue", 
          "name": key.charAt(0).toUpperCase() + key.slice(1), 
          "value": value 
        })) || [])
      ].filter(prop => prop),
      
      // Points of interest
      ...(hotel.poi && hotel.poi.length > 0 && {
        "touristAttraction": hotel.poi.map((poi: any) => ({
          "@type": "TouristAttraction",
          "name": poi.name,
          "description": poi.description,
          "timeRequired": `PT${poi.time_mins || poi.timeRequired || 15}M`
        }))
      }),
      
      // Timestamps
      "dateCreated": hotel.createdAt || new Date().toISOString(),
      "dateModified": hotel.updatedAt || new Date().toISOString()
    }

    // Set proper headers
    setHeader(event, 'Content-Type', 'application/ld+json')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    
    return hotelSchema
  } catch (error: any) {
    console.error('Error generating hotel schema:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to generate hotel schema'
    })
  }
})

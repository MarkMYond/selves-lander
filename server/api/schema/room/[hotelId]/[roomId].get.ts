export default defineEventHandler(async (event) => {
  const { hotelId, roomId } = getRouterParams(event)
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

    // Find the specific room
    const room = hotel.rooms?.find((r: any) => 
      r.id === roomId || 
      r.roomId?.toString() === roomId || 
      r.name?.toLowerCase().replace(/\s+/g, '-') === roomId
    )

    if (!room) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Room not found'
      })
    }

    // Generate HotelRoom schema dynamically
    const roomSchema = {
      "@context": "https://schema.org",
      "@type": "HotelRoom",
      "name": room.name || `Room ${roomId}`,
      "identifier": room.roomId || roomId,
      "description": room.description || `${room.name || 'Room'} at ${hotel.name}`,
      
      // Bed details - extract from basics array
      ...(room.basics && room.basics.find(b => b.includes('KING') || b.includes('QUEEN') || b.includes('TWIN')) && {
        "bed": {
          "@type": "BedDetails",
          "typeOfBed": room.basics.find(b => b.includes('KING')) ? "King" : 
                      room.basics.find(b => b.includes('QUEEN')) ? "Queen" : "Twin"
        }
      }),
      
      // Floor size - extract from basics array  
      ...(room.basics && room.basics.find(b => b.includes('sq ft')) && {
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": parseInt(room.basics.find(b => b.includes('sq ft')).match(/\d+/)[0]),
          "unitCode": "FTK"
        }
      }),
      
      // Occupancy - extract from basics array
      ...(room.basics && room.basics.find(b => b.includes('Sleeps')) && {
        "occupancy": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": parseInt(room.basics.find(b => b.includes('Sleeps')).match(/\d+/g)?.[1] || 2)
        }
      }),
      
      // Pricing - extract from basics array (simple starting price)
      ...(room.basics && room.basics.find((b: any) => b.includes('£')) && {
        "offers": {
          "@type": "Offer",
          "description": room.basics.find((b: any) => b.includes('£')).match(/(From £\d+)/)?.[0] || 'From £320',
          "price": room.basics.find((b: any) => b.includes('£')).match(/£(\d+)/)?.[1] || "320",
          "priceCurrency": "GBP"
        }
      }),
      
      // Images from hotel media
      ...(hotel.media && hotel.media.length > 0 && {
        "image": hotel.media.slice(0, 3).map((media: any) => media.url)
      }),
      
      // Search queries - room level keywords for SEO
      ...(room.searchQueries && room.searchQueries.length > 0 && {
        "keywords": room.searchQueries.join(", ")
      }),
      
      // Room amenities
      ...(room.amenities && room.amenities.length > 0 && {
        "amenityFeature": room.amenities.map((amenity: string) => ({
          "@type": "LocationFeatureSpecification",
          "name": amenity,
          "value": true
        }))
      }),
      
      // Additional properties - comprehensive
      "additionalProperty": [
        // Unique features
        ...(room.uniqueFeatures ? room.uniqueFeatures.map((feature: string) => ({ 
          "@type": "PropertyValue", 
          "name": "Unique Features", 
          "value": feature
        })) : []),
        
        // Room grade
        ...(room.grade ? [{ 
          "@type": "PropertyValue", 
          "name": "Room Grade", 
          "value": room.grade 
        }] : []),
        
        // Ideal for
        ...(room.idealFor ? [{ 
          "@type": "PropertyValue", 
          "name": "Ideal For", 
          "value": room.idealFor.join('; ')
        }] : []),
        
        // Not best for
        ...(room.notBestFor ? [{ 
          "@type": "PropertyValue", 
          "name": "Not Best For", 
          "value": room.notBestFor.join('; ')
        }] : [])
      ].filter(prop => prop),
      
      // Hotel as containedInPlace
      "containedInPlace": {
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
        
        // Hotel amenities
        ...(hotel.facilities && hotel.facilities.length > 0 && {
          "amenityFeature": hotel.facilities.map((facility: any) => ({
            "@type": "LocationFeatureSpecification",
            "name": facility.name || facility,
            "value": facility.available !== false
          }))
        }),
        
        // Reviews
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
        
        // Points of interest
        ...(hotel.poi && hotel.poi.length > 0 && {
          "touristAttraction": hotel.poi.map((poi: any) => ({
            "@type": "TouristAttraction",
            "name": poi.name,
            "description": poi.description,
            "timeRequired": `PT${poi.time_mins || 15}M`
          }))
        })
      },
      
      // Timestamps
      "dateCreated": hotel.createdAt || new Date().toISOString(),
      "dateModified": hotel.updatedAt || new Date().toISOString()
    }

    // Set proper headers
    setHeader(event, 'Content-Type', 'application/ld+json')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    
    return roomSchema
  } catch (error: any) {
    console.error('Error generating room schema:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to generate room schema'
    })
  }
})

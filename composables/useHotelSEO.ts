/**
 * SEO composable for hotel guide pages
 * Handles dynamic meta tags, JSON-LD structured data, and OpenGraph
 */
export const useHotelSEO = () => {
  const { $seo } = useNuxtApp()
  
  const setHotelSEO = (hotel: any, roomData?: any) => {
    const route = useRoute()
    const config = useRuntimeConfig()
    
    // Determine if this is a room page or hotel page
    const isRoomPage = !!roomData
    const pageType = isRoomPage ? 'room' : 'hotel'
    
    // Base URL construction
    const baseUrl = config.public.siteUrl
    const currentPath = route.path
    const canonicalUrl = `${baseUrl}${currentPath}`
    
    // Title construction
    let title = hotel.name
    if (isRoomPage && roomData.room) {
      title = `${roomData.room.name} - ${hotel.name} | ${config.public.siteName}`
    } else {
      title = `${hotel.name} | Hotel Guide | ${config.public.siteName}`
    }
    
    // Description construction
    let description = hotel.description || `Explore ${hotel.name} with detailed amenities, room options, and local insights.`
    if (isRoomPage && roomData.room) {
      description = roomData.room.description || `${roomData.room.name} at ${hotel.name} - detailed room information, amenities, and booking insights.`
    }
    
    // Truncate description for meta
    description = description.length > 160 
      ? description.substring(0, 157) + '...' 
      : description
    
    // Keywords construction
    const keywords = []
    if (hotel.name) keywords.push(hotel.name.toLowerCase())
    if (hotel.mainDetails?.location) keywords.push(hotel.mainDetails.location.toLowerCase())
    if (isRoomPage && roomData.room?.name) keywords.push(roomData.room.name.toLowerCase())
    keywords.push('hotel', 'accommodation', 'travel', 'booking')
    
    // Image for social sharing
    const ogImage = hotel.media?.primaryImageUrl || `${baseUrl}/logo.svg`
    
    // Set meta tags
    useSeoMeta({
      title,
      description,
      keywords: keywords.join(', '),
      
      // OpenGraph
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl: canonicalUrl,
      ogType: 'website',
  ogSiteName: config.public.siteName,
      
      // Twitter
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
  twitterSite: (config.public as any).twitterHandle || undefined,
      
      // Additional meta
      robots: 'index, follow',
  author: config.public.siteName,
    })
    
    // Set canonical link and theme color
    useHead({
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      meta: [
        { name: 'theme-color', content: '#1E0D43' }
      ]
    })
    
    // Set structured data
    useSchemaOrg([
      // Organization
      defineOrganization({
        name: config.public.siteName,
        url: baseUrl,
        logo: `${baseUrl}/logo.svg`,
        description: 'Comprehensive hotel guides and travel insights',
      }),
      
      // Hotel schema
      defineLocalBusiness({
        '@type': 'LodgingBusiness',
        name: hotel.name,
        description: hotel.description,
        url: canonicalUrl,
        address: hotel.mainDetails?.address ? {
          '@type': 'PostalAddress',
          streetAddress: hotel.mainDetails.address.street,
          addressLocality: hotel.mainDetails.address.city,
          addressRegion: hotel.mainDetails.address.region,
          postalCode: hotel.mainDetails.address.postalCode,
          addressCountry: hotel.mainDetails.address.country,
        } : undefined,
        telephone: hotel.businessInfo?.contact?.phone,
        email: hotel.businessInfo?.contact?.email,
        starRating: hotel.facts?.starRating ? {
          '@type': 'Rating',
          ratingValue: hotel.facts.starRating,
          bestRating: 5,
        } : undefined,
        amenityFeature: hotel.facilities ? Object.keys(hotel.facilities).map(facility => ({
          '@type': 'LocationFeatureSpecification',
          name: facility,
        })) : undefined,
        aggregateRating: hotel.reviews?.aggregate ? {
          '@type': 'AggregateRating',
          ratingValue: hotel.reviews.aggregate.overallScore,
          reviewCount: hotel.reviews.aggregate.totalReviews,
          bestRating: 10,
        } : undefined,
        image: hotel.media?.primaryImageUrl,
        priceRange: hotel.mainDetails?.priceRange,
      }),
      
      // Room schema (if room page)
      ...(isRoomPage && roomData.room ? [
        defineProduct({
          '@type': 'Hotel',
          name: roomData.room.name,
          description: roomData.room.description,
          sku: roomData.room.roomId?.toString(),
          brand: {
            '@type': 'Brand',
            name: hotel.name,
          },
          offers: roomData.room.basics?.find((b: string) => b.includes('£')) ? [{
            '@type': 'Offer',
            price: roomData.room.basics.find((b: string) => b.includes('£'))?.match(/£(\d+)/)?.[1],
            priceCurrency: 'GBP',
            availability: 'https://schema.org/InStock',
          }] : undefined,
          amenityFeature: roomData.room.amenities?.map((amenity: string) => ({
            '@type': 'LocationFeatureSpecification',
            name: amenity,
          })),
        })
      ] : []),
      
      // Breadcrumbs
      defineBreadcrumb({
        itemListElement: [
          { name: 'Home', item: baseUrl },
          { name: 'Hotel Guide', item: `${baseUrl}/guide` },
          { name: hotel.name, item: `${baseUrl}/guide/hotel/${route.params.hotelID || route.params.hotelId}` },
          ...(isRoomPage ? [{ name: roomData.room.name, item: canonicalUrl }] : []),
        ],
      }),
      
      // WebPage
      defineWebPage({
        '@type': 'WebPage',
        name: title,
        description,
        url: canonicalUrl,
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'WebSite',
          name: config.public.siteName,
          url: baseUrl,
        },
        about: {
          '@type': 'Hotel',
          name: hotel.name,
        },
      }),
    ])
  }
  
  return {
    setHotelSEO,
  }
}

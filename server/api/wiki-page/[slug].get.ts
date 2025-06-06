import { defineEventHandler, getRouterParam, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required'
    })
  }

  const config = useRuntimeConfig()
  const payloadApiUrl = config.public.payloadApiFullUrl || 'http://localhost:3333/api'
  
  try {
    const response = await $fetch(`${payloadApiUrl}/wiki-pages`, {
      query: {
        'where[slug][equals]': slug,
        'where[status][equals]': 'published',
        limit: 1,
        depth: 2
      }
    })
    
    return response
  } catch (error) {
    console.error('Error fetching wiki page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch wiki page'
    })
  }
})

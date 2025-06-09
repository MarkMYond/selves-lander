import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Fetch the complete navigation tree from Payload CMS
    const response = await fetch('http://localhost:3333/api/get-wiki-nav-tree')
    
    if (!response.ok) {
      console.error(`Failed to fetch wiki navigation tree: ${response.status} ${response.statusText}`)
      return {
        error: true,
        statusCode: response.status,
        statusMessage: `Failed to fetch navigation tree: ${response.statusText}`
      }
    }
    
    const data = await response.json()
    return data
    
  } catch (error) {
    console.error('Error in get-wiki-nav-tree endpoint:', error)
    return {
      error: true,
      statusCode: 500,
      statusMessage: 'Failed to fetch wiki navigation tree'
    }
  }
})

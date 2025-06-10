import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const url = getRouterParam(event, 'path') || ''
  
  // Handle favicon requests explicitly
  if (url === 'favicon-v2.png' || url === 'favicon.png' || url === 'favicon.ico') {
    try {
      const faviconPath = join(process.cwd(), 'public', 'favicon-v2.png')
      const faviconBuffer = await readFile(faviconPath)
      
      setHeader(event, 'Content-Type', 'image/png')
      setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
      
      return faviconBuffer
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Favicon not found'
      })
    }
  }
  
  // Let other requests pass through
  return
})

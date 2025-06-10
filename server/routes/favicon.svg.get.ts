import { defineEventHandler, setHeader, createError } from 'h3'
import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const faviconPath = join(process.cwd(), 'public', 'favicon.svg')
    const faviconBuffer = await readFile(faviconPath)
    
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000') // 1 year cache
    
    return faviconBuffer
  } catch (error) {
    console.error('Favicon SVG error:', error)
    throw createError({
      statusCode: 404,
      statusMessage: 'Favicon not found'
    })
  }
})

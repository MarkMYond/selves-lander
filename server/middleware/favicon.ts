import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Only handle favicon requests
  if (!url.pathname.match(/^\/favicon(-v2)?\.(png|svg|ico)$/)) {
    return
  }
  
  try {
    let filePath: string
    let contentType: string
    
    // Map request paths to actual files
    if (url.pathname === '/favicon-v2.png' || url.pathname === '/favicon.png') {
      filePath = join(process.cwd(), 'public', 'favicon-v2.png')
      contentType = 'image/png'
    } else if (url.pathname === '/favicon.svg') {
      filePath = join(process.cwd(), 'public', 'favicon.svg')
      contentType = 'image/svg+xml'
    } else if (url.pathname === '/favicon.ico') {
      // Serve PNG as ICO fallback
      filePath = join(process.cwd(), 'public', 'favicon-v2.png')
      contentType = 'image/x-icon'
    } else {
      return
    }
    
    const fileBuffer = await readFile(filePath)
    
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    
    return fileBuffer
  } catch (error) {
    console.error('Favicon middleware error:', error)
    return
  }
})

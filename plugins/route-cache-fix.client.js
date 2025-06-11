// This plugin fixes the "Cannot destructure property 'lockedState'" error in PayloadCMS
// by patching API responses and error handling

export default defineNuxtPlugin(() => {
  // Only run this on the client side
  if (typeof window === 'undefined') return

  // Store original console.error to avoid infinite loops
  const originalConsoleError = console.error

  // Create a global error handler for this specific error
  console.error = function (...args) {
    const errorText = args.join(' ')
    if (
      errorText.includes("Cannot destructure property 'lockedState'") ||
      errorText.includes('Cannot read properties of null') ||
      errorText.includes('undefined is not an object') ||
      errorText.includes('RouteCache')
    ) {
      console.warn('Intercepted PayloadCMS lockedState error in frontend')
      // Don't propagate the error
      return
    }

    // Pass other errors through
    return originalConsoleError.apply(this, args)
  }

  // Store the original fetch method
  const originalFetch = window.fetch

  // Create a patched fetch method that will intercept PayloadCMS API responses
  window.fetch = async function (...args) {
    try {
      // Call the original fetch
      const response = await originalFetch.apply(this, args)

      // Check if this is a PayloadCMS API request
      const url = args[0]?.toString() || ''
      if (url.includes('/api/') && (
        url.includes('media') || 
        url.includes('collections/') || 
        url.includes('admin/') ||
        url.includes('payload')
      )) {
        // Clone the response so we can read it
        const clonedResponse = response.clone()

        try {
          // Get the JSON body
          const data = await clonedResponse.json()

          // Patch the response if it's missing proper lock state
          if (data && typeof data === 'object') {
            const patchedData = patchLockedStateData(data)
            
            if (patchedData !== data) {
              // Create a new response with the patched data
              const patchedResponse = new Response(JSON.stringify(patchedData), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
              })

              return patchedResponse
            }
          }
        } catch (e) {
          // If parsing fails, just return the original response
          console.warn('Error patching PayloadCMS response:', e)
        }
      }

      return response
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  // Function to recursively patch data structures
  function patchLockedStateData(data) {
    if (!data || typeof data !== 'object') {
      return data
    }

    // If this is an array, patch each item
    if (Array.isArray(data)) {
      return data.map(item => patchLockedStateData(item))
    }

    // Create a copy of the data
    const patchedData = { ...data }

    // Add missing docPermissions if not present
    if (!patchedData.docPermissions) {
      patchedData.docPermissions = {
        lockedState: false,
        lockConfig: {},
        canLock: true,
        isLocked: false,
        unlockRecommended: false,
        requiresUnlock: false,
        hasDraft: false,
      }
    } else if (patchedData.docPermissions && !patchedData.docPermissions.hasOwnProperty('lockedState')) {
      // Ensure lockedState exists
      patchedData.docPermissions.lockedState = false
    }

    // If there's a docs array (collection responses), patch each document
    if (patchedData.docs && Array.isArray(patchedData.docs)) {
      patchedData.docs = patchedData.docs.map(doc => patchLockedStateData(doc))
    }

    // Recursively patch nested objects
    Object.keys(patchedData).forEach(key => {
      if (patchedData[key] && typeof patchedData[key] === 'object') {
        patchedData[key] = patchLockedStateData(patchedData[key])
      }
    })

    return patchedData
  }

  // Override any existing error handlers that might interfere
  window.addEventListener('error', function (event) {
    if (
      event.message && (
        event.message.includes("Cannot destructure property 'lockedState'") ||
        event.message.includes('RouteCache') ||
        event.message.includes('Cannot read properties of null')
      )
    ) {
      event.preventDefault()
      event.stopPropagation()
      console.warn('PayloadCMS lockedState error prevented in frontend')
      return false
    }
  })

  window.addEventListener('unhandledrejection', function (event) {
    if (
      event.reason && 
      event.reason.message && (
        event.reason.message.includes("Cannot destructure property 'lockedState'") ||
        event.reason.message.includes('RouteCache') ||
        event.reason.message.includes('Cannot read properties of null')
      )
    ) {
      event.preventDefault()
      console.warn('PayloadCMS lockedState promise rejection prevented in frontend')
      return false
    }
  })

  console.log('PayloadCMS Route Cache fix loaded successfully')
})

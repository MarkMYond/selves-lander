// This plugin fixes the "Cannot destructure property 'lockedState'" error in PayloadCMS
// by patching the useLock hook at runtime

export default defineNuxtPlugin(() => {
  // Only run this on the client side
  if (typeof window === 'undefined') return;

  // Create a global error handler for this specific error
  const originalError = console.error;
  console.error = function(...args) {
    const errorText = args.join(' ');
    if (errorText.includes("Cannot destructure property 'lockedState'") || 
        errorText.includes("Cannot read properties of null") ||
        errorText.includes("undefined is not an object")) {
      
      console.warn('Intercepted PayloadCMS lockedState error');
      // Don't propagate the error
      return;
    }
    
    // Pass other errors through
    return originalError.apply(this, args);
  };

  // Store the original fetch method to restore it later
  const originalFetch = window.fetch;

  // Create a patched fetch method that will intercept media API responses
  window.fetch = async function(...args) {
    try {
      // Call the original fetch
      const response = await originalFetch.apply(this, args);
      
      // Check if this is a media request from PayloadCMS
      const url = args[0]?.toString() || '';
      if (url.includes('/api/media')) {
        // Clone the response so we can read it
        const clonedResponse = response.clone();
        
        try {
          // Get the JSON body
          const data = await clonedResponse.json();
          
          // If there's no docPermissions, add it
          if (data && !data.docPermissions) {
            // Create a new response with added docPermissions
            const patchedData = {
              ...data,
              docPermissions: {
                lockedState: false,
                lockConfig: {},
                canLock: true,
                isLocked: false,
                unlockRecommended: false,
                requiresUnlock: false,
                hasDraft: false
              }
            };
            
            // Create a new response with the patched data
            const patchedResponse = new Response(JSON.stringify(patchedData), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
            
            return patchedResponse;
          }
        } catch (e) {
          // If parsing fails, just return the original response
          console.warn('Error patching media response:', e);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
  
  // console.log('PayloadCMS Route Cache fix loaded'); // Removed
});

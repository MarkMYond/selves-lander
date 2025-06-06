// Plugin to process rich text links marked with data-nuxt-link and make them behave like NuxtLink
// Works client-side only (hence the .client.js extension)

export default defineNuxtPlugin((nuxtApp) => {
  // Hook into app:mounted to ensure the DOM is ready
  nuxtApp.hook('app:mounted', () => {
    // Initial processing of links when the app first loads
    processNuxtLinks()

    // Set up a MutationObserver to watch for dynamically added content
    const observer = new MutationObserver((mutations) => {
      // Check if we need to process new links
      let hasNewLinks = false
      mutations.forEach((mutation) => {
        // If nodes were added, process
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          hasNewLinks = true
        }
      })

      if (hasNewLinks) {
        processNuxtLinks()
      }
    })

    // Start observing the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })

  function processNuxtLinks() {
    // Find all links with the data-nuxt-link attribute
    const links = document.querySelectorAll('a[data-nuxt-link]')

    links.forEach((link) => {
      // If we've already processed this link, skip it
      if (link.hasAttribute('data-nuxt-link-processed')) {
        return
      }

      // Mark this link as processed to avoid duplicating event listeners
      link.setAttribute('data-nuxt-link-processed', 'true')

      // Add click event listener to handle client-side navigation
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href')

        // Skip if no href or it's a hash link
        if (!href || href === '#' || href.startsWith('javascript:')) {
          return
        }

        // Only handle internal links
        if (href.startsWith('/')) {
          event.preventDefault()
          // Use the Nuxt router to navigate
          nuxtApp.$router.push(href)
        }
      })
    })
  }
})

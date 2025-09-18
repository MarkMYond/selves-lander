// Inject Tidio chat script on the client only, but defer to idle/user interaction
export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const inject = () => {
    if (document.getElementById('tidio-script')) return
    const script = document.createElement('script')
    script.id = 'tidio-script'
    script.src = '//code.tidio.co/qitfqdnsbwrh4mrth92l8yns3dsznpwg.js'
    script.async = true
    document.head.appendChild(script)
  }

  // Prefer idle callback for minimal impact; fallback to timeout
  if ('requestIdleCallback' in window) {
    ;(window as any).requestIdleCallback(inject, { timeout: 5000 })
  } else {
    setTimeout(inject, 3000)
  }

  // Also inject on first user interaction (ensures loading if user engages quickly)
  const onFirstInteraction = () => {
    inject()
    window.removeEventListener('scroll', onFirstInteraction)
    window.removeEventListener('mousemove', onFirstInteraction)
    window.removeEventListener('touchstart', onFirstInteraction)
    window.removeEventListener('keydown', onFirstInteraction)
  }
  window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true })
  window.addEventListener('mousemove', onFirstInteraction, { once: true })
  window.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true })
  window.addEventListener('keydown', onFirstInteraction, { once: true })
})

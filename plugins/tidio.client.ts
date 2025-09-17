// Inject Tidio chat script on the client only
export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  // Avoid duplicate injection during HMR or navigation
  if (document.getElementById('tidio-script')) return

  const script = document.createElement('script')
  script.id = 'tidio-script'
  script.src = '//code.tidio.co/qitfqdnsbwrh4mrth92l8yns3dsznpwg.js'
  script.async = true
  document.head.appendChild(script)
})

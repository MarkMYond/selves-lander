// Global SEO configuration and organization schema
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const siteName = config.public.siteName || 'Site'
  const siteUrl = (config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
  // Add global organization schema
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
          logo: `${siteUrl}/logo.svg`,
          description: 'AI-ready hospitality infrastructure connecting venues to intelligent travel agents.',
          foundingDate: '2024',
          industry: 'Travel Technology',
          sameAs: [
            // Add social media links when available
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            url: `${siteUrl}/book-a-demo`,
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'GB',
          },
        }),
      },
    ],
  })
})

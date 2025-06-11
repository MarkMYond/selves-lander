// Global SEO configuration and organization schema
export default defineNuxtPlugin(() => {
  // Add global organization schema
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Taash',
          url: 'https://taash.ai',
          logo: 'https://taash.ai/logo.svg',
          description: 'AI-ready hospitality infrastructure connecting venues to intelligent travel agents.',
          foundingDate: '2024',
          industry: 'Travel Technology',
          sameAs: [
            // Add social media links when available
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            url: 'https://taash.ai/book-a-demo',
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

// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css', // Added to load Satoshi variable fonts
    // Webflow CSS removed as per user request. Site will rely on Tailwind.
    // '~/assets/css/webflow/normalize.css',
    // '~/assets/css/webflow/webflow.css',
    // '~/assets/css/webflow/taash.webflow.css',
  ],
  devtools: { enabled: true },

  runtimeConfig: {
    // Keys within public are also exposed client-side
    public: {
      // Base Payload URL (without /api suffix)
      payloadApiUrl: (process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 'https://cms.taash.ai').replace(/\/$/, ''),
      // Full Payload API URL (with /api suffix)
      payloadApiFullUrl: `${(process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 'https://cms.taash.ai').replace(/\/$/, '')}/api`,
      // SEO config
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://taash.ai', // This is already correct
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Taash'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss', // Restore Tailwind module
    'nuxt-icon',           // Nuxt icon module (correct package name)
    '@pinia/nuxt',
    '@nuxt/image',         // Add image optimization
  ],

  icon: {
    // Configure for Phosphor icons
    packs: ['ph'],
    aliases: {
      // Add common duotone icons as aliases for easier usage
      'user-duotone': 'ph:user-duotone',
      'house-duotone': 'ph:house-duotone',
      'heart-duotone': 'ph:heart-duotone',
      'lightning-duotone': 'ph:lightning-duotone',
      'star-duotone': 'ph:star-duotone'
    },
    // Set default icon set behavior
    class: 'nuxt-icon'
  },
  
  // Plugins configuration
  plugins: [
    '~/plugins/phosphor-icons.ts' // Restored Phosphor icons plugin
  ],

  // Optimize for production
  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    },
    prerender: {
      crawlLinks: false, // Set this to false
      routes: [
        '/' // Only prerender the home page
      ],
      ignore: [
        '/wiki',
        '/registry',
        '/wiki/**',
        '/registry/**',
        '/**/_payload.json'
      ],
      failOnError: false // Prevent prerender errors from failing the build
    },
    // Ensure the wiki-navigation.json file is available during build
    publicAssets: [
      {
        dir: 'public',
        baseURL: '/'
      }
    ],
    // Add specific routeRules inside nitro for more control
    routeRules: {
      '/': { ssr: true },            // Added from root rules
      '/wiki': { ssr: true },        // Added from root rules
      '/wiki/**': { swr: 3600, ssr: true }, // Added cache for wiki pages (1 hour)
      '/registry': { ssr: true },    // Added from root rules
      '/registry/**': { swr: 3600, ssr: true }, // Added cache for registry pages (1 hour)
      // Static assets can be cached for longer
      '/favicon.svg': { cache: { maxAge: 60 * 60 * 24 * 30 } }, // 30 days
      '/_nuxt/**': { cache: { maxAge: 60 * 60 * 24 * 30 } }, // 30 days
      // Removed '/**/_payload.json': { ssr: false, prerender: false }
    },
    // Add Vercel-specific optimizations
    preset: 'vercel'
  },

  // Performance optimization
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    asyncContext: true,
    // Add more aggressive route handling
    // inlineSSRStyles: true // Removed due to TS error
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [ // Add link tag for favicon
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ],
      script: [
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MS2DN2ZJ');`,
          type: 'text/javascript' // Removed charset
        }
      ],
      noscript: [
        { 
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MS2DN2ZJ"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          // Removed body: true to resolve TS error; Nuxt will place it, likely in head or end of body.
          // For precise placement after <body>, a plugin or app.vue modification would be needed.
        }
      ]
    },
    // Add performance related attributes
    rootId: '__nuxt',
    cdnURL: process.env.NUXT_PUBLIC_CDN_URL || '',
  },


  postcss: {
    plugins: {
      autoprefixer: {}
    }
  },

  // Component auto-imports
  components: [
    // Add entry for the base components directory
    {
      path: '~/components',
      pathPrefix: false, // Don't add 'components' prefix
    },
    // Wiki components
    {
      path: '~/components/wiki',
      extensions: ['.vue'],
      prefix: '',
      pathPrefix: false,
    },
    // Payload blocks components (if they exist)
    {
      path: '~/components/payload-blocks',
      extensions: ['.vue'],
      prefix: '',
      pathPrefix: false,
    }
  ],

  compatibilityDate: '2025-04-24',

  // Enable server-side rendering for better SEO and initial page load
  ssr: true,

  // Root-level routeRules removed - consolidated into nitro.routeRules

  // Performance - render client components only when needed
  vite: {
    optimizeDeps: {
      include: [
        'vue',
        'vue-router'
      ],
      exclude: [
        'payload', // Exclude payload from optimization to prevent build errors
        'bson-objectid' // Exclude bson-objectid as well
      ]
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      cssMinify: true,
      // Improve chunking strategy
      rollupOptions: {
        output: {
          // Remove manual chunks entirely as they're causing import issues
          manualChunks: undefined
        }
      },
      // Reduce polyfill size
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    // Use Watchman for more efficient file watching
    server: {
      watch: {
        // usePolling: false, // Let Vite decide polling
        // useFsEvents: false, // Allow Vite/Watchman to handle events (removed this line)
        ignored: [
          '**/.git/**',
          '**/node_modules/**',
          '**/.nuxt/**',
          '**/.output/**',
          // Removed '**/sanity-studio/**' ignore rule
        ]
      }
    }
  },
  // Trigger Vercel deploy
})

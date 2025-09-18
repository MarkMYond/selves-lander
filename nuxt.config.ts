export default defineNuxtConfig({
  app: {
    head: {
      title: process.env.NUXT_PUBLIC_SITE_NAME ? `${process.env.NUXT_PUBLIC_SITE_NAME}` : 'Site',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // { hid: 'description', name: 'description', content: 'Your page description here.' }
      ],
      link: [
        { rel: 'alternate', type: 'application/ld+json', href: '/api/room-data.json' }
      ],
      script: [
        // elevenlabs widget removed
      ]
    }
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://selves.uk',
  },
  css: [
    '~/assets/css/main.css',
  ],
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      payloadApiUrl: (
        process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 
        'http://localhost:3333'
      ).replace(/\/$/, ''),
      payloadApiFullUrl: `${(process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3333').replace(/\/$/, '')}/api`,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Site',
    },
  },

  modules: [
  '@nuxtjs/tailwindcss',
  'nuxt-icon', // Ensure nuxt-icon is active
  '@pinia/nuxt',
  '@nuxt/image',
  '@nuxtjs/sitemap', // Added sitemap module
  '@nuxtjs/seo', // SEO optimization module
  ],

  // Disable problematic SEO features
  ogImage: {
    enabled: false, // Disable OG image generation to avoid the error
  },

  sitemap: { 
    hostname: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000', 
    gzip: true,
    sources: [
      '/api/__sitemap__/urls'
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    urls: [
      // Add high-priority static pages
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/book-a-demo', changefreq: 'monthly', priority: 0.8 },
    ],
    exclude: [ 
      '/admin/**',
      '/api/**',
      '/_nuxt/**',
    ],
  },

  // SEO Configuration for hotel guide pages
  seo: {
    automaticDefaults: false, // Custom control over meta tags
    fallbackTitle: false, // Disable fallback title
    templateParams: {}, // Empty template params to avoid conflicts
    defaultSeoMeta: {
      title: `${process.env.NUXT_PUBLIC_SITE_NAME || 'Site'} - Hotel Guide`,
      description: 'Comprehensive hotel guides with detailed room information, amenities, and local insights.',
      ogImage: '/logo.svg',
      themeColor: '#1E0D43',
    },
  },


  icon: { 
    // packs: ['ph'], // Remove packs to avoid loading all icons
    aliases: {
      'user-duotone': 'ph:user-duotone',
      'house-duotone': 'ph:house-duotone',
      'heart-duotone': 'ph:heart-duotone',
      'lightning-duotone': 'ph:lightning-duotone',
      'star-duotone': 'ph:star-duotone',
    },
    class: 'nuxt-icon',
  },

  plugins: [
  ],

  nitro: {
    esbuild: {
      options: {
        target: 'node20',
      },
    },
    minify: true, // Always minify for clean output
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    storage: {
      // Disable dev storage
    },
    experimental: {
      wasm: false, // Disable WASM for cleaner builds
    },
    prerender: {
      crawlLinks: true, // Enable crawling for automatic discovery
      routes: [
        '/',
        '/wiki', // Enable prerendering for wiki home
        '/registry', // Enable prerendering for registry home
      ],
      ignore: [
        '/**/_payload.json',
      ],
      failOnError: false,
    },
    publicAssets: [
      {
        dir: 'public',
        baseURL: '/',
      },
    ],
    routeRules: {
      '/': { ssr: true },
      '/wiki': { prerender: true }, // Static prerendering for ultra-fast loading
      '/wiki/**': { 
        prerender: true, // Enable static generation for all wiki pages
        headers: { 'cache-control': 'public, max-age=3600, immutable' } // Long cache for static content
      },
      '/registry': { prerender: true }, // Static prerendering for ultra-fast loading
      '/registry/**': { 
        prerender: true, // Enable static generation for all registry pages
        headers: { 'cache-control': 'public, max-age=3600, immutable' } // Long cache for static content
      },
      // Hotel guide pages - SSR with caching for SEO
      '/guide/hotel/**': { 
        ssr: true, // Server-side render for SEO
        headers: { 
          'cache-control': 'public, max-age=300, s-maxage=3600', // 5 min browser, 1 hour CDN
          'vary': 'Accept-Encoding',
        },
        experimentalNoScripts: false, // Keep scripts for interactivity
      },
      '/guide/room/**': { 
        ssr: true, // Server-side render for SEO
        headers: { 
          'cache-control': 'public, max-age=300, s-maxage=3600', // 5 min browser, 1 hour CDN
          'vary': 'Accept-Encoding',
        },
        experimentalNoScripts: false, // Keep scripts for interactivity
      },
      '/pricing': { prerender: true }, // Static page can be prerendered
      '/book-a-demo': { prerender: true }, // Static page can be prerendered
      '/favicon-v2.png': { headers: { 'cache-control': 'public, max-age=0, must-revalidate', 'content-type': 'image/png' } },
      '/_nuxt/**': { cache: { maxAge: 60 * 60 * 24 * 30 } },
    },
  },

  experimental: {
    asyncContext: true,
  },


  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/wiki',
      extensions: ['.vue'],
      prefix: '',
      pathPrefix: false,
    },
    {
      path: '~/components/payload-blocks',
      extensions: ['.vue'],
      prefix: '',
      pathPrefix: false,
    },
  ],

    vue: {
      compilerOptions: {
  // elevenlabs widget removed
      },
    },

  compatibilityDate: '2025-04-24',

  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      exclude: [
        'payload',
        'bson-objectid',
      ],
    },
    build: {
      target: 'esnext',
      minify: 'terser', // Always minify
      cssMinify: true, // Always minify CSS
      rollupOptions: {
        output: {
          manualChunks: undefined,
          // Clean asset names
          assetFileNames: '_nuxt/[name].[hash][extname]',
          chunkFileNames: '_nuxt/[name].[hash].js',
          entryFileNames: '_nuxt/[name].[hash].js'
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      terserOptions: {
        format: {
          comments: false, // Strip comments
          beautify: false, // No formatting
        },
        compress: {
          drop_console: true, // Remove console logs
          drop_debugger: true, // Remove debuggers
          pure_funcs: ['console.log', 'console.info'],
        },
        mangle: {
          safari10: true,
        },
      },
    },
    server: {
      watch: {
        ignored: [
          '**/.git/**',
          '**/node_modules/**',
          '**/.nuxt/**',
          '**/.output/**',
        ],
      },
    },
    // Force production-like behavior in dev
    define: {
      __DEV__: false,
      'process.env.NODE_ENV': '"production"',
    },
  },
})

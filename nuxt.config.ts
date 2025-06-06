export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css',
  ],
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      payloadApiUrl: (
        process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 'https://cms.taash.ai'
      ).replace(/\/$/, ''),
      payloadApiFullUrl: `${(process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 'https://cms.taash.ai').replace(/\/$/, '')}/api`,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://taash.ai',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Taash',
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  icon: {
    // packs: ['ph'], // Temporarily remove to test EMFILE issue
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
    '~/plugins/phosphor-icons.ts',
  ],

  nitro: {
    esbuild: {
      options: {
        target: 'node20',
      },
    },
    preset: 'vercel',
    vercel: {
      functions: {
        runtime: 'nodejs20.x',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: [
        '/',
      ],
      ignore: [
        '/wiki', // Keep base ignored for now as it's SSR
        '/registry', // Keep base ignored for now as it's SSR
        // '/wiki/**', // Attempt not ignoring dynamic CSR routes
        '/registry/**',
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
  },

  routeRules: {
    '/': { ssr: true },
    '/wiki': { ssr: true },
    '/wiki/**': { ssr: true }, // Enable SSR for wiki sub-pages
    '/registry': { ssr: true },
    '/registry/**': { ssr: true }, // Enable SSR for registry sub-pages
    '/favicon.svg': { cache: { maxAge: 60 * 60 * 24 * 30 } },
    '/_nuxt/**': { cache: { maxAge: 60 * 60 * 24 * 30 } },
  },

  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    asyncContext: true,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MS2DN2ZJ');`,
          type: 'text/javascript',
        },
      ],
      noscript: [
        {
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MS2DN2ZJ"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        },
      ],
    },
    rootId: '__nuxt',
    cdnURL: process.env.NUXT_PUBLIC_CDN_URL || '',
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

  compatibilityDate: '2025-04-24',

  ssr: true,

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
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
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
  },
})

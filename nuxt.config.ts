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
      // sitemap configuration removed from here
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon', // Ensure nuxt-icon is active
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/sitemap', // Added sitemap module
  ],

  sitemap: { 
    hostname: 'https://taash.ai', 
    gzip: true,
    routes: async () => {
      console.log('[Sitemap] Starting dynamic route generation...');
      const dynamicRoutes: { url: string; lastmod?: string }[] = [];
      const payloadApiUrl = (process.env.NUXT_PUBLIC_PAYLOAD_API_URL || 'https://cms.taash.ai').replace(/\/$/, '');
      console.log(`[Sitemap] Using Payload API URL: ${payloadApiUrl}`);

      // Helper function to get full path for hierarchical collections
      const getFullPath = (pageId: string, pagesMap: Map<string, { slug: string; parent?: string | { id: string } }>): string => {
        const page = pagesMap.get(pageId);
        if (!page) return '';
        let pathSegments: string[] = [page.slug];
        let currentPage = page;
        while (currentPage.parent) {
          const parentId = typeof currentPage.parent === 'string' ? currentPage.parent : currentPage.parent.id;
          const parentPage = pagesMap.get(parentId);
          if (parentPage) {
            pathSegments.unshift(parentPage.slug);
            currentPage = parentPage;
          } else {
            break; // Parent not found, stop
          }
        }
        return pathSegments.join('/');
      };

      const collectionsToFetch = [
        { slug: 'web-pages', pathPrefix: '', isHierarchical: false }, 
        { slug: 'wiki-pages', pathPrefix: '/wiki', isHierarchical: true },
        { slug: 'registry-pages', pathPrefix: '/registry', isHierarchical: true } 
      ];

      for (const collection of collectionsToFetch) {
        try {
          console.log(`[Sitemap] Fetching data for collection: ${collection.slug}`);
          const queryParams = 'limit=0&depth=0&select=id,slug,updatedAt' + 
                              (collection.isHierarchical ? ',parent' : '') +
                              '&where[status][equals]=published&where[meta.noIndex][not_equals]=true';
          
          const response = await $fetch<{ docs: { id: string; slug: string; updatedAt: string; parent?: string | { id: string } }[] }>(
            `${payloadApiUrl}/api/${collection.slug}?${queryParams}`
          );
          console.log(`[Sitemap] Fetched ${response.docs?.length || 0} documents for ${collection.slug}.`);

          if (response.docs) {
            if (collection.isHierarchical) {
              const pagesMap = new Map(response.docs.map(doc => [doc.id, doc]));
              response.docs.forEach(page => {
                const fullPath = getFullPath(page.id, pagesMap);
                if (fullPath) {
                  dynamicRoutes.push({ 
                    url: `${collection.pathPrefix}/${fullPath}`, 
                    lastmod: page.updatedAt 
                  });
                }
              });
            } else { // For non-hierarchical like web-pages
              response.docs.forEach(page => {
                const pageUrl = page.slug === 'home' ? '/' : `${collection.pathPrefix}/${page.slug}`;
                dynamicRoutes.push({ 
                  url: pageUrl, 
                  lastmod: page.updatedAt 
                });
              });
            }
          }
        } catch (e) {
          console.error(`[Sitemap] Error fetching sitemap data for ${collection.slug}:`, e);
        }
      }
      console.log(`[Sitemap] Generated ${dynamicRoutes.length} dynamic routes:`, JSON.stringify(dynamicRoutes.slice(0, 5), null, 2) + (dynamicRoutes.length > 5 ? '...' : '')); // Log first 5 routes
      return dynamicRoutes;
    },
    defaults: {
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    // exclude: [ '/admin/**' ],
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
    '~/plugins/phosphor-icons.ts', // Ensure this plugin is active
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
    routeRules: {
      '/': { ssr: true },
      '/wiki': { ssr: true },
      '/wiki/**': { ssr: false }, // Force client-side rendering for sub-pages
      '/registry': { ssr: true },
      '/registry/**': { ssr: false }, // Force client-side rendering for sub-pages
      '/favicon-v2.png': { headers: { 'cache-control': 'public, max-age=0, must-revalidate', 'content-type': 'image/png' } },
      '/_nuxt/**': { cache: { maxAge: 60 * 60 * 24 * 30 } },
    },
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
        { rel: 'icon', type: 'image/png', href: '/favicon-v2.png' },
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

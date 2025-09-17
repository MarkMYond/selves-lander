import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string) || 'http://localhost:3000'
  const sitemapIndexUrls = [
    {
      sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
      lastmod: new Date().toISOString(),
    },
  ];

  return sitemapIndexUrls;
});

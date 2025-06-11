import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const sitemapIndexUrls = [
    {
      sitemap: 'https://taash.ai/sitemap.xml',
      lastmod: new Date().toISOString(),
    },
  ];

  return sitemapIndexUrls;
});

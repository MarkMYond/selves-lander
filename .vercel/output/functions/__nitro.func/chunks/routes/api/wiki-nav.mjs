import { d as defineEventHandler, g as getQuery, u as useRuntimeConfig, c as createError } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'node:url';
import 'ipx';

const wikiNav = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const parentId = query.parentId?.toString();
  const config = useRuntimeConfig(event);
  const payloadApiFullUrl = config.public.payloadApiFullUrl || "https://taash-payld.vercel.app/api";
  try {
    if (parentId) {
      const url = `${payloadApiFullUrl}/wiki-pages?where[parent][equals]=${parentId}&where[status][equals]=published&sort=sort`;
      console.log(`Fetching wiki page children for parent ID ${parentId} from: ${url}`);
      const response = await $fetch(url);
      if (!response || !response.docs) {
        console.error(`No children found for parent ID: ${parentId}`);
        return [];
      }
      return response.docs.map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        icon: page.icon,
        hasChildren: false,
        // We don't check for grandchildren for simplicity
        isCategory: false
      }));
    }
    const cacheUrl = `${payloadApiFullUrl}/navigation-cache?where[section][equals]=wiki&limit=1`;
    console.log(`Fetching wiki navigation from Payload cache: ${cacheUrl}`);
    const cacheResponse = await $fetch(cacheUrl);
    if (!cacheResponse || !cacheResponse.docs || cacheResponse.docs.length === 0) {
      console.warn("No wiki navigation cache found in Payload, falling back to direct navigation API");
      return await $fetch("/api/navigation?section=wiki");
    }
    return cacheResponse.docs[0].navigationData || [];
  } catch (error) {
    console.error("Error fetching wiki navigation:", error.message || error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Error fetching wiki navigation: ${error.message || "Unknown error"}`
    });
  }
});

export { wikiNav as default };
//# sourceMappingURL=wiki-nav.mjs.map

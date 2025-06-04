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

const registryNav = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const parentId = query.parentId?.toString();
  const config = useRuntimeConfig(event);
  const payloadApiFullUrl = config.public.payloadApiFullUrl || "https://taash-payld.vercel.app/api";
  try {
    if (parentId) {
      const url = `${payloadApiFullUrl}/registry-pages?where[parent][equals]=${parentId}&where[status][equals]=published&sort=sort`;
      console.log(`Fetching registry page children for parent ID ${parentId} from: ${url}`);
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
    const cacheUrl = `${payloadApiFullUrl}/navigation-cache?where[section][equals]=registry&limit=1`;
    console.log(`Fetching registry navigation from Payload cache: ${cacheUrl}`);
    const cacheResponse = await $fetch(cacheUrl);
    if (!cacheResponse || !cacheResponse.docs || cacheResponse.docs.length === 0) {
      console.warn("No registry navigation cache found in Payload, falling back to direct navigation API");
      return await $fetch("/api/navigation?section=registry");
    }
    return cacheResponse.docs[0].navigationData || [];
  } catch (error) {
    console.error("Error fetching registry navigation:", error.message || error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Error fetching registry navigation: ${error.message || "Unknown error"}`
    });
  }
});

export { registryNav as default };
//# sourceMappingURL=registry-nav.mjs.map

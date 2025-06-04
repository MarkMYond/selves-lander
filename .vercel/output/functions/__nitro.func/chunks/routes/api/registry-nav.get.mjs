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

const buildPayloadQueryUrl = (baseApiUrl, collection, params) => {
  const endpoint = `${baseApiUrl.replace(/\/api\/?$/, "")}/api/${collection}`;
  const apiQuery = new URLSearchParams();
  for (const key in params) {
    if (key === "where") {
      const whereClauses = params[key];
      for (const field in whereClauses) {
        const condition = whereClauses[field];
        for (const operator in condition) {
          apiQuery.append(`where[${field}][${operator}]`, String(condition[operator]));
        }
      }
    } else {
      apiQuery.append(key, String(params[key]));
    }
  }
  return `${endpoint}?${apiQuery.toString()}`;
};
const registryNav_get = defineEventHandler(async (event) => {
  console.log("[/api/registry-nav] TRACE: Handler invoked (hierarchical logic)");
  const queryParams = getQuery(event);
  const parentId = queryParams.parentId;
  console.log(`[/api/registry-nav] TRACE: parentId from query: ${parentId}`);
  const runtimeConfig = useRuntimeConfig();
  const payloadApiUrl = runtimeConfig.public.payloadApiUrl;
  console.log(`[/api/registry-nav] TRACE: runtimeConfig.public.payloadApiUrl: ${payloadApiUrl}`);
  if (!payloadApiUrl) {
    console.error("[/api/registry-nav] FATAL: payloadApiUrl is not defined in runtime config.");
    throw createError({ statusCode: 500, statusMessage: "Payload API URL is not configured." });
  }
  const whereClauses = {
    status: { equals: "published" },
    isSectionHomepage: { not_equals: true }
  };
  if (parentId) {
    whereClauses.parent = { equals: parentId };
  } else {
    whereClauses.parent = { exists: false };
  }
  const requestUrl = buildPayloadQueryUrl(payloadApiUrl, "registry-pages", {
    // Changed collection to 'registry-pages'
    where: whereClauses,
    sort: "sort",
    limit: 100,
    depth: 0
    // Set depth to 0 as we only need IDs to check for children, parent info is via parentId query
  });
  console.log(`[/api/registry-nav] TRACE: Attempting to fetch parent/sibling items from: ${requestUrl}`);
  try {
    const response = await $fetch(requestUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response || !response.docs) {
      console.warn("[/api/registry-nav] WARN: No docs in response or invalid response from Payload API for parent/siblings.");
      return [];
    }
    console.log(`[/api/registry-nav] TRACE: Received ${response.docs.length} parent/sibling docs from Payload API.`);
    const navItemsPromises = response.docs.map(async (doc) => {
      const childrenCheckUrl = buildPayloadQueryUrl(payloadApiUrl, "registry-pages", {
        // Changed collection to 'registry-pages'
        where: { parent: { equals: doc.id }, status: { equals: "published" }, isSectionHomepage: { not_equals: true } },
        limit: 1,
        depth: 0
        // We only need to know if at least one child exists
      });
      console.log(`[/api/registry-nav] TRACE: Checking children for doc ID ${doc.id} from: ${childrenCheckUrl}`);
      const childrenResponse = await $fetch(childrenCheckUrl);
      const hasChildren = childrenResponse && childrenResponse.totalDocs > 0;
      console.log(`[/api/registry-nav] TRACE: Doc ID ${doc.id} hasChildren: ${hasChildren}`);
      return {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        icon: doc.icon,
        hasChildren
      };
    });
    const navItems = await Promise.all(navItemsPromises);
    console.log("[/api/registry-nav] TRACE: Processed navItems with hasChildren:", navItems.length);
    return navItems;
  } catch (err) {
    const fetchError = err;
    console.error(`[/api/registry-nav] ERROR: Error during registry navigation data processing. Initial URL: ${requestUrl}`, fetchError.message);
    if (fetchError.response) {
      console.error("[/api/registry-nav] ERROR: Payload API Response Status:", fetchError.response.status);
      console.error("[/api/registry-nav] ERROR: Payload API Response Data:", fetchError.response._data);
    }
    throw createError({
      statusCode: fetchError.response?.status || 500,
      statusMessage: "Failed to fetch or process navigation data from Payload API.",
      data: {
        requestUrlSent: requestUrl,
        // Log the first request URL
        originalErrorMessage: fetchError.message,
        payloadApiResponseStatus: fetchError.response?.status
      }
    });
  }
});

export { registryNav_get as default };
//# sourceMappingURL=registry-nav.get.mjs.map

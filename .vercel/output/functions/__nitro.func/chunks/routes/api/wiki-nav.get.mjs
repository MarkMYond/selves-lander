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
        if (typeof condition === "object" && condition !== null) {
          for (const operator in condition) {
            apiQuery.append(`where[${field}][${operator}]`, String(condition[operator]));
          }
        } else {
          apiQuery.append(`where[${field}][equals]`, String(condition));
        }
      }
    } else {
      apiQuery.append(key, String(params[key]));
    }
  }
  return `${endpoint}?${apiQuery.toString()}`;
};
async function getPageChildren(pageId, payloadApiUrl) {
  const childrenUrl = buildPayloadQueryUrl(payloadApiUrl, "wiki-pages", {
    where: {
      parent: { equals: pageId },
      status: { equals: "published" },
      isSectionHomepage: { not_equals: true }
    },
    sort: "sort",
    limit: 100,
    // Assuming max 100 children per page for nav
    depth: 0
  });
  console.log(`[/api/wiki-nav] TRACE: Fetching children for page ${pageId} from: ${childrenUrl}`);
  const childrenResponse = await $fetch(childrenUrl);
  if (!childrenResponse || !childrenResponse.docs) return [];
  const childNavItemsPromises = childrenResponse.docs.map(async (childDoc) => {
    const grandChildrenResponse = await $fetch(buildPayloadQueryUrl(payloadApiUrl, "wiki-pages", {
      where: { parent: { equals: childDoc.id }, status: { equals: "published" }, isSectionHomepage: { not_equals: true } },
      limit: 1,
      depth: 0
    }));
    return {
      id: childDoc.id,
      title: childDoc.title,
      slug: childDoc.slug,
      // pageSlug for clarity in NavItem
      icon: childDoc.icon,
      // pageIcon
      hasChildren: grandChildrenResponse.totalDocs > 0,
      isCategory: false
      // Explicitly a page
    };
  });
  return Promise.all(childNavItemsPromises);
}
const wikiNav_get = defineEventHandler(async (event) => {
  console.log("[/api/wiki-nav] TRACE: Handler invoked");
  const queryParams = getQuery(event);
  const parentId = queryParams.parentId;
  const runtimeConfig = useRuntimeConfig();
  const payloadApiUrl = runtimeConfig.public.payloadApiUrl;
  if (!payloadApiUrl) {
    console.error("[/api/wiki-nav] FATAL: payloadApiUrl is not defined.");
    throw createError({ statusCode: 500, statusMessage: "Payload API URL not configured." });
  }
  try {
    if (parentId) {
      console.log(`[/api/wiki-nav] TRACE: parentId detected: ${parentId}. Fetching page children.`);
      return getPageChildren(parentId, payloadApiUrl);
    }
    console.log("[/api/wiki-nav] TRACE: No parentId. Fetching categories and their top-level pages.");
    const categoriesUrl = buildPayloadQueryUrl(payloadApiUrl, "categories", {
      sort: "sort",
      // Sort categories by their 'sort' field
      limit: 50,
      // Assuming max 50 categories
      depth: 0
      // We only need category IDs and names initially
    });
    console.log(`[/api/wiki-nav] TRACE: Fetching categories from: ${categoriesUrl}`);
    const categoriesResponse = await $fetch(categoriesUrl);
    if (!categoriesResponse || !categoriesResponse.docs) {
      console.warn("[/api/wiki-nav] WARN: No categories found or invalid response.");
      return [];
    }
    console.log(`[/api/wiki-nav] TRACE: Found ${categoriesResponse.docs.length} categories.`);
    const categorizedNavItemsPromises = categoriesResponse.docs.map(async (categoryDoc) => {
      const pagesUrl = buildPayloadQueryUrl(payloadApiUrl, "wiki-pages", {
        where: {
          category: { equals: categoryDoc.id },
          parent: { exists: false },
          // Top-level pages within the category
          status: { equals: "published" },
          isSectionHomepage: { not_equals: true }
        },
        sort: "sort",
        // Sort pages by their 'sort' field
        limit: 100,
        // Assuming max 100 pages per category for nav
        depth: 0
        // Only need basic page info
      });
      console.log(`[/api/wiki-nav] TRACE: Fetching pages for category ${categoryDoc.name} (ID: ${categoryDoc.id}) from: ${pagesUrl}`);
      const pagesResponse = await $fetch(pagesUrl);
      let pageNavItems = [];
      if (pagesResponse && pagesResponse.docs) {
        console.log(`[/api/wiki-nav] TRACE: Found ${pagesResponse.docs.length} pages for category ${categoryDoc.name}.`);
        const pageNavItemPromises = pagesResponse.docs.map(async (pageDoc) => {
          const childrenCheckUrl = buildPayloadQueryUrl(payloadApiUrl, "wiki-pages", {
            where: { parent: { equals: pageDoc.id }, status: { equals: "published" }, isSectionHomepage: { not_equals: true } },
            limit: 1,
            depth: 0
          });
          const childrenResponse = await $fetch(childrenCheckUrl);
          return {
            id: pageDoc.id,
            // Page ID
            title: pageDoc.title,
            slug: pageDoc.slug,
            // Page slug
            icon: pageDoc.icon,
            // Page icon
            hasChildren: childrenResponse.totalDocs > 0,
            isCategory: false
            // This is a page
          };
        });
        pageNavItems = await Promise.all(pageNavItemPromises);
      }
      return {
        id: categoryDoc.id,
        // Category ID
        title: categoryDoc.name,
        // Category Name
        isCategory: true,
        children: pageNavItems,
        hasChildren: pageNavItems.length > 0
        // Category has children if it has pages
        // slug and icon are not typically set for category headers in this model
      };
    });
    const finalNavItems = await Promise.all(categorizedNavItemsPromises);
    const finalNavItemsFiltered = finalNavItems.filter((item) => item.isCategory && item.children && item.children.length > 0);
    console.log(`[/api/wiki-nav] TRACE: Processed ${finalNavItemsFiltered.length} categorized nav items.`);
    return finalNavItemsFiltered;
  } catch (err) {
    const fetchError = err;
    console.error(`[/api/wiki-nav] ERROR: Processing wiki navigation. ParentId: ${parentId}.`, fetchError.message);
    if (fetchError.response) {
      console.error("[/api/wiki-nav] ERROR: Payload API Response Status:", fetchError.response.status);
      console.error("[/api/wiki-nav] ERROR: Payload API Response Data:", fetchError.response._data);
    }
    throw createError({
      statusCode: fetchError.response?.status || 500,
      statusMessage: "Failed to fetch or process wiki navigation data.",
      data: {
        parentIdUsed: parentId,
        originalErrorMessage: fetchError.message,
        payloadApiResponseStatus: fetchError.response?.status
      }
    });
  }
});

export { wikiNav_get as default };
//# sourceMappingURL=wiki-nav.get.mjs.map

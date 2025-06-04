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

function buildHierarchy(pages) {
  const pagesById = {};
  const childrenByParentId = {};
  pages.forEach((page) => {
    const navPage = {
      id: page.id,
      title: page.title,
      slug: page.slug,
      icon: page.icon,
      // Use the icon field from Payload
      sort: page.sort,
      // Keep sort order if needed for child sorting
      children: []
      // Initialize children array
    };
    pagesById[page.id] = navPage;
    const parent = page.parent;
    const parentId = typeof parent === "object" && parent !== null ? parent.id : parent;
    navPage.parentId = parentId;
    if (parentId) {
      if (!childrenByParentId[parentId]) {
        childrenByParentId[parentId] = [];
      }
      childrenByParentId[parentId].push(navPage);
    }
  });
  Object.values(pagesById).forEach((page) => {
    if (childrenByParentId[page.id]) {
      page.children = childrenByParentId[page.id].sort((a, b) => (a.sort || 0) - (b.sort || 0));
    } else {
      delete page.children;
    }
  });
  const rootPages = Object.values(pagesById).filter((page) => !page.parentId);
  rootPages.sort((a, b) => (a.sort || 0) - (b.sort || 0));
  return rootPages;
}
const navigation = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const section = query.section?.toString();
  if (!section || !["wiki", "registry"].includes(section)) {
    console.warn("Navigation API: Invalid or missing section query parameter.");
    return [];
  }
  const collectionSlug = section === "wiki" ? "wiki-pages" : "registry-pages";
  const config = useRuntimeConfig(event);
  const payloadApiUrl = config.public.payloadApiFullUrl || "http://localhost:3333/api";
  try {
    const pagesApiUrl = `${payloadApiUrl}/${collectionSlug}`;
    const pagesParams = new URLSearchParams({
      limit: "1000",
      // Adjust if more pages are expected
      depth: "1",
      // Populate category and parent objects
      "where[status][equals]": "published"
      // Sorting will be handled after hierarchy build for root, and during build for children
      // sort: 'category,sort',
    }).toString();
    console.log(`Fetching pages from: ${pagesApiUrl}?${pagesParams}`);
    let allPages = [];
    try {
      const pagesResponse = await $fetch(`${pagesApiUrl}?${pagesParams}`, {
        retry: 1,
        // Try once more if it fails
        timeout: 5e3
        // 5 second timeout
      });
      if (!pagesResponse || !Array.isArray(pagesResponse.docs)) {
        console.error("Navigation API: Invalid pages response format from Payload.");
        console.log("Using empty pages array as fallback.");
      } else {
        allPages = pagesResponse.docs;
        console.log(`Fetched ${allPages.length} pages for section ${section}.`);
      }
    } catch (err) {
      console.error(`Error fetching pages from Payload: ${err?.message || "Unknown error"}`);
      console.log("Using empty pages array as fallback.");
    }
    const categoriesApiUrl = `${payloadApiUrl}/categories`;
    const categoriesParams = new URLSearchParams({
      limit: "100",
      sort: "sort",
      // Sort categories by their sort field
      depth: "0"
      // No need to populate relations for categories themselves
    }).toString();
    console.log(`Fetching categories from: ${categoriesApiUrl}?${categoriesParams}`);
    let allCategories = [];
    let categoriesById = {};
    try {
      const categoriesResponse = await $fetch(`${categoriesApiUrl}?${categoriesParams}`, {
        retry: 1,
        // Try once more if it fails
        timeout: 5e3
        // 5 second timeout
      });
      if (!categoriesResponse || !Array.isArray(categoriesResponse.docs)) {
        console.error("Navigation API: Invalid categories response format from Payload.");
        console.log("Using empty categories array as fallback.");
      } else {
        allCategories = categoriesResponse.docs;
        categoriesById = Object.fromEntries(allCategories.map((cat) => [cat.id, cat]));
        console.log(`Fetched ${allCategories.length} categories.`);
      }
    } catch (err) {
      console.error(`Error fetching categories from Payload: ${err?.message || "Unknown error"}`);
      console.log("Using empty categories array as fallback.");
    }
    const rootPages = buildHierarchy(allPages);
    console.log(`Built hierarchy with ${rootPages.length} root pages.`);
    const pagesByCategory = {};
    rootPages.forEach((page) => {
      const originalPage = allPages.find((p) => p.id === page.id);
      const category = originalPage?.category;
      const categoryId = typeof category === "object" && category !== null ? category.id : category;
      if (categoryId && categoriesById[categoryId]) {
        if (!pagesByCategory[categoryId]) {
          pagesByCategory[categoryId] = [];
        }
        if (!originalPage?.isSectionHomepage) {
          pagesByCategory[categoryId].push(page);
        }
      } else {
        console.warn(`Page "${page.title}" (ID: ${page.id}) has no valid category or category not found.`);
        const defaultCategoryId = "uncategorized";
        if (!pagesByCategory[defaultCategoryId]) pagesByCategory[defaultCategoryId] = [];
        if (!originalPage?.isSectionHomepage) {
          pagesByCategory[defaultCategoryId].push(page);
        }
      }
    });
    const result = allCategories.map((category) => {
      const categoryPages = pagesByCategory[category.id];
      if (categoriesById[category.id] && categoryPages && categoryPages.length > 0) {
        return {
          id: category.id,
          name: categoriesById[category.id].name,
          // Use fetched category name
          pages: categoryPages
          // Pages are already sorted and filtered
        };
      }
      return null;
    }).filter((group) => group !== null);
    if (pagesByCategory["uncategorized"] && pagesByCategory["uncategorized"].length > 0) {
      result.push({
        id: "uncategorized",
        name: "Other",
        // Or any suitable name
        pages: pagesByCategory["uncategorized"]
        // Pages are already sorted and filtered
      });
    }
    console.log(`Formatted navigation data with ${result.length} category groups.`);
    return result;
  } catch (error) {
    console.error(`Error in navigation API handler for section "${section}":`, error.message || error);
    if (error.data) {
      console.error("Payload API Error Response:", error.statusCode, error.statusMessage, error.data);
    } else if (error.response) {
      console.error("Fetch Error Response:", error.response.status, error.response.statusText);
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Server error fetching navigation data for ${section}. ${error.message || ""}`,
      data: error.data
      // Forward error details if available
    });
  }
});

export { navigation as default };
//# sourceMappingURL=navigation.mjs.map

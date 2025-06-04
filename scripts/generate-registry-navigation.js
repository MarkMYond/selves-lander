#!/usr/bin/env node

/**
 * Script to generate a static registry navigation JSON file
 * This script fetches all necessary data from Payload CMS,
 * builds a navigation structure, and writes it to a JSON file.
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

// Define the output path for the navigation JSON file
const OUTPUT_DIR = path.join(__dirname, '../public');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'registry-navigation.json');

// Use the same interfaces as the dynamic endpoint
/**
 * @typedef {Object} NavItem
 * @property {string} id - Category ID or page ID
 * @property {string} title - Category name or Page title
 * @property {string} [slug] - Page slug
 * @property {string} [icon] - Page icon
 * @property {boolean} [isCategory] - Flag to identify category headers
 * @property {NavItem[]} [children] - Child pages or child categories
 * @property {boolean} [hasChildren] - For pages, to indicate they have sub-pages
 */

/**
 * Helper function to build Payload query URLs
 * @param {string} baseApiUrl - Base API URL
 * @param {string} collection - Collection name
 * @param {Object} params - Query parameters
 * @returns {string} - The constructed URL
 */
const buildPayloadQueryUrl = (
  baseApiUrl,
  collection,
  params
) => {
  const endpoint = `${baseApiUrl.replace(/\/api\/?$/, '')}/api/${collection}`;
  const apiQuery = new URLSearchParams();

  for (const key in params) {
    if (key === 'where') {
      const whereClauses = params[key];
      for (const field in whereClauses) {
        const condition = whereClauses[field];
        if (typeof condition === 'object' && condition !== null) {
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

/**
 * Fetch children for a specific page
 * @param {string} pageId - The parent page ID
 * @param {string} payloadApiUrl - Payload API URL
 * @returns {Promise<NavItem[]>} - Array of navigation items
 */
async function getPageChildren(pageId, payloadApiUrl) {
  const childrenUrl = buildPayloadQueryUrl(payloadApiUrl, 'registry-pages', {
    where: {
      parent: { equals: pageId },
      status: { equals: 'published' },
      isSectionHomepage: { not_equals: true },
    },
    sort: 'sort',
    limit: 100,
    depth: 0,
  });

  console.log(`Fetching children for page ${pageId}`);
  const childrenResponse = await fetch(childrenUrl);
  const childrenData = await childrenResponse.json();

  if (!childrenData || !childrenData.docs) return [];

  const childNavItems = await Promise.all(childrenData.docs.map(async (childDoc) => {
    const grandChildrenUrl = buildPayloadQueryUrl(payloadApiUrl, 'registry-pages', {
      where: { 
        parent: { equals: childDoc.id }, 
        status: { equals: 'published' }, 
        isSectionHomepage: { not_equals: true } 
      },
      limit: 1,
      depth: 0,
    });
    const grandChildrenResponse = await fetch(grandChildrenUrl);
    const grandChildrenData = await grandChildrenResponse.json();
    
    return {
      id: childDoc.id,
      title: childDoc.title,
      slug: childDoc.slug,
      icon: childDoc.icon,
      hasChildren: grandChildrenData.totalDocs > 0,
      isCategory: false,
    };
  }));

  return childNavItems;
}

/**
 * The main function to generate the navigation JSON
 */
async function generateNavigation() {
  console.log('Starting registry navigation generation...');
  
  // Get the Payload API URL from environment variables
  const payloadApiUrl = process.env.PAYLOAD_API_URL || process.env.NUXT_PUBLIC_PAYLOAD_API_URL;
  
  if (!payloadApiUrl) {
    console.warn('WARNING: PAYLOAD_API_URL environment variable is not defined. Creating empty navigation file.');
    // Write an empty array to the JSON file
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    console.log(`Empty navigation file written to ${OUTPUT_FILE}`);
    return [];
  }

  try {
    // Fetch all categories
    const categoriesUrl = buildPayloadQueryUrl(payloadApiUrl, 'categories', {
      sort: 'sort',
      limit: 50,
      depth: 0,
    });
    
    console.log(`Fetching categories from: ${categoriesUrl}`);
    const categoriesResponse = await fetch(categoriesUrl);
    const categoriesData = await categoriesResponse.json();

    if (!categoriesData || !categoriesData.docs) {
      console.warn('No categories found or invalid response.');
      return [];
    }
    
    console.log(`Found ${categoriesData.docs.length} categories.`);

    // Process each category and fetch its pages
    const categorizedNavItems = await Promise.all(categoriesData.docs.map(async (categoryDoc) => {
      const pagesUrl = buildPayloadQueryUrl(payloadApiUrl, 'registry-pages', {
        where: {
          category: { equals: categoryDoc.id },
          parent: { exists: false },
          status: { equals: 'published' },
          isSectionHomepage: { not_equals: true },
        },
        sort: 'sort',
        limit: 100,
        depth: 0,
      });
      
      console.log(`Fetching pages for category ${categoryDoc.name} (ID: ${categoryDoc.id})`);
      const pagesResponse = await fetch(pagesUrl);
      const pagesData = await pagesResponse.json();

      let pageNavItems = [];
      if (pagesData && pagesData.docs) {
        console.log(`Found ${pagesData.docs.length} pages for category ${categoryDoc.name}.`);
        
        pageNavItems = await Promise.all(pagesData.docs.map(async (pageDoc) => {
          const childrenCheckUrl = buildPayloadQueryUrl(payloadApiUrl, 'registry-pages', {
            where: { 
              parent: { equals: pageDoc.id }, 
              status: { equals: 'published' }, 
              isSectionHomepage: { not_equals: true } 
            },
            limit: 1,
            depth: 0,
          });
          
          const childrenResponse = await fetch(childrenCheckUrl);
          const childrenData = await childrenResponse.json();
          
          return {
            id: pageDoc.id,
            title: pageDoc.title,
            slug: pageDoc.slug,
            icon: pageDoc.icon,
            hasChildren: childrenData.totalDocs > 0,
            isCategory: false,
          };
        }));
      }

      return {
        id: categoryDoc.id,
        title: categoryDoc.name,
        isCategory: true,
        children: pageNavItems,
        hasChildren: pageNavItems.length > 0,
      };
    }));

    // Filter out empty categories
    const filteredNavItems = categorizedNavItems.filter(item => 
      item.isCategory && item.children && item.children.length > 0
    );

    console.log(`Processed ${filteredNavItems.length} categorized nav items.`);

    // Ensure the output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write the navigation data to the JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(filteredNavItems, null, 2));
    console.log(`Navigation data written to ${OUTPUT_FILE}`);

    return filteredNavItems;
  } catch (err) {
    console.error('Error generating registry navigation:', err);
    throw err;
  }
}

// Execute the function if run directly
if (require.main === module) {
  generateNavigation()
    .then(() => {
      console.log('Registry navigation generation completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Registry navigation generation failed:', err);
      process.exit(1);
    });
}

// Export for use in other scripts
module.exports = { generateNavigation };

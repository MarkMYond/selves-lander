import axios from 'axios';
import dotenv from 'dotenv';

// Load .env from payload-cms directory
dotenv.config({ path: '../payload-cms/.env' });

// --- Configuration ---
// Ensure these environment variables are set in ../payload-cms/.env or your system environment
const PAYLOAD_API_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3333'; // Default to localhost:3333 if not set
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;
const WIKI_COLLECTION_SLUG = 'wiki-pages'; // Correct slug from src/collections/WikiPages.ts

if (!PAYLOAD_API_KEY) {
  console.error('Error: PAYLOAD_API_KEY environment variable is not set.');
  console.error('Please ensure PAYLOAD_API_KEY is defined in ../payload-cms/.env or your system environment.');
  process.exit(1);
}

const API_ENDPOINT = `${PAYLOAD_API_URL}/api/${WIKI_COLLECTION_SLUG}`;
const DEFAULT_CATEGORY_ID = '680c09165e071ca13c67ffff'; // ID provided by user

// --- Page Data ---
// Structure based on the markdown provided by the user
const pagesData = [
  {
    title: "Introduction to Agent2Agent in Travel",
    notes: [
      "What is Agent2Agent Protocol (with reference to Google's implementation)",
      "Why it matters for the travel industry",
      "How Henry orchestrates the ecosystem",
      "Vision: Simplifying travel through conversational commerce"
    ]
  },
  {
    title: "The Travel Industry Problem",
    notes: [
      "Current fragmentation challenges",
      "Integration complexity for providers",
      "Consumer friction points",
      "Data silos and their limitations",
      "Why existing solutions fall short"
    ]
  },
  {
    title: "How Agent2Agent Works",
    notes: [
      "Core protocol concepts in plain English",
      "The anatomy of an agent conversation",
      "Types of agents in the travel ecosystem",
      "Information flow between agents",
      "Trust and verification mechanisms"
    ]
  },
  {
    title: "The Henry Orchestration Layer",
    notes: [
      "What Henry does vs. the underlying protocol",
      "How orchestration simplifies complex travel scenarios",
      "Decision-making and routing logic",
      "Handling incomplete information and clarifications",
      "Privacy and data security approach"
    ]
  },
  {
    title: "Ecosystem Connection Points",
    sections: [ // Sub-pages/sections need structure
      { title: "Front-End Connections", notes: [
        "Consumer-facing travel apps and startups",
        "Voice assistants and conversational interfaces",
        "Messaging platforms and chatbots",
        "Travel planning tools and itinerary builders",
        "Integration with existing booking workflows"
      ]},
      { title: "Middle-Layer Connections", notes: [
         "Channel managers and distribution systems",
         "Property management systems (PMS)",
         "Global distribution systems (GDS)",
         "Meta-search engines and aggregators",
         "Data enrichment services and analytics platforms"
      ]},
      { title: "Back-End Provider Connections", notes: [
        "Hotel property management integration",
        "Restaurant reservation systems",
        "Experience and activity booking systems",
        "Transportation and logistics systems",
        "Specialized service providers"
      ]}
    ]
  },
  {
    title: "Industry Use Cases",
    sections: [
       { title: "Accommodation", notes: [
          "Hotel bookings and special requests",
          "Vacation rentals and alternative lodging",
          "Extended stays and business housing",
          "Group bookings and event accommodation",
          "Property-specific service discovery"
       ]},
       { title: "Dining & Restaurants", notes: [
          "Reservation management and availability",
          "Dietary preferences and special requirements",
          "Menu exploration and food preferences",
          "Private dining and special events",
          "Food delivery integration"
       ]},
       { title: "Activities & Experiences", notes: [
          "Tour and activity bookings",
          "Attraction tickets and timed entry",
          "Guided experiences and workshops",
          "Adventure and specialty tourism",
          "Local event discovery and ticketing"
       ]},
       { title: "Transportation & Logistics", notes: [
          "Ground transportation coordination",
          "Flight information and booking",
          "Multi-modal journey planning",
          "Airport transfers and shuttles",
          "Group transportation management"
       ]},
       { title: "Complex Itinerary Scenarios", notes: [
          "Business travel management",
          "Family vacation planning",
          "Destination weddings and events",
          "Adventure travel with multiple components",
          "Accessibility-focused travel planning"
       ]}
    ]
  },
  {
    title: "Joining the Ecosystem",
    notes: [
      "Options for different types of providers",
      "Integration pathways (from simple to advanced)",
      "Getting started with minimal technical resources",
      "Growth pathway for ecosystem participants",
      "Success metrics and expectations"
    ]
  },
  {
    title: "Benefits by Participant Type",
    notes: [
      "For hotels and accommodation providers",
      "For activity and experience providers",
      "For restaurants and dining services",
      "For transportation services",
      "For travel tech startups and API providers",
      "For channel managers and distribution systems"
    ]
  },
  {
    title: "Ecosystem Economics",
    notes: [
      "How value is created and shared",
      "Transparent fee structure explanation",
      "Investment and return considerations",
      "Comparison with traditional distribution costs",
      "Success stories and ROI examples"
    ]
  },
  {
    title: "Future Vision",
    notes: [
      "Roadmap highlights",
      "Emerging use cases",
      "Industry trends supporting the Agent2Agent model",
      "How the ecosystem will evolve",
      "Opportunities for innovation"
    ]
  },
  {
    title: "FAQ & Resources",
    notes: [
      "Common questions by provider category",
      "Comparison with other standards and approaches",
      "Glossary of terms",
      "Additional learning resources",
      "Contact information for specific scenarios"
    ]
  }
];

// --- Helper Functions ---

// Basic slugify function (you might have a more robust one in your project)
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Convert notes array to Payload Rich Text JSON list format, including the root object
function notesToRichText(notes) {
  let nodeArray;
  if (!notes || notes.length === 0) {
    // Default empty paragraph node
    nodeArray = [{ "children": [{ "text": "" }], "type": "p", "version": 1 }];
  } else {
    // Create the list node structure
    nodeArray = [
      {
        children: notes.map(note => ({
          children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: note, type: 'text', version: 1 }], // Added more text node details
          type: 'listitem',
          version: 1,
          format: '', // Add default format
          indent: 0   // Add default indent
        })),
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        type: 'list',
        version: 1
      }
    ];
  }

  // Wrap the node array in the root object
  return {
    root: {
      children: nodeArray,
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1
    }
  };
}

// Create the payload for a single page POST request
function createPagePayload(pageTitle, richTextContent) {
  const payload = {
    title: pageTitle,
    slug: slugify(pageTitle), // Generate slug from title
    status: 'published', // Or 'draft' if you prefer
     pageBuilder: [ // Correct field name from WikiPages.ts
       {
         blockType: 'content', // Correct block slug from src/blocks/Content.ts
         content: richTextContent,  // From src/blocks/Content.ts field name
      }
    ],
    category: DEFAULT_CATEGORY_ID, // Assign the default category ID
    // Add any other required fields for the 'wiki' collection here
    // e.g., parent: 'parentPageID' if you have hierarchy
  };
  return payload;
}

// --- Main Execution ---
async function createPages() {
  console.log(`Starting page creation against: ${API_ENDPOINT}`);

  for (const page of pagesData) {
    if (page.sections) {
      // Handle pages with sub-sections (needs parent/child logic if hierarchical)
      console.log(`\nProcessing section group: ${page.title}`);
      // Placeholder: Create parent page first if needed, then children.
      // This example currently skips creating parent/section group pages.
      // You might need to create a parent page for "Ecosystem Connection Points"
      // and then link the sub-pages "Front-End Connections", etc., to it.
      for (const section of page.sections) {
          const richTextContent = notesToRichText(section.notes);
          if (!richTextContent) {
              console.warn(`Skipping section "${section.title}" due to empty notes.`);
              continue;
          }
          const payload = createPagePayload(section.title, richTextContent);
           // Add parent linking logic here if necessary
           // payload.parent = parentPageId;

          console.log(`  Attempting to create: ${section.title}`);
          try {
            const response = await axios.post(API_ENDPOINT, payload, {
              headers: {
                'Authorization': `users API-Key ${PAYLOAD_API_KEY}`, // Assumes API Key auth for 'users'
                'Content-Type': 'application/json',
              },
            });
            console.log(`    ✅ Success: Created "${response.data.doc.title}" (ID: ${response.data.doc.id})`);
          } catch (error) {
            console.error(`    ❌ Error creating "${section.title}":`);
            // Log detailed error information if available
            if (error.response) {
              console.error(`      Status: ${error.response.status}`);
              console.error(`      Data: ${JSON.stringify(error.response.data, null, 2)}`);
            } else if (error.request) {
              // The request was made but no response was received
              console.error('      Error: No response received from server.', error.request);
            } else {
              console.error(`      ${error.message}`);
            }
          }
          // Use Promise directly instead of wrapping setTimeout
          await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between requests
      }
    } else {
      // Handle simple pages
       console.log(`\nProcessing page: ${page.title}`);
      const richTextContent = notesToRichText(page.notes);
       if (!richTextContent) {
          console.warn(`Skipping page "${page.title}" due to empty notes.`);
          continue;
       }
      const payload = createPagePayload(page.title, richTextContent);

      console.log(`  Attempting to create: ${page.title}`);
      try {
        const response = await axios.post(API_ENDPOINT, payload, {
          headers: {
            'Authorization': `users API-Key ${PAYLOAD_API_KEY}`, // Assumes API Key auth for 'users'
            'Content-Type': 'application/json',
          },
        });
        console.log(`    ✅ Success: Created "${response.data.doc.title}" (ID: ${response.data.doc.id})`);
      } catch (error) {
        console.error(`    ❌ Error creating "${page.title}":`);
        // Log detailed error information if available
        if (error.response) {
          console.error(`      Status: ${error.response.status}`);
          console.error(`      Data: ${JSON.stringify(error.response.data, null, 2)}`);
        } else if (error.request) {
           // The request was made but no response was received
           console.error('      Error: No response received from server.', error.request);
        } else {
           // Something happened in setting up the request that triggered an Error
           console.error(`      Error: ${error.message}`);
        }
      }
      // Use Promise directly instead of wrapping setTimeout
       await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between requests
    }
  }

  console.log('\nPage creation process finished.');
}

// Run the script
createPages();

const fs = require('fs');
const path = require('path');
// Removed dotenv loading
// Removed readline as prompts are removed
// node-fetch v2 is CJS compatible, v3+ is ESM only. Ensure correct version is installed or use dynamic import for ESM.
const fetch = require('node-fetch');

const INPUT_FILE = path.join(__dirname, 'new-page-content.json'); // Changed to use the new file

// --- Payload API Configuration ---
// Use hardcoded values provided by user
const PAYLOAD_API_URL = "http://localhost:3333/api"; // Provided URL
const PAYLOAD_API_KEY = "a1f2d6a7-53f5-46e1-bf07-8312c90b8267"; // Provided API Key

// --- Transformation Functions ---

// Simple text to Lexical paragraph node - using a minimal structure
function textToLexicalParagraph(text) {
  // Create a minimal viable structure for Lexical
  return {
    // This structure matches Lexical's expected format for the editor state
    // with just text in a paragraph
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: text || '',
              type: "text",
              version: 1
            }
          ],
          direction: null,
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1
        }
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  };
}

// Enhanced markdown text to Lexical text nodes with all required properties
function markdownTextToLexicalChildren(text) {
    const children = [];
    // Basic split for **bold** text
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split and keep delimiters

    parts.forEach(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
            children.push({
                type: 'text',
                text: part.slice(2, -2), // Remove **
                format: 1, // Use format: 1 for bold in Lexical
                version: 1,
                mode: "normal",
                style: "",
                detail: 0  // Adding detail property which is required by Lexical
            });
        } else if (part) { // Only add non-empty parts for non-bold text
            children.push({
                type: 'text',
                text: part,
                format: 0, // Explicitly set format to 0 (normal)
                version: 1,
                mode: "normal",
                style: "",
                detail: 0  // Adding detail property which is required by Lexical
            });
        }
    });
    // If only whitespace nodes resulted, ensure at least one empty text node with format 0
    if (children.length === 0 && text.trim() === '') {
         children.push({ 
            type: 'text', 
            text: '', 
            format: 0, 
            version: 1,
            mode: "normal",
            style: "",
            detail: 0  // Adding detail property which is required by Lexical
         });
    } else if (children.length === 0 && text) {
        // Fallback if split logic fails but text exists
        children.push({ 
            type: 'text', 
            text: text, 
            format: 0, 
            version: 1,
            mode: "normal",
            style: "",
            detail: 0  // Adding detail property which is required by Lexical
        });
    }
    
    return children;
}


// Convert input table structure to Lexical table structure
function createLexicalTable(headers, rows) {
  // Basic validation
  if (!headers || !Array.isArray(headers) || !rows || !Array.isArray(rows)) {
      console.error("Invalid table data for Lexical conversion");
      return null; // Or return an empty paragraph structure
  }

  const headerCells = headers.map(headerText => ({
    type: 'tablecell',
    children: [{ 
      type: 'paragraph', 
      children: markdownTextToLexicalChildren(headerText), 
      direction: null,
      format: '',
      indent: 0,
      version: 1 
    }],
    headerState: 'header',
    width: 150, // Default width, adjust as needed
    version: 1,
  }));

  const bodyRows = rows.map(rowData => {
     // Ensure rowData is an array
     if (!Array.isArray(rowData)) {
        console.warn("Skipping invalid table row:", rowData);
        return null; // Skip invalid rows
     }
     const cells = rowData.map(cellText => ({
       type: 'tablecell',
       children: [{ 
         type: 'paragraph', 
         children: markdownTextToLexicalChildren(cellText), 
         direction: null,
         format: '',
         indent: 0,
         version: 1 
       }],
       headerState: 'normal',
       width: 150, // Default width
       version: 1,
     }));
     return { type: 'tablerow', children: cells, version: 1 };
  }).filter(row => row !== null); // Filter out skipped invalid rows

  // Return in a format consistent with Lexical's format
  return {
    root: {
      children: [
        {
          type: 'table',
          children: [
            { type: 'tablerow', children: headerCells, version: 1 }, // Header row
            ...bodyRows // Body rows
          ],
          version: 1,
        }
      ],
      direction: null,
      format: '',
      indent: 0,
      type: "root",
      version: 1
    }
  };
}


// Create a rich text block with headings, paragraphs, and lists directly in Lexical format
function createRichTextContent(blocks) {
  if (!blocks || !Array.isArray(blocks)) {
    return textToLexicalParagraph(""); // Return empty paragraph if no blocks
  }

  // Convert blocks to Lexical nodes
  const children = blocks.map(block => {
    if (block.type === 'paragraph') {
      return {
        type: 'paragraph',
        children: [{ 
          type: 'text', 
          text: block.text || '', 
          format: 0, 
          version: 1,
          detail: 0,
          mode: "normal",
          style: "" 
        }],
        direction: null,
        format: "",
        indent: 0,
        version: 1
      };
    } else if (block.type === 'heading') {
      return {
        type: 'heading',
        tag: `h${block.level || 1}`, // h1, h2, etc.
        children: [{ 
          type: 'text', 
          text: block.text || '', 
          format: 0, 
          version: 1,
          detail: 0,
          mode: "normal",
          style: "" 
        }],
        direction: null,
        format: "",
        indent: 0,
        version: 1
      };
    } else if (block.type === 'list') {
      // Create list items
      const listItems = (block.items || []).map(item => ({
        type: 'listitem',
        children: [{
          type: 'paragraph',
          children: [{ 
            type: 'text', 
            text: item, 
            format: 0, 
            version: 1,
            detail: 0,
            mode: "normal",
            style: "" 
          }],
          direction: null,
          format: "",
          indent: 0,
          version: 1
        }],
        value: 1,
        version: 1
      }));

      return {
        type: block.style === 'numbered' ? 'list' : 'list',
        tag: block.style === 'numbered' ? 'ol' : 'ul',
        children: listItems,
        direction: null,
        format: "",
        indent: 0,
        version: 1
      };
    }
    
    // Default to paragraph if type is not recognized
    return {
      type: 'paragraph',
      children: [{ 
        type: 'text', 
        text: block.text || '', 
        format: 0, 
        version: 1,
        detail: 0,
        mode: "normal",
        style: "" 
      }],
      direction: null,
      format: "",
      indent: 0,
      version: 1
    };
  });

  // Return the complete Lexical structure
  return {
    root: {
      children,
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  };
}

// Main transformation logic
function transformInputToPayload(inputContent) {
  if (!inputContent || !Array.isArray(inputContent.content)) {
    throw new Error('Invalid input JSON structure. Expected { "content": [...] }');
  }

  return inputContent.content.map((item, index) => {
    const baseBlock = { id: `generated-${Date.now()}-${index}` }; // Simple unique ID

    switch (item.type) {
      case 'header':
        return {
          ...baseBlock,
          blockType: 'sectionHeaderBlock',
          title: item.text,
          level: `h${item.level || 2}`, // Default to h2 if level is missing
        };
      case 'paragraph':
        return {
          ...baseBlock,
          blockType: 'content',
          content: textToLexicalParagraph(item.text),
        };
      case 'richtext': // New block type for complex rich text content
        return {
          ...baseBlock,
          blockType: 'content',
          content: createRichTextContent(item.blocks),
        };
      case 'list':
        // Ensure items is an array, default to empty if not
        const inputItems = Array.isArray(item.items) ? item.items : [];
        return {
          ...baseBlock,
          blockType: 'list',
          style: item.style || 'bulleted',
          // Map the array of strings to an array of objects with itemText
          items: inputItems.map(text => ({ itemText: text })), 
        };
      case 'code':
        return {
          ...baseBlock,
          blockType: 'codeBlock',
          language: item.language || 'plaintext',
          code: item.code || '',
        };
      case 'table':
        const lexicalTableData = createLexicalTable(item.headers, item.rows);
        if (!lexicalTableData) {
            console.warn(`Skipping invalid table block at index ${index}`);
            return null; // Skip invalid tables
        }
        return {
          ...baseBlock,
          blockType: 'tableBlock',
          tableData: lexicalTableData,
        };
      default:
        console.warn(`Unsupported block type "${item.type}" found in input JSON. Skipping.`);
        return null; // Skip unsupported block types
    }
  }).filter(block => block !== null); // Remove skipped blocks
}

// --- Main Execution ---

async function main() {
  try {
    // --- Get Title and Slug from Command Line Arguments ---
    const args = process.argv.slice(2); // Skip node path and script path
    if (args.length < 2) {
      console.error('Error: Please provide the page title and slug as command line arguments.');
      console.error('Usage: node scripts/upload-wiki-json.cjs "Your Page Title" "your-page-slug"');
      process.exit(1);
    }
    const pageTitle = args[0];
    const pageSlug = args[1];
    console.log(`Using title: "${pageTitle}"`);
    console.log(`Using slug: "${pageSlug}"`);

    // 1. Read Input JSON
    if (!fs.existsSync(INPUT_FILE)) {
      console.error(`Error: Input file not found at ${INPUT_FILE}`);
      process.exit(1);
    }
    const inputJsonString = fs.readFileSync(INPUT_FILE, 'utf8');
    const inputData = JSON.parse(inputJsonString);

    // 2. Transform Data
    const payloadPageBuilder = transformInputToPayload(inputData);

    // 3. Title & Slug are now from arguments - Removed extraction logic

    // 4. Environment variable checks removed

    // Ensure API URL doesn't end with a slash
    const apiUrl = PAYLOAD_API_URL.replace(/\/$/, '');

    // 5. Construct Payload Document
    const payloadDocument = {
      title: pageTitle, // Use title from argument
      slug: pageSlug,   // Use slug from argument
      pageBuilder: payloadPageBuilder,
      status: 'draft', // Defaulting to draft
      // Add any other required fields for 'wiki-pages' collection
      // e.g., category: 'some-category-id' // Add if necessary
    };

    // 6. Send POST Request to Payload
    console.log(`\nAttempting to create wiki page "${pageTitle}" (${pageSlug}) at ${apiUrl}/wiki-pages...`);

    const response = await fetch(`${apiUrl}/wiki-pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `users API-Key ${PAYLOAD_API_KEY}`, // Payload's default API key header
      },
      body: JSON.stringify(payloadDocument),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error(`Error creating page: ${response.status} ${response.statusText}`);
      console.error('Response Body:', JSON.stringify(responseBody, null, 2));
      process.exit(1);
    }

    console.log('\nWiki page created successfully!');
    console.log('Response:', JSON.stringify(responseBody, null, 2));

  } catch (error) {
    console.error('\nAn error occurred:');
    console.error(error.message);
    if (error instanceof SyntaxError) {
      console.error(`Check the JSON syntax in ${INPUT_FILE}`);
    }
    process.exit(1);
  }
  // No finally block needed as readline is removed
}

// Removed readline question helper

main();

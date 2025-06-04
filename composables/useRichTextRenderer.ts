import { computed } from 'vue';
import type { Ref } from 'vue'; // Reverted import

// --- Type Definitions (Copied from ContentBlock.vue) ---

interface TextNode {
  type: 'text';
  text: string;
  format?: number;
  detail?: number;
  mode?: string;
  style?: string;
  version?: number;
}

interface LinkNode {
  type: 'link';
  fields?: {
    url?: string;
    newTab?: boolean;
    linkType?: 'internal' | 'custom';
    doc?: {
      relationTo: string;
      value: { id: string; slug?: string; [key: string]: any };
    }
  };
  children: TreeNode[];
}

interface HeadingNode {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: TreeNode[];
}

interface ParagraphNode {
  type: 'paragraph';
  children: TreeNode[];
}

interface ListNode {
  type: 'list';
  tag: 'ul' | 'ol';
  children: ListItemNode[];
}

interface ListItemNode {
  type: 'listitem';
  children: TreeNode[];
}

interface LineBreakNode {
  type: 'linebreak';
}

interface UploadNode {
  type: 'upload';
  value?: {
    id: string;
    url?: string;
    filename?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  relationTo?: string;
  children?: any[];
}

interface BlockNode {
  type: 'block';
  fields: {
    blockType: string;
    code?: string;
    [key: string]: any;
  };
}

export type TreeNode =
  | TextNode
  | LinkNode
  | HeadingNode
  | ParagraphNode
  | ListNode
  | ListItemNode
  | LineBreakNode
  | UploadNode
  | BlockNode
  | { type: string; children?: TreeNode[]; [key: string]: any }; // Fallback

export interface RichTextRoot {
  children: TreeNode[];
  // ... other root properties
}

// --- Helper Functions ---

// Simple HTML escaping function
const escapeHtml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
       .replace(/&/g, "&") // Use & for ampersand
       .replace(/</g, "<")
       .replace(/>/g, ">")
       .replace(/"/g, '"') // Corrected: Use single quotes for outer string
       .replace(/'/g, "&#039;");
 };

// Recursive node renderer function
const renderNode = (node: TreeNode): string => {
  switch (node.type) {
    case 'paragraph':
      const paragraphContent = renderChildren(node.children);
      return `<p>${paragraphContent.trim() === '' ? '&nbsp;' : paragraphContent}</p>`;

    case 'heading': {
      const tag = node.tag || 'h2';
      let classes = '';
      // Apply specific classes for h2 and h3 as per user's examples
      if (tag === 'h2') {
        // User H2 example: "text-brand-900 dark:text-brand-100 tracking-tight text-5xl leading-tight mb-4 max-md:text-4xl max-sm:text-3xl"
        // Making h2 smaller as requested: reducing by one size level
        // Color will be handled by prose styles
        classes = "tracking-tight text-3xl leading-tight mb-4 max-md:text-2xl max-sm:text-xl";
      } else if (tag === 'h3') {
        // User H3 example: "text-brand-900 dark:text-brand-100 text-2xl leading-8 max-sm:text-lg max-sm:leading-7 text-center"
        // Removing font-bold. Added a small bottom margin (mb-3) previously.
        // Color will be handled by prose styles
        classes = "text-2xl leading-8 max-sm:text-lg max-sm:leading-7 text-center mb-3";
      }
      // For other heading levels (h1, h4, h5, h6), no specific classes are added here,
      // so they will rely on prose styles from tailwind.config.js or browser defaults if prose doesn't cover them.
      if (classes) {
        return `<${tag} class="${classes}">${renderChildren(node.children)}</${tag}>`;
      }
      // Fallback for h1, h4, h5, h6 to be styled by prose or browser defaults
      return `<${tag}>${renderChildren(node.children)}</${tag}>`;
    }
    case 'list':
      const listTag = node.tag === 'ol' ? 'ol' : 'ul';
      return `<${listTag}>${renderChildren(node.children)}</${listTag}>`;

    case 'listitem':
      return `<li>${renderChildren(node.children)}</li>`;

    case 'link':
      let url = node.fields?.url || '#';
      let isExternal = false;
      
      if (node.fields?.linkType === 'internal' && node.fields?.doc?.value?.slug) {
        const relation = node.fields.doc.relationTo;
        const slug = node.fields.doc.value.slug;
        if (relation === 'wiki-pages') url = `/wiki/${slug}`;
        else if (relation === 'registry-pages') url = `/registry/${slug}`;
        else url = `/${slug}`;
        isExternal = false;
      } else {
        // Check if the URL is external (starts with http:// or https:// or //)
        isExternal = /^(https?:)?\/\//.test(url);
      }
      
      if (isExternal || node.fields?.newTab) {
        const target = ' target="_blank" rel="noopener noreferrer"';
        return `<a href="${escapeHtml(url)}"${target}>${renderChildren(node.children)}</a>`;
      } else {
        // For internal links, use a special data attribute that will be processed by a client-side directive
        return `<a href="${escapeHtml(url)}" data-nuxt-link>${renderChildren(node.children)}</a>`;
      }

    case 'text': {
      let text = escapeHtml(node.text);
      const format = node.format ?? 0;
      if (format & 1) text = `<strong>${text}</strong>`; // Bold
      if (format & 2) text = `<em>${text}</em>`; // Italic
      if (format & 8) text = `<u>${text}</u>`; // Underline
      if (format & 4) text = `<s>${text}</s>`; // Strikethrough
      if (format & 16) text = `<code>${text}</code>`; // Code
      return text;
    }

    case 'linebreak':
      return '<br>';

    case 'code': // Handle Payload's built-in code block type
      // Assuming children contain text nodes that make up the code
      // Or, if Payload puts code directly in a 'text' field of the 'code' node:
      // const codeContent = escapeHtml(node.text || renderChildren(node.children));
      const codeContentFromChildren = renderChildren(node.children); // Prefer children if they exist
      const directCodeText = node.text ? escapeHtml(node.text as string) : ''; // Handle if text is directly on node
      const finalCodeContent = codeContentFromChildren || directCodeText;
      // Using a generic class, or let prose handle it.
      // Add 'whitespace-pre-wrap' to respect newlines and wrap long lines.
      return `<pre class="whitespace-pre-wrap"><code>${finalCodeContent}</code></pre>`;

    case 'block': // Existing custom block handler
      if (node.fields?.blockType === 'codeBlock') {
        const customBlockCodeContent = escapeHtml(node.fields?.code || '');
        // Add 'whitespace-pre-wrap' here too for consistency
        return `<pre class="whitespace-pre-wrap"><code class="language-javascript">${customBlockCodeContent}</code></pre>`;
      }
      return `<!-- Unsupported block type: ${node.fields?.blockType} -->`;

    default:
      if ('children' in node && Array.isArray(node.children)) {
        return renderChildren(node.children);
      }
      console.warn('Unsupported/Unknown rich text node type:', node.type, node);
      return '';
  }
};

// Helper to safely render children nodes
const renderChildren = (children: TreeNode[] | undefined): string => {
  return children?.map(renderNode).join('') || '';
};


// --- Composable ---

export function useRichTextRenderer(richTextRoot: Readonly<Ref<RichTextRoot | undefined | null>>) { // Reverted parameter type

  const renderedHtml = computed(() => {
    if (!richTextRoot.value?.children) {
      return '';
    }
    try {
      return renderChildren(richTextRoot.value.children);
    } catch (error) {
      console.error('Error rendering custom Lexical content:', error);
      return '<p>Error rendering content.</p>'; // Fallback HTML
    }
  });

  return {
    renderedHtml,
  };
}

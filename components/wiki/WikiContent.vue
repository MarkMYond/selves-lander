<template>
  <div class="wiki-content">
    <!-- Add Schema.org data using pageMetadata -->
    <SchemaOrgData :page="pageMetadata" />

    <!-- Title and metadata -->
    <div class="mb-8">
      <!-- Removed h1 title as it's handled by the parent page -->
      <div class="flex items-center text-base leading-relaxed text-gray-500 gap-2 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']">
        <span v-if="lastUpdated">Last updated: {{ lastUpdated }}</span>
      </div>
    </div>

    <!-- Table of Contents (if the page has headings) -->
    <div v-if="hasToc" class="mb-8 p-4 bg-brand-50 rounded-md"> <!-- Changed bg-gray-50 to bg-brand-50 -->
      <div class="text-lg font-medium mb-2">Table of Contents</div>
      <ul class="space-y-1">
        <li v-for="heading in tableOfContents" :key="heading.id" class="pl-4">
          <a :href="`#${heading.id}`" class="text-primary hover:underline">
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </div>

    <!-- Content area -->
    <!-- Using manual rendering loop + prose styles for basic formatting -->
    <div class="page-builder-manual prose prose-lg max-w-none">
      <template v-if="pageBuilder && pageBuilder.length > 0" v-for="block in pageBuilder" :key="block._key">
        <!-- Custom Block Components -->
        <ContentBlock v-if="block._type === 'contentBlock'" :block="block" />
        <CodeBlock v-else-if="block._type === 'code'" :block="block" />
        <CalloutBlock v-else-if="block._type === 'callout'" :block="block" />
        <ImageBlock v-else-if="block._type === 'imageBlock'" :block="block" />
        <TableBlock v-else-if="block._type === 'tableBlock'" :block="block" />
        <ExpandableBlock v-else-if="block._type === 'expandableBlock'" :block="block" />
        <DividerBlock v-else-if="block._type === 'divider'" />
        <VideoEmbedBlock v-else-if="block._type === 'videoEmbed'" :block="block" />
        <TaskListBlock v-else-if="block._type === 'taskList'" :block="block" />
        <QuoteBlock v-else-if="block._type === 'quote'" :block="block" />
        <FileAttachmentBlock v-else-if="block._type === 'fileAttachment'" :block="block" />
        <GenericEmbedBlock v-else-if="block._type === 'genericEmbed'" :block="block" />
        <SectionHeaderBlock v-else-if="block._type === 'sectionHeader'" :block="block" /> <!-- Added Section Header -->

        <!-- Manual Rendering for Standard Block (_type: 'block') -->
        <template v-else-if="block._type === 'block'">
          <p v-if="!block.style || block.style === 'normal'">
            <template v-for="child in block.children" :key="child._key">
              <!-- Basic text rendering, ignoring marks for now -->
              <span>{{ child.text }}</span>
            </template>
          </p>
          <h1 v-else-if="block.style === 'h1'">
             <template v-for="child in block.children" :key="child._key"><span>{{ child.text }}</span></template>
          </h1>
          <h2 v-else-if="block.style === 'h2'">
             <template v-for="child in block.children" :key="child._key"><span>{{ child.text }}</span></template>
          </h2>
          <h3 v-else-if="block.style === 'h3'">
             <template v-for="child in block.children" :key="child._key"><span>{{ child.text }}</span></template>
          </h3>
          <h4 v-else-if="block.style === 'h4'">
             <template v-for="child in block.children" :key="child._key"><span>{{ child.text }}</span></template>
          </h4>
           <blockquote v-else-if="block.style === 'blockquote'">
             <template v-for="child in block.children" :key="child._key"><span>{{ child.text }}</span></template>
          </blockquote>
          <!-- Add more style handlers as needed (e.g., lists) -->
           <pre v-else>Unhandled block style: {{ block.style }} - {{ JSON.stringify(block, null, 2) }}</pre>
        </template>

        <!-- Fallback for unknown top-level block types -->
        <div v-else class="p-4 my-4 border border-red-500 bg-red-50">
          <p class="font-bold text-red-700">Unknown block type:</p>
          <pre>{{ JSON.stringify(block, null, 2) }}</pre>
        </div>
      </template>

      <!-- Empty state if no content -->
      <div v-else class="py-4 text-gray-500 italic">
        This page has no content yet.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

// Explicit imports for custom block components
import CalloutBlock from '../payload-blocks/wiki-registry/CalloutBlock.vue';
import CodeBlock from '../payload-blocks/wiki-registry/CodeBlock.vue';
import ExpandableBlock from '../payload-blocks/wiki-registry/ExpandableBlock.vue';
import ImageBlock from '../payload-blocks/wiki-registry/ImageBlock.vue';
import TableBlock from '../payload-blocks/wiki-registry/TableBlock.vue';
import ContentBlock from '../payload-blocks/wiki-registry/ContentBlock.vue';
// Import new block components
import DividerBlock from '../payload-blocks/wiki-registry/DividerBlock.vue';
import VideoEmbedBlock from '../payload-blocks/wiki-registry/VideoEmbedBlock.vue';
import TaskListBlock from '../payload-blocks/wiki-registry/TaskListBlock.vue';
import QuoteBlock from '../payload-blocks/wiki-registry/QuoteBlock.vue';
import FileAttachmentBlock from '../payload-blocks/wiki-registry/FileAttachmentBlock.vue';
import GenericEmbedBlock from '../payload-blocks/wiki-registry/GenericEmbedBlock.vue';
import SectionHeaderBlock from '../payload-blocks/wiki-registry/SectionHeaderBlock.vue'; // Import Section Header


// Define type for Metadata (subset of WikiPage info)
interface PageMetadata {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: { current: string };
  description?: string;
  schemaOrg?: {
    type?: string;
    jsonLd?: string;
  };
}

// Define props for pageBuilder array and pageMetadata object
const props = defineProps({
  pageBuilder: {
    type: Array as PropType<any[]>,
    required: false, // Allow empty content
    default: () => []
  },
  pageMetadata: {
    type: Object as PropType<PageMetadata>,
    required: true
  }
});

// Format the last updated date if available
const lastUpdated = computed(() => {
  if (props.pageMetadata._updatedAt) { // Use pageMetadata
    const date = new Date(props.pageMetadata._updatedAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  return null;
});

// Table of contents generation
const tableOfContents = computed(() => {
  if (!props.pageBuilder || props.pageBuilder.length === 0) return []; // Use pageBuilder

  return props.pageBuilder
    .filter((block: any) => block._type === 'block' && ['h1', 'h2', 'h3'].includes(block.style)) // Add type
    .map((block: any) => { // Add type
      const text = block.children.map((child: any) => child.text).join('');
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      return { id, text, level: block.style };
    });
});

// Do we have enough headings to show a TOC?
const hasToc = computed(() => tableOfContents.value.length >= 3);

// No blockComponents mapping needed as rendering is manual based on _type.
</script>

<template>
  <div class="my-6 overflow-x-auto">
    <h4 v-if="block.title" class="font-semibold text-lg mb-2">
      {{ block.title }}
    </h4>
    <!-- Render the rich text which should contain the table -->
    <div class="prose max-w-none"> <!-- Use prose for default table styling -->
      <ContentBlock :block="{ blockType: 'content', content: block.tableData }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import ContentBlock from './ContentBlock.vue'; // Import ContentBlock for rich text rendering

// Assuming structure for TableBlock data from Payload
interface TableBlockData {
  id?: string;
  blockType: 'tableBlock';
  title?: string;
  tableData: any; // Payload Rich Text JSON structure containing the table
}

const props = defineProps({
  block: {
    type: Object as PropType<TableBlockData>,
    required: true,
  },
})

// Note: Ensure your Tailwind typography plugin (@tailwindcss/typography)
// is installed and configured, or add custom table styles globally
// or scoped here if needed. The rich text renderer within ContentBlock
// will output standard <table>, <thead>, <tbody>, <tr>, <th>, <td> tags.
</script>

<style scoped>
/* Add specific table styling overrides if prose defaults aren't sufficient */
:deep(table) {
  /* Example: Ensure table doesn't overflow excessively on small screens */
  min-width: 600px; /* Or adjust as needed */
}
</style>

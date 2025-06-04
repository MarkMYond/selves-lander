<template>
  <details :open="block.initiallyOpen || isOpen" @toggle="handleToggle" class="my-6 border rounded group">
    <summary class="flex items-center justify-between p-3 cursor-pointer bg-brand-50 hover:bg-brand-100 rounded-t group-open:rounded-b-none"> <!-- Changed bg-gray-50 to bg-brand-50 and hover:bg-gray-100 to hover:bg-brand-100 -->
      <span class="font-medium text-gray-800">{{ block.title }}</span>
      <PhCaretDown :size="16" class="text-gray-500 transition-transform duration-200 group-open:rotate-180" />
    </summary>
    <div class="p-4 border-t">
      <!-- Render the nested rich text content -->
      <ContentBlock :block="{ blockType: 'content', content: block.content }" />
    </div>
  </details>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue';
import ContentBlock from './ContentBlock.vue'; // Import ContentBlock for rich text

// Assuming structure for ExpandableBlock data from Payload
interface ExpandableBlockData {
  id?: string;
  blockType: 'expandableBlock';
  title: string;
  initiallyOpen?: boolean;
  content: any; // Payload Rich Text JSON structure
}

const props = defineProps({
  block: {
    type: Object as PropType<ExpandableBlockData>,
    required: true,
  },
})

// Use ref for client-side toggle state after initial load
const isOpen = ref(props.block.initiallyOpen || false);

const handleToggle = (event: Event) => {
  // Update the local state when the details element is toggled by the user
  isOpen.value = (event.target as HTMLDetailsElement).open;
}
</script>

<style scoped>
details > summary {
  list-style: none; /* Remove default marker */
}
details > summary::-webkit-details-marker {
  display: none; /* Remove default marker for Safari */
}
/* Add styles to target the rendered rich text within the details if needed */
:deep(.prose p:last-child) {
  margin-bottom: 0;
}
</style>

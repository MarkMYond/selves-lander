<template>
  <div class="my-4">
    <ul v-if="style === 'bulleted'" class="list-disc list-inside space-y-1">
      <li v-for="(item, index) in items" :key="index" v-html="renderMarkdown(item)"></li>
    </ul>
    <ol v-else-if="style === 'numbered'" class="list-decimal list-inside space-y-1">
      <li v-for="(item, index) in items" :key="index" v-html="renderMarkdown(item)"></li>
    </ol>
    <div v-else class="text-red-500">
      Warning: Unknown list style '{{ style }}'. Please use 'bulleted' or 'numbered'.
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
// Basic markdown rendering (e.g., **bold** -> <strong>bold</strong>)
// NOTE: This is a very basic implementation and might not cover all cases.
// Consider a more robust library like 'marked' or 'markdown-it' if complex markdown is needed.
// Also, ensure input is sanitized if it comes from untrusted sources.
const renderMarkdown = (text: string): string => {
  if (!text) return '';
  // Replace **bold** with <strong>bold</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Add more basic replacements if needed (e.g., *italic*)
  // html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  return html;
};

interface Props {
  style?: 'bulleted' | 'numbered';
  items: string[];
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  style: 'bulleted', // Default to bulleted list
  items: () => [],
});
</script>

<style scoped>
/* Add any specific list block styles if needed */
/* Tailwind's list-disc/list-decimal and list-inside handle basic styling */
li::marker {
  /* You might want to customize markers further */
  /* color: theme('colors.primary.500'); */
}
</style>

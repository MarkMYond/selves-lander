<template>
  <div v-if="block?.code" class="my-6">
    <!-- Basic code block rendering -->
    <!-- Consider using a syntax highlighting library like Prism.js or highlight.js -->
    <pre
      class="bg-gray-900 text-white p-4 rounded overflow-x-auto text-sm font-mono"
      :class="languageClass"
    ><code>{{ block.code }}</code></pre>
    <div v-if="block.language" class="text-xs text-gray-500 mt-1">
      Language: {{ block.language }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

// Assuming structure for CodeBlock data from Payload
interface CodeBlockData {
  id?: string;
  blockType: 'codeBlock';
  language?: string;
  code: string;
}

const props = defineProps({
  block: {
    type: Object as PropType<CodeBlockData>,
    required: true,
  },
})

// Generate a class for potential syntax highlighting integration
const languageClass = computed(() => {
  return props.block?.language ? `language-${props.block.language.toLowerCase()}` : 'language-plaintext';
});

// In a real implementation, you might use a watcher or mounted hook
// to trigger a syntax highlighting library on the <pre><code> block.
</script>

<style scoped>
/* Scoped styles specific to the code block if needed */
pre {
  white-space: pre-wrap; /* Allow wrapping long lines */
  word-break: break-all; /* Break words if necessary */
}
</style>

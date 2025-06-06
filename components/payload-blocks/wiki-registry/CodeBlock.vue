<template>
  <div
    v-if="block?.code"
    class="my-6"
  >
    <pre
      class="bg-gray-900 text-white p-4 rounded overflow-x-auto text-sm font-mono"
      :class="languageClass"
    ><code>{{ block.code }}</code></pre>
    <div
      v-if="block.language"
      class="text-xs text-gray-500 mt-1"
    >
      Language: {{ block.language }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

interface CodeBlockData {
  id?: string
  blockType: 'codeBlock'
  language?: string
  code: string
}

const props = defineProps({
  block: {
    type: Object as PropType<CodeBlockData>,
    required: true,
  },
})

const languageClass = computed(() => {
  return props.block?.language
    ? `language-${props.block.language.toLowerCase()}`
    : 'language-plaintext'
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

<template>
  <div class="my-4">
    <ul
      v-if="style === 'bulleted'"
      class="list-disc list-inside space-y-1"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        v-html="renderMarkdown(item)"
      />
    </ul>
    <ol
      v-else-if="style === 'numbered'"
      class="list-decimal list-inside space-y-1"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        v-html="renderMarkdown(item)"
      />
    </ol>
    <div
      v-else
      class="text-red-500"
    >
      Warning: Unknown list style '{{ style }}'. Please use 'bulleted' or
      'numbered'.
    </div>
  </div>
</template>

<script setup lang="ts">

const renderMarkdown = (text: string): string => {
  if (!text) return ''
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  return html
}

interface Props {
  style?: 'bulleted' | 'numbered'
  items: string[]
}

const props = withDefaults(defineProps<Props>(), {
  style: 'bulleted',
  items: () => [],
})
</script>

<style scoped>
li::marker {
}
</style>

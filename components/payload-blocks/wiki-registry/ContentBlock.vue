<template>
  <ClientOnly>
    <div
      v-if="renderedHtml"
      class="prose max-w-none dark:prose-invert"
      v-html="renderedHtml"
    />
    <template #fallback>
      <div class="py-4">
        Loading content...
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import {
  useRichTextRenderer,
  type RichTextRoot,
} from '../../../composables/useRichTextRenderer'

interface ContentBlockData {
  id?: string
  blockType: 'content'
  content: { root: RichTextRoot }
}

const props = defineProps({
  block: {
    type: Object as PropType<ContentBlockData>,
    required: true,
  },
})

const contentRoot = computed(() => props.block?.content?.root)
const { renderedHtml } = useRichTextRenderer(contentRoot)
</script>

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
  useRegistryRichTextRenderer,
  type RegistryRichTextRoot,
} from '../../../composables/useRegistryRichTextRenderer'

interface RegContentBlockData {
  id?: string
  blockType: 'regRichText'
  content: { root: RegistryRichTextRoot }
}

const props = defineProps({
  block: {
    type: Object as PropType<RegContentBlockData>,
    required: true,
  },
})

const contentRoot = computed(() => props.block?.content?.root)
const { renderedHtml } = useRegistryRichTextRenderer(contentRoot)
</script>

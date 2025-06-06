<template>
  <blockquote
    class="my-6 border-l-4 border-brand-primary pl-4 italic text-gray-700"
  >
    <p
      class="mb-2 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
    >
      "{{ block.quote }}"
    </p>
    <footer
      v-if="block.attribution"
      class="text-base leading-relaxed text-gray-500 not-italic [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
    >
      — {{ block.attribution }}
    </footer>
  </blockquote>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface QuoteBlockData {
  id?: string
  blockType: 'quoteBlock'
  quote: string
  attribution?: string
}

const props = defineProps({
  block: {
    type: Object as PropType<QuoteBlockData>,
    required: true,
  },
})
</script>

<style scoped>
</style>

<template>
  <div>
    <component
      v-for="(block, idx) in blocks"
      :is="getComponent(block.blockType)"
      :key="block.id || idx"
      :block="block"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType, Component } from 'vue'
import RegContentBlock from './RegContentBlock.vue'
import RegCalloutBlock from './RegCalloutBlock.vue'
import RegCodeBlock from './RegCodeBlock.vue'
import RegImageCarouselBlock from './RegImageCarouselBlock.vue'
import RegColumnsBlock from './RegColumnsBlock.vue'
import RegAccordionBlock from './RegAccordionBlock.vue'
import RegTableBlock from './RegTableBlock.vue'

const blockMap: Record<string, Component> = {
  regRichText: RegContentBlock,
  regCallout: RegCalloutBlock,
  regCode: RegCodeBlock,
  regImageCarousel: RegImageCarouselBlock,
  regColumns: RegColumnsBlock,
  regAccordion: RegAccordionBlock,
  regTable: RegTableBlock,
}

type RegistryBlock = {
  id?: string | number;
  blockType: string;
  [key: string]: any;
}

const props = defineProps({
  blocks: {
    type: Array as PropType<RegistryBlock[]>,
    required: true,
  },
})

function getComponent(type: string): Component | null {
  return blockMap[type] || null
}
</script>

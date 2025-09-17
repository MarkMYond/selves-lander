<template>
  <div v-if="block.columns && block.columns.length" class="my-6 grid gap-6" :class="gridClass">
    <div v-for="(col, idx) in block.columns" :key="idx" class="flex flex-col gap-4">
      <RegistryBlockRenderer :blocks="col.blocks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import RegistryBlockRenderer from './RegistryBlockRenderer.vue'

interface RegColumnsBlockData {
  id?: string
  blockType: 'regColumns'
  columns: Array<{ blocks: any[] }>
}

const props = defineProps({
  block: {
    type: Object as PropType<RegColumnsBlockData>,
    required: true,
  },
})

const gridClass = computed(() => {
  const cols = props.block.columns.length
  return `grid-cols-${cols}`
})
</script>

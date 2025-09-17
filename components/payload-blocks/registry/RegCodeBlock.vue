<template>
  <div :class="containerClasses" class="my-6">
    <h4 v-if="block.title" class="font-semibold text-lg mb-2">
      {{ block.title }}
    </h4>
    <pre :class="preClasses" class="p-4 rounded overflow-x-auto text-sm font-mono">
      <code>{{ block.code }}</code>
    </pre>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

interface RegCodeBlockData {
  id?: string
  blockType: 'regCode'
  title?: string
  code: string
  showBorder?: boolean
}

const props = defineProps({
  block: {
    type: Object as PropType<RegCodeBlockData>,
    required: true,
  },
})

const containerClasses = computed(() => {
  return props.block?.showBorder ? 'border border-gray-300 bg-gray-50' : ''
})

const preClasses = computed(() => {
  return props.block?.showBorder ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
})
</script>

<template>
  <div
    v-if="block?.content"
    :class="calloutClasses"
    class="my-6 p-4 rounded border-l-4"
  >
    <h4
      v-if="block.title"
      class="font-semibold text-lg mb-2"
      :class="titleClasses"
    >
      {{ block.title }}
    </h4>
    <ContentBlock :block="{ blockType: 'content', content: block.content }" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import ContentBlock from './ContentBlock.vue'

interface CalloutBlockData {
  id?: string
  blockType: 'calloutBlock'
  type: 'info' | 'warning' | 'danger' | 'success' | 'note'
  title?: string
  content: any
}

const props = defineProps({
  block: {
    type: Object as PropType<CalloutBlockData>,
    required: true,
  },
})

const calloutClasses = computed(() => {
  switch (props.block?.type) {
    case 'info':
      return 'bg-blue-50 border-blue-500'
    case 'warning':
      return 'bg-yellow-50 border-yellow-500'
    case 'danger':
      return 'bg-red-50 border-red-500'
    case 'success':
      return 'bg-green-50 border-green-500'
    case 'note':
    default:
      return 'bg-brand-50 border-brand-primary'
  }
})

const titleClasses = computed(() => {
  switch (props.block?.type) {
    case 'info':
      return 'text-blue-800'
    case 'warning':
      return 'text-yellow-800'
    case 'danger':
      return 'text-red-800'
    case 'success':
      return 'text-green-800'
    case 'note':
    default:
      return 'text-gray-800'
  }
})
</script>

<style scoped>
:deep(p:last-child) {
  margin-bottom: 0;
}
</style>

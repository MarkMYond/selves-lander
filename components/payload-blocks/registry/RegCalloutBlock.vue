<template>
  <div
    v-if="block?.content"
    :class="calloutClasses"
    class="my-6 p-4 rounded flex items-start gap-3 border-l-4"
  >
    <span v-if="block.icon" class="text-2xl flex-shrink-0">
      <i :class="iconClass" />
    </span>
    <div>
      <h4 v-if="block.title" class="font-semibold text-lg mb-2">
        {{ block.title }}
      </h4>
      <RegContentBlock :block="{ blockType: 'regRichText', content: block.content }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import RegContentBlock from './RegContentBlock.vue'

interface RegCalloutBlockData {
  id?: string
  blockType: 'regCallout'
  title?: string
  content: any
  backgroundColor?: string
  icon?: string
}

const props = defineProps({
  block: {
    type: Object as PropType<RegCalloutBlockData>,
    required: true,
  },
})

const calloutClasses = computed(() => {
  switch (props.block?.backgroundColor) {
    case 'bg-brandTheme-01':
      return 'bg-purple-50 border-purple-500'
    case 'bg-brandTheme-02':
      return 'bg-blue-50 border-blue-500'
    case 'bg-brandTheme-03':
      return 'bg-green-50 border-green-500'
    case 'bg-brandTheme-04':
      return 'bg-yellow-50 border-yellow-500'
    case 'bg-pink-light':
      return 'bg-pink-50 border-pink-500'
    case 'bg-purple-light':
      return 'bg-purple-100 border-purple-600'
    case 'none':
    default:
      return 'bg-white border-gray-300'
  }
})

const iconClass = computed(() => {
  return props.block?.icon ? props.block.icon : ''
})
</script>

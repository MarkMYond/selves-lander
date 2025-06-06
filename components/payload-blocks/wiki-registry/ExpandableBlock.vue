<template>
  <details
    :open="block.initiallyOpen || isOpen"
    class="my-6 border rounded group"
    @toggle="handleToggle"
  >
    <summary
      class="flex items-center justify-between p-3 cursor-pointer bg-brand-50 hover:bg-brand-100 rounded-t group-open:rounded-b-none"
    >
      <span class="font-medium text-gray-800">{{ block.title }}</span>
      <!-- <PhCaretDown
        :size="16"
        class="text-gray-500 transition-transform duration-200 group-open:rotate-180"
      /> -->
      <span>(v)</span> <!-- Placeholder for caret -->
    </summary>
    <div class="p-4 border-t">
      <ContentBlock :block="{ blockType: 'content', content: block.content }" />
    </div>
  </details>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'
// import { PhCaretDown } from '@phosphor-icons/vue'
import ContentBlock from './ContentBlock.vue'

interface ExpandableBlockData {
  id?: string
  blockType: 'expandableBlock'
  title: string
  initiallyOpen?: boolean
  content: any
}

const props = defineProps({
  block: {
    type: Object as PropType<ExpandableBlockData>,
    required: true,
  },
})

const isOpen = ref(props.block.initiallyOpen || false)

const handleToggle = (event: Event) => {
  isOpen.value = (event.target as HTMLDetailsElement).open
}
</script>

<style scoped>
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}
:deep(.prose p:last-child) {
  margin-bottom: 0;
}
</style>

<template>
  <div v-if="block.items && block.items.length" class="my-6">
    <div v-for="(item, idx) in block.items" :key="idx" class="mb-4 border rounded">
      <button
        class="w-full text-left px-4 py-2 font-semibold bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"
        @click="toggle(idx)"
      >
        {{ item.title }}
      </button>
      <div v-show="openIndexes[idx]" class="px-4 py-2 bg-white rounded-b">
        <RegContentBlock :block="{ blockType: 'regRichText', content: item.content }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'
import RegContentBlock from './RegContentBlock.vue'

interface RegAccordionBlockData {
  id?: string
  blockType: 'regAccordion'
  items: Array<{ title: string; content: any }>
}

const props = defineProps({
  block: {
    type: Object as PropType<RegAccordionBlockData>,
    required: true,
  },
})

const openIndexes = ref(props.block.items.map(() => false))

function toggle(idx: number) {
  openIndexes.value[idx] = !openIndexes.value[idx]
}
</script>

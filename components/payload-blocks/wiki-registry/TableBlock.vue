<template>
  <div class="my-6 overflow-x-auto">
    <h4
      v-if="block.title"
      class="font-semibold text-lg mb-2"
    >
      {{ block.title }}
    </h4>
    <div class="prose max-w-none">
      <ContentBlock
        :block="{ blockType: 'content', content: block.tableData }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import ContentBlock from './ContentBlock.vue'

interface TableBlockData {
  id?: string
  blockType: 'tableBlock'
  title?: string
  tableData: any
}

const props = defineProps({
  block: {
    type: Object as PropType<TableBlockData>,
    required: true,
  },
})
</script>

<style scoped>
:deep(table) {
  min-width: 600px;
}
</style>

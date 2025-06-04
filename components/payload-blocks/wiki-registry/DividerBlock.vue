<template>
  <hr class="my-8 border-brand-50" /> <!-- Changed border-gray-200 to border-brand-50 -->
</template>

<script setup lang="ts">
// No props needed for a simple divider
// Assuming structure for DividerBlock data from Payload (even if empty)
interface DividerBlockData {
  id?: string;
  blockType: 'dividerBlock';
}

// defineProps({
//   block: {
//     type: Object as PropType<DividerBlockData>,
//     required: true,
//   },
// })
</script>

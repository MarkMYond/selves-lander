<template>
  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300 py-1">
    <template v-if="availability === 'included'">
      <Icon name="ph:check-circle-fill" class="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
      <span>{{ featureText }}</span>
    </template>
    <template v-else-if="availability === 'not_included'">
      <Icon name="ph:x-circle-fill" class="mr-2 h-5 w-5 text-red-400 flex-shrink-0" />
      <span class="line-through text-gray-400 dark:text-gray-500">{{ featureText }}</span>
    </template>
    <template v-else-if="availability === 'custom'">
      <!-- For custom text, we might not want an icon, or a different one. 
           For now, just display text. The parent table cell will handle alignment. -->
      <span class="font-medium text-gray-800 dark:text-gray-100">{{ customText || featureText }}</span>
    </template>
    
    <Icon v-if="tooltip" name="ph:info" class="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help flex-shrink-0" :title="tooltip" />
  </li>
</template>

<script setup lang="ts">
import { defineProps, type PropType } from 'vue';
// Icon component is globally available via nuxt-icon

defineProps({
  featureText: {
    type: String,
    required: true,
  },
  availability: {
    type: String as PropType<'included' | 'not_included' | 'custom'>,
    default: 'not_included',
  },
  customText: {
    type: String,
    default: '',
  },
  tooltip: {
    type: String,
    required: false,
  },
});
</script>

<style scoped>
/* Add any specific styles if needed */
li {
  list-style: none; /* Ensure no default list bullets */
}
</style>

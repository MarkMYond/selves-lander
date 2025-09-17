<template>
  <div v-if="vibeItems && vibeItems.length > 0" class="mb-6">
    <h2 class="text-lg font-semibold mb-4">Vibe</h2>
    <div class="flex flex-wrap gap-5">
      <span 
        v-for="(item, index) in vibeItems" 
        :key="index"
        class="bg-purple-50 px-4 py-2 rounded-full text-sm"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  vibe: string[] | string | null;
}>();

// Parse JSON if it's a string, or handle array/object formats
const parsedVibe = computed(() => {
  if (typeof props.vibe === 'string') {
    try {
      const parsed = JSON.parse(props.vibe);
      // Handle array format
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // Handle object format - extract values
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.values(parsed);
      }
      // Handle single string value
      return [parsed];
    } catch {
      // If JSON parse fails, treat as single item
      return [props.vibe];
    }
  }
  
  if (Array.isArray(props.vibe)) {
    return props.vibe;
  }
  
  return [];
});

const vibeItems = computed(() => parsedVibe.value.filter(item => item && item.toString().trim()));
</script>

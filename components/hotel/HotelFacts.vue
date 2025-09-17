<template>
  <div v-if="factsItems && factsItems.length > 0" class="mb-6">
    <h2 class="text-lg font-semibold mb-4">Facts</h2>
    <div class="space-y-1">
      <div 
        v-for="(fact, index) in factsItems" 
        :key="index"
        class="flex items-center text-sm"
      >
        <span class="text-gray-400 mr-2">|</span>
        <span class="font-semibold capitalize">{{ fact.id }}:</span>
        <span class="ml-1">{{ fact.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Fact {
  id: string;
  text: string;
}

const props = defineProps<{
  facts: Fact[] | string | null;
}>();

// Parse JSON if it's a string, or handle array format
const parsedFacts = computed(() => {
  if (typeof props.facts === 'string') {
    try {
      const parsed = JSON.parse(props.facts);
      // Handle array format
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // Handle single object
      if (typeof parsed === 'object' && parsed !== null && parsed.id && parsed.text) {
        return [parsed];
      }
      return [];
    } catch {
      return [];
    }
  }
  
  if (Array.isArray(props.facts)) {
    return props.facts;
  }
  
  return [];
});

const factsItems = computed(() => 
  parsedFacts.value.filter(fact => fact && fact.id && fact.text)
);
</script>

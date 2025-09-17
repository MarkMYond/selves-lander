<template>
  <div class="mb-6">
    <h2 class="text-lg font-semibold mb-4">Points of Interest</h2>
    
    <div v-if="poiData && poiData.length > 0">
      <!-- Table Header -->
      <div class="grid grid-cols-3 gap-4 pb-2 mb-3 border-b border-gray-200 font-medium text-sm text-gray-700">
        <div>Name</div>
        <div>Description</div>
        <div>Travel Time</div>
      </div>
      
      <!-- Table Rows -->
      <div 
        v-for="(poi, index) in poiData" 
        :key="index"
        class="grid grid-cols-3 gap-4 py-2 text-sm border-b border-gray-100 last:border-b-0"
      >
        <div class="font-medium">{{ poi.name }}</div>
        <div class="text-gray-600">{{ poi.description }}</div>
        <div class="text-gray-500">{{ poi.travel_time }}</div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500">No points of interest available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface POIItem {
  name: string;
  description: string;
  travel_time: string;
}

const props = defineProps<{
  poi: POIItem[] | string | null;
}>();

// Parse JSON if it's a string
const parsedPOI = computed(() => {
  if (typeof props.poi === 'string') {
    try {
      const parsed = JSON.parse(props.poi);
      if (Array.isArray(parsed)) {
        return parsed as POIItem[];
      }
      return null;
    } catch {
      return null;
    }
  }
  
  if (Array.isArray(props.poi)) {
    return props.poi as POIItem[];
  }
  
  return null;
});

const poiData = computed(() => parsedPOI.value);
</script>

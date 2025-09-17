<template>
  <div v-if="facilitiesData && facilitiesData.length > 0" class="mb-6">
    <h2 class="text-lg font-semibold mb-4">Facilities</h2>
    <div class="w-1/2">
      <div class="font-mono text-sm space-y-1">
        <div 
          v-for="(row, index) in chunkedFacilities" 
          :key="index"
          class="flex items-center"
        >
          <span class="text-gray-400 mr-2">|</span>
          <span class="flex-1">{{ row[0] || '' }}</span>
          <span class="text-gray-400 mx-2">|</span>
          <span class="flex-1">{{ row[1] || '' }}</span>
          <span class="text-gray-400 mx-2">|</span>
          <span class="flex-1">{{ row[2] || '' }}</span>
          <span class="text-gray-400 ml-2">|</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  facilities: string[] | string | null;
}>();

// Parse JSON if it's a string, expecting array of facility names
const parsedFacilities = computed(() => {
  if (typeof props.facilities === 'string') {
    try {
      const parsed = JSON.parse(props.facilities);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  }
  
  if (Array.isArray(props.facilities)) {
    return props.facilities;
  }
  
  return [];
});

const facilitiesData = computed(() => parsedFacilities.value);

// Chunk the facilities into groups of 3 for table rows
const chunkedFacilities = computed(() => {
  const facilities = facilitiesData.value;
  const chunks = [];
  
  for (let i = 0; i < facilities.length; i += 3) {
    const chunk = facilities.slice(i, i + 3);
    // Pad with empty strings if needed
    while (chunk.length < 3) {
      chunk.push('');
    }
    chunks.push(chunk);
  }
  
  return chunks;
});
</script>

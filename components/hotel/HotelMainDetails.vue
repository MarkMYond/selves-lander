<template>
  <div v-if="details" class="space-y-1">
    <!-- Price Tier -->
    <div v-if="details.price_tier" class="flex items-center text-sm">
      <span class="text-gray-400 mr-2">|</span>
      <span>{{ details.price_tier }}</span>
    </div>
    
    <!-- Location -->
    <div v-if="details.geo" class="flex items-center text-sm">
      <span class="text-gray-400 mr-2">|</span>
      <span>{{ details.geo.latitude }}, {{ details.geo.longitude }}</span>
    </div>
    
    <!-- Check-in time -->
    <div v-if="details.check_in" class="flex items-center text-sm">
      <span class="text-gray-400 mr-2">|</span>
      <span>Check-in: {{ details.check_in }}</span>
    </div>
    
    <!-- Check-out time -->
    <div v-if="details.check_out" class="flex items-center text-sm">
      <span class="text-gray-400 mr-2">|</span>
      <span>Check-out: {{ details.check_out }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MainDetails {
  price_tier?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
  check_in?: string;
  check_out?: string;
  [key: string]: any;
}

const props = defineProps<{
  details: MainDetails | string | null;
}>();

// Parse JSON if it's a string
const parsedDetails = computed(() => {
  if (typeof props.details === 'string') {
    try {
      return JSON.parse(props.details) as MainDetails;
    } catch {
      return null;
    }
  }
  return props.details;
});

const details = computed(() => parsedDetails.value);
</script>

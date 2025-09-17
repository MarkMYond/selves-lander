<template>
  <div class="mb-6">
    <h2 class="text-lg font-semibold mb-4">Reviews</h2>
    
    <div v-if="reviewsData">
      <!-- Average Score (bolded at top) -->
      <div v-if="reviewsData.average_score || reviewsData.averageScore" class="mb-3">
        <span class="text-gray-400 mr-2">|</span>
        <span class="font-semibold text-sm">Average Score: {{ reviewsData.average_score || reviewsData.averageScore }}</span>
      </div>
      
      <!-- Score Breakdown -->
      <div v-if="reviewsData.score_breakdown" class="space-y-1">
        <div 
          v-for="(score, category) in reviewsData.score_breakdown" 
          :key="category"
          class="flex items-center text-sm"
        >
          <span class="text-gray-400 mr-2">|</span>
          <span class="capitalize">{{ category }}: {{ score }}</span>
        </div>
      </div>
      
      <!-- Individual Reviews (if they exist) -->
      <div v-if="reviewsData.reviews && reviewsData.reviews.length > 0" class="space-y-1 mt-3">
        <div 
          v-for="(review, index) in reviewsData.reviews" 
          :key="index"
          class="flex items-center text-sm"
        >
          <span class="text-gray-400 mr-2">|</span>
          <span>{{ review }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500">No reviews data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ReviewsData {
  average_score?: string | number;
  averageScore?: string | number;
  score_breakdown?: Record<string, number>;
  reviews?: string[];
}

const props = defineProps<{
  reviews: ReviewsData | string | null;
}>();

// Parse JSON if it's a string
const parsedReviews = computed(() => {
  if (typeof props.reviews === 'string') {
    try {
      const parsed = JSON.parse(props.reviews);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as ReviewsData;
      }
      return null;
    } catch {
      return null;
    }
  }
  
  if (typeof props.reviews === 'object' && props.reviews !== null) {
    return props.reviews as ReviewsData;
  }
  
  return null;
});

const reviewsData = computed(() => {
  console.log('Reviews data received:', props.reviews);
  console.log('Parsed reviews data:', parsedReviews.value);
  return parsedReviews.value;
});
</script>

<template>
  <figure v-if="imageUrl" class="my-6">
    <img
      :src="imageUrl"
      :alt="imageAlt"
      class="max-w-full h-auto mx-auto rounded"
      :style="imageStyle"
    />
    <figcaption v-if="block.caption" class="text-center text-base leading-relaxed text-gray-600 mt-2 italic [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']">
      {{ block.caption }}
    </figcaption>
  </figure>
  <div v-else class="my-6 p-4 bg-gray-100 rounded text-center">
    <p class="text-gray-600">Image not available</p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useMediaUrl } from '../../composables/useMediaUrl'

// Simple media interface to avoid relying on generated types
interface SimpleMedia {
  id?: string;
  url?: string;
  filename?: string;
  alt?: string;
  width?: number;
  height?: number;
}

// Simplified interface for ImageBlock data
interface SimpleImageBlockData {
  id?: string;
  blockType: 'imageBlock';
  image: SimpleMedia | string | null;
  caption?: string;
  width?: number;
}

const props = defineProps({
  block: {
    type: Object as PropType<SimpleImageBlockData>,
    required: true,
  },
})

// Use our media URL composable
const { getMediaUrl } = useMediaUrl();

// Extract image URL, handling all possible cases to prevent errors
const imageUrl = computed(() => {
  try {
    if (!props.block?.image) return '';
    
    // Case 1: If image is a string (ID or URL)
    if (typeof props.block.image === 'string') {
      return getMediaUrl(props.block.image);
    }
    
    // Case 2: If image is an object with a url
    if (props.block.image && typeof props.block.image === 'object' && props.block.image.url) {
      return props.block.image.url;
    }
    
    // Case 3: If image is an object with a filename
    if (props.block.image && typeof props.block.image === 'object' && props.block.image.filename) {
      return getMediaUrl(props.block.image.filename);
    }
    
    // No valid URL found
    return '';
  } catch (error) {
    console.error('Error getting image URL:', error);
    return ''; // Return empty string if there's an error
  }
})

// Extract alt text with proper fallbacks
const imageAlt = computed(() => {
  try {
    // If image is an object with alt property
    if (typeof props.block?.image === 'object' && props.block.image && props.block.image.alt) {
      return props.block.image.alt;
    }
    
    // Fallback to caption if available
    if (props.block?.caption) {
      return props.block.caption;
    }
    
    return 'Image'; // Default fallback
  } catch (error) {
    console.error('Error getting alt text:', error);
    return 'Image'; // Default fallback
  }
})

// Calculate inline style for width if provided
const imageStyle = computed(() => {
  try {
    // if (props.block?.width && props.block.width > 0) {
    //   // Increase the specified width by 1.5x, but cap at 100%
    //   const adjustedWidth = Math.min(100, props.block.width * 1.5);
    //   return { maxWidth: `${adjustedWidth}%` };
    // }
    return {}; // No specific width style
  } catch (error) {
    console.error('Error calculating image style:', error);
    return {}; // Default to no style
  }
})
</script>

<style scoped>
/* Scoped styles if needed */
figure {
  margin-left: auto;
  margin-right: auto;
}
</style>

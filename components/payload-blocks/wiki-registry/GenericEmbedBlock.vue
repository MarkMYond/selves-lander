<template>
  <div class="my-6 aspect-video" :style="embedStyle">
    <!-- Attempt to render as an iframe if it looks like an iframe tag -->
    <div v-if="isIframe" v-html="block.embedUrl" class="w-full h-full"></div>
    <!-- Otherwise, assume it's a URL and try embedding in a standard iframe -->
    <iframe
      v-else-if="isUrl"
      :src="block.embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="w-full h-full"
    ></iframe>
    <!-- Fallback if it's neither -->
    <div v-else class="p-4 border rounded bg-red-50 text-red-700">
      Invalid embed code or URL provided.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

// Assuming structure for GenericEmbedBlock data from Payload
interface GenericEmbedBlockData {
  id?: string;
  blockType: 'genericEmbedBlock';
  embedUrl: string; // Can be a URL or an HTML snippet (e.g., iframe)
  height?: number;
}

const props = defineProps({
  block: {
    type: Object as PropType<GenericEmbedBlockData>,
    required: true,
  },
})

// Check if the embed code looks like an iframe
const isIframe = computed(() => {
  return props.block?.embedUrl?.trim().startsWith('<iframe');
});

// Basic check if the input looks like a URL
const isUrl = computed(() => {
  try {
    new URL(props.block.embedUrl);
    return true;
  } catch (_) {
    return false;
  }
});

// Calculate inline style for height if provided
const embedStyle = computed(() => {
  if (props.block?.height && props.block.height > 0) {
    // If height is provided, override aspect-video and set height directly
    return { height: `${props.block.height}px`, aspectRatio: 'auto' };
  }
  // Default uses aspect-video class for 16:9 ratio
  return {};
})

</script>

<style scoped>
/* Ensure iframe fills the container */
iframe {
  display: block;
}
/* Ensure v-html content fills container if it's an iframe */
:deep(iframe) {
  width: 100%;
  height: 100%;
}
</style>

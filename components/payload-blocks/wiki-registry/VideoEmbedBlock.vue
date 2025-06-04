<template>
  <div class="my-6 overflow-hidden rounded shadow-md" :style="aspectRatioStyle">
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="absolute top-0 left-0 w-full h-full"
    ></iframe>
    <div v-else class="p-4 border rounded bg-red-50 text-red-700">
      Invalid video platform or ID provided.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

// Assuming structure for VideoEmbedBlock data from Payload
interface VideoEmbedBlockData {
  id?: string;
  blockType: 'videoEmbedBlock';
  platform: 'youtube' | 'vimeo';
  videoId: string;
  aspectRatio?: string; // e.g., '16/9', '4/3'
}

const props = defineProps({
  block: {
    type: Object as PropType<VideoEmbedBlockData>,
    required: true,
  },
})

// Construct the embed URL based on platform and video ID
const embedUrl = computed(() => {
  if (!props.block?.platform || !props.block?.videoId) {
    return null;
  }
  switch (props.block.platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${props.block.videoId}`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${props.block.videoId}`;
    default:
      return null;
  }
});

// Calculate aspect ratio for the container
// Uses Tailwind's aspect-ratio plugin classes if available, otherwise inline style fallback
const aspectRatioStyle = computed(() => {
  const ratio = props.block?.aspectRatio || '16/9'; // Default to 16:9
  const [width, height] = ratio.split('/').map(Number);
  if (width && height) {
    // Padding-top trick for aspect ratio
    return {
      position: 'relative' as 'relative', // Explicitly type 'relative'
      paddingTop: `${(height / width) * 100}%`,
    };
  }
  // Fallback style if ratio is invalid (shouldn't happen with select field)
  return { position: 'relative' as 'relative', paddingTop: '56.25%' }; // 16:9 default
});

</script>

<style scoped>
/* Ensures iframe fills the relatively positioned container with padding */
iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

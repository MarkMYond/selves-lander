<template>
  <div
    class="my-6 overflow-hidden rounded shadow-md"
    :style="aspectRatioStyle"
  >
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="absolute top-0 left-0 w-full h-full"
    />
    <div
      v-else
      class="p-4 border rounded bg-red-50 text-red-700"
    >
      Invalid video platform or ID provided.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

interface VideoEmbedBlockData {
  id?: string
  blockType: 'videoEmbedBlock'
  platform: 'youtube' | 'vimeo'
  videoId: string
  aspectRatio?: string
}

const props = defineProps({
  block: {
    type: Object as PropType<VideoEmbedBlockData>,
    required: true,
  },
})

const embedUrl = computed(() => {
  if (!props.block?.platform || !props.block?.videoId) {
    return null
  }
  switch (props.block.platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${props.block.videoId}`
    case 'vimeo':
      return `https://player.vimeo.com/video/${props.block.videoId}`
    default:
      return null
  }
})

const aspectRatioStyle = computed(() => {
  const ratio = props.block?.aspectRatio || '16/9'
  const [width, height] = ratio.split('/').map(Number)
  if (width && height) {
    return {
      position: 'relative' as const,
      paddingTop: `${(height / width) * 100}%`,
    }
  }
  return { position: 'relative' as const, paddingTop: '56.25%' }
})
</script>

<style scoped>
iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

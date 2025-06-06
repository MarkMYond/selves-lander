<template>
  <div
    class="my-6 aspect-video"
    :style="embedStyle"
  >
    <div
      v-if="isIframe"
      class="w-full h-full"
      v-html="block.embedUrl"
    />
    <iframe
      v-else-if="isUrl"
      :src="block.embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="w-full h-full"
    />
    <div
      v-else
      class="p-4 border rounded bg-red-50 text-red-700"
    >
      Invalid embed code or URL provided.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

interface GenericEmbedBlockData {
  id?: string
  blockType: 'genericEmbedBlock'
  embedUrl: string
  height?: number
}

const props = defineProps({
  block: {
    type: Object as PropType<GenericEmbedBlockData>,
    required: true,
  },
})

const isIframe = computed(() => {
  return props.block?.embedUrl?.trim().startsWith('<iframe')
})

const isUrl = computed(() => {
  try {
    new URL(props.block.embedUrl)
    return true
  } catch (_) {
    return false
  }
})

const embedStyle = computed(() => {
  if (props.block?.height && props.block.height > 0) {
    return { height: `${props.block.height}px`, aspectRatio: 'auto' }
  }
  return {}
})
</script>

<style scoped>
iframe {
  display: block;
}
:deep(iframe) {
  width: 100%;
  height: 100%;
}
</style>

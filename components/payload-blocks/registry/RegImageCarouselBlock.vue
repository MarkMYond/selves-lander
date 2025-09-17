<template>
  <div v-if="block.images && block.images.length" class="my-6">
    <div class="flex gap-2 overflow-x-auto">
      <div
        v-for="(img, idx) in visibleImages"
        :key="img.image?.id || idx"
        class="w-24 h-24 flex-shrink-0 rounded overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center"
      >
        <img
          v-if="img.image?.url"
          :src="img.image.url"
          alt="Thumbnail"
          class="object-cover w-full h-full"
        />
        <span v-else class="text-xs text-gray-400">No Image</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

interface RegImageCarouselBlockData {
  id?: string
  blockType: 'regImageCarousel'
  images: Array<{ image: { id?: string; url?: string } }>
  visibleThumbnails?: number
}

const props = defineProps({
  block: {
    type: Object as PropType<RegImageCarouselBlockData>,
    required: true,
  },
})

const visibleImages = computed(() => {
  const count = props.block.visibleThumbnails || 4
  return props.block.images.slice(0, count)
})
</script>

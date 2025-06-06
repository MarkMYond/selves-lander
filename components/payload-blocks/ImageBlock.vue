<template>
  <figure
    v-if="imageUrl"
    class="my-6"
  >
    <img
      :src="imageUrl"
      :alt="imageAlt"
      class="max-w-full h-auto mx-auto rounded"
      :style="imageStyle"
    >
    <figcaption
      v-if="block.caption"
      class="text-center text-base leading-relaxed text-gray-600 mt-2 italic [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
    >
      {{ block.caption }}
    </figcaption>
  </figure>
  <div
    v-else
    class="my-6 p-4 bg-gray-100 rounded text-center"
  >
    <p class="text-gray-600">
      Image not available
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useMediaUrl } from '../../composables/useMediaUrl'

interface SimpleMedia {
  id?: string
  url?: string
  filename?: string
  alt?: string
  width?: number
  height?: number
}

interface SimpleImageBlockData {
  id?: string
  blockType: 'imageBlock'
  image: SimpleMedia | string | null
  caption?: string
  width?: number
}

const props = defineProps({
  block: {
    type: Object as PropType<SimpleImageBlockData>,
    required: true,
  },
})

const { getMediaUrl } = useMediaUrl()

const imageUrl = computed(() => {
  try {
    if (!props.block?.image) return ''

    if (typeof props.block.image === 'string') {
      return getMediaUrl(props.block.image)
    }

    if (
      props.block.image &&
      typeof props.block.image === 'object' &&
      props.block.image.url
    ) {
      return props.block.image.url
    }

    if (
      props.block.image &&
      typeof props.block.image === 'object' &&
      props.block.image.filename
    ) {
      return getMediaUrl(props.block.image.filename)
    }

    return ''
  } catch (error) {
    console.error('Error getting image URL:', error)
    return ''
  }
})

const imageAlt = computed(() => {
  try {
    if (
      typeof props.block?.image === 'object' &&
      props.block.image &&
      props.block.image.alt
    ) {
      return props.block.image.alt
    }

    if (props.block?.caption) {
      return props.block.caption
    }

    return 'Image'
  } catch (error) {
    console.error('Error getting alt text:', error)
    return 'Image'
  }
})

const imageStyle = computed(() => {
  try {
    return {}
  } catch (error) {
    console.error('Error calculating image style:', error)
    return {}
  }
})
</script>

<style scoped>
figure {
  margin-left: auto;
  margin-right: auto;
}
</style>

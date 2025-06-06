<template>
  <div
    v-if="block"
    class="pt-20 pb-20 max-md:pt-20 max-md:pb-20 max-sm:pt-12 max-sm:pb-12"
    :class="sectionBgClass"
  >
    <div
      class="relative px-16 mx-auto max-md:px-8 max-sm:px-4"
      :class="containerClass"
    >
      <div
        class="flex flex-wrap gap-5 justify-between items-center px-11 py-9 rounded-2xl grid-rows-[auto_auto] mx-auto max-md:flex-col max-md:gap-3.5 max-md:px-9 max-md:py-7 max-md:text-center max-sm:gap-3.5 max-sm:px-5 max-sm:py-7 border-[3px] border-solid border-brand-primary"
        :class="contentBgClass"
      >
        <div
          class="max-w-[375px] pr-7 max-md:text-center max-md:max-w-[323px] max-md:pr-0 max-md:mb-4 max-sm:max-w-[309px]"
        >
          <p
            v-if="block.title"
            class="text-brand-900 dark:text-brand-100 text-3xl leading-10 max-md:text-4xl max-md:leading-tight max-md:text-center max-sm:text-3xl max-sm:leading-9"
          >
            {{ block.title }}
          </p>
        </div>

        <div
          v-if="block.logos && block.logos.length > 0"
          class="flex-1 relative overflow-hidden w-full"
        >
          <div
            class="flex logo-slider py-2"
            :class="{ 'animate-slide': shouldAnimate }"
            :style="{ width: `${logoContainerWidth}px` }"
          >
            <template
              v-for="(logoItem, index) in block.logos"
              :key="`original-${logoItem.id || `logo-${index}`}`"
            >
              <div
                class="logo-item shrink-0 flex items-center justify-center mx-4"
              >
                <img
                  v-if="logoItem.logo?.url"
                  :alt="logoItem.altText || 'Client logo'"
                  :src="getMediaUrl(logoItem.logo)"
                  class="object-contain max-w-[120px] max-h-[80px] align-middle overflow-x-clip overflow-y-clip max-md:max-w-[100px] max-md:max-h-[70px] max-sm:max-w-[90px] max-sm:max-h-[65px]"
                >
              </div>
            </template>

            <template
              v-for="(logoItem, index) in block.logos"
              :key="`duplicate-${logoItem.id || `logo-${index}`}`"
            >
              <div
                class="logo-item shrink-0 flex items-center justify-center mx-4"
              >
                <img
                  v-if="logoItem.logo?.url"
                  :alt="logoItem.altText || 'Client logo'"
                  :src="getMediaUrl(logoItem.logo)"
                  class="object-contain max-w-[120px] max-h-[80px] align-middle overflow-x-clip overflow-y-clip max-md:max-w-[100px] max-md:max-h-[70px] max-sm:max-w-[90px] max-sm:max-h-[65px]"
                >
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="py-12 bg-brand-50"
  >
    <div class="container mx-auto px-4">
      <p class="text-center text-gray-500">
        Client logos content unavailable
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'
import type { Media } from '../../../src/payload-types'

const { getMediaUrl } = useMediaUrl()

const props = defineProps<{
  block?: {
    blockType: 'clientLogos'
    title?: string
    logos?: Array<{
      logo: Media | null
      altText?: string
      id?: string | null
    }>
    sectionBackgroundColor?: string | null
    contentBackgroundColor?: string | null
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null
    id?: string | null
  }
}>()

const shouldAnimate = ref(false)
const logoContainerWidth = ref(0)

onMounted(() => {
  if (props.block && props.block.logos && props.block.logos.length > 0) {
    const calculateWidth = () => {
      if (!props.block?.logos) return; // Guard against undefined logos array
      const isMobile = window.innerWidth < 768
      const logoWidth = isMobile ? 136 : 160
      const singleSetWidth = props.block.logos.length * logoWidth
      logoContainerWidth.value = singleSetWidth * 2
    }

    calculateWidth()

    window.addEventListener('resize', calculateWidth)

    shouldAnimate.value = props.block.logos.length > 2
  }
})

const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'light-grey':
      return 'bg-brand-50'
    default:
      return 'bg-' + props.block?.sectionBackgroundColor
  }
})

const contentBgClass = computed(() => {
  switch (props.block?.contentBackgroundColor) {
    case 'light-grey':
      return 'bg-brand-50'
    default:
      return 'bg-' + props.block?.contentBackgroundColor
  }
})

const containerClass = computed(() => {
  switch (props.block?.containerWidth) {
    case 'medium':
      return 'max-w-5xl'
    case 'wide':
      return 'max-w-7xl'
    case 'full':
      return 'max-w-none'
    default:
      return 'max-w-7xl'
  }
})
</script>

<style scoped>
.logo-slider {
  transition: transform 0.5s ease;
}

.animate-slide {
  animation: scroll 25s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.logo-slider:hover {
  animation-play-state: paused;
}

@media (max-width: 768px) {
  .logo-item {
    margin-left: 8px;
    margin-right: 8px;
  }
}
</style>

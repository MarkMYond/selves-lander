<template>
  <section
    class="brand-logo-outer-section block-section-padding"
    :class="[outerBackgroundColorClass]"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="brand-logo-inner-container relative p-8 md:p-12 rounded-xl"
        :class="[innerContainerBackgroundColorClass]"
      >
        <div
          v-if="block.title"
          class="text-center mb-8 md:mb-12"
        >
          <p
            class="text-xl sm:text-2xl font-semibold"
            :class="[titleColorClass]"
          >
            {{ block.title }}
          </p>
        </div>

        <div class="logo-slider-wrapper overflow-hidden w-full relative">
          <div
            v-if="block.logos && block.logos.length > 0"
            class="flex animate-marquee-continuous"
          >
            <div
              v-for="(item, index) in block.logos"
              :key="`logo-${index}`"
              class="flex-none px-6 md:px-10 flex items-center"
            >
              <img
                v-if="
                  item.logoImage &&
                    typeof item.logoImage === 'object' &&
                    item.logoImage.url
                "
                :src="getMediaUrl(item.logoImage)"
                :alt="item.altText || 'Brand Logo'"
                loading="lazy"
                class="max-h-10 md:max-h-12 object-contain"
                :class="{
                  'filter-for-dark-bg': block.backgroundColor === 'dark',
                }"
              >
              <div
                class="logo-logo-divider-1 h-8 w-px ml-6 md:ml-10"
                :class="dividerColorClass"
              />
            </div>
            <div
              v-for="(item, index) in block.logos"
              :key="`logo-dup-${index}`"
              class="flex-none px-6 md:px-10 flex items-center"
              aria-hidden="true"
            >
              <img
                v-if="
                  item.logoImage &&
                    typeof item.logoImage === 'object' &&
                    item.logoImage.url
                "
                :src="getMediaUrl(item.logoImage)"
                :alt="item.altText || 'Brand Logo'"
                loading="lazy"
                class="max-h-10 md:max-h-12 object-contain"
                :class="{
                  'filter-for-dark-bg': block.backgroundColor === 'dark',
                }"
              >
              <div
                class="logo-logo-divider-1 h-8 w-px ml-6 md:ml-10"
                :class="dividerColorClass"
              />
            </div>
          </div>
          <div
            class="slider-overlay-right absolute top-0 bottom-0 right-0 w-16 md:w-24 bg-gradient-to-l pointer-events-none"
            :class="overlayGradientClassRightInner"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '@/composables/useMediaUrl'
import type { Media } from '@/src/payload-types'
import type { BrandLogosBlock as BrandLogosBlockType } from '@/src/payload-types'

const props = defineProps<{
  block: BrandLogosBlockType
}>()

const { getMediaUrl } = useMediaUrl()

const outerBackgroundColorClass = computed(() => {
  switch (props.block.backgroundColor) {
    case 'dark':
      return 'bg-transparent'
    case 'light':
      return 'bg-transparent'
    case 'transparent':
      return 'bg-transparent'
    default:
      return 'bg-transparent'
  }
})

const innerContainerBackgroundColorClass = computed(() => {
  if (props.block.backgroundColor === 'dark') {
    return 'bg-[#1f1f1f]'
  }
  return 'bg-brandNeutral-02'
})

const titleColorClass = computed(() => {
  if (props.block.backgroundColor === 'dark') {
    return 'text-brandNeutral-01'
  }
  return 'text-brandNeutral-04 dark:text-brandNeutral-02'
})

const overlayGradientClassRightInner = computed(() => {
  if (props.block.backgroundColor === 'dark') return 'to-[#1f1f1f]'
  return 'to-brandNeutral-02'
})

const paddingMap = {
  none: 'py-0',
  small: 'py-8 md:py-10',
  medium: 'py-12 md:py-16',
  large: 'py-16 md:py-24',
}

const paddingTopClass = computed(() => {
  const paddingValue = props.block.paddingTop || 'medium'
  return paddingMap[paddingValue]?.replace('py-', 'pt-') || 'pt-12 md:pt-16'
})

const paddingBottomClass = computed(() => {
  const paddingValue = props.block.paddingBottom || 'medium'
  return paddingMap[paddingValue]?.replace('py-', 'pb-') || 'pb-12 md:pb-16'
})

const dividerColorClass = computed(() => {
  if (props.block.backgroundColor === 'dark') {
    return 'bg-gray-600'
  }
  return 'bg-black bg-opacity-15'
})
</script>

<style scoped>
@keyframes marquee-continuous {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee-continuous {
  animation: marquee-continuous 30s linear infinite;
  will-change: transform;
}

.slider-overlay-left,
.slider-overlay-right {
  filter: blur(
    10px
  );
}

.filter-for-dark-bg {
  filter: brightness(0) invert(1);
}
</style>

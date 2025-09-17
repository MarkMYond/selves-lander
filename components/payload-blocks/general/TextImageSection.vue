<script setup lang="ts">
import { computed } from 'vue'
import type { TextImageSectionBlock } from '../../../src/payload-types'
import BaseButton from '@/components/ui/BaseButton.vue' // Import BaseButton
import { useMediaUrl } from '@/composables/useMediaUrl' // Added missing import

// Update props to accept a block prop
const props = defineProps<{
  block: Omit<TextImageSectionBlock, 'containerWidth'> & {
    // Omit containerWidth as it's removed from Payload
    id: string
    removeTopPadding?: boolean | null
    removeBottomPadding?: boolean | null
    imagePosition?: 'left' | 'right'
    imageBackgroundColor?: string | null // Added for image background color
    // containerWidth is no longer a direct prop from Payload for this block
  }
}>()

// Provide default value for imagePosition
const imagePosition = computed(() => props.block.imagePosition || 'right')

const { getMediaUrl } = useMediaUrl()

// Helper to check if a URL is external (starts with http:// or https:// or //)
const isExternalUrl = (url: string): boolean => {
  return /^(https?:)?\/\//.test(url)
}

// Map Payload background color values to Tailwind classes
const sectionBgClass = computed(() => {
  // 'light-grey' is not a valid option in TextImageSectionBlock type for sectionBackgroundColor
  // It's mapped to 'bg-brand-50' if it were, but direct use of 'brand-50' from Payload is preferred.
  // Defaulting to a transparent background if 'none' or if the value is unexpected.
  if (
    props.block?.sectionBackgroundColor === 'none' ||
    !props.block?.sectionBackgroundColor
  ) {
    return 'bg-transparent'
  }
  return 'bg-' + props.block.sectionBackgroundColor
})

const contentBgClass = computed(() => {
  // 'light-grey' is not a valid option in TextImageSectionBlock type for contentBackgroundColor
  // Defaulting to a transparent background if 'none' or if the value is unexpected.
  if (
    props.block?.contentBackgroundColor === 'none' ||
    !props.block?.contentBackgroundColor
  ) {
    return 'bg-transparent'
  }
  return 'bg-' + props.block.contentBackgroundColor
})

const imageBgClass = computed(() => {
  if (
    props.block?.imageBackgroundColor &&
    props.block.imageBackgroundColor !== 'none'
  ) {
    return 'bg-' + props.block.imageBackgroundColor
  }
  return 'bg-brandNeutral-02' // Default background if none specified or 'none'
})

// Determine image URL using the composable
const imageUrl = computed(() => {
  if (
    props.block.image &&
    typeof props.block.image === 'object' &&
    'url' in props.block.image
  ) {
    return getMediaUrl(props.block.image.url)
  }
  return null
})

// Determine alt text
const imageAlt = computed(() => {
  if (
    props.block.image &&
    typeof props.block.image === 'object' &&
    'alt' in props.block.image
  ) {
    return props.block.image.alt || 'Section image'
  }
  return 'Section image'
})

// Unused computed properties (containerClass, getButtonClasses) have been removed.

// Re-introduce conditional padding logic
const dynamicPaddingClass = computed(() => {
  const topPadding = props.block.removeTopPadding ? 'pt-0' : 'pt-16'
  const bottomPadding = props.block.removeBottomPadding ? 'pb-0' : 'pb-16'

  // If block-section-padding is py-16, then pt-16 and pb-16 are its components.
  // If both are pt-0 and pb-0, effectively py-0.
  if (topPadding === 'pt-0' && bottomPadding === 'pb-0') return 'py-0'
  if (topPadding === 'pt-16' && bottomPadding === 'pb-16')
    return 'block-section-padding' // py-16

  return `${topPadding} ${bottomPadding}` // Handles mixed cases like pt-0 pb-16 or pt-16 pb-0
})
</script>

<template>
  <section
    :class="[sectionBgClass, dynamicPaddingClass, 'text-image-feature-item']"
  >
    <div
      class="relative"
      :class="[contentBgClass]"
    >
      <div
        class="flex gap-12 items-center w-full max-lg:flex-col max-md:gap-9 max-sm:gap-9"
        :class="[
          {
            'flex-row-reverse': imagePosition === 'left',
            'flex-row': imagePosition === 'right',
          },
        ]"
      >
        <div class="flex-1">
          <div class="flex-1 mx-auto max-w-[618px] max-md:max-w-none">
            <h2
              v-if="props.block.title"
              class="text-brandNeutral-04 dark:text-brandNeutral-01 mb-6 md:mb-8 font-semibold tracking-[-0.01em]"
              :class="
                props.block.titleStyle === 'large'
                  ? 'text-8xl leading-[96px] max-md:text-7xl max-md:leading-[76px] max-sm:text-5xl max-sm:leading-[56px]'
                  : 'text-[30px] leading-[1.3em] sm:text-[30px] md:text-[36px] lg:text-[40px]'
              "
              v-html="props.block.title"
            />
            <p
              v-if="props.block.description"
              class="text-body-18 leading-1.7 text-brandNeutral-03 dark:text-brandNeutral-02 mb-8 md:mb-10 max-w-none [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            >
              {{ props.block.description }}
            </p>
            <div
              v-if="props.block.buttons && props.block.buttons.length > 0"
              class="flex flex-wrap gap-4"
            >
              <template
                v-for="(button, index) in props.block.buttons"
                :key="index"
              >
                <BaseButton
                  :to="!isExternalUrl(button.url) ? button.url : undefined"
                  :href="isExternalUrl(button.url) ? button.url : undefined"
                  :target="isExternalUrl(button.url) ? '_blank' : undefined"
                  :variant="
                    button.style === 'secondary' ? 'secondary' : 'primary'
                  "
                  :aria-label="button.text"
                >
                  {{ button.text }}
                </BaseButton>
              </template>
            </div>
          </div>
        </div>
        <div
          v-if="imageUrl"
          class="flex-1 rounded-xl flex items-end justify-center px-4 pt-[42px]"
          :class="[imageBgClass]"
        >
          <img
            :src="imageUrl"
            :alt="imageAlt"
            class="overflow-hidden w-full max-w-full h-auto align-middle rounded-2xl"
            loading="lazy"
          >
        </div>
      </div>
    </div>
  </section>
</template>

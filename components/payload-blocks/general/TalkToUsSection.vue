<template>
  <section
    class="flex relative justify-center items-center w-full py-16 md:py-20"
    :class="sectionBgClass"
  >
    <div
      class="mx-auto w-full px-6"
      :class="containerClass"
    >
      <div class="py-10 md:py-16">
        <div
          class="grid gap-6 md:gap-10 justify-items-stretch items-center w-full grid-rows-[auto]"
        >
          <img
            v-if="block?.image && typeof block.image === 'object'"
            :src="getMediaUrl(block.image)"
            :alt="block.image.alt || 'Illustration'"
            class="self-center w-full max-w-xs md:max-w-sm lg:max-w-md align-middle select-none overflow-x-clip overflow-y-clip row-[1_/_2] col-[1_/_2]"
          >
          <div
            v-else
            class="self-center row-[1_/_2] col-[1_/_2] text-center italic text-gray-500"
          >
            [Image Placeholder]
          </div>

          <div
            class="self-center row-[1_/_2] col-[1_/_2] text-center md:text-left md:pl-10 lg:pl-16 z-10"
          >
            <div
              v-if="block?.title"
              class="text-3xl md:text-4xl leading-tight mb-6 md:mb-8"
            >
              {{ block.title }}
            </div>
            <a
              v-if="block?.ctaButton?.url && block.ctaButton.text"
              :href="block.ctaButton.url"
              :class="getButtonClasses(block.ctaButton.style)"
            >
              {{ block.ctaButton.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'
import type { Media } from '../../../src/payload-types'
import type { SupportNinjaSectionBlock } from '../../../src/payload-types'

const { getMediaUrl } = useMediaUrl()

const props = defineProps<{
  block?: SupportNinjaSectionBlock & {
    sectionBackgroundColor?: string | null
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null
    id?: string | null
  }
}>()

const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white':
      return 'bg-white'
    case 'brand-50':
      return 'bg-brand-50'
    // 'light-grey', 'brand-900', 'brand-primary' are not valid according to SupportNinjaSectionBlock type
    // Handle 'none', 'gradient', null, undefined explicitly if needed
    default:
      if (props.block?.sectionBackgroundColor === 'none' || !props.block?.sectionBackgroundColor) {
        return 'bg-transparent';
      }
      // For other valid types like 'gradient', or if new valid types are added
      // and not explicitly handled above, this will attempt to use them.
      // Ensure Tailwind is configured for classes like 'bg-gradient' if used.
      return 'bg-' + props.block?.sectionBackgroundColor // Fallback, might result in non-existent class
  }
})

const containerClass = computed(() => {
  switch (props.block?.containerWidth) {
    case 'medium':
      return 'container max-w-5xl'
    case 'wide':
      return 'container max-w-7xl'
    case 'full':
      return 'max-w-none px-0'
    default:
      return 'container max-w-[1140px]'
  }
})

const getButtonClasses = (
  style: 'primary' | 'secondary' | undefined | null
) => {
  const base =
    'inline-block px-6 py-3 text-base font-medium text-center rounded-[52px] transition-colors'
  // The template directly uses Tailwind classes for the button, so this function isn't strictly necessary
  // for the current template structure but kept for consistency if button styling becomes more complex.
  if (style === 'secondary') {
    return `${base} bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50`
  }
  return `${base} bg-blue-600 text-white hover:bg-blue-700`
}
</script>

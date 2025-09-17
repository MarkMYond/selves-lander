<template>
  <section
    class="pt-16 max-sm:pt-20"
    :class="[
      sectionBgClass,
      { 'pb-16 max-md:pb-10': !block.removeBottomPadding },
    ]"
  >
    <div
      class="grid gap-x-20 gap-y-10 mx-auto w-full"
      :class="[
        containerClass,
        block.image ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1',
        horizontalPaddingClass,
      ]"
    >
      <div
        class="text-center w-full p-4 rounded"
        :class="[{ 'md:col-span-2': !block.image }, contentBgClass]"
      >
        <p
          v-if="block.superTitle"
          class="text-base leading-relaxed font-semibold uppercase tracking-wider text-brand-primary mb-2 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ block.superTitle }}
        </p>
        <component
          :is="block.useH1ForTitle ? 'h1' : 'h2'"
          v-if="block.title"
          :class="[
            'text-brand-900 dark:text-brand-100 tracking-tight',
            block.titleStyle === 'large'
              ? 'mb-10 text-7xl leading-[86px] max-md:mb-7 max-md:text-6xl max-md:leading-[66px] max-sm:mb-7 max-sm:text-4xl max-sm:leading-10'
              : 'text-5xl leading-tight mb-4 max-md:text-4xl max-sm:text-3xl',
          ]"
        >
          {{ block.title }}
        </component>
        <p
          v-if="block.description"
          class="text-xl leading-8 text-brand-900 dark:text-brand-100 mb-10 max-md:mb-7 max-sm:mb-7 max-w-none [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ block.description }}
        </p>
        <slot name="extra" />
        <div
          v-if="block.includeButton && block.button?.url"
          class="flex justify-center mt-4"
        >
          <NuxtLink
            v-if="!isExternalUrl(block.button.url)"
            :to="block.button.url"
            :class="getButtonClasses(block.button.style)"
          >
            {{ block.button.text || 'Learn More' }}
          </NuxtLink>
          <a
            v-else
            :href="block.button.url"
            :class="getButtonClasses(block.button.style)"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ block.button.text || 'Learn More' }}
          </a>
        </div>
      </div>
      <div
        v-if="block.image"
        class="w-full p-4 rounded"
        :class="contentBgClass"
      >
        <img
          width="479"
          :alt="block.image?.alt || 'Feature image'"
          :src="getMediaUrl(block.image)"
          class="object-contain relative mx-auto align-middle rounded-lg select-none max-h-[550px] max-w-[600px] overflow-x-clip overflow-y-clip"
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'
import type { Media, FeatureSection } from '../../../src/payload-types'

const { getMediaUrl } = useMediaUrl()

const isExternalUrl = (url: string): boolean => {
  return /^(https?:)?\/\//.test(url)
}

const props = defineProps<{
  block: FeatureSection & {
    superTitle?: string | null
    description?: string | null
    image?: Media | null
    button?: {
      text: string
      style?: 'primary' | 'secondary' | null
      url: string
    } | null
    includeButton?: boolean
    useH1ForTitle?: boolean | null
    removeBottomPadding?: boolean | null
    sectionBackgroundColor?: string | null
    contentBackgroundColor?: string | null
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null
    id?: string | null
  }
}>()

const getButtonClasses = (
  style: 'primary' | 'secondary' | undefined | null
) => {
  const baseClasses =
    'inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm'
  if (style === 'secondary') {
    return `${baseClasses} border-[3px] border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white`
  }
  return `${baseClasses} border border-transparent text-white bg-brand-primary hover:bg-brand-900`
}

const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    // case 'light-grey': // Not a valid type for FeatureSection.sectionBackgroundColor
    //   return 'bg-brand-50'
    default:
      // If sectionBackgroundColor is one of the valid types like 'white', 'brand-50', etc.
      // this will correctly apply 'bg-white', 'bg-brand-50'.
      // If it's an unhandled valid type like 'none' or 'gradient', or null/undefined,
      // this might result in 'bg-none', 'bg-gradient', 'bg-null', or 'bg-undefined'.
      // Ensure your Tailwind config or global styles handle these if they are intended.
      // For 'none' or transparent, 'bg-transparent' is usually appropriate.
      if (props.block?.sectionBackgroundColor === 'none' || !props.block?.sectionBackgroundColor) {
        return 'bg-transparent';
      }
      return 'bg-' + props.block?.sectionBackgroundColor
  }
})

const contentBgClass = computed(() => {
  switch (props.block?.contentBackgroundColor) {
    // case 'light-grey': // Not a valid type for FeatureSection.contentBackgroundColor
    //   return 'bg-brand-50'
    default:
      // Similar logic as sectionBgClass
      if (props.block?.contentBackgroundColor === 'none' || !props.block?.contentBackgroundColor) {
        return 'bg-transparent';
      }
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

const horizontalPaddingClass = computed(() => {
  if (props.block?.titleStyle === 'large') {
    return 'px-36 max-md:px-16 max-sm:px-8'
  }
  return 'px-44 max-md:px-16 max-sm:px-8'
})
</script>

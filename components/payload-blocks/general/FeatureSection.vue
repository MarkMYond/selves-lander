<template>
  <!-- Outer section for full-width background and vertical spacing -->
  <!-- Bottom padding is now conditional -->
  <section
    class="pt-16 max-sm:pt-20"
    :class="[
      sectionBgClass,
      { 'pb-16 max-md:pb-10': !block.removeBottomPadding }, // Apply padding only if checkbox is false/unchecked
    ]"
  >
    <!-- Inner div for container width and grid layout -->
    <!-- Re-added horizontal padding px-52 -->
    <div
      class="grid gap-x-20 gap-y-10 mx-auto w-full"
      :class="[
        containerClass,
        block.image ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1', // Dynamic grid columns
        horizontalPaddingClass, // Added computed horizontal padding
      ]"
    >
      <!-- Text container centered, removed max-w, added contentBgClass -->
      <div
        class="text-center w-full p-4 rounded"
        :class="[{ 'md:col-span-2': !block.image }, contentBgClass]"
      >
        <!-- Added Super Title -->
        <p
          v-if="block.superTitle"
          class="text-base leading-relaxed font-semibold uppercase tracking-wider text-brand-primary mb-2 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ block.superTitle }}
        </p>
        <!-- Updated title classes -->
        <component
          v-if="block.title"
          :is="block.useH1ForTitle ? 'h1' : 'h2'"
          :class="[
            'text-brand-900 dark:text-brand-100 tracking-tight',
            block.titleStyle === 'large'
              ? 'mb-10 text-7xl leading-[86px] max-md:mb-7 max-md:text-6xl max-md:leading-[66px] max-sm:mb-7 max-sm:text-4xl max-sm:leading-10' // Large style (matches previous useH1ForTitle true)
              : 'text-5xl leading-tight mb-4 max-md:text-4xl max-sm:text-3xl', // Standard style (matches previous useH1ForTitle false)
          ]"
        >
          {{ block.title }}
        </component>
        <!-- Reverted to description, applied small body text style -->
        <p
          v-if="block.description"
          class="text-xl leading-8 text-brand-900 dark:text-brand-100 mb-10 max-md:mb-7 max-sm:mb-7 max-w-none [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ block.description }}
        </p>
        <slot name="extra"></slot>
        <!-- Moved button container inside text container -->
        <div
          v-if="block.includeButton && block.button?.url"
          class="flex justify-center mt-4"
        >
          <!-- Use NuxtLink for internal URLs -->
          <NuxtLink
            v-if="!isExternalUrl(block.button.url)"
            :to="block.button.url"
            :class="getButtonClasses(block.button.style)"
          >
            {{ block.button.text || 'Learn More' }}
          </NuxtLink>
          <!-- Use regular anchor for external URLs -->
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
      <!-- Image container remains conditional, removed max-w, added contentBgClass -->
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
        />
        <!-- Removed v-else placeholder -->
      </div>
      <!-- Button container removed from here -->
    </div>
    <!-- Close inner grid div -->
  </section>
  <!-- Close outer section -->
</template>

<script setup lang="ts">
import { computed } from 'vue' // Import computed
import { useMediaUrl } from '../../../composables/useMediaUrl' // Import useMediaUrl
import type { Media, FeatureSection } from '../../../src/payload-types' // Import Media type and FeatureSection interface

// useRuntimeConfig is auto-imported by Nuxt 3
// const config = useRuntimeConfig() // No longer needed
const { getMediaUrl } = useMediaUrl() // Use the composable

// Helper to check if a URL is external (starts with http:// or https:// or //)
const isExternalUrl = (url: string): boolean => {
  return /^(https?:)?\/\//.test(url)
}

// Define props using the imported interface, adding superTitle
const props = defineProps<{
  block: FeatureSection & {
    // FeatureSection from payload-types will now include titleStyle
    superTitle?: string | null // Add superTitle
    // Ensure other fields match the updated block definition
    description?: string | null // Changed back from subtitle
    image?: Media | null
    button?: {
      text: string
      style?: 'primary' | 'secondary' | null // Add style from block def
      url: string
    } | null
    includeButton?: boolean
    useH1ForTitle?: boolean | null // This can remain for semantic H1/H2 choice
    removeBottomPadding?: boolean | null // Added new prop
    sectionBackgroundColor?: string | null
    contentBackgroundColor?: string | null
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null
    // titleStyle will be part of FeatureSection from payload-types
    id?: string | null
  }
}>()

// Button Class Logic (copied from TextImageSection)
const getButtonClasses = (
  style: 'primary' | 'secondary' | undefined | null
) => {
  // Base classes matching STYLING_GUIDE.md (adjust if needed, e.g., size)
  const baseClasses =
    'inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm'
  if (style === 'secondary') {
    // Secondary: 3px brand-primary border, brand-primary text, white bg -> hover: brand-primary bg, white text
    return `${baseClasses} border-[3px] border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white`
  }
  // Default to primary: brand-primary bg, white text -> hover: brand-900 bg
  return `${baseClasses} border border-transparent text-white bg-brand-primary hover:bg-brand-900`
}

// Background and Container Classes
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

// Container width class - This block seems to use max-w-screen-sm internally,
// so we might adjust the container logic or the internal max-w classes.
// Let's apply the container class to the outer div for now.
const containerClass = computed(() => {
  switch (props.block?.containerWidth) {
    case 'medium':
      return 'max-w-5xl'
    case 'wide':
      return 'max-w-7xl'
    case 'full':
      return 'max-w-none'
    default:
      return 'max-w-7xl' // Default to wide
  }
})

const horizontalPaddingClass = computed(() => {
  if (props.block?.titleStyle === 'large') {
    // Approx 150px padding for large title style
    return 'px-36 max-md:px-16 max-sm:px-8'
  }
  // Standard padding (approx 180px)
  return 'px-44 max-md:px-16 max-sm:px-8' // px-44 is 176px, close to 180px
})

// TODO: Add computed property for button style if needed, similar to TextImageSection
</script>

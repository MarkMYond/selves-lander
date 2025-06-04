<template>
  <section v-if="block" :class="[sectionBgClass, paddingClasses]">
    <!-- Apply container width class here -->
    <div
      class="relative mx-auto px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32"
      :class="containerClass"
    >
      <!-- This div will control the overall layout of title, description, image, and then cards -->
      <div class="flex flex-col">
        <!-- Wrapper for Title, Description, and Image -->
        <div
          class="flex flex-wrap gap-7 items-start mb-6 max-lg:flex-col max-lg:gap-6 max-lg:items-start max-lg:mb-10 max-sm:gap-5 max-sm:mb-6 lg:gap-20"
        >
          <!-- Text Content (Title & Description) -->
          <div class="flex-1 max-lg:w-full">
            <h2
              v-if="block.title"
              class="text-brand-900 dark:text-brand-100 mb-7 text-5xl leading-tight max-md:mb-6 max-md:text-4xl max-sm:mb-5 max-sm:text-3xl"
            >
              {{ block.title }}
            </h2>
            <div v-if="block.description" class="max-w-none">
              <p
                class="text-xl leading-8 text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
              >
                {{ block.description }}
              </p>
            </div>
            <div v-else-if="!block.description" class="max-w-none">
              <p
                class="text-xl leading-8 text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
              >
                Don't let headcount become a headache. We'll connect you with
                talent that meets your needs.
              </p>
              <p
                class="text-xl leading-8 text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
              >
                Your dedicated new team members will become experts in your
                world — your customers, your tech, your data, your systems — so
                they can expand on what you've built.
              </p>
            </div>
          </div>
          <!-- Section Image - will stack below text on max-lg due to parent flex-col -->
          <div class="lg:flex-shrink-0 max-lg:w-full max-lg:order-last">
            <img
              v-if="
                block.sectionImage &&
                typeof block.sectionImage === 'object' &&
                block.sectionImage.url
              "
              :src="getMediaUrl(block.sectionImage as Media)"
              :alt="block.sectionImage.alt || 'Section illustration'"
              class="w-full lg:w-64 h-auto max-h-96 align-middle overflow-clip"
            />
            <img
              v-else-if="!block.sectionImage"
              alt="Illustration of green plant inside of red and white vase"
              src="https://cdn.prod.website-files.com/64149f79022d0c5fc8ce46e8/64149f79022d0c4794ce4765_Illustration%3DPlant%201.svg"
              class="w-full lg:w-64 h-auto max-h-96 align-middle overflow-clip"
            />
          </div>
        </div>
        <!-- Solution Items Grid -->
        <div
          v-if="block.solutions && block.solutions.length > 0"
          role="list"
          :class="[
            'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12', // Adjusted grid for better responsiveness
            contentBgClass, // Use computed class
          ]"
        >
          <SolutionItem
            v-for="(solutionItem, index) in block.solutions"
            :key="solutionItem.id || `solution-${index}`"
            :solution="solutionItem"
          />
        </div>
        <!-- This div closes the "Solution Items Grid" -->
      </div>
      <!-- This div closes the new "flex flex-col" wrapper -->
    </div>
  </section>
  <section v-else class="py-12 bg-brand-50">
    <!-- Fallback content when block is undefined -->
    <div class="container mx-auto px-4">
      <p class="text-center text-brand-900 dark:text-brand-100">
        Solutions section content unavailable
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import SolutionItem from './SolutionItem.vue'
import { computed } from 'vue' // Import computed
import { useMediaUrl } from '../../../composables/useMediaUrl' // Import useMediaUrl
import type { SolutionsListBlock, Media } from '../../../src/payload-types' // Import SolutionsListBlock and Media type

const { getMediaUrl } = useMediaUrl() // Use the composable

const props = defineProps<{
  block?: SolutionsListBlock | undefined // Use imported SolutionsListBlock type
}>()

// Padding classes
const paddingClasses = computed(() => {
  const classes = []
  const fullTopPadding = 'pt-32 max-md:pt-24 max-sm:pt-16'
  const noTopPadding = 'pt-0'
  const fullBottomPadding = 'pb-32 max-md:pb-24 max-sm:pb-16'
  const noBottomPadding = 'pb-0'

  if (props.block?.removeTopPadding) {
    // Changed to removeTopPadding
    classes.push(noTopPadding)
  } else {
    classes.push(fullTopPadding)
  }
  if (props.block?.removeBottomPadding) {
    // Changed to removeBottomPadding
    classes.push(noBottomPadding)
  } else {
    classes.push(fullBottomPadding)
  }
  return classes.join(' ')
})

// Container width class
const containerClass = computed(() => {
  // Use optional chaining ?. in case block is undefined initially
  switch (props.block?.containerWidth) {
    case 'medium':
      return 'max-w-5xl'
    case 'wide':
      return 'max-w-7xl'
    case 'full':
      return 'max-w-none'
    default:
      return 'max-w-[1598px]' // Keep original default max-width
  }
})

// Background Classes
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
</script>

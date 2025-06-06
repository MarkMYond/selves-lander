<template>
  <section
    v-if="block"
    :class="[sectionBgClass, paddingClasses]"
  >
    <div
      class="relative mx-auto px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32"
      :class="containerClass"
    >
      <div class="flex flex-col">
        <div
          class="flex flex-wrap gap-7 items-start mb-6 max-lg:flex-col max-lg:gap-6 max-lg:items-start max-lg:mb-10 max-sm:gap-5 max-sm:mb-6 lg:gap-20"
        >
          <div class="flex-1 max-lg:w-full">
            <h2
              v-if="block.title"
              class="text-brand-900 dark:text-brand-100 mb-7 text-5xl leading-tight max-md:mb-6 max-md:text-4xl max-sm:mb-5 max-sm:text-3xl"
            >
              {{ block.title }}
            </h2>
            <div
              v-if="block.description"
              class="max-w-none"
            >
              <p
                class="text-xl leading-8 text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
              >
                {{ block.description }}
              </p>
            </div>
            <div
              v-else-if="!block.description"
              class="max-w-none"
            >
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
            >
            <img
              v-else-if="!block.sectionImage"
              alt="Illustration of green plant inside of red and white vase"
              src="https://cdn.prod.website-files.com/64149f79022d0c5fc8ce46e8/64149f79022d0c4794ce4765_Illustration%3DPlant%201.svg"
              class="w-full lg:w-64 h-auto max-h-96 align-middle overflow-clip"
            >
          </div>
        </div>
        <div
          v-if="block.solutions && block.solutions.length > 0"
          role="list"
          :class="[
            'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12',
            contentBgClass,
          ]"
        >
          <SolutionItem
            v-for="(solutionItem, index) in block.solutions"
            :key="solutionItem.id || `solution-${index}`"
            :solution="solutionItem"
          />
        </div>
      </div>
    </div>
  </section>
  <section
    v-else
    class="py-12 bg-brand-50"
  >
    <div class="container mx-auto px-4">
      <p class="text-center text-brand-900 dark:text-brand-100">
        Solutions section content unavailable
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import SolutionItem from './SolutionItem.vue'
import { computed } from 'vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'
import type { SolutionsListBlock, Media } from '../../../src/payload-types'

const { getMediaUrl } = useMediaUrl()

const props = defineProps<{
  block?: SolutionsListBlock | undefined
}>()

const paddingClasses = computed(() => {
  const classes = []
  const fullTopPadding = 'pt-32 max-md:pt-24 max-sm:pt-16'
  const noTopPadding = 'pt-0'
  const fullBottomPadding = 'pb-32 max-md:pb-24 max-sm:pb-16'
  const noBottomPadding = 'pb-0'

  if (props.block?.removeTopPadding) {
    classes.push(noTopPadding)
  } else {
    classes.push(fullTopPadding)
  }
  if (props.block?.removeBottomPadding) {
    classes.push(noBottomPadding)
  } else {
    classes.push(fullBottomPadding)
  }
  return classes.join(' ')
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
      return 'max-w-[1598px]'
  }
})

const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    default:
      if (props.block?.sectionBackgroundColor === 'none' || !props.block?.sectionBackgroundColor) {
        return 'bg-transparent';
      }
      return 'bg-' + props.block?.sectionBackgroundColor
  }
})

const contentBgClass = computed(() => {
  switch (props.block?.contentBackgroundColor) {
    default:
      if (props.block?.contentBackgroundColor === 'none' || !props.block?.contentBackgroundColor) {
        return 'bg-transparent';
      }
      return 'bg-' + props.block?.contentBackgroundColor
  }
})
</script>

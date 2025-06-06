<template>
  <div
    class="pt-20 max-md:pt-20 max-sm:pt-12"
    :class="sectionBgClass"
  >
    <div
      class="relative px-28 mx-auto max-md:px-16 max-sm:px-7"
      :class="containerClass"
    >
      <div
        class="rounded-xl px-12 py-20 relative overflow-hidden"
        :class="contentBgClass"
      >
        <div
          class="flex gap-14 gap-14 gap-y-14 gap-y-14 items-center mx-auto max-md:flex-col max-md:gap-12 max-md:gap-12 max-md:gap-y-12 max-md:gap-y-12 max-md: max-sm:gap-12 max-sm:gap-12 max-sm:gap-y-12 max-sm:gap-y-12"
        >
          <div
            v-if="block.benefits?.[0]?.icon"
            class="flex-1"
          >
            <img
              :alt="block.benefits[0].icon?.alt || 'Benefit illustration'"
              :src="getMediaUrl(block.benefits[0].icon)"
              class="w-full max-w-full align-middle overflow-x-clip overflow-y-clip"
            >
          </div>
          <div
            v-else
            class="flex-1 text-center italic text-gray-500"
          >
            [Benefit Image Placeholder]
          </div>

          <div class="flex-1">
            <div class="flex-1 max-w-[517px] max-md:max-w-none">
              <h2
                v-if="block.title"
                class="mb-7 text-5xl leading-tight max-md:mb-6 max-md:text-4xl max-sm:mb-5 max-sm:text-3xl"
              >
                {{ block.title }}
              </h2>
              <p
                v-if="block.description"
                class="mb-4 whitespace-pre-line max-md:mb-4 max-md:opacity-0 max-sm:mb-3.5"
              >
                {{ block.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'
import type { Media } from '../../../src/payload-types'

const { getMediaUrl } = useMediaUrl()

const props = defineProps<{
  block: {
    blockType: 'servicesBenefits'
    title?: string
    description?: string
    benefits?: Array<{
      icon?: Media | null
      benefitTitle?: string
      benefitDescription?: string
      id?: string | null
    }>
    sectionBackgroundColor?: string | null
    contentBackgroundColor?: string | null
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null
    id?: string | null
  }
}>()

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

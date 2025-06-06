<template>
  <section
    class="pt-20 pb-20 max-md:pt-16 max-sm:pt-12"
    :class="sectionBgClass"
  >
    <div
      class="relative px-40 mx-auto max-md:px-12 max-sm:px-6"
      :class="containerClass"
    >
      <div class="flex flex-col md:flex-row gap-12 items-center">
        <div class="flex-1">
          <h2
            v-if="block?.title"
            class="text-brandNeutral-04 dark:text-brand-100 mb-7 text-5xl leading-tight max-md:mb-6 max-md:text-4xl max-sm:mb-5 max-sm:text-3xl"
          >
            {{ block.title }}
          </h2>
          <p
            v-if="block?.description"
            class="text-brandNeutral-04 dark:text-brand-100 mb-7 text-lg max-md:mb-6 max-sm:mb-5"
          >
            {{ block.description }}
          </p>
          <a
            v-if="
              block?.ctaButton && block.ctaButton.text && block.ctaButton.url
            "
            :href="block.ctaButton.url"
            :class="getButtonClasses(block.ctaButton.style)"
          >
            <span>{{ block.ctaButton.text }}</span>
          </a>
        </div>
        <div
          v-if="block?.image"
          class="flex-1"
        >
          <img
            :src="getMediaUrl(block.image)"
            :alt="block.image.alt || 'Support Ninja Section Image'"
            class="object-contain w-full h-auto rounded-lg"
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'
import type { Media } from '../../../src/payload-types'

const { getMediaUrl } = useMediaUrl()

interface CtaButton {
  text: string
  url: string
  style?: 'primary' | 'secondary' | null
}

interface SupportNinjaBlock {
  blockType: 'supportNinjaSection'
  title?: string | null
  description?: string | null
  image?: Media | null
  ctaButton?: CtaButton | null
  sectionBackgroundColor?: string | null
  contentBackgroundColor?: string | null
  containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null
  id?: string | null
}

const props = defineProps<{
  block?: SupportNinjaBlock
}>()

const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white':
      return 'bg-white'
    case 'light-grey':
      return 'bg-brand-50'
    case 'brand-50':
      return 'bg-brand-50'
    case 'brand-900':
      return 'bg-brand-900'
    case 'brand-primary':
      return 'bg-brand-primary'
    default:
      return 'bg-brand-50'
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
      return 'max-w-[1598px]'
  }
})

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
</script>

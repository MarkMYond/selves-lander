<template>
  <section :class="[sectionBgClass, paddingClasses]">
    <div
      class="relative px-40 mx-auto max-md:px-16 max-sm:px-7"
      :class="containerClass"
    >
      <div
        class="flex gap-16 max-lg:flex-col max-lg:gap-12 max-sm:gap-12"
        :class="{ 'flex-row-reverse': block?.imagePosition === 'left' }"
      >
        <div class="flex-1">
          <h2
            v-if="block?.title"
            class="mb-7 text-5xl leading-tight max-md:mb-6 max-md:text-4xl max-sm:mb-5 max-sm:text-3xl text-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
          >
            {{ block.title }}
          </h2>
          <div
            v-if="
              block?.description ||
                (block?.benefits && block.benefits.length > 0)
            "
            class="mb-7 max-md:mb-6 max-sm:mb-5"
          >
            <p
              v-if="block.description"
              class="text-xl leading-8 mb-6 text-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            >
              {{ block.description }}
            </p>

            <ul
              v-if="block.benefits && block.benefits.length > 0"
              role="list"
              class="overflow-hidden mt-6 list-none p-0"
            >
              <li
                v-for="(benefit, index) in block.benefits"
                :key="benefit.id || `benefit-${index}`"
                class="flex items-start text-base leading-relaxed mb-2 text-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
              >
                <Icon
                  v-if="block.checkmarkIconName"
                  :name="getIconWithVariant(block.checkmarkIconName)"
                  class="w-12 h-12 text-brand-900 mr-2 shrink-0"
                />
                <span
                  v-else
                  class="w-12 h-12 mr-2 shrink-0"
                />
                <span>
                  <strong class="font-semibold">{{
                    cleanBenefitText(benefit.title)
                  }}</strong>
                  <span v-if="benefit.description">&nbsp;- {{ benefit.description }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div v-if="block?.link && block.link.url">
            <NuxtLink
              v-if="!isExternalUrl(block.link.url)"
              :to="block.link.url"
              :class="getButtonClasses(block.link.style)"
            >
              {{ block.link.text || 'Learn More' }}
            </NuxtLink>
            <a
              v-else
              :href="block.link.url"
              :class="getButtonClasses(block.link.style)"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ block.link.text || 'Learn More' }}
            </a>
          </div>
        </div>
        <div class="flex-1 flex items-center">
          <div class="relative flex items-center justify-center w-full">
            <img
              v-if="characterImageUrl"
              :alt="characterImageAlt"
              :src="characterImageUrl"
              class="object-contain relative max-w-full h-auto text-center align-middle max-h-[571px] overflow-clip max-md:h-auto max-md:max-h-[352px] max-md:w-[90%] max-sm:max-h-[281px]"
              loading="lazy"
            >
            <div
              v-else
              class="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500"
            >
              Image not available
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AiSupportSectionBlock, Media } from '../../../src/payload-types'

const isExternalUrl = (url: string): boolean => {
  return /^(https?:)?\/\//.test(url)
}

const { getIconName } = useIcons()

const getIconWithVariant = (iconName: string) => {
  return getIconName(iconName.toLowerCase(), 'regular')
}

const props = defineProps<{
  block: AiSupportSectionBlock
}>()

const { getMediaUrl } = useMediaUrl()

const cleanBenefitText = (text: string): string => {
  if (!text) return ''
  return text.replace(/^>+\s*/g, '').trim()
}

const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white':
      return 'bg-white'
    // case 'light-grey': // Type not in AiSupportSectionBlock.sectionBackgroundColor
    //   return 'bg-brand-50'
    case 'brand-50':
      return 'bg-brand-50'
    // case 'brand-900': // Type not in AiSupportSectionBlock.sectionBackgroundColor
    //   return 'bg-brand-900'
    // case 'brand-primary': // Type not in AiSupportSectionBlock.sectionBackgroundColor
    //   return 'bg-brand-primary'
    // Assuming 'gradient' and 'none' might be valid types from the error message,
    // but they are not handled here. Defaulting to brand-50.
    // Consider adding 'gradient' or 'transparent' if 'none' is a valid option.
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
    default:
      return 'max-w-7xl'
  }
})

const characterImage = computed((): Media | null => {
  const img =
    typeof props.block?.characterImage === 'object'
      ? props.block.characterImage
      : null
  return img
})

const characterImageUrl = computed(() => {
  const url = characterImage.value?.url
    ? getMediaUrl(characterImage.value.url)
    : ''
  return url
})

const characterImageAlt = computed(() => {
  return characterImage.value?.alt || 'AI Support Illustration'
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

const paddingClasses = computed(() => {
  const classes = []
  const fullTopPadding = 'pt-32 max-md:pt-20 max-sm:pt-10'
  const halfTopPadding = 'pt-16 max-md:pt-10 max-sm:pt-6'
  const fullBottomPadding = 'pb-32 max-md:pb-20 max-sm:pb-10'
  const halfBottomPadding = 'pb-16 max-md:pb-10 max-sm:pb-6'

  if (props.block?.reduceTopPadding) {
    classes.push(halfTopPadding)
  } else {
    classes.push(fullTopPadding)
  }

  if (props.block?.reduceBottomPadding) {
    classes.push(halfBottomPadding)
  } else {
    classes.push(fullBottomPadding)
  }

  return classes.join(' ')
})
</script>

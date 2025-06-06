<template>
  <section class="integrations-section block-section-padding">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-start gap-12">
        <SectionHeader
          v-if="block.title"
          :eyebrow-text="block.eyebrow"
          :title="block.title"
          :subtitle="block.description"
          :title-image="block.titleImage"
          class=""
        />

        <div
          v-if="block.logos && block.logos.length"
          class="flex flex-wrap justify-start gap-4 md:gap-6 lg:gap-8"
        >
          <div
            v-for="(logoEntry, index) in block.logos"
            :key="logoEntry.id || 'logo-' + index"
            class="group relative"
          >
            <div
              class="integration-icon-card rounded-xl w-28 h-28 md:w-32 md:h-32 flex items-center justify-center p-4"
              :class="getLogoBgClass(logoEntry.backgroundColorClass)"
            >
              <img
                v-if="logoEntry.logoImage"
                :src="getMediaUrl(logoEntry.logoImage)"
                :alt="logoEntry.altText || 'Integration logo'"
                loading="lazy"
                class="max-w-full max-h-16 object-contain"
              >
            </div>
            <span
              v-if="logoEntry.altText"
              class="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded-md text-xs font-medium shadow-lg whitespace-nowrap invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
              :class="[
                getLogoBgClass(logoEntry.backgroundColorClass),
                getTooltipTextColorClass(logoEntry.backgroundColorClass),
              ]"
            >
              {{ logoEntry.altText }}
            </span>
          </div>
        </div>

        <div
          v-if="block.button && block.button.text"
          class="text-left"
        >
          <BaseButton
            :to="
              isInternalLink(block.button)
                ? getButtonUrl(block.button)
                : undefined
            "
            :href="
              !isInternalLink(block.button)
                ? getButtonUrl(block.button)
                : undefined
            "
            :target="shouldOpenInNewTab(block.button) ? '_blank' : undefined"
            :variant="(block.button.variant as any) || 'primary'"
            class="px-8 md:px-10 rounded-full"
          >
            {{ block.button.text }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '../../composables/useMediaUrl'
import type { Media } from '../../src/payload-types'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

interface LogoImage extends Media {
}

interface LogoEntry {
  id?: string
  logoImage: LogoImage | string
  altText?: string
  backgroundColorClass?: string
}

interface ButtonData {
  text: string
  url: string
  variant?: 'border' | 'primary' | 'secondary' | 'tertiary'
  type?: 'internal' | 'external'
  internalLink?: string | { slug?: string }
  externalLink?: string
  newTab?: boolean
}

interface IntegrationsSectionBlockProps {
  blockType: 'integrationsSection'
  eyebrow?: string
  title: string
  description?: string
  titleImage?: Media | string | null
  logos?: LogoEntry[]
  button?: ButtonData
}

const props = defineProps<{
  block: IntegrationsSectionBlockProps
}>()

const { getMediaUrl } = useMediaUrl()

const isTrulyExternalUrl = (url?: string): boolean => {
  if (!url) return false
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//')
  )
}

const isInternalLink = (button?: ButtonData | any): boolean => {
  if (!button) return false

  if (button.type && typeof button.type === 'string') {
    const linkButton = button as any
    if (linkButton.type === 'internal') return true
    if (linkButton.type === 'external') {
      if (
        linkButton.externalLink &&
        typeof linkButton.externalLink === 'string' &&
        linkButton.externalLink.startsWith('/') &&
        !isTrulyExternalUrl(linkButton.externalLink)
      ) {
        return true
      }
      return false
    }
  }

  if (button.url && typeof button.url === 'string') {
    return button.url.startsWith('/') && !isTrulyExternalUrl(button.url)
  }

  if (button.internalLink && !button.externalLink) return true
  if (
    button.externalLink &&
    typeof button.externalLink === 'string' &&
    button.externalLink.startsWith('/') &&
    !isTrulyExternalUrl(button.externalLink) &&
    !button.internalLink
  )
    return true

  return false
}

const getButtonUrl = (button?: ButtonData | any): string => {
  if (!button) return '#'

  const isEffectivelyInternal = isInternalLink(button)

  if (isEffectivelyInternal) {
    if (button.type === 'internal' && button.internalLink) {
      const internalValue = button.internalLink
      if (
        typeof internalValue === 'object' &&
        internalValue !== null &&
        'slug' in internalValue &&
        typeof internalValue.slug === 'string'
      ) {
        return `/${internalValue.slug}`
      }
      if (typeof internalValue === 'string') {
        return internalValue.startsWith('/')
          ? internalValue
          : `/${internalValue}`
      }
    }
    if (
      button.type === 'external' &&
      button.externalLink &&
      typeof button.externalLink === 'string' &&
      button.externalLink.startsWith('/') &&
      !isTrulyExternalUrl(button.externalLink)
    ) {
      return button.externalLink
    }
    if (
      button.url &&
      typeof button.url === 'string' &&
      button.url.startsWith('/') &&
      !isTrulyExternalUrl(button.url)
    ) {
      return button.url
    }
    if (button.internalLink) {
      const internalValue = button.internalLink
      if (
        typeof internalValue === 'object' &&
        internalValue !== null &&
        'slug' in internalValue &&
        typeof internalValue.slug === 'string'
      )
        return `/${internalValue.slug}`
      if (typeof internalValue === 'string')
        return internalValue.startsWith('/')
          ? internalValue
          : `/${internalValue}`
    }
  } else {
    if (
      button.type === 'external' &&
      button.externalLink &&
      typeof button.externalLink === 'string'
    ) {
      return button.externalLink
    }
    if (
      button.url &&
      typeof button.url === 'string' &&
      isTrulyExternalUrl(button.url)
    ) {
      return button.url
    }
  }
  return typeof button.url === 'string' ? button.url : '#'
}

const shouldOpenInNewTab = (button?: ButtonData | any): boolean => {
  if (!button) return false

  if ('newTab' in button && button.newTab === true) return true

  const url = getButtonUrl(button)
  if (
    isTrulyExternalUrl(url) &&
    (!('newTab' in button) || button.newTab !== false)
  )
    return true

  return false
}

const getTooltipTextColorClass = (bgColorValue?: string) => {
  const darkBgValues = ['purple', 'green', 'yellow']
  if (bgColorValue && darkBgValues.includes(bgColorValue)) {
    return 'text-white'
  }
  return 'text-brandNeutral-04'
}

const getLogoBgClass = (bgColorValue?: string) => {
  switch (bgColorValue) {
    case 'theme-color-01':
      return 'bg-brandTheme-01'
    case 'theme-color-02':
      return 'bg-brandTheme-02'
    case 'theme-color-03':
      return 'bg-brandTheme-03'
    case 'theme-color-04':
      return 'bg-brandTheme-04'
    case 'purple':
      return 'bg-brandTheme-01'
    case 'green':
      return 'bg-brandTheme-03'
    case 'yellow':
      return 'bg-brandTheme-04'
    case 'purple-light':
      return 'bg-brandTheme-01'
    case 'default':
    default:
      return 'bg-brandNeutral-02'
  }
}

const getButtonClass = (variant?: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary text-primary-foreground hover:brightness-90'
    case 'secondary':
      return 'bg-brandTheme-04 text-brandNeutral-04 hover:brightness-95'
    case 'tertiary':
      return 'bg-brandNeutral-01 text-brandNeutral-04 hover:bg-brandNeutral-02'
    case 'border':
    default:
      return 'border border-brandNeutral-04 text-brandNeutral-04 hover:bg-brandNeutral-02'
  }
}
</script>

<style scoped>
.integration-icon-card img {
  max-height: 80%;
}
</style>

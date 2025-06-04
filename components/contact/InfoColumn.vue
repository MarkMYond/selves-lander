<template>
  <div
    :class="[
      'flex flex-col p-10',
      textColorClass,
      { 'min-h-[600px]': !isGetInTouchPage },
    ]"
  >
    <!-- Top Section: Logo and Header Link -->
    <section
      v-if="logoUrl"
      class="flex justify-between items-center mb-24 max-sm:mb-14"
    >
      <a href="/" aria-label="Home">
        <!-- Increased logo size by 3x -->
        <img
          :src="logoUrl"
          :alt="logo?.alt || 'Logo'"
          class="h-15 max-w-full inline-block align-middle"
        />
      </a>

      <!-- <button
        v-if="headerLink?.text"
        @click="$emit('request-name-focus')"
        class="inline-flex md:hidden items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm border border-transparent text-white bg-brand-primary hover:bg-brand-900"
      >
        <span>{{ headerLink.text }}</span>
        <Icon name="ph:arrow-right" class="ml-3 h-5 w-5 text-white" />
      </button> -->
    </section>

    <!-- Main Title Section -->
    <div>
      <h1
        v-if="props.mainTitlePart1"
        class="text-brand-900 dark:text-brand-100 mb-10 text-7xl leading-[86px] tracking-tight max-md:mb-7 max-md:text-6xl max-md:leading-[66px] max-sm:mb-7 max-sm:text-4xl max-sm:leading-10 font-normal"
      >
        {{ props.mainTitlePart1 }}
        <span
          v-if="props.mainTitlePart2"
          class="text-primary-400 font-normal"
          >{{ props.mainTitlePart2 }}</span
        >
      </h1>
    </div>

    <!-- Spacer to push footer down with adjustable minimum height -->
    <div :class="['flex-grow', { 'min-h-[160px]': !isGetInTouchPage }]"></div>

    <!-- Footer Section -->
    <footer>
      <p
        v-if="footerText"
        class="md:mb-8 text-base leading-6 opacity-80 text-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
      >
        {{ footerText }}
      </p>
      <!-- Updated divider line to be brand-primary and 3px thick -->
      <div
        v-if="footerLinks && footerLinks.length > 0"
        :class="['w-full h-[3px] bg-brand-primary mb-4', dividerMarginTopClass]"
        class="hidden md:block"
      ></div>
      <nav
        v-if="footerLinks && footerLinks.length > 0"
        class="overflow-scroll hidden md:flex"
      >
        <a
          v-for="(link, index) in footerLinks"
          :key="link.id || `footer-link-${index}`"
          :href="link.url ?? '#'"
          :class="[
            'cursor-pointer duration-300 transition-colors hover:opacity-100 text-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']',
            { 'ml-8': index > 0 },
          ]"
        >
          {{ link.text }}
        </a>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from 'vue' // Added defineEmits
import { useRoute } from 'vue-router' // Import useRoute
import type { Media } from '../../../payload-cms/src/payload-types'
import { useMediaUrl } from '../../composables/useMediaUrl'
import { navigateTo } from 'nuxt/app' // Import navigateTo

// Define emits
const emit = defineEmits(['request-name-focus'])

// Define props based on the updated Payload block fields
const props = defineProps<{
  logo?: Media | null
  headerLink?: {
    text?: string | null
    url?: string | null
  } | null
  mainTitlePart1?: string | null
  mainTitlePart2?: string | null
  footerText?: string | null
  footerLinks?: Array<{
    id?: string | null
    text?: string | null
    url?: string | null
  }> | null
  textColorClass?: string // Still keeping this prop for compatibility
}>()

const route = useRoute() // Get the current route
const isGetInTouchPage = computed(() => route.path === '/get-in-touch')

const { getMediaUrl } = useMediaUrl()

// Computed property for logo URL
const logoUrl = computed(() => {
  const img = typeof props.logo === 'object' ? props.logo : null
  return img?.url ? getMediaUrl(img.url) : ''
})

// We're no longer using these since we're using specific brand colors
// But keeping them for compatibility
const headerLinkClasses = computed(() => {
  return 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'
})
const headerLinkIconClasses = computed(() => {
  return 'text-brand-primary'
})

// Computed class for the divider's top margin
const dividerMarginTopClass = computed(() => {
  return props.footerText ? 'mt-0' : 'mt-14'
})

// Function to handle navigation (no longer used by this button, but kept for potential other uses)
const navigateToUrl = (url?: string | null) => {
  if (url) {
    navigateTo(url, { external: true }) // Use external: true if it's an external link
  }
}
</script>

<template>
  <section :class="[mappedSectionBgColor]">
    <div :class="['mx-auto', mappedContainerWidth]">
      <div
        :class="[
          'px-10 py-10 max-sm:px-5 max-sm:py-5 pb-32 max-md:pb-24 max-sm:pb-16',
          mappedContentBgColor,
        ]"
      >
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div>
            <p
              v-if="content.superTitle"
              class="text-base leading-relaxed font-semibold uppercase tracking-wider text-brand-primary mb-2 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            >
              {{ content.superTitle }}
            </p>
            <h2
              v-if="content.title"
              class="text-brand-900 dark:text-brand-100 text-5xl leading-tight mb-4 max-md:text-4xl max-sm:text-3xl"
            >
              {{ content.title }}
            </h2>
            <p
              v-if="content.description"
              class="text-base leading-relaxed text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            >
              {{ content.description }}
            </p>
          </div>
          <div
            v-if="content.ctaText && content.ctaUrl"
            class="flex flex-col justify-center md:justify-end"
          >
            <div class="text-right mt-4 md:mt-0">
              <a
                :href="content.ctaUrl"
                class="text-xl leading-7 text-right cursor-pointer decoration-zinc-800 outline-zinc-800 text-brand-900 max-sm:text-base max-sm:leading-6 hover:underline"
                >{{ content.ctaText }} →</a
              >
            </div>
          </div>
        </div>
        <div
          v-if="sectors.length > 0"
          class="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
        >
          <SectorCard
            v-for="(sector, index) in sectors"
            :key="sector.id || index"
            :title="sector.title || ''"
            :image="sector.image"
            :iconName="sector.iconName || undefined"
            :background-color="sector.backgroundColor || ''"
            :href="sector.href || '#'"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectorCard from './SectorCard.vue'
import { computed } from 'vue'
import type {
  SectorsSectionBlockPayload,
  Media,
} from '../../../../payload-cms/src/payload-types'
import { useMediaUrl } from '../../../composables/useMediaUrl'

// Updated props to accept a block prop instead of direct properties
const props = defineProps<{
  block: SectorsSectionBlockPayload
}>()

// Extract content for easier access in the template
const content = props.block.content || {}
const sectors = props.block.sectors || []

// Map Payload container width values to Tailwind classes
const mappedContainerWidth = computed(() => {
  switch (props.block.containerWidth) {
    case 'medium':
      return 'max-w-5xl'
    case 'wide':
      return 'max-w-7xl'
    case 'full':
      return 'max-w-none'
    case 'default':
    default:
      return 'max-w-[1140px]'
  }
})

// Map Payload background color values to Tailwind classes
const mappedContentBgColor = computed(() => {
  switch (props.block.contentBackgroundColor) {
    case 'light-grey':
      return 'bg-brand-50' // Changed bg-light-grey to bg-brand-50
    case 'brand-50':
      return 'bg-brand-50'
    case 'brand-900':
      return 'bg-brand-900'
    case 'brand-primary':
      return 'bg-brand-primary'
    case 'white':
    default:
      return 'bg-white'
  }
})

// Map Payload background color values to Tailwind classes for Section Background
const mappedSectionBgColor = computed(() => {
  switch (props.block.sectionBackgroundColor) {
    case 'light-grey':
      return 'bg-brand-50' // Changed bg-light-grey to bg-brand-50
    case 'brand-50':
      return 'bg-brand-50'
    case 'brand-900':
      return 'bg-brand-900'
    case 'brand-primary':
      return 'bg-brand-primary'
    case 'white':
    default:
      return 'bg-white'
  }
})
</script>

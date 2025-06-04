<template>
  <section class="section-dashboard-payload relative overflow-hidden block-section-padding"> <!-- Use new global padding class -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div 
        v-if="block" 
        :data-w-id="block.dataWId || '96f4d3d9-d9a0-c250-9d0a-736521598813'" 
        class="bg-brandNeutral-02 rounded-xl p-12 md:p-16 flex flex-col gap-y-12 relative overflow-hidden"
      >
        <!-- Grid Background Pattern -->
        <div class="absolute inset-0 z-10 bg-[url('/webflow-assets/images/pattern-hero3.png')] bg-center bg-no-repeat bg-cover opacity-20"></div>
        
        <!-- Arrow Background Element -->
        <div class="overview-arrow-shape absolute z-0 bottom-0 left-0 w-full h-full bg-[url('/webflow-assets/images/overview-arrow-shape.svg')] bg-bottom-left bg-no-repeat opacity-30" style="background-size: 100%;"></div>
        <div class="overview-top-content flex flex-col md:grid md:grid-cols-2 items-stretch gap-x-8 md:gap-x-12 relative z-20">
          <div class="overview-left-content flex flex-col items-start justify-center gap-y-10 w-full md:col-span-1">
            <div class="context-text-block flex flex-col space-y-2">
              <div v-if="block.eyebrowText"
                   class="inline-block self-start px-4 py-1 rounded-full"
                   :class="[block.eyebrowBackgroundColor || 'bg-brandTheme-02']">
                <p class="text-body-14 font-medium text-brandNeutral-04">{{ block.eyebrowText }}</p>
              </div>
              <div class="space-y-4">
                <h3 v-if="block.title" class="text-h3 lg:text-h2 font-bold text-brandNeutral-04 max-w-lg leading-[1.1]" v-html="block.title"></h3>
                <p v-if="block.description" class="text-body-18 text-brandNeutral-03 max-w-2xl leading-normal" v-html="block.description"></p> <!-- Removed lg:text-body-20 -->
              </div>
            </div>
            <div v-if="block.primaryButton" class="overview-bottom-button-wrapper w-full sm:w-auto flex items-center">
              <BaseButton
                v-if="block.primaryButton.url && block.primaryButton.text"
                :to="block.primaryButton.url"
                variant="primary" 
                class="px-8 md:px-10 rounded-full" 
              >
                {{ block.primaryButton.text }}
              </BaseButton>

          <!-- Charles feature commented out -->
          <!--
          <div class="overview-btn ml-4">
            <div data-wf--arrow-button-right--variant="bg-white" class="charles-point-right-wrapper" style="transform: translate3d(-6.225px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; will-change: transform;">
              <div class="charles-point-right w-variant-1fcb5b32-cea4-5d01-3a7a-e2ea6590b371 bg-white">
                <p class="charles-point-text w-variant-1fcb5b32-cea4-5d01-3a7a-e2ea6590b371 text-black">Charles</p>
              </div>
              <img src="https://cdn.prod.website-files.com/673442f44c948080a43e913b/67364220d277fca4a29ece15_shape-1.svg" loading="lazy" alt="" class="charles-point-right-icon">
            </div>
          </div>
          -->
        </div>
      </div>
      <div v-if="block.image" class="overview-image-block-2 md:col-span-1 h-auto md:h-full relative self-stretch md:-mr-24">
        <img
          :src="getMediaUrl(block.image)"
          loading="lazy"
          :alt="typeof block.image === 'object' ? block.image.alt || block.title : block.title"
          class="overview-image-2 object-cover object-left w-full h-full rounded-xl md:rounded-l-none md:rounded-r-xl"
        >

      </div>
    </div>
    <div v-if="block.stats && block.stats.length" class="overview-bottom-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-x-[30px] w-full relative z-20">
      <div v-for="(stat, index) in block.stats" :key="stat.id || index" class="overview-list-item-2 text-brandNeutral-04 w-full">
        <!-- <h2 v-if="stat.value" class="text-h3 lg:text-h2 font-bold leading-tight text-brandNeutral-04">{{ stat.value }}</h2> -->
        <div class="flex items-center gap-x-2 mb-1"> <!-- Wrapper for icon and label -->
          <img 
            v-if="stat.icon && typeof stat.icon === 'object' && stat.icon.url" 
            :src="getMediaUrl(stat.icon)" 
            :alt="stat.icon.alt || 'Stat icon'" 
            class="h-9 w-9 object-contain"
          >
          <!-- Fallback/placeholder for icon if needed -->
          <!-- <div v-else class="h-6 w-6 bg-gray-300 rounded"></div> -->
          <h5 v-if="stat.label" class="text-brandNeutral-04 text-body-20 lg:text-h4 font-semibold leading-snug">{{ stat.label }}</h5>
        </div>
        <p v-if="stat.description" class="text-brandNeutral-04 text-body-16 lg:text-body-18 font-normal leading-relaxed opacity-80">{{ stat.description }}</p>
      </div>
    </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps, onMounted } from 'vue'
import type { PropType } from 'vue'
import { useMediaUrl as useMediaUrlComposable } from '../../composables/useMediaUrl'
import type { Media } from '../../src/payload-types'
import BaseButton from '@/components/ui/BaseButton.vue'; // Corrected import path

const { getMediaUrl } = useMediaUrlComposable();

// Define interfaces for Payload data
interface PrimaryButton {
  text: string
  url: string
}

interface StatItem {
  id?: string
  // value: string // Removed as per new requirement
  icon?: Media | string | null // Added icon field
  label: string
  description?: string
}

// Define the main block props interface
interface DashboardSectionBlockProps {
  blockType: 'dashboardSection'
  eyebrowText?: string | null // Added eyebrowText
  eyebrowBackgroundColor?: string | null // Added eyebrowBackgroundColor
  title: string
  description: string
  primaryButton?: PrimaryButton
  image: Media | string
  stats?: StatItem[]
  dataWId?: string
  id?: string
}

const props = defineProps({
  block: {
    type: Object as PropType<DashboardSectionBlockProps>,
    required: true,
  },
})

// Extend Window interface for Webflow property
declare global {
  interface Window {
    Webflow?: any; // You can define a more specific type for Webflow if available
  }
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.Webflow) {
    window.Webflow.ready?.()
    window.Webflow.require?.('ix2')?.init()
  }
})
</script>
<style scoped>
/* Scoped styles for this component if needed */
/* Rely on global Webflow styles loaded via nuxt.config.ts or main.scss */
.overview-card-wrapper-1 {
  opacity: 1; /* Override inline style if needed, or manage via Webflow interactions */
}
</style>

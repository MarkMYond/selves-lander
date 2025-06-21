<template>
  <section
    class="section-dashboard-payload relative overflow-hidden block-section-padding"
  >
    <div class="container mx-auto sm:px-6 lg:px-8 relative">
      <div
        v-if="block"
        :data-w-id="block.dataWId || '96f4d3d9-d9a0-c250-9d0a-736521598813'"
        class="bg-brandNeutral-02 rounded-xl md:p-16 flex flex-col gap-y-12 relative overflow-hidden"
      >
        <!-- <div
          class="absolute inset-0 z-10 bg-[url('~/assets/images/pattern-hero3.png')] bg-center bg-no-repeat bg-cover opacity-20"
        /> -->

        <div
          class="overview-arrow-shape absolute z-0 bottom-0 left-0 w-full h-full bg-[url('~/assets/images/overview-arrow-shape.svg')] bg-bottom-left bg-no-repeat opacity-30"
          style="background-size: 100%"
        />
        <div
          class="overview-top-content flex flex-col md:grid md:grid-cols-2 items-stretch gap-x-8 md:gap-x-12 relative z-20 p-12 md:p-0"
        >
          <div
            class="overview-left-content flex flex-col items-start justify-center gap-y-10 w-full md:col-span-1"
          >
            <div class="context-text-block flex flex-col space-y-2">
              <div
                v-if="block.eyebrowText"
                class="inline-block self-start px-4 py-1 rounded-full"
                :class="[block.eyebrowBackgroundColor || 'bg-brandTheme-02']"
              >
                <p class="text-body-14 font-medium text-brandNeutral-04">
                  {{ block.eyebrowText }}
                </p>
              </div>
              <div class="space-y-4">
                <h3
                  v-if="block.title"
                  class="text-h3 lg:text-h2 font-bold text-brandNeutral-04 max-w-lg leading-[1.1]"
                  v-html="block.title"
                />
                <p
                  v-if="block.description"
                  class="text-body-18 text-brandNeutral-03 max-w-2xl leading-normal"
                  v-html="block.description"
                />
              </div>
            </div>
            <div
              v-if="block.primaryButton"
              class="overview-bottom-button-wrapper w-full sm:w-auto flex items-center"
            >
              <BaseButton
                v-if="block.primaryButton.url && block.primaryButton.text"
                :to="block.primaryButton.url"
                variant="primary"
                class="px-8 md:px-10 rounded-full"
              >
                {{ block.primaryButton.text }}
              </BaseButton>
            </div>
          </div>
          <div
            v-if="block.image"
            class="overview-image-block-2 md:col-span-1 h-auto md:h-full relative self-stretch mt-8 md:mt-0 w-full"
          >
            <img
              :src="getMediaUrl(block.image)"
              loading="lazy"
              :alt="
                typeof block.image === 'object'
                  ? block.image.alt || block.title
                  : block.title
              "
              class="overview-image-2 object-cover object-left w-full h-full rounded-xl md:rounded-l-none md:rounded-r-xl"
            >
          </div>
        </div>
        <div
          v-if="block.stats && block.stats.length"
          class="overview-bottom-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-x-[30px] w-full relative z-20 p-12 md:p-0"
        >
          <div
            v-for="(stat, index) in block.stats"
            :key="stat.id || index"
            class="overview-list-item-2 text-brandNeutral-04 w-full"
          >
            <div class="flex items-center gap-x-2 mb-1">
              <img
                v-if="
                  stat.icon && typeof stat.icon === 'object' && stat.icon.url
                "
                :src="getMediaUrl(stat.icon)"
                :alt="stat.icon.alt || 'Stat icon'"
                class="h-9 w-9 object-contain"
              >
              <h5
                v-if="stat.label"
                class="text-brandNeutral-04 text-body-20 lg:text-h4 font-semibold leading-snug"
              >
                {{ stat.label }}
              </h5>
            </div>
            <p
              v-if="stat.description"
              class="text-brandNeutral-04 text-body-16 lg:text-body-18 font-normal leading-relaxed opacity-80"
            >
              {{ stat.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { PropType } from 'vue'
import { useMediaUrl as useMediaUrlComposable } from '../../composables/useMediaUrl'
import type { Media } from '../../src/payload-types'
import BaseButton from '@/components/ui/BaseButton.vue'

const { getMediaUrl } = useMediaUrlComposable()

interface PrimaryButton {
  text: string
  url: string
}

interface StatItem {
  id?: string
  icon?: Media | string | null
  label: string
  description?: string
}

interface DashboardSectionBlockProps {
  blockType: 'dashboardSection'
  eyebrowText?: string | null
  eyebrowBackgroundColor?: string | null
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

declare global {
  interface Window {
    Webflow?: any
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
.overview-card-wrapper-1 {
  opacity: 1;
}
</style>

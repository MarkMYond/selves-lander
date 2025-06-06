<template>
  <header
    class="overflow-x-hidden overflow-y-hidden relative pb-14 bg-brand-50 max-md:pb-9 max-sm:pb-5"
  >
    <div
      class="relative px-28 mx-auto max-w-[1337px] max-md:px-16 max-md:max-w-[1232px] max-sm:px-7 max-sm:w-full max-sm:max-w-full"
    >
      <div class="py-20 max-md:py-20 max-sm:pt-9 max-sm:pb-12">
        <div class="flex flex-col items-center text-center">
          <div
            class="text-center max-w-[716px] max-md:opacity-0 max-md:max-w-[660px] max-sm:max-w-[632px]"
          >
            <p
              class="text-2xl leading-10 text-center max-md:text-2xl max-md:leading-10 max-sm:text-base max-sm:leading-6"
            >
              Quickly and seamlessly scale your team with agile, highly
              customizable outsourcing solutions that power your growth.
              {{ block.subHeadline }}
            </p>
          </div>
          <h1
            v-if="block.headline"
            class="mb-6 text-7xl text-center leading-[95px] max-md:mb-6 max-md:text-7xl max-md:leading-[79px] max-sm:mb-5 max-sm:text-5xl max-sm:leading-[59px]"
          >
            {{ block.headline }}
          </h1>
          <div
            v-if="block.decorativeImages && block.decorativeImages.length > 0"
            class="mt-8 flex justify-center items-center gap-4 flex-wrap"
          >
            <template
              v-for="item in block.decorativeImages"
              :key="item.id"
            >
              <a
                v-if="item.url && item.image?.url"
                :href="item.url"
                class="block"
              >
                <img
                  :src="getMediaUrl(item.image as any)"
                  :alt="item.image.alt || 'Decorative image'"
                  class="h-36 object-contain"
                >
              </a>
              <img
                v-else-if="item.image?.url"
                :src="getMediaUrl(item.image as any)"
                :alt="item.image.alt || 'Decorative image'"
                class="h-36 object-contain"
              >
            </template>
          </div>

          <div
            v-if="block.ctaButtons && block.ctaButtons.length > 0"
            class="mt-8 flex justify-center gap-4"
          >
            <a
              v-for="(button, index) in block.ctaButtons"
              :key="index"
              :href="button.url"
              :class="[
                'inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary',
                index === 0
                  ? 'bg-brand-primary text-white hover:bg-primary-600'
                  : 'bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-primary-100',
              ]"
            >
              {{ button.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useMediaUrl } from '../../../../composables/useMediaUrl'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const { getMediaUrl } = useMediaUrl()

defineProps<{
  block: {
    blockType: 'builderHeroSection'
    headline?: string
    subHeadline?: string
    ctaButtons?: Array<{
      text: string
      url: string
      id?: string | null
    }>
    decorativeImages?: Array<{
      image?: {
        id: string
        alt?: string | null
        url?: string | null
      } | null
      url?: string | null
      id?: string | null
    }> | null
    id?: string | null
  }
}>()
</script>

<style scoped>
</style>

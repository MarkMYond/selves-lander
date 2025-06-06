<template>
  <section class="what-makes-us-different-section block-section-padding">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-12 lg:gap-16">
        <div
          v-if="block.title"
          class="text-left flex flex-col items-start gap-2"
        >
          <p
            v-if="block.eyebrow"
            class="text-body-14 font-medium text-brandNeutral-04 bg-brandTheme-02 rounded-full inline-block px-3 py-1 mb-2"
          >
            {{ block.eyebrow }}
          </p>
          <div class="flex flex-col items-start gap-4">
            <h2
              class="text-h3 sm:text-h2 font-bold text-brandNeutral-04"
              v-html="block.title"
            />
            <h6
              v-if="block.description"
              class="text-body-18 text-brandNeutral-04 max-w-2xl"
            >
              {{ block.description }}
            </h6>
          </div>
        </div>

        <div
          v-if="block.cards && block.cards.length"
          class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          <div
            v-for="(card, index) in block.cards"
            :key="card.id || 'benefit-card-' + index"
            class="benefit-card bg-brandNeutral-02 rounded-xl p-8 flex flex-col"
          >
            <div class="flex flex-col gap-4">
              <div
                v-if="card.icon"
                class="benefits-icon-card rounded-full p-3 w-14 h-14 flex items-center justify-center"
                :class="getIconBgClass(card.iconBackgroundColor)"
              >
                <img
                  :src="getMediaUrl(card.icon)"
                  loading="lazy"
                  :alt="card.cardTitle || 'Benefit icon'"
                  class="w-8 h-8"
                >
              </div>
              <p
                v-if="card.cardTitle"
                class="text-body-20 font-bold text-brandNeutral-04"
              >
                {{ card.cardTitle }}
              </p>
              <p
                v-if="card.cardDescription"
                class="text-body-16 text-brandNeutral-04"
              >
                {{ card.cardDescription }}
              </p>
            </div>
            <div
              v-if="
                card.additionalCardImages && card.additionalCardImages.length
              "
              class="mt-4 flex flex-col gap-2"
            >
              <div
                v-for="(imgEntry, imgIndex) in card.additionalCardImages"
                :key="imgEntry.id || 'add-img-' + imgIndex"
              >
                <img
                  :src="getMediaUrl(imgEntry.imageFile)"
                  :alt="
                    imgEntry.altText ||
                      card.cardTitle + ' additional image ' + (imgIndex + 1)
                  "
                  loading="lazy"
                  class="w-full h-auto rounded-xl object-cover"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '../../composables/useMediaUrl'
import type { Media } from '../../src/payload-types'

interface IconFile extends Media {
}

interface AdditionalImage {
  id?: string
  imageFile: IconFile | string
  altText?: string
}

interface BenefitCardData {
  id?: string
  icon: IconFile | string
  iconBackgroundColor?:
    | 'theme-color-01'
    | 'theme-color-02'
    | 'theme-color-03'
    | 'theme-color-04'
    | 'neutral-01'
    | 'neutral-04'
  cardTitle: string
  cardDescription: string
  additionalCardImages?: AdditionalImage[]
}

interface WhatMakesUsDifferentBlockProps {
  blockType: 'whatMakesUsDifferentSection'
  eyebrow?: string
  title: string
  description?: string
  cards?: BenefitCardData[]
}

const props = defineProps<{
  block: WhatMakesUsDifferentBlockProps
}>()

const { getMediaUrl } = useMediaUrl()

const getIconBgClass = (bgColorValue?: string) => {
  switch (bgColorValue) {
    case 'theme-color-01':
      return 'bg-brandTheme-01'
    case 'theme-color-02':
      return 'bg-brandTheme-02'
    case 'theme-color-03':
      return 'bg-brandTheme-03'
    case 'theme-color-04':
      return 'bg-brandTheme-04'
    case 'neutral-01':
      return 'bg-brandNeutral-01'
    case 'neutral-04':
      return 'bg-brandNeutral-04'
    default:
      return 'bg-brandTheme-04'
  }
}
</script>

<style scoped>
</style>

<template>
  <section class="benefits-section-02 block-section-padding">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="benefits-wrapper-2 flex flex-col gap-12 lg:gap-16">
        <div
          class="section-title-subtitle text-center flex flex-col items-center gap-2"
        >
          <p
            v-if="block.eyebrow"
            class="section-subtitle-text-2 text-[#9886fe] text-lg font-bold"
          >
            {{ block.eyebrow }}
          </p>
          <div class="section-title---wrapper flex flex-col items-center gap-4">
            <h2
              class="section-title-heading text-4xl sm:text-5xl font-bold text-[#120a0b]"
              v-html="block.title?.replace('<br>', '')"
            />
            <h6
              v-if="block.description"
              class="section-p-text---18px text-lg text-[#454140] max-w-2xl"
            >
              {{ block.description }}
            </h6>
          </div>
        </div>

        <div
          v-if="block.benefitCards && block.benefitCards.length"
          class="content-card-list-2 flex flex-wrap justify-between gap-6"
        >
          <div
            v-for="(card, index) in block.benefitCards"
            :key="card.id || `benefit-card-${index}`"
            class="content-card-2 rounded-[32px] p-10 flex flex-col overflow-hidden"
            :class="[
              getCardLayoutClass(index, block.benefitCards.length),
              card.cardType === 'counter'
                ? 'bg-[#120a0b] text-white card-style-4'
                : 'bg-[#f8f4f1] text-[#120a0b]',
              getCardStyleSpecificClass(index),
            ]"
          >
            <template v-if="card.cardType === 'content'">
              <div class="context-text-block flex flex-col gap-3 mb-auto">
                <h3
                  class="content-title-small text-4xl font-bold text-[#120a0b]"
                  v-html="card.contentTitle?.replace('<br>', '')"
                />
                <div
                  v-if="card.contentDescription"
                  class="max-w-md"
                >
                  <p
                    class="content-text-p text-base text-[#454140b3] font-medium leading-relaxed"
                  >
                    {{ card.contentDescription }}
                  </p>
                </div>
              </div>
              <div
                v-if="card.contentImages && card.contentImages.length"
                class="content-card-image-wrapper mt-6"
                :class="getImageWrapperClass(index)"
              >
                <template v-if="card.contentImages.length === 1">
                  <img
                    :src="getMediaUrl(card.contentImages[0].image)"
                    :alt="card.contentImages[0].altText || card.contentTitle"
                    loading="lazy"
                    class="content-card-single-image w-full h-auto rounded-xl object-cover"
                    :class="getSingleImageClass(index)"
                  >
                </template>
                <template v-else-if="card.contentImages.length === 2">
                  <div
                    class="content-card-group-image-1 w-3/4"
                    :class="{
                      'ml-auto': index === 0 && card.contentImages.length === 2,
                    }"
                  >
                    <img
                      :src="getMediaUrl(card.contentImages[0].image)"
                      :alt="card.contentImages[0].altText || card.contentTitle"
                      loading="lazy"
                      class="content-card-single-image rounded-xl shadow-md mb-4"
                    >
                  </div>
                  <div
                    class="content-card-group-image-2 w-3/4"
                    :class="{
                      'mr-auto': index === 0 && card.contentImages.length === 2,
                    }"
                  >
                    <img
                      :src="getMediaUrl(card.contentImages[1].image)"
                      :alt="card.contentImages[1].altText || card.contentTitle"
                      loading="lazy"
                      class="content-card-single-image rounded-xl shadow-md"
                    >
                  </div>
                </template>
              </div>
            </template>

            <template v-if="card.cardType === 'counter'">
              <div class="flex flex-col justify-center h-full text-left">
                <div class="benifits-counter-top-block">
                  <h2 class="text-[#ffd86f] text-6xl font-bold leading-none">
                    {{ card.counterValue }}
                  </h2>
                  <p class="medium text-white text-lg font-medium mt-1">
                    {{ card.counterText }}
                  </p>
                </div>
                <h5
                  v-if="card.counterDescription"
                  class="text-white opacity-90 text-xl font-medium leading-normal mt-6"
                >
                  {{ card.counterDescription }}
                </h5>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '@/composables/useMediaUrl'
import type { Media } from '@/src/payload-types'

interface ContentImageItem {
  image: Media | string
  altText?: string
  id?: string
}

interface BenefitCard {
  id?: string
  cardType: 'content' | 'counter'
  contentTitle?: string
  contentDescription?: string
  contentImages?: ContentImageItem[]
  counterValue?: string
  counterText?: string
  counterDescription?: string
}

interface BenefitsSectionBlockType {
  blockType: 'benefitsSection'
  eyebrow?: string
  title?: string
  description?: string
  benefitCards?: BenefitCard[]
}

const props = defineProps<{
  block: BenefitsSectionBlockType
}>()

const { getMediaUrl } = useMediaUrl()

const getCardLayoutClass = (index: number, totalCards: number) => {
  if (totalCards === 4) {
    if (index === 0) return 'w-full md:w-[43%]'
    if (index === 1) return 'w-full md:w-[54%]'
    if (index === 2) return 'w-full md:w-[57%]'
    if (index === 3) return 'w-full md:w-[40%]'
  }
  return 'w-full md:w-[48%]'
}

const getCardStyleSpecificClass = (index: number) => {
  if (index === 0) return 'card-style-1'
  if (index === 1) return 'card-style-2'
  if (index === 2) return 'card-style-3'
  return ''
}

const getImageWrapperClass = (index: number) => {
  if (index === 0) return 'flex flex-col'
  if (index === 1) return 'relative'
  if (index === 2) return 'flex gap-4'
  return ''
}

const getSingleImageClass = (index: number) => {
  if (index === 1) return '_1'
  return ''
}
</script>

<style scoped>
.card-style-1 {
  background-image: url('/webflow-assets/images/benefits-shape1.png');
  background-position: 54% 160%;
  background-repeat: no-repeat;
  background-size: 190%;
}
.card-style-2 {
  background-image: url('/webflow-assets/images/benefits-shape2.png');
  background-position: -60% 150%;
  background-repeat: no-repeat;
  background-size: 150%;
}
.card-style-3 {
  background-image: url('/webflow-assets/images/benefits-shape3.png');
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: auto;
}
.card-style-4 {
  background-image: url('/webflow-assets/images/benefits-shape4.png');
  background-position: 30% -100%;
  background-repeat: no-repeat;
  background-size: auto;
}
</style>

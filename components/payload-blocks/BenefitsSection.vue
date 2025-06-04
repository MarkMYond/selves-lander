<template>
  <section class="benefits-section-02 block-section-padding"> <!-- section-padding, remove-bottom-padding if needed -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="benefits-wrapper-2 flex flex-col gap-12 lg:gap-16">
        <!-- Title Section -->
        <div class="section-title-subtitle text-center flex flex-col items-center gap-2">
          <!-- Decorative subtitle elements from Webflow (e.g., "plans") are omitted for simplicity unless requested -->
          <p v-if="block.eyebrow" class="section-subtitle-text-2 text-[#9886fe] text-lg font-bold">
            {{ block.eyebrow }}
          </p>
          <div class="section-title---wrapper flex flex-col items-center gap-4">
            <h2 class="section-title-heading text-4xl sm:text-5xl font-bold text-[#120a0b]" v-html="block.title?.replace('<br>', '')"></h2>
            <h6 v-if="block.description" class="section-p-text---18px text-lg text-[#454140] max-w-2xl">
              {{ block.description }}
            </h6>
          </div>
        </div>

        <!-- Benefits Cards Grid -->
        <div v-if="block.benefitCards && block.benefitCards.length" class="content-card-list-2 flex flex-wrap justify-between gap-6">
          <div 
            v-for="(card, index) in block.benefitCards" 
            :key="card.id || `benefit-card-${index}`"
            class="content-card-2 rounded-[32px] p-10 flex flex-col overflow-hidden"
            :class="[
              getCardLayoutClass(index, block.benefitCards.length),
              card.cardType === 'counter' ? 'bg-[#120a0b] text-white card-style-4' : 'bg-[#f8f4f1] text-[#120a0b]',
              getCardStyleSpecificClass(index) // For content card background images
            ]"
          >
            <!-- Content Card Type -->
            <template v-if="card.cardType === 'content'">
              <div class="context-text-block flex flex-col gap-3 mb-auto">
                <h3 class="content-title-small text-4xl font-bold text-[#120a0b]" v-html="card.contentTitle?.replace('<br>', '')"></h3>
                <div v-if="card.contentDescription" class="max-w-md"> <!-- _w-430 -->
                  <p class="content-text-p text-base text-[#454140b3] font-medium leading-relaxed">{{ card.contentDescription }}</p>
                </div>
              </div>
              <div v-if="card.contentImages && card.contentImages.length" class="content-card-image-wrapper mt-6" :class="getImageWrapperClass(index)">
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
                  <div class="content-card-group-image-1 w-3/4" :class="{'ml-auto': index === 0 && card.contentImages.length === 2}"> <!-- Specific to card _1 -->
                    <img :src="getMediaUrl(card.contentImages[0].image)" :alt="card.contentImages[0].altText || card.contentTitle" loading="lazy" class="content-card-single-image rounded-xl shadow-md mb-4">
                  </div>
                  <div class="content-card-group-image-2 w-3/4" :class="{'mr-auto': index === 0 && card.contentImages.length === 2}"> <!-- Specific to card _1 -->
                     <img :src="getMediaUrl(card.contentImages[1].image)" :alt="card.contentImages[1].altText || card.contentTitle" loading="lazy" class="content-card-single-image rounded-xl shadow-md">
                  </div>
                </template>
              </div>
            </template>

            <!-- Counter Card Type -->
            <template v-if="card.cardType === 'counter'">
              <div class="flex flex-col justify-center h-full text-left">
                <div class="benifits-counter-top-block">
                  <h2 class="text-[#ffd86f] text-6xl font-bold leading-none">{{ card.counterValue }}</h2>
                  <p class="medium text-white text-lg font-medium mt-1">{{ card.counterText }}</p>
                </div>
                <h5 v-if="card.counterDescription" class="text-white opacity-90 text-xl font-medium leading-normal mt-6">{{ card.counterDescription }}</h5>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMediaUrl } from '@/composables/useMediaUrl';
import type { Media } from '@/src/payload-types';

interface ContentImageItem {
  image: Media | string;
  altText?: string;
  id?: string;
}

interface BenefitCard {
  id?: string;
  cardType: 'content' | 'counter';
  contentTitle?: string;
  contentDescription?: string;
  contentImages?: ContentImageItem[];
  counterValue?: string;
  counterText?: string;
  counterDescription?: string;
}

interface BenefitsSectionBlockType {
  blockType: 'benefitsSection';
  eyebrow?: string;
  title?: string;
  description?: string;
  benefitCards?: BenefitCard[];
}

const props = defineProps<{
  block: BenefitsSectionBlockType;
}>();

const { getMediaUrl } = useMediaUrl();

// Helper to mimic Webflow's specific card layouts
// .content-card-2._1: width: 43%
// .content-card-2._2: width: 54%
// .content-card-2._3: width: 57%
// .content-card-2._4: width: 40% (counter card)
const getCardLayoutClass = (index: number, totalCards: number) => {
  // This function now only returns width classes. Background is handled in the template.
  if (totalCards === 4) {
    if (index === 0) return 'w-full md:w-[43%]'; // Card 1
    if (index === 1) return 'w-full md:w-[54%]'; // Card 2
    if (index === 2) return 'w-full md:w-[57%]'; // Card 3
    if (index === 3) return 'w-full md:w-[40%]'; // Card 4 (Counter) - bg and text color handled in template
  }
  return 'w-full md:w-[48%]'; // Default fallback for other counts
};

const getCardStyleSpecificClass = (index: number) => {
  if (index === 0) return 'card-style-1';
  if (index === 1) return 'card-style-2';
  if (index === 2) return 'card-style-3';
  // Card 4 (counter) style is applied directly with cardType check
  return '';
};

const getImageWrapperClass = (index: number) => {
  // Webflow has specific image wrapper classes like _1, _2, _3
  // This is a simplified version. More complex logic might be needed for exact replication.
  if (index === 0) return 'flex flex-col'; // _1
  if (index === 1) return 'relative'; // _2 (image is absolute positioned in Webflow)
  if (index === 2) return 'flex gap-4'; // _3
  return '';
};

const getSingleImageClass = (index: number) => {
  if (index === 1) return '_1'; // for .content-card-single-image._1
  return '';
}

</script>

<style scoped>
/* Mimicking Webflow background patterns if they are complex and not easily done with Tailwind */
.card-style-1 { /* Corresponds to .content-card-2._1 */
  background-image: url('/webflow-assets/images/benefits-shape1.png');
  background-position: 54% 160%;
  background-repeat: no-repeat;
  background-size: 190%;
}
.card-style-2 { /* Corresponds to .content-card-2._2 */
  background-image: url('/webflow-assets/images/benefits-shape2.png');
  background-position: -60% 150%;
  background-repeat: no-repeat;
  background-size: 150%;
}
.card-style-3 { /* Corresponds to .content-card-2._3 */
  background-image: url('/webflow-assets/images/benefits-shape3.png');
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: auto;
}
.card-style-4 { /* Corresponds to .content-card-2._4 (Counter card) */
  background-image: url('/webflow-assets/images/benefits-shape4.png');
  background-position: 30% -100%; /* Note: Webflow has -100% which might be tricky */
  background-repeat: no-repeat;
  background-size: auto;
}

/* If images in card 2 need absolute positioning like Webflow: */
/* .content-card-image-wrapper._2 .content-card-single-image._1 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%; 
} */
</style>

<template>
  <section class="why-choose-us-section-01 block-section-padding"> <!-- Use new global padding class, removed others -->
    <div class="w-layout-blockcontainer container mx-auto px-4 sm:px-6 lg:px-8 w-container">
      <div class="why-choose-us-wrapper space-y-12">
        <div 
          class="why-choose-section-title"
          ref="sectionTitleRef"
          
        >
          <SectionHeader
            :eyebrowText="props.block.eyebrowText"
            :eyebrowBackgroundColor="props.block.eyebrowBackgroundColor"
            :title="props.block.title"
            :subtitle="props.block.subTitle" 
            :titleImage="props.block.titleImage"
          />
        </div>
        
        <div 
          v-if="props.block?.cards && props.block.cards.length > 0"
          class="why-choose-us-single-card-wrapper grid grid-cols-1 md:grid-cols-3 gap-8"
          ref="cardsWrapperRef"
          
        >
          <div 
            v-for="(card, index) in props.block.cards" 
            :key="card.id || `card-${index}`" 
            class="why-choose-us-single-card text-center border border-gray-200 rounded-2xl p-6 md:p-8 space-y-4"
          >
            <div 
              v-if="card.icon && typeof card.icon === 'object' && card.icon.url" 
              class="why-choose-us-card-icon inline-flex items-center justify-center rounded-xl p-3.5"
              :class="[card.iconBackgroundColor || 'bg-brandTheme-01']"
            >
              <img :src="getMediaUrl(card.icon)" loading="lazy" :alt="card.icon.alt || 'Feature Icon'" class="h-[42px] w-[42px]">
            </div>
            <p v-if="card.cardTitle" class="why-choose-us-card-item text-body-20 font-semibold text-brandNeutral-04">{{ card.cardTitle }}</p> <!-- Standardized card title -->
            <p v-if="card.cardText" class="text-body-16 text-brandNeutral-03">{{ card.cardText }}</p> <!-- Standardized card text -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType } from 'vue';
import { useScrollAnimations } from '@/composables/useScrollAnimations';
import { useMediaUrl } from '@/composables/useMediaUrl';
// TypeScript error suggests 'WhyChooseUsSection' might be the correct type now
// We'll assume eyebrowBackgroundColor and titleImage will be added to WhyChooseUsSection type
import type { WhyChooseUsSection, Media } from '@/src/payload-types'; 
import SectionHeader from '@/components/ui/SectionHeader.vue'; // Import the new SectionHeader

// ExtendedWhyChooseUsSection interface removed as fields should now be in WhyChooseUsSection from payload-types

const props = defineProps({
  block: { 
    type: Object as PropType<WhyChooseUsSection>, // Use base type
    required: true,
  },
});

const { getMediaUrl } = useMediaUrl();
const { registerElement } = useScrollAnimations();

const sectionTitleRef = ref<HTMLElement | null>(null);
const cardsWrapperRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (sectionTitleRef.value) {
    const id = sectionTitleRef.value.getAttribute('data-w-id');
    if (id) registerElement(id, sectionTitleRef.value);
  }
  if (cardsWrapperRef.value) {
    const id = cardsWrapperRef.value.getAttribute('data-w-id');
    if (id) registerElement(id, cardsWrapperRef.value);
  }
});

// Define CSS variables for theme colors if they are not globally available
// For simplicity, assuming Tailwind classes like bg-theme-color-01 are defined
// or mapped to actual colors in tailwind.config.js or global CSS.
// Webflow variables:
// --color--theme-color-01: #9886fe; (Used for icon bg)
// --color--theme-color-02: #c9ff85; (Used for eyebrow bg)
// --color--theme-color-03: #7ce1ff; (Used for icon bg)
// --color--theme-color-04: #ffd86f; (Used for icon bg)
</script>

<style scoped>
/* Replicating Webflow class names for clarity, but using Tailwind for styling */
/* .section-padding class from Webflow might provide specific padding values not covered by py-16/py-24 */
/* .remove-bottom-padding from Webflow means padding-bottom: 0; */

.why-choose-us-section-01.remove-bottom-padding {
  padding-bottom: 0;
}

/* Ensure theme color classes from Payload map to actual background colors */
/* These are now direct Tailwind classes (bg-brandTheme-01, etc.) defined in tailwind.config.js, so local definitions are removed. */

/* Text colors for theme backgrounds if needed - should be handled by Tailwind text utilities or component logic if text color needs to adapt to bg */

/* Fallback for icon images if they are SVGs and need color */
.why-choose-us-card-icon img {
  /* If SVGs are not colored correctly, might need fill/stroke styling here,
     but that's hard with <img> tags. Better to use correctly colored SVGs. */
}
</style>

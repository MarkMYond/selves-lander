<template>
  <section 
    class="brand-logo-outer-section block-section-padding"
    :class="[outerBackgroundColorClass]" 
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- This div represents the .brand-logo-wrapper.brand-logo-2 -->
      <div 
        class="brand-logo-inner-container relative p-8 md:p-12 rounded-xl" 
        :class="[innerContainerBackgroundColorClass]"
      >
        <div v-if="block.title" class="text-center mb-8 md:mb-12">
          <p class="text-xl sm:text-2xl font-semibold" :class="[titleColorClass]">{{ block.title }}</p>
        </div>
        
        <div class="logo-slider-wrapper overflow-hidden w-full relative">
          <div v-if="block.logos && block.logos.length > 0" class="flex animate-marquee-continuous">
            <!-- Original Logos -->
            <div 
              v-for="(item, index) in block.logos" 
              :key="`logo-${index}`" 
              class="flex-none px-6 md:px-10 flex items-center"
            >
              <img 
                v-if="item.logoImage && typeof item.logoImage === 'object' && item.logoImage.url"
                :src="getMediaUrl(item.logoImage)" 
                :alt="item.altText || 'Brand Logo'" 
                loading="lazy"
                class="max-h-10 md:max-h-12 object-contain" 
                :class="{'filter-for-dark-bg': block.backgroundColor === 'dark'}"
              >
              <div class="logo-logo-divider-1 h-8 w-px ml-6 md:ml-10" :class="dividerColorClass"></div>
            </div>
            <!-- Duplicated Logos for seamless scroll -->
            <div 
              v-for="(item, index) in block.logos" 
              :key="`logo-dup-${index}`" 
              class="flex-none px-6 md:px-10 flex items-center"
              aria-hidden="true"
            >
              <img 
                v-if="item.logoImage && typeof item.logoImage === 'object' && item.logoImage.url"
                :src="getMediaUrl(item.logoImage)" 
                :alt="item.altText || 'Brand Logo'" 
                loading="lazy"
                class="max-h-10 md:max-h-12 object-contain"
                :class="{'filter-for-dark-bg': block.backgroundColor === 'dark'}"
              >
              <div class="logo-logo-divider-1 h-8 w-px ml-6 md:ml-10" :class="dividerColorClass"></div>
            </div>
          </div>
          <!-- Overlays for fade effect -->
          <!-- Left overlay removed -->
          <div class="slider-overlay-right absolute top-0 bottom-0 right-0 w-16 md:w-24 bg-gradient-to-l pointer-events-none" :class="overlayGradientClassRightInner"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMediaUrl } from '@/composables/useMediaUrl';
import type { Media } from '@/src/payload-types';
import type { BrandLogosBlock as BrandLogosBlockType } from '@/src/payload-types';

const props = defineProps<{
  block: BrandLogosBlockType;
}>();

const { getMediaUrl } = useMediaUrl();

const outerBackgroundColorClass = computed(() => {
  // This class applies to the full-width section.
  // The inner container will have its own background.
  switch (props.block.backgroundColor) {
    case 'dark':
      return 'bg-transparent'; 
    case 'light':
      return 'bg-transparent'; // Remove white background for light theme
    case 'transparent':
      return 'bg-transparent';
    default:
      return 'bg-transparent'; // Remove white background for default theme
  }
});

const innerContainerBackgroundColorClass = computed(() => {
  // The .brand-logo-wrapper.brand-logo-2 style.
  // Defaulting to a light grey, common for such contained sections.
  // If outer is dark, inner should also be dark but perhaps slightly different.
  if (props.block.backgroundColor === 'dark') {
    return 'bg-[#1f1f1f]'; // A slightly lighter dark for the contained box
  }
  // For light/transparent/default, restore the inner container color
  return 'bg-brandNeutral-02'; 
});

const titleColorClass = computed(() => {
  // Webflow .brand-logo-title color was var(--color--neutral-04)
  if (props.block.backgroundColor === 'dark') {
    return 'text-brandNeutral-01'; // Light title on dark inner background
  }
  return 'text-brandNeutral-04 dark:text-brandNeutral-02'; // Darker title on light inner background
});

// overlayGradientClassLeftInner removed

const overlayGradientClassRightInner = computed(() => {
  if (props.block.backgroundColor === 'dark') return 'to-[#1f1f1f]'; // Match inner dark bg
  return 'to-brandNeutral-02'; // Match new default inner bg
});

const paddingMap = {
  none: 'py-0', // Overall section padding
  small: 'py-8 md:py-10', 
  medium: 'py-12 md:py-16', // Default for brand-logo-section-05 was ~90px top
  large: 'py-16 md:py-24'
};

const paddingTopClass = computed(() => {
  const paddingValue = props.block.paddingTop || 'medium';
  return paddingMap[paddingValue]?.replace('py-', 'pt-') || 'pt-12 md:pt-16';
});

const paddingBottomClass = computed(() => {
  const paddingValue = props.block.paddingBottom || 'medium';
  return paddingMap[paddingValue]?.replace('py-', 'pb-') || 'pb-12 md:pb-16';
});

const dividerColorClass = computed(() => {
  // Webflow .logo-logo-divider-1 was background-color: #120a0b24 (black with 24% alpha)
  if (props.block.backgroundColor === 'dark') {
    return 'bg-gray-600'; // Lighter divider on dark inner background
  }
  return 'bg-black bg-opacity-15'; // Equivalent to #120a0b24
});

</script>

<style scoped>
@keyframes marquee-continuous {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); } 
}

.animate-marquee-continuous {
  animation: marquee-continuous 30s linear infinite; /* Halved duration to double speed */
  will-change: transform;
}

/* For Webflow's blur on overlays - this requires custom CSS as Tailwind doesn't have filter:blur utilities by default */
.slider-overlay-left,
.slider-overlay-right {
  filter: blur(10px); /* Reduced blur slightly from 15px for potentially better performance/look */
}

/* Optional: Filter for dark logos on dark backgrounds if needed */
.filter-for-dark-bg {
  filter: brightness(0) invert(1);
}
</style>

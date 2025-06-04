<template>
  <section class="pt-20 pb-20 max-md:pt-16 max-sm:pt-12" :class="sectionBgClass">
    <!-- Apply container width class here -->
    <div class="relative px-40 mx-auto max-md:px-12 max-sm:px-6" :class="containerClass"> <!-- Adjusted horizontal padding again -->
      <div class="flex flex-col md:flex-row gap-12 items-center"> <!-- Reverted breakpoint lg -> md -->
        <!-- Removed md:w-1/2 -->
        <div class="flex-1">
          <h2 v-if="block?.title" class="text-brandNeutral-04 dark:text-brand-100 mb-7 text-5xl leading-tight max-md:mb-6 max-md:text-4xl max-sm:mb-5 max-sm:text-3xl">
            {{ block.title }}
          </h2>
          <p v-if="block?.description" class="text-brandNeutral-04 dark:text-brand-100 mb-7 text-lg max-md:mb-6 max-sm:mb-5">
            {{ block.description }}
          </p>
          <a
            v-if="block?.ctaButton && block.ctaButton.text && block.ctaButton.url"
            :href="block.ctaButton.url"
            :class="getButtonClasses(block.ctaButton.style)"
          >
            <span>{{ block.ctaButton.text }}</span>
            <!-- Removed inner div with icon for standard button style -->
            <!-- <div class="ml-4 flex overflow-hidden shrink-0 justify-center items-center w-10 h-10 text-red-500 bg-zinc-50 rounded-full max-md:w-8 max-md:h-8 max-sm:w-7 max-sm:h-7">
            </div> -->
          </a>
        </div>
        <!-- Removed md:w-1/2 -->
        <!-- Use getMediaUrl for image src -->
        <div class="flex-1" v-if="block?.image">
          <img
            :src="getMediaUrl(block.image)"
            :alt="block.image.alt || 'Support Ninja Section Image'"
            class="object-contain w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue'; // Import computed
// Removed unused ArrowIcon import
import { useMediaUrl } from '../../../composables/useMediaUrl'; // Import useMediaUrl
import type { Media } from '../../../src/payload-types'; // Import Media type

const { getMediaUrl } = useMediaUrl(); // Use the composable

interface CtaButton {
  text: string;
  url: string;
  style?: 'primary' | 'secondary' | null; // Added style
}
// Removed local Image interface

interface SupportNinjaBlock {
  blockType: 'supportNinjaSection';
  title?: string | null;
  description?: string | null;
  image?: Media | null; // Use Media type
  ctaButton?: CtaButton | null;
  sectionBackgroundColor?: string | null; // Added
  contentBackgroundColor?: string | null; // Added (though not used in this template)
  containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null; // Added
  id?: string | null; // Added id for BlockRenderer key
}

// Use standard generic defineProps
const props = defineProps<{
  block?: SupportNinjaBlock // Make block optional for safety
}>();

// Background and Container Classes
const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white': return 'bg-white';
    case 'light-grey': return 'bg-brand-50'; // Changed bg-light-grey to bg-brand-50
    case 'brand-50': return 'bg-brand-50';
    case 'brand-900': return 'bg-brand-900';
    case 'brand-primary': return 'bg-brand-primary';
    default: return 'bg-brand-50'; // Default based on original static code
  }
});

const containerClass = computed(() => {
  switch (props.block?.containerWidth) {
    case 'medium': return 'max-w-5xl';
    case 'wide': return 'max-w-7xl';
    case 'full': return 'max-w-none';
    default: return 'max-w-[1598px]'; // Keep original default max-width
  }
});

// Button classes based on style - Large Oval Style (Standardized)
const getButtonClasses = (style: 'primary' | 'secondary' | undefined | null) => {
  // Base classes for large oval shape, including responsive adjustments
  const baseClasses = 'inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm';
  if (style === 'secondary') {
    // Secondary: 3px brand-primary border, brand-primary text, white bg -> hover: brand-primary bg, white text
    return `${baseClasses} border-[3px] border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white`;
  }
  // Default to primary: brand-primary bg, white text -> hover: brand-900 bg
  return `${baseClasses} border border-transparent text-white bg-brand-primary hover:bg-brand-900`;
};
</script>

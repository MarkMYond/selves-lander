<template>
  <section class="py-16 md:py-24" :class="sectionBgClass">
    <div class="container mx-auto px-4 md:px-8" :class="containerClass">
      <div class="max-w-4xl">
        <h1 class="font-bold text-4xl md:text-5xl lg:text-6xl mb-4"> <!-- Reverted text color -->
          <!-- Use block data -->
          <span class="block">{{ block?.headingLine1 }}</span>
          <span class="block text-primary-600">{{ block?.headingLine2 }}</span>
        </h1>

        <p v-if="block?.subheading" class="text-lg md:text-xl text-gray-700 mb-8">{{ block.subheading }}</p> <!-- Reverted text color -->

        <div class="flex flex-wrap gap-4">
          <!-- Use getButtonClasses for dynamic styling -->
          <a
            v-if="block?.primaryCTA"
            :href="block.primaryCTA.url"
            :class="getButtonClasses(block.primaryCTA.style || 'primary')"
          >
            {{ block.primaryCTA.text }}
          </a>

          <a
            v-if="block?.secondaryCTA"
            :href="block.secondaryCTA.url"
            :class="getButtonClasses(block.secondaryCTA.style || 'secondary')"
          >
            {{ block.secondaryCTA.text }}
          </a>
        </div>
      </div>

      <div v-if="block?.image" class="mt-10">
        <img
          :src="getMediaUrl(block.image)"
          :alt="block.image.alt || 'Hero image'"
          class="rounded-lg shadow-lg max-h-96 object-cover w-full"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"> // Added lang="ts"
import { computed } from 'vue'; // Import computed
import type { Media } from '../../../../payload-cms/src/payload-types'; // Import Media type
import { useMediaUrl } from '../../../composables/useMediaUrl'; // Import useMediaUrl

// Define interfaces for nested objects
interface CTA {
  text: string;
  url: string;
  style?: 'primary' | 'secondary' | null;
}

// Define props using TypeScript generics
const props = defineProps<{
  block?: {
    blockType: 'b2HeroSection'; // Assuming this is the block slug
    headingLine1?: string | null;
    headingLine2?: string | null;
    subheading?: string | null;
    primaryCTA?: CTA | null;
    secondaryCTA?: CTA | null;
    image?: Media | null; // Use Media type
    sectionBackgroundColor?: string | null; // Added
    // contentBackgroundColor not typically needed for hero
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null; // Added
    id?: string | null;
  }
}>();

const { getMediaUrl } = useMediaUrl();

// Background and Container Classes
const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white': return 'bg-white';
    case 'light-grey': return 'bg-brand-50'; // Changed bg-light-grey to bg-brand-50
    case 'brand-50': return 'bg-brand-50';
    case 'brand-900': return 'bg-brand-900';
    case 'brand-primary': return 'bg-brand-primary';
    default: return 'bg-white'; // Default based on original static code
  }
});

const containerClass = computed(() => {
  // Hero usually uses the default container, but allow overrides
  switch (props.block?.containerWidth) {
    case 'medium': return 'max-w-5xl'; // Or adjust as needed
    case 'wide': return 'max-w-7xl';   // Or adjust as needed
    case 'full': return 'max-w-none px-0'; // Remove padding for full width
    default: return ''; // Use default container padding/width
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

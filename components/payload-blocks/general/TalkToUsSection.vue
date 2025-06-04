<template>
  <!-- Bind section background -->
  <section
    class="flex relative justify-center items-center w-full py-16 md:py-20"
    :class="sectionBgClass"
  >
    <!-- Bind container width -->
    <div class="mx-auto w-full px-6" :class="containerClass">
      <div class="py-10 md:py-16">
        <div
          class="grid gap-6 md:gap-10 justify-items-stretch items-center w-full grid-rows-[auto]"
        >
          <!-- Image (Row 1, Col 1) -->
          <!-- Check if image is an object before accessing alt -->
          <img
            v-if="block?.image && typeof block.image === 'object'"
            :src="getMediaUrl(block.image)"
            :alt="block.image.alt || 'Illustration'"
            class="self-center w-full max-w-xs md:max-w-sm lg:max-w-md align-middle select-none overflow-x-clip overflow-y-clip row-[1_/_2] col-[1_/_2]"
          />
          <!-- Handle case where image might be just an ID (string) or null/undefined -->
          <div v-else class="self-center row-[1_/_2] col-[1_/_2] text-center italic text-gray-500">[Image Placeholder]</div>

          <!-- Text Content (Row 1, Col 1 - overlaps image) -->
          <div class="self-center row-[1_/_2] col-[1_/_2] text-center md:text-left md:pl-10 lg:pl-16 z-10">
            <!-- Use headline field -->
            <div
              v-if="block?.headline"
              class="text-3xl md:text-4xl leading-tight mb-6 md:mb-8"
            >
              {{ block.headline }}
            </div>
            <!-- Button (Aligned with text, potentially below on small screens) -->
            <a
              v-if="block?.button?.url && block.button.text"
              :href="block.button.url"
              class="inline-block px-6 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-[52px] hover:bg-blue-700 transition-colors"
              
            > 
              {{ block.button.text }}
            </a>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMediaUrl } from '../../../composables/useMediaUrl';
import type { Media } from '../../../../payload-cms/src/payload-types';
// Import the correct interface name
import type { TalkToUs } from '../../../../payload-cms/src/payload-types';

const { getMediaUrl } = useMediaUrl();

// Define props using the standard generic syntax
const props = defineProps<{
  block?: TalkToUs & { // Use the imported interface name
    // Add standard layout props if not already in the block type
    sectionBackgroundColor?: string | null;
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null;
    id?: string | null; // Included for BlockRenderer key
  }
}>();

// Computed class for section background
const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white': return 'bg-white';
    case 'light-grey': return 'bg-brand-50'; // Changed bg-light-grey to bg-brand-50
    case 'brand-50': return 'bg-brand-50';
    case 'brand-900': return 'bg-brand-900';
    case 'brand-primary': return 'bg-brand-primary';
    default: return 'bg-brand-50'; // Changed bg-rose-100 to bg-brand-50
  }
});

// Computed class for container width
const containerClass = computed(() => {
  switch (props.block?.containerWidth) {
    case 'medium': return 'container max-w-5xl';
    case 'wide': return 'container max-w-7xl';
    case 'full': return 'max-w-none px-0';
    default: return 'container max-w-[1140px]'; // Default based on original static code
  }
});

// Basic button styling - refine as needed or use a shared button component
const getButtonClasses = (style: 'primary' | 'secondary' | undefined | null) => {
  const base = 'inline-block px-6 py-3 text-base font-medium text-center rounded-[52px] transition-colors';
  if (style === 'secondary') {
    // Example secondary style
    return `${base} bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50`;
  }
  // Default primary style
  return `${base} bg-blue-600 text-white hover:bg-blue-700`;
};
</script>

<template>
  <section :class="[sectionBgClass, paddingClasses]">
    <div
      class="relative px-40 mx-auto max-md:px-16 max-sm:px-7"
      :class="containerClass"
    >
      <div 
        class="flex gap-16 max-lg:flex-col max-lg:gap-12 max-sm:gap-12"
        :class="{ 'flex-row-reverse': block?.imagePosition === 'left' }"
      >
        <div class="flex-1">
          <h2
            v-if="block?.title"
            class="mb-7 text-5xl leading-tight max-md:mb-6 max-md:text-4xl max-sm:mb-5 max-sm:text-3xl text-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
          >
            {{ block.title }}
          </h2>
          <div v-if="block?.description || (block?.benefits && block.benefits.length > 0)" class="mb-7 max-md:mb-6 max-sm:mb-5">
            <p v-if="block.description" class="text-xl leading-8 mb-6 text-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']">{{ block.description }}</p>

            <ul v-if="block.benefits && block.benefits.length > 0"
              role="list"
              class="overflow-hidden mt-6 list-none p-0"
            >
              <li
                v-for="(benefit, index) in block.benefits"
                :key="benefit.id || `benefit-${index}`"
                class="flex items-start text-base leading-relaxed mb-2 text-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
              >
                <Icon 
                  v-if="block.checkmarkIconName" 
                  :name="getIconWithVariant(block.checkmarkIconName)" 
                  class="w-12 h-12 text-brand-900 mr-2 shrink-0"
                />
                <span v-else class="w-12 h-12 mr-2 shrink-0"></span>
                <span>
                  <strong class="font-semibold">{{ cleanBenefitText(benefit.title) }}</strong> 
                  <span v-if="benefit.description">&nbsp;- {{ benefit.description }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div v-if="block?.link && block.link.url">
            <!-- Use NuxtLink for internal URLs -->
            <NuxtLink
              v-if="!isExternalUrl(block.link.url)"
              :to="block.link.url"
              :class="getButtonClasses(block.link.style)"
            >
              {{ block.link.text || 'Learn More' }}
            </NuxtLink>
            <!-- Use regular anchor for external URLs -->
            <a
              v-else
              :href="block.link.url"
              :class="getButtonClasses(block.link.style)"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {{ block.link.text || 'Learn More' }}
            </a>
          </div>
        </div>
        <div class="flex-1 flex items-center">
          <div class="relative flex items-center justify-center w-full">
            <img
              v-if="characterImageUrl"
              :alt="characterImageAlt"
              :src="characterImageUrl"
              class="object-contain relative max-w-full h-auto text-center align-middle max-h-[571px] overflow-clip max-md:h-auto max-md:max-h-[352px] max-md:w-[90%] max-sm:max-h-[281px]"
              loading="lazy"
            />
            <div v-else class="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
              Image not available
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AiSupportSectionBlock, Media } from '../../../src/payload-types';

// Helper to check if a URL is external (starts with http:// or https:// or //)
const isExternalUrl = (url: string): boolean => {
  return /^(https?:)?\/\//.test(url);
};

// Import the useIcons composable
const { getIconName } = useIcons();

// Define function to get icon with regular (outline) variant
const getIconWithVariant = (iconName: string) => {
  return getIconName(iconName.toLowerCase(), 'regular');
};

// Define props to accept a block prop
const props = defineProps<{
  block: AiSupportSectionBlock;
}>();

const { getMediaUrl } = useMediaUrl();

// Helper function to clean benefit text by removing '>' characters
const cleanBenefitText = (text: string): string => {
  if (!text) return '';
  return text.replace(/^>+\s*/g, '').trim();
};

// Computed class for section background
const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white': return 'bg-white';
    case 'light-grey': return 'bg-brand-50'; // Changed to brand-50, removed light-gray
    case 'brand-50': return 'bg-brand-50';
    case 'brand-900': return 'bg-brand-900'; // Added case for brand-900
    case 'brand-primary': return 'bg-brand-primary'; // Corrected to bg-brand-primary
    default: return 'bg-brand-50'; // Default to brand-50
  }
});

// Computed class for container width
const containerClass = computed(() => {
  switch (props.block?.containerWidth) {
    case 'medium': return 'max-w-5xl';
    case 'wide': return 'max-w-7xl';
    default: return 'max-w-7xl';
  }
});

// Computed properties for character image
const characterImage = computed((): Media | null => {
  const img = typeof props.block?.characterImage === 'object' ? props.block.characterImage : null;
  return img;
});

const characterImageUrl = computed(() => {
  const url = characterImage.value?.url ? getMediaUrl(characterImage.value.url) : '';
  return url;
});

const characterImageAlt = computed(() => {
  return characterImage.value?.alt || 'AI Support Illustration';
});

// Button classes function
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

// Computed class for padding
const paddingClasses = computed(() => {
  const classes = [];
  const fullTopPadding = 'pt-32 max-md:pt-20 max-sm:pt-10';
  const halfTopPadding = 'pt-16 max-md:pt-10 max-sm:pt-6';
  const fullBottomPadding = 'pb-32 max-md:pb-20 max-sm:pb-10';
  const halfBottomPadding = 'pb-16 max-md:pb-10 max-sm:pb-6';
  
  if (props.block?.reduceTopPadding) {
    classes.push(halfTopPadding);
  } else {
    classes.push(fullTopPadding);
  }
  
  if (props.block?.reduceBottomPadding) {
    classes.push(halfBottomPadding);
  } else {
    classes.push(fullBottomPadding);
  }
  
  return classes.join(' ');
});
</script>

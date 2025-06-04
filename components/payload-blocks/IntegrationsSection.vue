<template>
  <section class="integrations-section block-section-padding"> <!-- Use new global padding class -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-start gap-12"> <!-- Alignment: items-start, consistent 48px gap -->
        <!-- Standardized Title Section -->
        <SectionHeader
          v-if="block.title"
          :eyebrowText="block.eyebrow"
          :title="block.title"
          :subtitle="block.description"
          :titleImage="block.titleImage"
          class="" 
        />

        <!-- Integration Logos -->
        <div v-if="block.logos && block.logos.length" class="flex flex-wrap justify-start gap-4 md:gap-6 lg:gap-8"> <!-- Alignment: justify-start, removed max-w-4xl -->
          <div 
            v-for="(logoEntry, index) in block.logos" 
            :key="logoEntry.id || 'logo-' + index"
            class="group relative"
          >
            <div
              class="integration-icon-card rounded-xl w-28 h-28 md:w-32 md:h-32 flex items-center justify-center p-4"
              :class="getLogoBgClass(logoEntry.backgroundColorClass)"
            >
              <img 
                v-if="logoEntry.logoImage"
                :src="getMediaUrl(logoEntry.logoImage)" 
                :alt="logoEntry.altText || 'Integration logo'" 
                loading="lazy" 
                class="max-w-full max-h-16 object-contain" 
              />
            </div>
            <span v-if="logoEntry.altText"
              class="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded-md text-xs font-medium shadow-lg whitespace-nowrap invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
              :class="[getLogoBgClass(logoEntry.backgroundColorClass), getTooltipTextColorClass(logoEntry.backgroundColorClass)]"
            >
              {{ logoEntry.altText }}
            </span>
          </div>
        </div>

        <!-- Button -->
        <div v-if="block.button && block.button.text && block.button.url" class="text-left"> <!-- Alignment: text-left, removed mt-8 -->
          <BaseButton
            :to="block.button.url"
            :variant="block.button.variant as any || 'primary'"
            class="px-8 md:px-10 rounded-full"
          >
            {{ block.button.text }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMediaUrl } from '../../composables/useMediaUrl';
import type { Media } from '../../src/payload-types';
import BaseButton from '@/components/ui/BaseButton.vue'; // Import BaseButton
import SectionHeader from '@/components/ui/SectionHeader.vue'; // Import SectionHeader

interface LogoImage extends Media {
  // Specific fields if your Media type is more detailed
}

interface LogoEntry {
  id?: string;
  logoImage: LogoImage | string;
  altText?: string;
  backgroundColorClass?: string; // Value from the select field in Payload
}

interface ButtonData {
  text: string;
  url: string;
  variant?: 'border' | 'primary' | 'secondary' | 'tertiary';
}

interface IntegrationsSectionBlockProps {
  blockType: 'integrationsSection';
  eyebrow?: string;
  title: string;
  description?: string;
  titleImage?: Media | string | null; // Added titleImage
  logos?: LogoEntry[];
  button?: ButtonData;
}

const props = defineProps<{
  block: IntegrationsSectionBlockProps;
}>();

const { getMediaUrl } = useMediaUrl();

const getTooltipTextColorClass = (bgColorValue?: string) => {
  // These are the 'value' fields from logoBgColorOptions in IntegrationsSection.ts
  // that correspond to darker background colors where light text is preferred.
  const darkBgValues = ['purple', 'green', 'yellow']; 
  if (bgColorValue && darkBgValues.includes(bgColorValue)) {
    return 'text-white'; // Using white for best contrast on potentially vibrant dark colors
  }
  return 'text-brandNeutral-04'; // Default dark text for lighter backgrounds
};

const getLogoBgClass = (bgColorValue?: string) => {
  switch (bgColorValue) {
    case 'theme-color-01': return 'bg-brandTheme-01';
    case 'theme-color-02': return 'bg-brandTheme-02';
    case 'theme-color-03': return 'bg-brandTheme-03';
    case 'theme-color-04': return 'bg-brandTheme-04';
    case 'purple': return 'bg-brandTheme-01'; // Mapped to light lavender (brandTheme-01)
    case 'green': return 'bg-brandTheme-03';   // Mapped to light teal/mint (brandTheme-03)
    case 'yellow': return 'bg-brandTheme-04';  // Mapped to light yellow/cream (brandTheme-04)
    case 'purple-light': return 'bg-brandTheme-01'; // Mapped to light lavender
    case 'default':
    default: return 'bg-brandNeutral-02'; // Default to main block background
  }
};

const getButtonClass = (variant?: string) => {
  switch (variant) {
    case 'primary': return 'bg-primary text-primary-foreground hover:brightness-90'; // Uses new primary from config (brandNeutral-04 bg, brandNeutral-01 text)
    case 'secondary': return 'bg-brandTheme-04 text-brandNeutral-04 hover:brightness-95'; // Light yellow/cream bg, dark text
    case 'tertiary': return 'bg-brandNeutral-01 text-brandNeutral-04 hover:bg-brandNeutral-02'; // White bg, dark text
    case 'border':
    default: return 'border border-brandNeutral-04 text-brandNeutral-04 hover:bg-brandNeutral-02'; // Dark border and text, light hover
  }
};
</script>

<style scoped>
/* Scoped styles if needed */
.integration-icon-card img {
  /* Ensure icons don't get overly large if their container is padded */
  max-height: 80%; /* Example, adjust as needed */
}
</style>

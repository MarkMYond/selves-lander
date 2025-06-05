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
        <div v-if="block.button && block.button.text" class="text-left"> <!-- block.button.url check removed, getButtonUrl handles undefined -->
          <BaseButton
            :to="isInternalLink(block.button) ? getButtonUrl(block.button) : undefined"
            :href="!isInternalLink(block.button) ? getButtonUrl(block.button) : undefined"
            :target="shouldOpenInNewTab(block.button) ? '_blank' : undefined"
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
import { computed } from 'vue'; // Added computed if it's used by helpers, defineProps is auto-imported
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
  url: string; // This is the simple URL string from Payload for this block
  variant?: 'border' | 'primary' | 'secondary' | 'tertiary';
  // Potentially, if Payload data for this button is enriched to match HeroSection02:
  type?: 'internal' | 'external';
  internalLink?: string | { slug?: string }; // Assuming internalLink could be object or string
  externalLink?: string;
  newTab?: boolean;
}

interface IntegrationsSectionBlockProps {
  blockType: 'integrationsSection';
  eyebrow?: string;
  title: string;
  description?: string;
  titleImage?: Media | string | null; // Added titleImage
  logos?: LogoEntry[];
  button?: ButtonData; // This can now accommodate richer link fields if present
}

const props = defineProps<{
  block: IntegrationsSectionBlockProps;
}>();

// Log button data from Payload for debugging
if (props.block?.button) {
  console.log('[IntegrationsSection] Button Data:', JSON.parse(JSON.stringify(props.block.button)));
}

const { getMediaUrl } = useMediaUrl();

// --- Link Helper Functions (adapted for ButtonData or richer link objects) ---
const isTrulyExternalUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
};

// Adjusted to accept ButtonData or a more complex link object like in HeroSection02
const isInternalLink = (button?: ButtonData | any): boolean => {
  if (!button) return false;

  // If button object has a 'type' field (like from a linkGroup in HeroSection02)
  if (button.type && typeof button.type === 'string') {
    const linkButton = button as any;
    if (linkButton.type === 'internal') return true;
    if (linkButton.type === 'external') {
      if (linkButton.externalLink && typeof linkButton.externalLink === 'string' && linkButton.externalLink.startsWith('/') && !isTrulyExternalUrl(linkButton.externalLink)) {
        return true; // Treat relative externalLink as internal
      }
      return false; // Truly external or type is external without a relative path
    }
  }

  // Fallback for simple ButtonData (like in IntegrationsSection) with just a 'url'
  if (button.url && typeof button.url === 'string') {
    return button.url.startsWith('/') && !isTrulyExternalUrl(button.url);
  }

  // Fallback if type is not set but link fields are present (more like HeroSection02's button object)
  if (button.internalLink && !button.externalLink) return true;
  if (button.externalLink && typeof button.externalLink === 'string' && button.externalLink.startsWith('/') && !isTrulyExternalUrl(button.externalLink) && !button.internalLink) return true;
  
  return false; 
};

const getButtonUrl = (button?: ButtonData | any): string => {
  if (!button) return '#';

  const isEffectivelyInternal = isInternalLink(button);

  if (isEffectivelyInternal) {
    // Case 1: Rich link object with 'type' and 'internalLink' (like HeroSection02)
    if (button.type === 'internal' && button.internalLink) {
      const internalValue = button.internalLink;
      if (typeof internalValue === 'object' && internalValue !== null && 'slug' in internalValue && typeof internalValue.slug === 'string') {
        return `/${internalValue.slug}`;
      }
      if (typeof internalValue === 'string') {
        return internalValue.startsWith('/') ? internalValue : `/${internalValue}`;
      }
    }
    // Case 2: Rich link object with 'type'='external' but 'externalLink' is a relative path
    if (button.type === 'external' && button.externalLink && typeof button.externalLink === 'string' && button.externalLink.startsWith('/') && !isTrulyExternalUrl(button.externalLink)) {
      return button.externalLink;
    }
    // Case 3: Simple ButtonData object with 'url' being a relative path
    if (button.url && typeof button.url === 'string' && button.url.startsWith('/') && !isTrulyExternalUrl(button.url)) {
      return button.url;
    }
    // Fallback for effectively internal if internalLink field exists (e.g. from HeroSection02 type button if type was missing)
    if (button.internalLink) { 
        const internalValue = button.internalLink;
        if (typeof internalValue === 'object' && internalValue !== null && 'slug' in internalValue && typeof internalValue.slug === 'string') return `/${internalValue.slug}`;
        if (typeof internalValue === 'string') return internalValue.startsWith('/') ? internalValue : `/${internalValue}`;
    }
  } else { // Truly External link
     // Case 1: Rich link object with 'type'='external' and 'externalLink'
     if (button.type === 'external' && button.externalLink && typeof button.externalLink === 'string') {
      return button.externalLink;
    }
    // Case 2: Simple ButtonData object with 'url' being a full external URL
    if (button.url && typeof button.url === 'string' && isTrulyExternalUrl(button.url)) {
      return button.url;
    }
  }
  // Fallback to raw button.url if present and not caught above, otherwise '#'
  return (typeof button.url === 'string' ? button.url : '#');
};

const shouldOpenInNewTab = (button?: ButtonData | any): boolean => {
  if (!button) return false;
  
  // If button object has a 'newTab' field (like from a linkGroup)
  if ('newTab' in button && button.newTab === true) return true;
  
  const url = getButtonUrl(button); // Use the final determined URL
  // Open in new tab if it's a truly external URL and newTab is not explicitly false
  if (isTrulyExternalUrl(url) && (!('newTab' in button) || button.newTab !== false)) return true;
  
  return false;
};

// Log processed link for debugging
if (props.block?.button) {
  console.log('[IntegrationsSection] Processed Button - isInternal:', isInternalLink(props.block.button), 'URL:', getButtonUrl(props.block.button), 'NewTab:', shouldOpenInNewTab(props.block.button));
}
// --- End of Link Helper Functions ---

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

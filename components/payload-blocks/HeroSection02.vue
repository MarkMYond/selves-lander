<template>
  <section class="hero-background-pattern"> <!-- Styling will include relative positioning -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8"> <!-- Standard inner container -->
      <div data-w-id="cf4bb090-9bc9-05d3-4165-d605cde8167b" style="opacity:0" class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16" ref="heroWrapperRef">
        <div class="lg:w-1/2 space-y-8 text-left"> <!-- Alignment: text-left -->
          <div class="space-y-6">
            <!-- New Eyebrow Section -->
            <div v-if="props.block?.eyebrowText" class="flex justify-start"> <!-- Ensure left alignment for the pill itself -->
              <p class="text-body-14 font-medium text-brandNeutral-04 bg-brandTheme-02 rounded-full inline-block px-3 py-1">
                {{ props.block.eyebrowText }}
              </p>
            </div>
            <!-- End New Eyebrow Section -->
            <h1 class="text-5xl md:text-display-h1 font-bold tracking-custom-tightest text-brandNeutral-04 leading-1" v-html="props.block?.heading || 'Transform the way your team works<br>'"></h1> <!-- text-5xl for mobile, md:text-display-h1 for tablet+ -->
            <div class="max-w-xl"> <!-- Removed mx-auto lg:mx-0 for left alignment -->
              <p class="text-body-18 md:text-body-20 leading-1.7 text-brandNeutral-03">{{ props.block?.subheading || 'Streamline your workflow, manage projects, and empower your team with task management solution.' }}</p> <!-- Typography & Color -->
            </div>
          </div>
          <div class="flex flex-row items-center justify-start gap-4"> <!-- Alignment: justify-start, changed flex-col sm:flex-row to flex-row -->
            <BaseButton
              v-if="props.block?.buttons && props.block.buttons[0]"
              :to="isInternalLink(props.block.buttons[0]) ? getButtonUrl(props.block.buttons[0]) : undefined"
              :href="!isInternalLink(props.block.buttons[0]) ? getButtonUrl(props.block.buttons[0]) : undefined"
              :target="shouldOpenInNewTab(props.block.buttons[0]) ? '_blank' : undefined"
              :variant="props.block.buttons[0].variant as any || 'primary'" 
            >
              {{ props.block?.buttons?.[0]?.label || 'Book a Demo' }}
            </BaseButton>
            <BaseButton
              v-if="props.block?.buttons && props.block.buttons[1]"
              :to="isInternalLink(props.block.buttons[1]) ? getButtonUrl(props.block.buttons[1]) : undefined"
              :href="!isInternalLink(props.block.buttons[1]) ? getButtonUrl(props.block.buttons[1]) : undefined"
              :target="shouldOpenInNewTab(props.block.buttons[1]) ? '_blank' : undefined"
              :variant="props.block.buttons[1].variant as any || 'secondary'"
            >
              {{ props.block?.buttons?.[1]?.label || 'Get in Touch' }}
            </BaseButton>
          </div>
        </div>
        <div class="lg:w-1/2 mt-10 lg:mt-0">
          <!-- Single Hero Image -->
          <div v-if="props.block?.heroImage" class="transform transition-transform duration-500 hover:scale-105">
            <img 
              :src="mediaHelpers.getMediaUrl(props.block.heroImage) || '/webflow-assets/images/hero-card-2.1.png'" 
              loading="lazy" 
              :alt="getImageAlt(props.block.heroImage) || 'Hero Image'" 
              class="w-3/4 mx-auto lg:w-full h-auto object-cover rounded-xl shadow-lg"
            >
          </div>
          <!-- Fallback if no image provided -->
          <div v-else class="w-full h-auto bg-brandNeutral-02 rounded-xl shadow-lg flex items-center justify-center aspect-[4/3]">
            <p class="text-brandNeutral-03">Hero image placeholder</p>
          </div>

          <div class="mt-6 flex justify-end" v-if="props.block?.arrowButtonText">
            <div class="inline-flex items-center p-3 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:brightness-90 transition-colors duration-150 ease-in-out"> <!-- Color & Hover -->
              <div class="mr-2">
                <p class="text-body-14 font-medium">{{ props.block?.arrowButtonText }}</p> <!-- Typography -->
              </div>
              <img src="/webflow-assets/images/shape-1.svg" loading="lazy" alt="Arrow Shape" class="h-5 w-5">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type PropType } from 'vue';
import { useScrollAnimations } from '@/composables/useScrollAnimations';
import { useHeroAnimations } from '@/composables/useHeroAnimations';
import { useMediaUrl } from '@/composables/useMediaUrl'; // Import useMediaUrl
import type { HeroSection02Payload, Media, WebPage } from '@/src/payload-types';
import BaseButton from '@/components/ui/BaseButton.vue'; // Fixed import path

// Define props
const props = defineProps({
  block: { 
    type: Object as PropType<HeroSection02Payload>,
    required: true,
  },
});

// Helper function to get button URL based on HeroSection02Payload button structure
const getButtonUrl = (button?: any): string => {
  if (!button) {
    return '#';
  }

  // Check for internal link first
  if (button.internalLink) { 
    const internalValue = button.internalLink; // internalValue is string | WebPage
    if (typeof internalValue === 'object' && internalValue !== null && 'slug' in internalValue && typeof internalValue.slug === 'string') {
      const url = `/${internalValue.slug}`;
      return url; // It's a WebPage object
    }
    if (typeof internalValue === 'string') {
      // It's an ID or a slug/path string
      const url = internalValue.startsWith('/') ? internalValue : `/${internalValue}`;
      return url;
    }
  }
  
  // Check for external link
  if (button.externalLink) {
    return button.externalLink;
  }
  
  return '#';
};

// Helper function to determine if a button is an internal link
const isInternalLink = (button?: any): boolean => {
  if (!button) {
    return false;
  }
  
  // Check the type field first if it exists
  if (button.type) {
    const isInternal = button.type === 'internal';
    return isInternal;
  }
  
  // Fallback: If button has internalLink and no externalLink, it's internal
  // If button has externalLink, it's external
  const hasInternal = !!button.internalLink;
  const hasExternal = !!button.externalLink;
  const isInternal = hasInternal && !hasExternal;
  return isInternal;
};

// Helper function to determine if link should open in new tab
const shouldOpenInNewTab = (button?: any): boolean => {
  if (!button) {
    return false;
  }
  
  // For external links, always open in new tab for security
  // Internal links can optionally open in new tab based on configuration
  const shouldOpen = !!button?.externalLink || !!button?.newTab;
  return shouldOpen;
};

// Use the composable for image URL
const mediaHelpers = useMediaUrl(); // Call composable and store its result

// Helper function to get image alt text
const getImageAlt = (imageField: string | Media | null | undefined): string | undefined => {
  if (imageField && typeof imageField === 'object' && imageField?.alt) {
    return imageField.alt;
  }
  return undefined;
};

// Scroll animations
const { registerElement: registerScrollElement } = useScrollAnimations();
// Hero animations
const { initializeHeroAnimations } = useHeroAnimations();

const heroWrapperRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (heroWrapperRef.value) {
    const id = heroWrapperRef.value.getAttribute('data-w-id');
    if (id) {
      registerScrollElement(id, heroWrapperRef.value);
    }
  }
  initializeHeroAnimations();
});
</script>

<style scoped>
.hero-background-pattern { /* Styles for background on the outer section */
  position: relative; /* Added for positioning */
  top: -5.625rem; /* Pulls section up by 90px (5rem + 10px). Adjust as needed. */
  background-image: url('/assets/images/pattern-shape2.png');
  background-position: 0% 0%; /* Top left */
  background-repeat: no-repeat;
  background-size: cover; 
  padding-top: 145px; /* Large padding to push content down, revealing background */
  padding-bottom: 56px; /* Halved bottom padding */
  overflow: hidden;
  margin-bottom: -5.625rem; /* Compensate for the shifted space in layout */
}
/* Styles specific to this hero section can be added here if needed */
</style>

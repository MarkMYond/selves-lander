<template>
  <section class="block-section-padding"> <!-- Use new global padding class -->
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex flex-col gap-12"> <!-- Wrapper for header and grid with 48px gap -->
        <SectionHeader
          v-if="block.title"
          :title="block.title"
          :subtitle="block.description"
          :eyebrowText="block.eyebrowText" 
          :titleImage="block.titleImage"
          class="" 
        />
        <!-- Grid of testimonials -->
        <div v-if="itemsToDisplay && itemsToDisplay.length" 
             class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          <!-- Repeated testimonial item -->
          <div v-for="(item, index) in itemsToDisplay" 
               :key="item.id || index"
               class="flex flex-col py-11 px-8 bg-brandNeutral-02 rounded-xl"> <!-- Removed space-y-4 -->
            <!-- Company Logo at the top -->
            <div v-if="item.companyLogo" class="flex justify-start mb-9"> <!-- Align logo to left, add mb-9 (36px) -->
              <div 
                class="inline-flex items-center justify-center rounded-xl p-3.5 w-16 h-16" 
                :class="[getLogoBgClass(item.companyLogoBackgroundColor)]"
              >
                <img 
                  :src="getMediaUrl(item.companyLogo)" 
                  :alt="(typeof item.companyLogo === 'object' && item.companyLogo?.alt) ? item.companyLogo.alt : 'Company Logo'" 
                  class="w-14 h-14 object-contain"
                />
              </div>
            </div>

            <!-- Quote Title and Quote/Summary -->
            <blockquote class="flex-1 mb-9"> <!-- Add mb-9 (36px) -->
            <h3 v-if="item.quoteTitle" class="text-h4 font-medium text-brandNeutral-04 mb-3 leading-tight">
              {{ item.quoteTitle }}
            </h3>
            <p class="text-body-18 text-brandNeutral-04 leading-relaxed">
              {{ item.quote }}
            </p>
          </blockquote>

          <!-- Author/Company Info and Read More Button -->
          <div class="mt-auto pt-5">
            <div class="flex items-center justify-between">
              <!-- Logo and Name/Role -->
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img
                    v-if="item.authorImage && typeof item.authorImage === 'object' && item.authorImage.url"
                    class="object-cover w-10 h-10 rounded-full bg-brandNeutral-stroke" 
                    :src="getMediaUrl(item.authorImage)"
                    :alt="(typeof item.authorImage === 'object' && item.authorImage?.alt) ? item.authorImage.alt : item.authorName"
                  />
                  <div v-else class="flex items-center justify-center w-10 h-10 rounded-full bg-brandNeutral-stroke">
                    <!-- Placeholder Icon for author -->
                    <svg class="w-5 h-5 text-brandNeutral-03" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-body-16 font-medium text-brandNeutral-04">
                    {{ item.authorName }}
                  </p>
                  <p v-if="item.authorRole" class="text-body-14 text-brandNeutral-03">
                    {{ item.authorRole }}
                  </p>
                </div>
              </div>

              <!-- Read More Button -->
              <BaseButton
                v-if="item.readMoreLink"
                :href="item.readMoreLink"
                target="_blank"
                variant="border"
              >
                Read More
                <svg class="w-4 h-4 ml-1 text-brandNeutral-03" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </BaseButton>
            </div>
          </div>
          </div> <!-- Close testimonial item -->
        </div> <!-- Close grid -->
      </div> <!-- Close flex wrapper -->
    </div> <!-- Close container -->
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// Note: TestimonialsSectionBlock type will need to be updated after Payload types are regenerated
// to reflect the new 'caseStudies' array and its fields like 'quoteTitle', 'companyLogo', 'readMoreLink'.
import type { TestimonialsSectionBlock, Media } from '../../src/payload-types'; // This will be incorrect for old data structure
import { useMediaUrl } from '../../composables/useMediaUrl';
import BaseButton from '@/components/ui/BaseButton.vue'; // Import BaseButton
import SectionHeader from '@/components/ui/SectionHeader.vue'; // Import SectionHeader

interface CaseStudyItem {
  id?: string | null;
  quoteTitle?: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  companyLogo?: Media | string | null; 
  companyLogoBackgroundColor?: string | null;
  authorImage?: Media | string | null; 
  readMoreLink?: string;
  // [key: string]: any; // Allow other properties - removed for stricter typing if possible
}

interface Props {
  block: TestimonialsSectionBlock & { 
    testimonials?: CaseStudyItem[], 
    caseStudies?: CaseStudyItem[],
    eyebrowText?: string | null, // Added for SectionHeader
    titleImage?: Media | string | null // Added for SectionHeader
  };
}

const props = defineProps<Props>();

const { getMediaUrl } = useMediaUrl();

const itemsToDisplay = computed(() => {
  // Prioritize new 'caseStudies' field, fall back to old 'testimonials'
  if (props.block.caseStudies && props.block.caseStudies.length > 0) {
    return props.block.caseStudies;
  }
  return props.block.testimonials || [];
});

// Helper function to get background class for company logo (similar to IntegrationsSection)
const getLogoBgClass = (bgColorValue?: string | null) => {
  switch (bgColorValue) {
    case 'theme-color-01': return 'bg-brandTheme-01';
    case 'theme-color-02': return 'bg-brandTheme-02';
    case 'theme-color-03': return 'bg-brandTheme-03';
    case 'theme-color-04': return 'bg-brandTheme-04';
    case 'purple': return 'bg-brandTheme-01';
    case 'green': return 'bg-brandTheme-03';
    case 'yellow': return 'bg-brandTheme-04';
    case 'purple-light': return 'bg-brandTheme-01';
    case 'default':
    default: return 'bg-brandNeutral-01'; // Default to a light neutral, adjust as needed
  }
};
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>

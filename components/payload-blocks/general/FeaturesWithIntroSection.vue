<script setup lang="ts">
import { computed } from 'vue'
// Ensure this path is correct based on your payload-types.ts location
import type { FeaturesWithIntroSectionBlock as FeaturesWithIntroSectionBlockType, Media } from '../../../src/payload-types' 
import TextImageSection from './TextImageSection.vue' // Import the child component
import SectionHeader from '@/components/ui/SectionHeader.vue'; // Import SectionHeader

// Define a more specific type for introContent if needed, or rely on generated types
interface IntroContentType {
  superTitle?: string | null;
  title: string; // Assuming title is required for intro
  description?: string | null;
  eyebrowBackgroundColor?: string | null; // For SectionHeader
  titleImage?: Media | string | null;      // For SectionHeader
}

const props = defineProps<{
  block: Omit<FeaturesWithIntroSectionBlockType, 'introContent'> & { 
    id: string;
    introContent?: IntroContentType | null; // Use the more specific type
    // sectionBackgroundColor, etc., are part of FeaturesWithIntroSectionBlockType
  }
}>()

// Map Payload background color values to Tailwind classes for the parent section
const sectionBgClass = computed(() => {
  if (props.block?.sectionBackgroundColor === 'none' || !props.block?.sectionBackgroundColor) {
    return 'bg-transparent'
  }
  return 'bg-' + props.block.sectionBackgroundColor
})

// containerClass and paddingClasses are no longer used as block-section-padding and standard container are applied directly

// Styling for the introductory content (these consts are no longer needed as SectionHeader handles styling)
// const introSuperTitleClass = 'section-subtitle-btn---1 mb-4 inline-block px-4 py-1 font-medium rounded-full bg-brandTheme-02 text-brandNeutral-04 text-body-14';
// const introTitleClass = 'section-title-heading text-h3 md:text-h2 font-bold text-brandNeutral-04 dark:text-brandNeutral-01 mb-4 text-center';
// const introDescriptionClass = 'section-p-text---18px text-body-18 text-brandNeutral-03 dark:text-brandNeutral-02 max-w-3xl mx-auto text-center';

</script>

<template>
  <section :class="[sectionBgClass, 'block-section-padding']"> <!-- Use new global padding class -->
    <div class="container mx-auto px-2 sm:px-3 lg:px-4"> <!-- Reduced padding -->
      <div class="max-w-4xl mx-auto"> <!-- Restored max-w-4xl -->
        <!-- Introductory Content using SectionHeader -->
        <div v-if="props.block.introContent && props.block.introContent.title" class="mb-12"> <!-- Removed centering classes -->
          <SectionHeader
            :title="props.block.introContent.title"
            :subtitle="props.block.introContent.description"
            :eyebrow-text="props.block.introContent.superTitle"
            :eyebrow-background-color="props.block.introContent.eyebrowBackgroundColor"
            :title-image="props.block.introContent.titleImage"
          />
        </div>

        <!-- Feature Items (using TextImageSection component) -->
        <div v-if="props.block.featureItems && props.block.featureItems.length > 0" class="space-y-12"> <!-- Changed to space-y-2 -->
          <template v-for="(item, index) in props.block.featureItems" :key="item.id || `feature-${index}`">
            <TextImageSection 
            :block="{
              ...item,
              blockType: 'textImageSection', // Add required blockType
              id: item.id || `feature-item-${index}`, 
              sectionBackgroundColor: 'none', 
              contentBackgroundColor: 'none',
              // containerWidth: 'full', // Removed, TextImageSection is now always full within its parent
              removeTopPadding: true, 
              removeBottomPadding: true, 
            }" 
          />
          </template>
        </div>
      </div> <!-- Closing the max-w-4xl wrapper -->
    </div>
  </section>
</template>

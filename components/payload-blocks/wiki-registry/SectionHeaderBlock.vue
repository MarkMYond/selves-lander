<template>
  <component :is="block.level || 'h2'" :id="anchorId" class="font-bold scroll-mt-20" :class="headingClasses">
    <a v-if="anchorId" :href="`#${anchorId}`"> <!-- Removed hover:underline -->
      {{ block.title }}
    </a>
    <span v-else>{{ block.title }}</span>
  </component>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import slugify from 'slugify' // Using slugify for anchor generation

// Assuming structure for SectionHeaderBlock data from Payload
interface SectionHeaderBlockData {
  id?: string;
  blockType: 'sectionHeaderBlock';
  title: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  anchorId?: string;
}

const props = defineProps({
  block: {
    type: Object as PropType<SectionHeaderBlockData>,
    required: true,
  },
})

// Generate anchor ID if not provided, based on title
const anchorId = computed(() => {
  if (props.block?.anchorId) {
    // Use provided ID, ensuring it's URL-friendly (basic slugify)
    return slugify(props.block.anchorId, { lower: true, strict: true });
  }
  if (props.block?.title) {
    // Generate from title if no anchorId is given
    return slugify(props.block.title, { lower: true, strict: true });
  }
  return null; // No anchor if no title or ID
});

// Compute Tailwind classes based on heading level
const headingClasses = computed(() => {
  const commonColorTracking = 'text-brandNeutral-04 dark:text-brand-100 tracking-tight';
  const commonColorOnly = 'text-brandNeutral-04 dark:text-brand-100';

  switch (props.block?.level) {
    case 'h1':
      // Retaining original H1 style from this component for other potential uses.
      // Wiki page H1 is styled directly in its own file.
      return `text-brandNeutral-04 dark:text-brand-100 text-6xl lg:text-7xl my-6`; // Added color and back a default margin
    case 'h2':
      // Making h2 smaller as requested: reducing text-4xl to text-3xl, etc.
      return `${commonColorTracking} text-3xl leading-tight max-md:text-2xl max-sm:text-xl mt-8 mb-4`;
    case 'h3':
      // User expectation: "text-brand-900 dark:text-brand-100 text-2xl leading-8 max-sm:text-lg max-sm:leading-7 text-center"
      // Let's use mt-6 mb-3 for H3 margins.
      return `${commonColorOnly} text-2xl leading-8 max-sm:text-lg max-sm:leading-7 text-center mt-6 mb-3`;
    case 'h4':
      return `${commonColorOnly} text-lg lg:text-xl my-4`; // Added color, keeping H4 as is for now, added some margin
    default: // Fallback, e.g. if level is not h1-h4
      // Using the same styles as h2 for consistency
      return `${commonColorTracking} text-3xl leading-tight max-md:text-2xl max-sm:text-xl mt-8 mb-4`;
  }
});

// Adjust margins based on heading level - applied on the component tag directly for simplicity
// The `my-6` class on the component tag will be overridden by more specific margin classes here if needed,
// or we can remove `my-6` and apply all margins here.
// For now, let's keep `my-6` as a base and let these specific classes add to or override it if Tailwind's utility precedence allows.
// A better approach might be to remove `my-6` from the template and set all margins here.
// However, to minimize changes in this step, I'll just return the size/color classes.
// The margins `my-6` (mt-6 mb-6) will apply.
// H1: mt-8 mb-10 (from page)
// H2: (current my-6) -> text-5xl. Let's make it mt-12 mb-6
// H3: (current my-6) -> text-3xl. Let's make it mt-10 mb-4

// The component tag has `my-6`. Let's adjust this.
// The component tag is: <component :is="block.level || 'h2'" :id="anchorId" class="my-6 font-bold scroll-mt-20" :class="headingClasses">
// We can't easily change the `my-6` from here without also changing the template.
// For now, the `headingClasses` will only set text size, color, leading, tracking.
// The `my-6` will still apply. This might be acceptable or need further refinement.
// Let's stick to the user's request of matching H2/H3 styles first, focusing on size and appearance.
</script>

<style scoped>
/* Add specific header styling if needed */
/* scroll-mt-20 provides top margin when scrolling to the anchor, adjust as needed for sticky header */
</style>

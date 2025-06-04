<template>
  <div class="section-header text-left space-y-2 md:flex md:flex-row md:items-start md:gap-8">
    <!-- Text Content Column -->
    <div :class="[titleImage ? 'md:w-3/4' : 'md:w-full', 'space-y-2']">
      <div v-if="eyebrowText" 
           class="inline-block px-4 py-1 rounded-full"
           :class="[eyebrowBackgroundColorClass]">
        <p class="text-body-14 font-medium text-brandNeutral-04">{{ eyebrowText }}</p>
      </div>
      <div class="space-y-4">
        <h2 v-if="title" class="text-h3 md:text-h2 font-bold text-brandNeutral-04 max-w-xl leading-[1.1]" v-html="title"></h2> <!-- Set line-height to 1.1, changed max-w-lg to max-w-xl -->
        <p v-if="subtitle" class="text-body-18 text-brandNeutral-03 max-w-2xl" v-html="subtitle"></p>
      </div>
    </div>
    <!-- Image Column (Desktop Only) -->
    <div v-if="titleImage && typeof titleImage === 'object' && titleImage.url" 
         class="hidden md:block md:w-1/4 mt-4 md:mt-0">
      <img 
        :src="getMediaUrl(titleImage)" 
        :alt="titleImage.alt || title || 'Header image'" 
        class="w-full h-auto rounded-lg object-contain mx-auto"
        loading="lazy"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { useMediaUrl } from '@/composables/useMediaUrl';
import type { Media } from '@/src/payload-types'; // Assuming Media type is available

const props = defineProps({
  eyebrowText: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },
  eyebrowBackgroundColor: { 
    type: [String, null] as PropType<string | null>,
    required: false,
    default: 'bg-brandTheme-02',
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },
  titleImage: {
    type: [Object, String, null] as PropType<Media | string | null>,
    required: false,
    default: null,
  },
  // titleImageAlt: { 
  //   type: String,
  //   required: false,
  // },
});

const { getMediaUrl } = useMediaUrl();

const eyebrowBackgroundColorClass = computed(() => {
  // If a specific class is passed, use it, otherwise use the default.
  // This allows direct Tailwind classes from Payload.
  return props.eyebrowBackgroundColor;
});
</script>

<style scoped>
/* Add any specific scoped styles if needed */
.section-header {
  /* Placeholder for any root-level styling if necessary */
}
</style>

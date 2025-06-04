<script setup lang="ts">
import { computed } from 'vue';
import { useMediaUrl } from '../../../composables/useMediaUrl';
// Assuming TemplateCard will be moved to the same directory
import TemplateCard from './TemplateCard.vue';
// Import Payload types
import type { NewTemplatesSectionBlock, Template } from '../../../../payload-cms/src/payload-types';

const { getMediaUrl } = useMediaUrl();

// Define props based on the Payload block type
const props = defineProps<{
  block?: NewTemplatesSectionBlock & {
    sectionBackgroundColor?: string | null;
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null;
    id?: string | null;
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
  // Using max-w classes directly on the inner div as per temp component structure
  switch (props.block?.containerWidth) {
    case 'medium': return 'max-w-5xl';
    case 'wide': return 'max-w-7xl';
    case 'full': return 'max-w-none';
    default: return 'max-w-[1140px]'; // Default from temp component layout
  }
});

// Helper to ensure templateItem is a populated Template object
const isTemplateObject = (item: string | Template | undefined | null): item is Template => {
  return typeof item === 'object' && item !== null;
};

</script>

<template>
  <!-- Use sectionBgClass for background -->
   <section :class="sectionBgClass">
     <!-- Use containerClass for width constraint -->
     <div class="mx-auto w-full max-sm:relative" :class="containerClass">
       <div class="px-3 mx-6 max-sm:px-5">
          <div class="pt-16 pb-32 max-md:pt-12 max-md:pb-24 max-sm:pt-8 max-sm:pb-16"> <!-- Reduced top padding by half -->
            <!-- Main grid layout -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center"> <!-- Reverted to 4 columns -->

             <!-- Text Content Section (using Payload data) -->
             <div
               v-if="block?.content"
               class="flex flex-col justify-center gap-0 gap-y-0 lg:col-span-1 lg:order-last"
             >
              <header v-if="block.content.superTitle" class="mb-4 max-md:mb-6 max-sm:mb-5">
               <p
                 class="text-base leading-relaxed font-bold uppercase whitespace-pre-line border-neutral-400 decoration-neutral-400 outline-neutral-400 text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
               >
                 {{ block.content.superTitle }}
              </p>
              </header>
              <div v-if="block.content.title" class="mb-4 max-md:mb-6 max-sm:mb-5">
                <h3 class="text-brand-900 dark:text-brand-100 text-3xl leading-8">{{ block.content.title }}</h3> <!-- Added text color -->
               </div>
               <div v-if="block.content.description" class="mb-8 max-md:mb-12">
                <p class="text-base leading-relaxed text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"> <!-- Added text color -->
                  {{ block.content.description }}
                </p>
              </div>
               <div v-if="block.content.ctaUrl && block.content.ctaText">
                 <a
                   :href="block.content.ctaUrl"
                   class="inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm border border-transparent text-white bg-brand-primary hover:bg-brand-900 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
                   :aria-label="block.content.ctaText"
                   >{{ block.content.ctaText }}</a
                 >
              </div>
            </div>

             <!-- Template Cards Grid (using Payload data) -->
             <div
               v-if="block?.templates && block.templates.length > 0"
               class="grid lg:col-span-3 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-sm:flex max-sm:overflow-x-scroll"
               >
               <!-- Iterate over block.templates -->
               <template v-for="(templateItem, index) in block.templates">
                <!-- Check if templateItem is a populated object -->
                <!-- Check if templateItem is a populated object -->
                <TemplateCard
                  v-if="isTemplateObject(templateItem)"
                  :key="templateItem.id || index"
                  :href="templateItem.href || '#'"
                  :imageUrl="getMediaUrl(templateItem.image)"
                   :imageAlt="(typeof templateItem.image === 'object' && templateItem.image?.alt) ? templateItem.image.alt : (templateItem.title || 'Template image')"
                   :title="templateItem.title || 'Untitled'"
                   :category="templateItem.category"
                   :iconName="templateItem.iconName || undefined"
                   backgroundColor="bg-white"
                   :hasBorder="true"
                 ></TemplateCard>
               </template>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

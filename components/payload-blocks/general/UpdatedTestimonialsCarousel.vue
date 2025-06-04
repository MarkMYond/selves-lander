<template>
  <!-- Bind section background -->
  <div class="pt-20 max-md:pt-20 max-sm:pt-12" :class="sectionBgClass">
    <!-- Bind container width -->
    <div class="relative px-4 mx-auto max-sm:w-full max-sm:max-w-full" :class="containerClass">
      <!-- TODO: Review inner background - should it be contentBackgroundColor? -->
      <div class="bg-brand-100 rounded-xl px-12 py-20 relative overflow-hidden min-h-[320px]">
        <!-- Decorative SVGs -->
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
          <svg class="absolute top-0 left-0 w-64 h-64" viewBox="0 0 100 100">
            <path d="M100,0 C100,60 0,60 0,100" stroke="#1F1F1F" fill="none" stroke-width="1.5" />
          </svg>
          <svg class="absolute top-0 right-0 w-64 h-64" viewBox="0 0 100 100" style="transform: scaleX(-1)">
            <path d="M100,0 C100,60 0,60 0,100" stroke="#1F1F1F" fill="none" stroke-width="1.5" />
          </svg>
        </div>

        <!-- Title from block prop -->
        <h2
          v-if="block?.title"
          class="mb-7 text-5xl leading-tight text-center max-md:mb-6 max-md:text-4xl max-sm:mb-5 max-sm:text-3xl"
        >
          {{ block.title }}
        </h2>

        <!-- Content -->
        <div v-if="currentTestimonial" class="text-center relative z-10 max-w-4xl mx-auto">
          <blockquote v-if="currentTestimonial.quote" class="text-2xl italic text-[#2C2C2C] font-medium leading-relaxed mb-12">
            "{{ currentTestimonial.quote }}"
          </blockquote>

          <div class="flex flex-col items-center">
            <div v-if="currentTestimonial.authorName" class="font-bold text-[#2C2C2C] text-xl">
              {{ currentTestimonial.authorName }}
            </div>
            <div v-if="currentTestimonial.authorTitle" class="text-[#2C2C2C] text-md mt-1">
              {{ currentTestimonial.authorTitle }}
            </div>
          </div>
        </div>

        <!-- Placeholder if no testimonials -->
        <div v-else class="text-center italic text-gray-500 py-12">
          No testimonials available.
        </div>

        <!-- Navigation elements (dots) and connecting line to the arrows -->
        <div v-if="totalSlides > 1" class="absolute bottom-12 left-0 right-0 flex justify-between items-center px-12 z-10">
          <!-- Dots -->
          <div class="flex items-center gap-2">
            <button
              v-for="index in totalSlides"
              :key="`dot-${index}`"
              type="button"
              :aria-label="`Show testimonial ${index} of ${totalSlides}`"
              class="relative shrink-0 w-3 h-3 rounded-full cursor-pointer transition-colors duration-200"
              :class="currentSlide === index - 1 ? 'bg-[#2C2C2C]' : 'bg-[#D0D0D0]'"
              @click="goToSlide(index - 1)"
            ></button>
          </div>

          <!-- Connecting line and arrow container -->
          <div class="flex items-center">
            <!-- Horizontal line connecting dots to arrows -->
            <div class="w-20 h-px bg-[#D0D0D0] mr-3"></div>

            <!-- Arrow Navigation Pill -->
            <div class="flex items-center bg-[#1B3A2C] rounded-full px-3">
              <button
                aria-label="Previous testimonial"
                class="flex justify-center items-center w-10 h-10 text-white cursor-pointer"
                @click="prevSlide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="h-6 w-px bg-white/20 mx-1"></div>
              <button
                aria-label="Next testimonial"
                class="flex justify-center items-center w-10 h-10 text-white cursor-pointer"
                @click="nextSlide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Media } from '../../../../payload-cms/src/payload-types'; // Import Media type

const props = defineProps<{
  block?: { // Make block optional
    blockType: 'builderTestimonialsCarousel';
    title?: string;
    backgroundImage?: {
      id: string;
      alt?: string | null;
      url?: string | null;
    } | null;
    testimonials?: Array<{
      quote?: string;
      authorName?: string;
      authorTitle?: string;
      authorImage?: {
        id: string;
        alt?: string | null;
        url?: string | null;
      } | null;
      id?: string | null;
    }>;
    id?: string | null;
    // Add standard layout props
    sectionBackgroundColor?: string | null;
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null;
  } | undefined // Make block optional
}>();

const currentSlide = ref(0);

// Use optional chaining for block access
const totalSlides = computed(() => props.block?.testimonials?.length || 0);

const currentTestimonial = computed(() => {
  // Use optional chaining for block access
  if (!props.block?.testimonials || props.block.testimonials.length === 0) {
    return null;
  }
  return props.block.testimonials[currentSlide.value];
});

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides.value) % totalSlides.value;
};

// Background and Container Classes
const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white': return 'bg-white';
    case 'light-grey': return 'bg-brand-50'; // Changed bg-light-grey to bg-brand-50
    case 'brand-50': return 'bg-brand-50';
    case 'brand-900': return 'bg-brand-900';
    case 'brand-primary': return 'bg-brand-primary';
    default: return 'bg-brand-50'; // Default based on original static code
  }
});

const containerClass = computed(() => {
  // This applies to the inner content container, not the outer section
  switch (props.block?.containerWidth) {
    case 'medium': return 'max-w-5xl';
    case 'wide': return 'max-w-7xl';
    case 'full': return 'max-w-none';
    default: return 'max-w-7xl'; // Default to wide for the inner content
  }
});
</script>

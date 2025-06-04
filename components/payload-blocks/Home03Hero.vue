<template>
  <section class=""> <!-- hero-section-03 - Removed pt-[105px] -->
    <div class="container mx-auto px-[30px] max-w-[1500px]"> <!-- container hero-3 -->
      <div 
        class="relative z-10 flex flex-col gap-20 bg-[#f8f4f1] bg-[url('/webflow-assets/images/pattern-hero3.png')] bg-center bg-no-repeat bg-cover rounded-tl-[24px] rounded-tr-[24px] max-w-[1360px] mx-auto pt-10 px-10"
      > <!-- hero-wrapper-3 -->
        <!-- Top Block -->
        <div class="flex flex-col items-center gap-6 text-center max-w-[934px] mx-auto"> <!-- hero-top-block-2 -->
          <div class="flex flex-col items-center gap-4 mx-auto"> <!-- hero-top-text-block-2 -->
            <div v-if="block.taglinePrefix || block.taglineSuffix" class="flex items-center gap-2 p-[4px_20px_4px_8px] bg-white rounded-full"> <!-- tagline-2 -->
              <div v-if="block.taglinePrefix" class="bg-[#c9ff85] text-[#454140] px-4 py-0.5 rounded-full text-sm font-medium"> <!-- tagline-button & body-text-14 medium -->
                <p>{{ block.taglinePrefix }}</p>
              </div>
              <p v-if="block.taglineSuffix" class="text-base font-medium text-[#120a0b] leading-[1.7]">{{ block.taglineSuffix }}</p> <!-- body-text-16 medium text-neutral-04 -->
            </div>
            <h1 class="text-[72px] font-bold text-[#120a0b] leading-[1.15] tracking-[-0.02em] mb-0"> <!-- display-heading-1 -->
              <span v-html="block.headline"></span>
            </h1>
            <div v-if="block.subheadline" class="max-w-[650px] mx-auto"> <!-- _w-650 -->
              <p class="text-xl text-[#454140] leading-[1.7]">{{ block.subheadline }}</p> <!-- body-text-20 -->
            </div>
          </div>
          <div class="w-full max-w-[521px] mx-auto"> <!-- form-block-2 -->
            <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-4 w-full"> <!-- hero-form -->
              <input 
                class="block w-full h-14 px-6 py-3 font-medium text-[#120a0b] bg-white border-0 rounded-full placeholder:text-[#120a0b] placeholder:text-base focus:ring-2 focus:ring-indigo-500" 
                maxlength="256" 
                name="Email-Address" 
                :placeholder="block.formPlaceholder || 'Enter your email'" 
                type="email" 
                required
                v-model="email"
              > <!-- text-field-2 -->
              <button 
                type="submit"
                class="w-full sm:w-auto flex-shrink-0 h-14 px-[30px] py-3 border border-transparent rounded-full shadow-sm text-base font-bold text-[#120a0b] bg-[#ffd86f] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffd86f]"
              > <!-- submit-button-2 button secondary -->
                {{ block.formButtonText || 'Get Started for free' }}
              </button>
            </form>
            <!-- Form submission messages can be handled later if needed -->
          </div>
        </div>

        <!-- Bottom Block - Image Grid -->
        <div class="relative z-10 flex items-center justify-between w-full gap-6 mx-auto"> <!-- hero-bottom-block-2 -->
          <div class="flex flex-col w-1/4 gap-3.5"> <!-- hero-card-image-1 -->
            <div v-if="getImageUrl(block.imageTopLeft)" class="w-full"> <!-- hero-image-group-1 -->
              <img :src="getImageUrl(block.imageTopLeft)" :alt="getImageAlt(block.imageTopLeft) || 'Hero image'" class="rounded-[24px] shadow-[0_4px_10px_rgba(240,227,220,0.5)] object-cover w-full h-auto">
            </div>
            <div v-if="getImageUrl(block.imageTopRight)" class="w-full p-1 bg-[#f2e9e4] border-2 border-dashed border-[#e7d5cb] rounded-xl"> <!-- hero-image-group-2 -->
              <img :src="getImageUrl(block.imageTopRight)" :alt="getImageAlt(block.imageTopRight) || 'Hero image'" class="rounded-[24px] shadow-[0_4px_10px_rgba(240,227,220,0.5)] object-cover w-full h-auto -rotate-[5.04deg]">
            </div>
          </div>
          <div v-if="getImageUrl(block.imageCenter)" class="w-[46%]"> <!-- hero-card-image-2 -->
            <img :src="getImageUrl(block.imageCenter)" :alt="getImageAlt(block.imageCenter) || 'Hero image'" class="rounded-t-[24px] rounded-b-none shadow-none object-cover w-full aspect-[4/3]"> <!-- hero-card-single-image _3 -->
          </div>
          <div v-if="getImageUrl(block.imageBottom)" class="w-1/4"> <!-- hero-card-image-3 -->
            <img :src="getImageUrl(block.imageBottom)" :alt="getImageAlt(block.imageBottom) || 'Hero image'" class="rounded-[24px] shadow-[0_4px_10px_rgba(240,227,220,0.5)] object-cover w-full h-auto">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMediaUrl } from '@/composables/useMediaUrl'; // Assuming this composable exists in frontend
import type { Media } from '@/src/payload-types'; // Import Media type

// Define Props
interface Home03HeroBlock {
  blockType: 'home03Hero'; // Matches the slug in Payload
  taglinePrefix?: string;
  taglineSuffix?: string;
  headline: string;
  subheadline?: string;
  formPlaceholder?: string;
  formButtonText?: string;
  imageTopLeft?: Media | string; // Can be full object or just ID
  imageTopRight?: Media | string;
  imageCenter?: Media | string;
  imageBottom?: Media | string;
}

const props = defineProps<{
  block: Home03HeroBlock;
}>();

const email = ref('');
const { getMediaUrl } = useMediaUrl(); // Correctly destructure getMediaUrl

const handleSubmit = () => {
  if (email.value) {
    console.log('Form submitted with email:', email.value);
    // Handle form submission logic here (e.g., send to an API)
    alert(`Thank you! Your email ${email.value} has been received (simulated).`);
    email.value = ''; // Clear input after submission
  }
};

// Use the composable's getMediaUrl directly
const getImageUrl = (image: Media | string | undefined): string => {
  return getMediaUrl(image); // The composable already handles logic for string or object
};

// Helper to get image alt text
const getImageAlt = (image: Media | string | undefined): string => {
  if (!image) return '';
  if (typeof image === 'object' && image.alt) {
    return image.alt;
  }
  // If it's an ID or alt is not directly available on the object, 
  // you might need a more complex lookup or a default.
  // For now, returning empty string if not an object with alt.
  return ''; 
};

</script>

<style scoped>
/* Scoped styles if needed, but prefer Tailwind utilities */
</style>

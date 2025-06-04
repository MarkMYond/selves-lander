<template>
  <main>
    <!-- Form Section -->
    <section class="book-a-demo-form-section py-16 sm:py-24 lg:py-32">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="book-a-demo-card max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-xl">
            <h3 class="text-2xl font-bold text-brandNeutral-04 mb-8 text-center">Book Your Demo</h3>
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <div>
                <label for="your-name" class="block text-sm font-medium text-brandNeutral-03 mb-1">Your Name</label>
                <input type="text" name="your-name" id="your-name" placeholder="Enter your name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-sm">
              </div>
              <div>
                <label for="your-email" class="block text-sm font-medium text-brandNeutral-03 mb-1">Your Email</label>
                <input type="email" name="your-email" id="your-email" placeholder="Enter your email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-sm">
              </div>
              <div>
                <label for="company" class="block text-sm font-medium text-brandNeutral-03 mb-1">Company</label>
                <input type="text" name="company" id="company" placeholder="Company Name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-sm">
              </div>
              <div>
                <label for="subject" class="block text-sm font-medium text-brandNeutral-03 mb-1">Subject</label>
                <input type="text" name="subject" id="subject" placeholder="Write your subject" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-sm">
              </div>
              <div class="pt-2">
                <label class="flex items-center">
                  <input id="agree-privacy" name="agree-privacy" type="checkbox" class="h-4 w-4 text-brandTheme-01 border-gray-300 rounded focus:ring-brandTheme-01">
                  <span for="agree-privacy" class="ml-2 block text-sm text-brandNeutral-03">
                    By reaching out to us, you agree to our 
                    <NuxtLink to="/privacy-policy" class="font-medium text-brandTheme-01 hover:text-brandTheme-01/80">Privacy Policy.</NuxtLink>
                  </span>
                </label>
              </div>
              <div class="pt-2">
                <BaseButton type="submit" variant="primary" class="w-full flex justify-center items-center">
                  Send Message
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 ml-2">
                    <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
                  </svg>
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- "Why book a demo?" Section - This will be rendered by BlockRenderer if page is fetched from Payload -->
      <!-- If this page is purely static, you'd put the FeaturesWithIntroSection directly here -->
      <BlockRenderer :blocks="pageData.value?.layout" /> 
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import AppHeader from '@/components/AppHeader.vue'; // No longer needed if default layout used
// import TheFooter from '@/components/TheFooter.vue'; // No longer needed if default layout used
import SectionHeader from '@/components/ui/SectionHeader.vue'; // Still needed if form uses it, but form is static
import BaseButton from '@/components/ui/BaseButton.vue';
import BlockRenderer from '@/components/BlockRenderer.vue'; // For rendering Payload blocks
import { useAsyncData, useRuntimeConfig, useError } from 'nuxt/app'; // Import Nuxt composables from nuxt/app
import type { WebPage as PageType } from '@/src/payload-types'; // Import PageType

// SEO and page metadata
useHead({
  title: 'Book A Demo - TaskHub',
  meta: [
    { name: 'description', content: 'Schedule a personalized demo of TaskHub and see how it can transform your team\'s productivity.' }
  ],
});

// Fetch page data from Payload
const config = useRuntimeConfig();
const { PAYLOAD_API_URL } = config.public;
const { data: pageData, error } = await useAsyncData<PageType>(
  'book-a-demo-page',
  () => $fetch(`${PAYLOAD_API_URL}/web-pages?where[slug][equals]=book-a-demo&depth=2`)
        .then(data => (data as any)?.docs?.[0] as PageType) // Extract the first document
);

if (error.value) {
  console.error('Error fetching book-a-demo page data:', error.value);
  // Optionally, use Nuxt's error handling
  // throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const handleSubmit = () => {
  // Placeholder for form submission logic
  alert('Form submitted (placeholder)!');
};
</script>

<style scoped>
/* Page-specific styles if needed */
.inner-hero-section {
  background-color: #FBF8FF; /* brandNeutral-02, was #f8f4f1 */
}
.book-a-demo-card {
  /* Add any specific card styling if different from shadow-xl, bg-white, rounded-xl */
}
</style>

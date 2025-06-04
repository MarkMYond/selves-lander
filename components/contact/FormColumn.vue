<template>
  <section
    :class="['flex flex-col justify-center items-center p-4 w-full bg-white max-md:max-w-full max-sm:px-6 max-sm:py-4', { 'min-h-[calc(100vh-var(--header-height,80px))]': !isGetInTouchPage }]"
    aria-labelledby="form-heading"
  >
    <div class="mb-4 w-[400px] max-md:w-[540px] max-sm:w-full">
      <!-- Keep sr-only h2 for accessibility -->
      <h2 id="form-heading" class="sr-only">Contact form</h2>
      
      <form
        name="contact-form"
        aria-label="Contact Form"
        @submit.prevent="handleSubmit"
      >
        <!-- Name Field -->
        <div class="mb-8 relative">
          <label
            for="Name"
            class="absolute left-2 -top-2.5 px-1 bg-white text-xs text-brand-primary z-10"
            >Name*</label 
          >
          <input
            type="text"
            maxlength="256"
            id="Name"
            name="Name"
            placeholder="John Smith"
            required
            v-model="formData.name"
            class="px-3 pt-3 pb-2 w-full bg-white rounded-md border-2 border-brand-primary focus:ring-brand-primary focus:border-brand-primary text-brand-primary placeholder:text-brand-primary placeholder:opacity-40 focus:placeholder:opacity-75"
            ref="nameInputRef"
          />
        </div>

        <!-- Email Field -->
        <div class="mb-8 relative">
          <label
            for="Email"
            class="absolute left-2 -top-2.5 px-1 bg-white text-xs text-brand-primary z-10"
            >Email*</label
          >
          <input
            type="email"
            maxlength="256"
            id="Email"
            name="Email"
            placeholder="johnsmith@example.com"
            required
            v-model="formData.email"
            class="px-3 pt-3 pb-2 w-full bg-white rounded-md border-2 border-brand-primary focus:ring-brand-primary focus:border-brand-primary text-brand-primary placeholder:text-brand-primary placeholder:opacity-40 focus:placeholder:opacity-75"
          />
        </div>

        <!-- Company Field -->
        <div class="mb-8 relative">
          <label
            for="Company"
            class="absolute left-2 -top-2.5 px-1 bg-white text-xs text-brand-primary z-10"
            >Company</label
          >
          <input
            type="text"
            maxlength="256"
            id="Company"
            name="Company"
            placeholder="ACME Hotels"
            v-model="formData.company"
            class="px-3 pt-3 pb-2 w-full bg-white rounded-md border-2 border-brand-primary focus:ring-brand-primary focus:border-brand-primary text-brand-primary placeholder:text-brand-primary placeholder:opacity-40 focus:placeholder:opacity-75"
          />
        </div>

        <!-- Position Field -->
        <div class="mb-8 relative">
          <label
            for="Position"
            class="absolute left-2 -top-2.5 px-1 bg-white text-xs text-brand-primary z-10"
            >Position</label
          >
          <input
            type="text"
            maxlength="256"
            id="Position"
            name="Position"
            placeholder="CEO"
            v-model="formData.position"
            class="px-3 pt-3 pb-2 w-full bg-white rounded-md border-2 border-brand-primary focus:ring-brand-primary focus:border-brand-primary text-brand-primary placeholder:text-brand-primary placeholder:opacity-40 focus:placeholder:opacity-75"
          />
        </div>
        
        <div class="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <button
            type="submit"
            class="flex-1 inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm border border-transparent text-white bg-brand-primary hover:bg-brand-900"
          >
            Send Message
          </button>
          <a
            href="https://calendar.app.google/yCyog7QgyLRB25f56"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm border-[3px] border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white text-center"
          >
            Book a call
          </a>
        </div>
      </form>

      <div
        v-if="formState.success"
        tabindex="-1"
        role="region"
        aria-label="Email Form success"
        class="p-5 text-center bg-indigo-50 rounded-md mt-4"
      >
        <div class="text-center">
          Thank you! Your submission has been received!
        </div>
      </div>

      <div
        v-if="formState.error"
        tabindex="-1"
        role="region"
        aria-label="Email Form failure"
        class="p-2.5 mt-2.5 bg-brand-50 rounded-md"
      >
        <div>Oops! Something went wrong while submitting the form.</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, defineProps, computed, ref, defineExpose } from 'vue' // Added ref and defineExpose
import { useRoute } from 'vue-router'; // Import useRoute

// Define props
const props = defineProps<{
  title?: string | null;
  textColorClass?: string;
  // formFieldsConfig is no longer used as we have fixed fields now
}>();

interface FormData {
  name: string;
  email: string;
  company: string;
  position: string;
}

interface FormState {
  success: boolean;
  error: boolean;
  submitting: boolean;
}

const route = useRoute(); // Get the current route
const isGetInTouchPage = computed(() => route.path === '/get-in-touch');

const formData = reactive<FormData>({
  name: '',
  email: '',
  company: '',
  position: '',
});

const formState = reactive<FormState>({
  success: false,
  error: false,
  submitting: false,
});

const handleSubmit = async () => {
  formState.submitting = true;
  formState.error = false;
  formState.success = false;

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      formState.success = true;
      // Reset form data
      Object.keys(formData).forEach((key) => {
        (formData as any)[key] = '';
      });
    } else {
      console.error('Error submitting form:', result);
      throw new Error(result.statusMessage || `Form submission failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    formState.error = true;
  } finally {
    formState.submitting = false;
  }
};

// Template ref for the name input
const nameInputRef = ref<HTMLInputElement | null>(null);

// Method to focus the name input
const focusNameInput = () => {
  nameInputRef.value?.focus();
};

// Expose the method
defineExpose({
  focusNameInput,
});
</script>

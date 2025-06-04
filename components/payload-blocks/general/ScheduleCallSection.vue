<template>
  <section :class="[
    mappedSectionBgColor, 
    paddingClasses, 
    { 'flex flex-col min-h-[calc(100vh-var(--header-height,80px))]': isGetInTouchPage }
  ]">
    <div :class="[
      'mx-auto px-4 sm:px-6 lg:px-8', 
      mappedContainerWidth, 
      { 'flex-grow flex flex-col': isGetInTouchPage }
    ]">
      <div :class="[
        'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16', 
        { 'flex-grow': isGetInTouchPage }
      ]">
        <InfoColumn 
          :logo="typeof block.infoColumn?.infoColumnLogo === 'object' ? block.infoColumn.infoColumnLogo : null" 
          :headerLink="block.infoColumn?.infoColumnHeaderLink"
          :mainTitlePart1="block.infoColumn?.infoColumnMainTitlePart1"
          :mainTitlePart2="block.infoColumn?.infoColumnMainTitlePart2"
          :titleContainerDesktopHeight="block.infoColumn?.infoColumnTitleContainerDesktopHeight"
          :footerText="block.infoColumn?.infoColumnFooterText"
          :footerLinks="block.infoColumn?.infoColumnFooterLinks"
          :textColorClass="textColorClass"
          @request-name-focus="handleRequestNameFocus"
        />
        
        <FormColumn 
          :title="block.formColumn?.formTitle" 
          :textColorClass="textColorClass" 
          :formFieldsConfig="block.formColumn?.formFields" 
          ref="formColumnRef"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'; // Added ref
import { useRoute } from 'vue-router'; // Import useRoute
import type { ScheduleCallBlockPayload } from '../../../../payload-cms/src/payload-types'; // Changed to ScheduleCallBlockPayload
import InfoColumn from '../../contact/InfoColumn.vue'; // Corrected path
import FormColumn from '../../contact/FormColumn.vue'; // Corrected path

const props = defineProps<{
  block: ScheduleCallBlockPayload; // Changed to ScheduleCallBlockPayload
}>();

// --- Background Color ---
const sectionBgColorValue = computed(() => props.block?.sectionBackgroundColor);
const mappedSectionBgColor = computed(() => {
  switch (sectionBgColorValue.value) {
    case 'light-grey': return 'bg-brand-50'; // Changed bg-light-grey to bg-brand-50
    case 'brand-50': return 'bg-brand-50';
    case 'brand-900': return 'bg-brand-900';
    case 'brand-primary': return 'bg-brand-primary';
    case 'white':
    default: return 'bg-white';
  }
});

// --- Text Color based on Background ---
const textColorClass = computed(() => {
  return sectionBgColorValue.value === 'brand-900' || sectionBgColorValue.value === 'brand-primary'
    ? 'text-white'
    : 'text-brand-900'; // Default text color
});

// --- Container Width ---
const containerWidthValue = computed(() => props.block?.containerWidth);
const mappedContainerWidth = computed(() => {
  switch (containerWidthValue.value) {
    case 'medium': return 'max-w-5xl';
    case 'wide': return 'max-w-7xl';
    case 'full': return 'max-w-none';
    case 'default':
    default: return 'max-w-7xl'; // Defaulting to wide for this layout
  }
});

// --- Padding Control ---
const route = useRoute(); // Define route here
const isGetInTouchPage = computed(() => route.path === '/get-in-touch'); // Define isGetInTouchPage here

const paddingClasses = computed(() => {
  const classes = [];
  // Default full padding values (adjust if needed)
  const fullTop = 'pt-16 md:pt-24';
  const fullBottom = 'pb-16 md:pb-24';
  // Half padding values (adjust if needed)
  const halfTop = 'pt-8 md:pt-12';
  const halfBottom = 'pb-8 md:pb-12';

  if (isGetInTouchPage.value || props.block?.reduceTopPadding) { // Now isGetInTouchPage is accessible
    classes.push(halfTop);
  } else {
    classes.push(fullTop);
  }

  if (isGetInTouchPage.value || props.block?.reduceBottomPadding) {
    classes.push(halfBottom);
  } else {
    classes.push(fullBottom);
  }
  return classes.join(' ');
});

// Ref for the FormColumn component
const formColumnRef = ref<{ focusNameInput: () => void } | null>(null);

// Handler for the custom event
const handleRequestNameFocus = () => {
  formColumnRef.value?.focusNameInput();
};
</script>

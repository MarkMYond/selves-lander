<template>
  <section :class="[mappedSectionBgColor, ...sectionPaddingClasses, 'section-padding']">
    <div class="w-layout-blockcontainer container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="inner-pricing-wrapper">
        
        <SectionHeader
          v-if="block?.title"
          :eyebrow-text="block.eyebrowText"
          :title="block.title"
          :subtitle="block.description"
          :title-image="block.headerImage || null"
          class="mb-8 md:mb-12" 
          title-max-width="max-w-2xl" 
          subtitle-max-width="max-w-3xl" 
        />

        <div v-if="block?.enableBillingToggle !== false" class="pricing-card-wrapper">
          <div class="toggle-wrapper mb-8 md:mb-12 flex justify-center">
            <div class="toggle-block-wrapper inline-flex items-center bg-gray-100 dark:bg-brandNeutral-03 rounded-xl p-2 space-x-2">
              <button
                type="button"
                class="toggle-option px-8 py-3 rounded-xl text-base transition-colors duration-200 ease-in-out"
                :class="!isYearlyBilling 
                  ? 'bg-brandTheme-02 text-brand-primary font-semibold shadow-md'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brandNeutral-02'"
                @click="isYearlyBilling = false"
              >
                Monthly
              </button>
              <button
                type="button"
                class="toggle-option px-8 py-3 rounded-xl text-base transition-colors duration-200 ease-in-out"
                :class="isYearlyBilling 
                  ? 'bg-brandTheme-02 text-brand-primary font-semibold shadow-md'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brandNeutral-02'"
                @click="isYearlyBilling = true"
              >
                Annual 
                <!-- Removed (Save 20%) text -->
              </button>
            </div>
          </div>
        </div>

        <div :class="isYearlyBilling ? 'yearly' : 'monthly'" class="pricing-table grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <p v-if="!plans || plans.length === 0" class="text-center col-span-full text-red-500">No plans available to display.</p>
          <template v-else>
            <PlanCard
              v-for="(plan, index) in plans"
              :key="plan.id || `plan-${index}`"
              :plan-data="plan"
              :is-yearly-billing="isYearlyBilling"
              :features="plan.planSpecificFeatures || []"
              :plan-index="index" 
              :class="[
                plans.length === 1 ? 'md:col-span-3 lg:col-span-3 mx-auto max-w-md' : '',
              ]"
            />
          </template>
        </div>

        <div
          v-if="block?.sectionCtaText && block?.sectionCtaLink"
          class="text-center mt-12"
        >
          <NuxtLink
            v-if="!isExternalUrl(block.sectionCtaLink!)"
            :to="block.sectionCtaLink!"
            :class="getMainButtonClasses(block.sectionCtaStyle || 'primary')"
            class="button" 
          >
            {{ block.sectionCtaText }}
          </NuxtLink>
          <a
            v-else
            :href="block.sectionCtaLink!"
            :class="getMainButtonClasses(block.sectionCtaStyle || 'primary')"
            class="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ block.sectionCtaText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// Attempting to use the direct type, assuming generate:types will eventually work.
import type { PricingCardsBlock } from '../../../src/payload-types'; 
import PlanCard from './PlanCard.vue'; 
import SectionHeader from '@/components/ui/SectionHeader.vue'; // Import SectionHeader

// This will cause a TS error if PricingCardsBlock or its 'plans' structure is not correctly generated.
type PlanItemType = NonNullable<PricingCardsBlock['plans']>[number];


const props = defineProps<{
  block: PricingCardsBlock; // Attempting to use direct type
}>();

const isYearlyBilling = ref(true);

const isExternalUrl = (url: string): boolean => url?.startsWith('http');

const plans = computed(() => props.block?.plans || []);
const sectionBgColorValue = computed(() => props.block?.sectionBackgroundColor);

const hasAnnualPricing = computed(() => {
  if (!props.block || !props.block.plans) return false;
  return props.block.plans.some((plan: PlanItemType) => plan.annualPrice && plan.annualPrice.trim() !== '');
});

const mappedSectionBgColor = computed(() => {
  switch (sectionBgColorValue.value) {
    case 'light-grey': return 'bg-brandNeutral-02 dark:bg-brandNeutral-04';
    case 'brand-50': return 'bg-brand-50 dark:bg-brand-900/20';
    case 'brand-900': return 'bg-brand-900 text-white';
    case 'brand-primary': return 'bg-brand-primary text-white';
    case 'white': default: return 'bg-white dark:bg-brandNeutral-04';
  }
});

const sectionPaddingClasses = computed(() => {
  const classes = ['py-12 md:py-16 lg:py-20'];
  if (props.block?.removeTopPadding) classes.push('pt-0');
  if (props.block?.removeBottomPadding) classes.push('pb-0', '!mb-0');
  return classes;
});

const getMainButtonClasses = (style: 'primary' | 'secondary' = 'primary') => {
  if (style === 'secondary') {
    return 'inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 border border-brand-primary text-brand-primary bg-white hover:bg-brand-50 dark:bg-brandNeutral-03 dark:text-brandNeutral-01 dark:hover:bg-brandNeutral-02';
  }
  return 'inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 border border-transparent text-white bg-brand-primary hover:bg-opacity-90 focus:ring-brand-primary';
};
</script>

<style scoped>
/* Scoped styles can be adapted from Webflow or existing PricingPlans.vue */
.toggle-block-wrapper .toggle-block-text { transition: color 0.3s ease; }
.section-title-subtitle .section-subtitle-wrapper { display: flex; justify-content: center; margin-bottom: 0.5rem; }
.section-subtitle-btn---1 { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; }
.bg-theme-color-02 { background-color: #EFF6FF; color: #1D4ED8; } 
.section-title-heading { font-size: 2.25rem; line-height: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
.section-p-text---18px { font-size: 1.125rem; line-height: 1.75rem; color: #4B5563; max-width: 60ch; margin-left: auto; margin-right: auto; }
</style>

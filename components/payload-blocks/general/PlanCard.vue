<template>
  <div
    class="p-6 md:p-8 rounded-2xl border flex flex-col" 
    :class="[bgColorClass, isMostPopular ? 'border-brand-primary shadow-2xl scale-105 z-10' : 'border-gray-200 dark:border-gray-700 shadow-lg']"
  >
    <div v-if="isMostPopular" class="absolute top-0 -mt-3 left-1/2 transform -translate-x-1/2">
      <span class="bg-brand-primary text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Popular</span>
    </div>
    <h3
      class="text-2xl font-semibold leading-tight mb-2"
      :class="isMostPopular ? 'text-brand-primary' : 'text-brand-900 dark:text-brand-100'"
    >
      {{ title }}
    </h3>
    <p
      class="text-sm text-gray-600 dark:text-gray-400 min-h-[4em] mb-4" 
    >
      {{ description }}
    </p>
    <div
      class="mb-6"
    >
      <template v-if="displayPrice">
        <span
          class="text-4xl font-bold"
          :class="isMostPopular ? 'text-brand-primary' : 'text-brand-900 dark:text-brand-100'"
          >{{ displayPrice }}</span
        ><span
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          {{ displayPriceSuffix }}</span
        >
        <!-- BillingToggle is now in the parent PricingPlans.vue -->
      </template>
      <template v-else>
        <div class="mt-2 md:-mt-6 lg:mt-0 lg:min-h-[88px] lg:mb-5">
          <span
            class="[font-variant-ligatures:stylistic] [font-feature-settings:'ss01'] font-bold"
            >Available on request
          </span>
          <b
            class="inline text-4xl font-bold leading-[54px] max-sm:text-2xl max-sm:leading-9"
          ></b>
        </div>
      </template>
    </div>
    <!-- Use NuxtLink for internal URLs, regular anchor for external ones -->
    <!--
    <NuxtLink
      v-if="ctaLink && !isExternalUrl(ctaLink)"
      :to="ctaLink"
      class="inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm border border-transparent text-white bg-brand-primary hover:bg-brand-900 w-full mt-4 text-center [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
    >
      {{ ctaText }}
    </NuxtLink>

    <a
      v-else-if="ctaLink"
      :href="ctaLink"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm border border-transparent text-white bg-brand-primary hover:bg-brand-900 w-full mt-4 text-center [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
    >
      {{ ctaText }}
    </a>
    -->
    <ul class="space-y-3 mb-8 flex-grow">
      <PlanFeature
        v-for="(feature, featureIndex) in features"
        :key="feature.id || `feature-${title}-${featureIndex}`"
        :feature-text="feature.featureName"
        :availability="getFeatureAvailability(feature, planIndex) as ('included' | 'not_included' | 'custom' | undefined)"
        :custom-text="getFeatureCustomText(feature, planIndex)"
        :tooltip="feature.tooltip ?? undefined"
      />
    </ul>
    <BaseButton 
      :to="ctaLink" 
      :variant="isMostPopular ? 'primary' : 'secondary'" 
      class="w-full mt-auto"
      :target="isExternalUrl(ctaLink) ? '_blank' : undefined"
    >
      {{ ctaText }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { PricingPlansBlock } from '@/src/payload-types'; // Ensure this path is correct
import PlanFeature from './PlanFeature.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

type SharedFeatureItem = NonNullable<PricingPlansBlock['sharedFeatures']>[number];

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  monthlyPrice: { type: String, default: '' },
  annualPrice: { type: String, default: '' },
  priceSuffix: { type: String, default: '/month' },
  bgColorClass: { type: String, default: 'bg-white dark:bg-brandNeutral-03' },
  ctaText: { type: String, required: true },
  ctaLink: { type: String, required: true },
  isMostPopular: { type: Boolean, default: false },
  features: { type: Array as PropType<SharedFeatureItem[]>, required: true },
  planIndex: { type: Number, required: true },
  isYearlyBilling: { type: Boolean, required: true },
});

const isExternalUrl = (url: string): boolean => /^(https?:)?\/\//.test(url);

const displayPrice = computed(() => {
  return props.isYearlyBilling ? props.annualPrice : props.monthlyPrice;
});

const displayPriceSuffix = computed(() => {
  // If annual and a specific annual suffix isn't provided, adjust common suffixes
  if (props.isYearlyBilling && props.priceSuffix.includes('/month')) {
    return props.priceSuffix.replace('/month', '/year (billed annually)');
  }
  return props.priceSuffix;
});

const getFeatureAvailability = (feature: SharedFeatureItem, planIndex: number): string | undefined => {
  if (planIndex === 0) return feature.plan1Availability ?? undefined;
  if (planIndex === 1) return feature.plan2Availability ?? undefined;
  if (planIndex === 2) return feature.plan3Availability ?? undefined;
  return undefined;
};

const getFeatureCustomText = (feature: SharedFeatureItem, planIndex: number): string | undefined => {
  if (planIndex === 0) return feature.plan1CustomText ?? undefined;
  if (planIndex === 1) return feature.plan2CustomText ?? undefined;
  if (planIndex === 2) return feature.plan3CustomText ?? undefined;
  return undefined;
};
</script>

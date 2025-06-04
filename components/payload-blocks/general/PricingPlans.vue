<template>
  <section :class="[mappedSectionBgColor, ...sectionPaddingClasses]">
    <div class="px-4 sm:px-6 lg:px-8 mx-auto" :class="containerWidthClass">
      <SectionHeader
        v-if="title"
        :title="title"
        :subtitle="block.mainCtaText && block.mainCtaLink ? null : 'Choose the plan that\'s right for you.'" 
        :eyebrowText="block.eyebrowText"
        class="text-center mb-8 md:mb-12"
        :theme="sectionBgColorValue === 'brand-900' || sectionBgColorValue === 'brand-primary' ? 'dark' : 'light'"
      />

      <!-- Monthly/Annual Toggle -->
      <div class="flex justify-center items-center space-x-3 mb-8 md:mb-12">
        <span :class="{'font-semibold text-brand-primary': !isYearlyBilling, 'text-gray-500': isYearlyBilling}">Monthly</span>
        <button
          @click="isYearlyBilling = !isYearlyBilling"
          type="button"
          :class="[isYearlyBilling ? 'bg-brand-primary' : 'bg-gray-200']"
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          role="switch"
          :aria-checked="isYearlyBilling" 
        >
          <span
            aria-hidden="true"
            :class="[isYearlyBilling ? 'translate-x-5' : 'translate-x-0']"
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          ></span>
        </button>
        <span :class="{'font-semibold text-brand-primary': isYearlyBilling, 'text-gray-500': !isYearlyBilling}">
          Annual <span class="text-xs text-green-600">(Save 20%)</span> {/* Example discount text */}
        </span>
      </div>
      
      <!-- Main CTA (if only one plan or general CTA) - from original HTML structure -->
      <div v-if="plans.length <= 1 && mainCtaLink" class="text-center mt-8 mb-0">
        <NuxtLink
          v-if="!isExternalUrl(mainCtaLink)"
          :to="mainCtaLink"
          :class="getMainButtonClasses()"
        >
          {{ mainCtaText }}
        </NuxtLink>
        <a
          v-else
          :href="mainCtaLink"
          :class="getMainButtonClasses()"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ mainCtaText }}
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
        <PlanCard
          v-for="(plan, index) in plans"
          :key="plan.id || `plan-${index}`"
          :title="plan.name || 'Unnamed Plan'" 
          :description="plan.description || ''"
          :monthly-price="plan.monthlyPrice ?? ''"
          :annual-price="plan.annualPrice ?? ''"
          :price-suffix="plan.priceSuffix || '/month'"
          :bg-color-class="getCardBgClass(plan.cardBackgroundColor)"
          :cta-text="plan.ctaButtonLabel || 'Get Started'"
          :cta-link="plan.ctaButtonLink || '#'"
          :is-most-popular="plan.isMostPopular || false"
          :features="block.sharedFeatures || []"
          :plan-index="index"
          :is-yearly-billing="isYearlyBilling"
          :class="plans.length === 1 ? 'md:col-span-2 lg:col-span-3 md:max-w-md lg:max-w-md mx-auto' : (plans.length === 2 && index === 0 ? 'md:col-start-1 lg:col-start-1' : (plans.length === 2 && index === 1 ? 'md:col-start-2 lg:col-start-2' : ''))"
        />
      </div>

      <!-- Compare Plans Table Section -->
      <div v-if="block.sharedFeatures && block.sharedFeatures.length > 0 && block.compareTableTitle" class="mt-16 md:mt-24">
        <SectionHeader
          :title="block.compareTableTitle"
          :subtitle="block.compareTableDescription"
          class="text-center mb-8 md:mb-12"
          :theme="sectionBgColorValue === 'brand-900' || sectionBgColorValue === 'brand-primary' ? 'dark' : 'light'"
        />
        <div class="overflow-x-auto bg-white dark:bg-brandNeutral-03 shadow-md rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-brandNeutral-04">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Features
                </th>
                <th v-for="(plan, index) in plans" :key="`header-${plan.id || index}`" scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ plan.name }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-brandNeutral-03 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(feature, featureIndex) in block.sharedFeatures" :key="`feature-row-${feature.id || featureIndex}`">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ feature.featureName }}
                  <Icon v-if="feature.tooltip" name="ph:info" class="ml-1 text-gray-400 dark:text-gray-500 cursor-help" :title="feature.tooltip" />
                </td>
                <td v-for="(plan, planIndex) in plans" :key="`cell-${feature.id}-${plan.id || planIndex}`" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                  <template v-if="getFeatureAvailability(feature, planIndex) === 'included'">
                    <Icon name="ph:check-circle-fill" class="text-green-500 h-5 w-5 mx-auto" />
                  </template>
                  <template v-else-if="getFeatureAvailability(feature, planIndex) === 'not_included'">
                    <Icon name="ph:x-circle-fill" class="text-red-400 h-5 w-5 mx-auto" />
                  </template>
                  <template v-else>
                    {{ getFeatureCustomText(feature, planIndex) }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PricingPlansBlock } from '@/src/payload-types'; // Removed SharedFeature import
import PlanCard from './PlanCard.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue'; 
// import Icon from '@/components/ui/Icon.vue'; // Removed: nuxt-icon should make <Icon> globally available

// Define the type for items in sharedFeatures array based on payload-types.ts
type SharedFeatureItem = NonNullable<PricingPlansBlock['sharedFeatures']>[number];

const props = defineProps<{
  block: PricingPlansBlock;
}>();

const isYearlyBilling = ref(false);

const isExternalUrl = (url: string): boolean => url?.startsWith('http');

const title = computed(() => props.block?.title || 'Plans for every stage of your company');
const plans = computed(() => props.block?.plans || []);
const sectionBgColorValue = computed(() => props.block?.sectionBackgroundColor);

const mainCtaText = computed(() => props.block?.mainCtaText || 'Get Started');
const mainCtaLink = computed(() => props.block?.mainCtaLink || '/contact-us');
const mainCtaStyle = computed(() => props.block?.mainCtaStyle || 'primary');

const containerWidthClass = computed(() => {
  // Assuming a 'containerWidth' field might be added to the block later
  // For now, using a common max-width for pricing sections.
  return 'max-w-7xl'; // Example: Tailwind's max-w-7xl
});

const mappedSectionBgColor = computed(() => {
  switch (sectionBgColorValue.value) {
    case 'light-grey': return 'bg-brandNeutral-02 dark:bg-brandNeutral-04'; // Using brandNeutral-02 for light grey
    case 'brand-50': return 'bg-brand-50 dark:bg-brand-900/20';
    case 'brand-900': return 'bg-brand-900 text-white';
    case 'brand-primary': return 'bg-brand-primary text-white'; // Assuming brand-primary is dark
    case 'white':
    default:
      return 'bg-white dark:bg-brandNeutral-04';
  }
});

const sectionPaddingClasses = computed(() => {
  const classes = [];
  if (props.block?.removeTopPadding) {
    classes.push('pt-0');
  } else {
    classes.push('py-12 md:py-16 lg:py-20'); // Standard section padding
  }
  if (props.block?.removeBottomPadding) {
    classes.push('pb-0');
  } else {
    // Vertical padding is already handled by py-* above, so only add if different
  }
  return classes;
});

const getMainButtonClasses = () => {
  const baseClasses = 'inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  if (mainCtaStyle.value === 'secondary') {
    return `${baseClasses} border border-brand-primary text-brand-primary bg-white hover:bg-brand-50 dark:bg-brandNeutral-03 dark:text-brandNeutral-01 dark:hover:bg-brandNeutral-02`;
  }
  return `${baseClasses} border border-transparent text-white bg-brand-primary hover:bg-opacity-90 focus:ring-brand-primary`;
};

const getCardBgClass = (colorClass?: string | null) => {
  return colorClass && colorClass.startsWith('bg-') ? colorClass : 'bg-white dark:bg-brandNeutral-03';
};

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

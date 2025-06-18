<template>
  <section :class="[mappedSectionBgColor, ...sectionPaddingClasses, 'section-padding']">
    <div class="w-layout-blockcontainer container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Inner Pricing Wrapper from Webflow -->
      <div class="inner-pricing-wrapper">
        <!-- Section Title / Hero Part -->
        <div
          v-if="title || block.eyebrowText"
          data-wf--section-title--variant="subtitle-left-rotate---bg-02"
          class="section-title-subtitle mb-8 md:mb-12 text-center"
        >
          <div v-if="block.eyebrowText" class="section-subtitle-wrapper justify-center">
            <div class="section-subtitle-btn---1 bg-theme-color-02">
              <p class="section-subtitle-text">{{ block.eyebrowText }}</p>
            </div>
          </div>
          <div v-if="title" class="section-title---wrapper mt-2">
            <h2 class="section-title-heading">{{ title }}</h2>
            <h6 v-if="block.mainCtaText && block.mainCtaLink" class="section-p-text---18px">
              <!-- Subtitle can be added here if needed from block data -->
            </h6>
            <h6 v-else class="section-p-text---18px">
              Choose the plan that's right for you. (Restoring complexity)
            </h6>
          </div>
        </div>

        <!-- Toggle Wrapper from Webflow -->
        <div class="pricing-card-wrapper">
          <div class="toggle-wrapper mb-8 md:mb-12">
            <div class="toggle-block-wrapper flex justify-center items-center space-x-3">
              <p
                class="toggle-block-text monthly cursor-pointer"
                :class="{ 'font-semibold text-brand-primary': !isYearlyBilling, 'text-gray-500': isYearlyBilling }"
                @click="isYearlyBilling = false"
              >
                Monthly
              </p>
              <button
                type="button"
                :class="[isYearlyBilling ? 'bg-brand-primary' : 'bg-gray-200']"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                role="switch"
                :aria-checked="isYearlyBilling"
                @click="isYearlyBilling = !isYearlyBilling"
              >
                <span
                  aria-hidden="true"
                  :class="[isYearlyBilling ? 'translate-x-5' : 'translate-x-0']"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                />
              </button>
              <p
                class="toggle-block-text annual cursor-pointer"
                :class="{ 'font-semibold text-brand-primary': isYearlyBilling, 'text-gray-500': !isYearlyBilling }"
                @click="isYearlyBilling = true"
              >
                Annual <span class="text-xs text-green-600">(Save 20%)</span>
              </p>
            </div>
          </div>

          <!-- Pricing Table (Cards) from Webflow - PlanCard rendering temporarily commented out -->
          <div :class="isYearlyBilling ? 'yearly' : 'monthly'" class="pricing-table grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <!-- <p class="text-center col-span-full">(PlanCard components will be rendered here)</p> -->
            
            <PlanCard
              v-for="(plan, index) in plansComputed"
              :key="plan.id || `plan-${index}`"
              :plan-data="plan"
              :is-yearly-billing="isYearlyBilling"
              :features="getPlanSpecificFeatures(index)"
              :plan-index="index"
              :class="[
                plansComputed.length === 1 ? 'md:col-span-2 lg:col-span-3 md:max-w-md lg:max-w-md mx-auto' : '',
                plansComputed.length === 2 && index === 0 ? 'md:col-start-1 lg:col-start-1' : '',
                plansComputed.length === 2 && index === 1 ? 'md:col-start-2 lg:col-start-2' : '',
              ]"
            />
            
          </div>
        </div>
      </div>

      <!-- Main CTA (if only one plan or specific condition) -->
      <div
        v-if="plansComputed.length <= 1 && mainCtaLinkComputed && block.mainCtaText"
        class="text-center mt-12"
      >
        <NuxtLink
          v-if="!isExternalUrl(mainCtaLinkComputed!)"
          :to="mainCtaLinkComputed!"
          :class="getMainButtonClasses(block.mainCtaStyle || 'primary')"
          class="button"
        >
          {{ block.mainCtaText }}
        </NuxtLink>
        <a
          v-else
          :href="mainCtaLinkComputed!"
          :class="getMainButtonClasses(block.mainCtaStyle || 'primary')"
          class="button"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ block.mainCtaText }}
        </a>
      </div>

      <!-- Feature Comparison Table Section - Content temporarily commented out -->
      <div
        v-if="block.sharedFeatures && block.sharedFeatures.length > 0 && block.compareTableTitle"
        class="pricing-plans-section section-padding remove-bottom-padding mt-16 md:mt-24"
      >
        <div class="section-title-subtitle mb-8 md:mb-12 text-center">
          <div class="section-title---wrapper mt-2">
            <h2 class="section-title-heading">{{ block.compareTableTitle }}</h2>
            <h6 v-if="block.compareTableDescription" class="section-p-text---20px">
              {{ block.compareTableDescription }}
            </h6>
          </div>
        </div>
        <!-- <p class="text-center">(Comparison table content will be rendered here)</p> -->
        <!-- Desktop Comparison Table -->
        <div class="pricing-plans-feature-wrapper hidden md:block">
          <div class="pricing-plans-header-wrapper">
            <div class="pricing-header text-align-left">
              <h5 class="pricing-header-text">Plan features</h5>
            </div>
            <div v-for="(plan, index) in plansComputed" :key="`header-col-${plan.id || index}`" class="pricing-header" :class="{'bg': plan.isMostPopular}">
              <h5 class="pricing-header-text">{{ plan.name }}</h5>
            </div>
          </div>
          <div class="pricing-plans-feature-list">
            <div v-for="(feature, featureIndex) in block.sharedFeatures" :key="`feature-row-desktop-${feature.id || featureIndex}`" class="pricing-plans-feature-item">
              <div class="pricing-feature-name">
                <p class="pricing-feature-text-2">{{ feature.featureName }}</p>
                <Icon v-if="feature.tooltip" name="ph:info" class="ml-1 text-gray-400 dark:text-gray-500 cursor-help w-4 h-4" :title="feature.tooltip" />
              </div>
              <div v-for="(plan, planIndex) in plansComputed" :key="`cell-desktop-${feature.id}-${plan.id || planIndex}`" class="pricing-feature-icon" :class="{'bg': plan.isMostPopular, 'last': planIndex === plansComputed.length -1 && featureIndex === block.sharedFeatures.length -1 && plan.isMostPopular}">
                <template v-if="getFeatureAvailability(feature, planIndex) === 'included'">
                  <span class="pricing-feature-single-icon text-green-500">✓</span> <!-- Placeholder -->
                </template>
                <template v-else-if="getFeatureAvailability(feature, planIndex) === 'not_included'">
                  <span class="pricing-feature-single-icon text-red-400">✗</span> <!-- Placeholder -->
                </template>
                <template v-else>
                  <span class="pricing-feature-text-2 text-sm">{{ getFeatureCustomText(feature, planIndex) }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Comparison Tables -->
        <div class="pricing-plans-feature-wrapper medium-devices md:hidden">
          <div v-for="(plan, planIndex) in plansComputed" :key="`mobile-plan-table-${plan.id || planIndex}`" class="pricing-plans-feature-list medium-devices mb-8">
            <div class="pricing-header medium-devices" :class="{'growth': plan.isMostPopular}">
               <h5 class="pricing-header-text">{{ plan.name }}</h5>
            </div>
            <div v-for="(feature, featureIndex) in block.sharedFeatures" :key="`feature-row-mobile-${feature.id}-${plan.id || planIndex}`" class="pricing-plans-feature-item medium-devices">
              <div class="pricing-feature-name">
                <p class="pricing-feature-text-2">{{ feature.featureName }}</p>
                <Icon v-if="feature.tooltip" name="ph:info" class="ml-1 text-gray-400 dark:text-gray-500 cursor-help w-4 h-4" :title="feature.tooltip" />
              </div>
              <div class="pricing-feature-icon" :class="{'bg': plan.isMostPopular, 'last': featureIndex === block.sharedFeatures.length -1 && plan.isMostPopular}">
                 <template v-if="getFeatureAvailability(feature, planIndex) === 'included'">
                  <span class="pricing-feature-single-icon text-green-500">✓</span> <!-- Placeholder -->
                </template>
                <template v-else-if="getFeatureAvailability(feature, planIndex) === 'not_included'">
                  <span class="pricing-feature-single-icon text-red-400">✗</span> <!-- Placeholder -->
                </template>
                <template v-else>
                  <span class="pricing-feature-text-2 text-sm">{{ getFeatureCustomText(feature, planIndex) }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PricingPlansBlock as PricingPlansBlockType } from '@/src/payload-types';
import PlanCard from './PlanCard.vue'; // Uncommented
// import SectionHeader from '@/components/ui/SectionHeader.vue'; // Still unused for now

type SharedFeatureItem = NonNullable<PricingPlansBlockType['sharedFeatures']>[number];

const props = defineProps<{
  block: PricingPlansBlockType;
}>();

const isYearlyBilling = ref(true);

const isExternalUrl = (url: string): boolean => url?.startsWith('http');

const title = computed(() => props.block?.title || 'Plans for every stage of your company');
const plansComputed = computed(() => props.block?.plans || []); 
const sectionBgColorValue = computed(() => props.block?.sectionBackgroundColor);
const mainCtaLinkComputed = computed(() => props.block?.mainCtaLink); // Renamed

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

const getMainButtonClasses = (style: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
  return `button-variant-${style}`; // Placeholder
};

// Function to convert sharedFeatures to plan-specific features for PlanCard
const getPlanSpecificFeatures = (planIndex: number) => {
  if (!props.block?.sharedFeatures) return [];
  
  return props.block.sharedFeatures.map((feature) => {
    const availability = getFeatureAvailability(feature, planIndex);
    const customText = getFeatureCustomText(feature, planIndex);
    
    return {
      id: feature.id || `feature-${planIndex}-${feature.featureName}`,
      featureText: feature.featureName || '',
      isIncluded: availability === 'included',
      tooltip: feature.tooltip || undefined,
      customText: availability === 'custom' ? customText : undefined,
    };
  });
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

<style scoped>
/* Styles from previous version - can be refined later */
.toggle-block-wrapper .toggle-block-text { transition: color 0.3s ease; }
.pricing-header { padding: 1rem 1.5rem; text-align: center; }
.pricing-header.bg { background-color: #f0f2f5; }
.pricing-header-text { font-size: 1.125rem; font-weight: 600; }
.pricing-plans-feature-item { display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; padding: 1rem 0; border-bottom: 1px solid #e5e7eb; }
.pricing-plans-feature-item:last-child { border-bottom: none; }
.pricing-feature-name { padding-left: 1.5rem; display: flex; align-items: center; }
.pricing-feature-name .pricing-feature-text-2 { margin-right: 0.5rem; }
.pricing-feature-icon { display: flex; justify-content: center; align-items: center; padding: 1rem 1.5rem; }
.pricing-feature-icon.bg { background-color: #f0f2f5; }
.pricing-feature-single-icon { width: 1.25rem; height: 1.25rem; }
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-list.medium-devices { border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; }
.pricing-plans-feature-wrapper.medium-devices .pricing-header.medium-devices { background-color: #f9fafb; padding: 0.75rem 1rem; font-weight: 600; }
.pricing-plans-feature-wrapper.medium-devices .pricing-header.medium-devices.growth { background-color: #e0f2fe; color: #0c4a6e; }
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-item.medium-devices { display: flex; justify-content: space-between; padding: 0.75rem 1rem; border-top: 1px solid #e5e7eb; }
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-item.medium-devices .pricing-feature-icon { padding: 0; }
.section-title-subtitle .section-subtitle-wrapper { display: flex; justify-content: center; margin-bottom: 0.5rem; }
.section-subtitle-btn---1 { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; }
.bg-theme-color-02 { background-color: #EFF6FF; color: #1D4ED8; }
.section-title-heading { font-size: 2.25rem; line-height: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
.section-p-text---18px, .section-p-text---20px { font-size: 1.125rem; line-height: 1.75rem; color: #4B5563; max-width: 60ch; margin-left: auto; margin-right: auto; }
</style>

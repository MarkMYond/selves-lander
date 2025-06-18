<template>
  <section :class="[mappedSectionBgColor, ...sectionPaddingClasses, 'section-padding']">
    <div class="w-layout-blockcontainer container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        v-if="block?.title || block?.eyebrowText || block?.description"
        :eyebrow-text="block.eyebrowText"
        :title="block.title || 'Compare Our Plans'"
        :subtitle="block.description"
        :title-image="block.headerImage || null"
        class="mb-8 md:mb-12"
      />

      <!-- Desktop Comparison Table -->
      <div 
        v-if="planHeaders && planHeaders.length > 0 && sharedFeatures && sharedFeatures.length > 0" 
        class="pricing-plans-feature-wrapper hidden md:block"
        :style="tableGridStyle"
      >
        <div class="pricing-plans-header-wrapper feature-table-grid">
          <div class="pricing-header text-left">
            <h5 class="pricing-header-text text-2xl font-bold">Plan features</h5>
          </div>
          <div v-for="(planHeader, index) in planHeaders" :key="`header-col-${planHeader.id || index}`" class="pricing-header" :class="{'popular-column-bg': planHeader.isMostPopular}">
            <h5 class="pricing-header-text text-2xl font-bold">{{ planHeader.name }}</h5>
          </div>
        </div>
        <div class="pricing-plans-feature-list">
          <div v-for="(feature, featureIndex) in sharedFeatures" :key="`feature-row-desktop-${feature.id || featureIndex}`" class="pricing-plans-feature-item feature-table-grid">
            <div class="pricing-feature-name">
              <p class="pricing-feature-text-2 text-lg font-medium">{{ feature.featureName }}</p>
              <div v-if="feature.tooltip" class="tooltip-wrapper flex-shrink-0 relative">
                <Icon name="ph:question" class="ml-1 text-gray-400 dark:text-gray-500 cursor-help w-4 h-4" />
                <div class="tooltip-text">{{ feature.tooltip }}</div>
              </div>
            </div>
            <div v-for="(planHeader, planIndex) in planHeaders" :key="`cell-desktop-${feature.id}-${planHeader.id || planIndex}`" class="pricing-feature-icon" :class="{'popular-column-bg': planHeader.isMostPopular, 'last': planIndex === planHeaders.length -1 && featureIndex === sharedFeatures.length -1 && planHeader.isMostPopular}">
              <template v-if="getFeatureAvailability(feature, planIndex) === 'included'">
                <span class="icon-wrapper h-5 w-5 flex-shrink-0 rounded-full bg-black flex items-center justify-center">
                  <span class="text-white text-xs font-bold">✓</span>
                </span>
              </template>
              <template v-else-if="getFeatureAvailability(feature, planIndex) === 'not_included'">
                <span class="text-gray-500 text-3xl font-medium">-</span>
              </template>
              <template v-else>
                <span class="pricing-feature-text-2 text-lg font-medium">{{ getFeatureCustomText(feature, planIndex) }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Comparison Tables -->
      <div v-if="planHeaders && planHeaders.length > 0 && sharedFeatures && sharedFeatures.length > 0" class="pricing-plans-feature-wrapper medium-devices md:hidden">
        <div 
          v-for="(planHeader, planIndex) in planHeaders" 
          :key="`mobile-plan-table-${planHeader.id || planIndex}`" 
          class="pricing-plans-feature-list medium-devices mb-8"
          :class="{'popular-column-bg': planHeader.isMostPopular}"
        >
          <div class="pricing-header medium-devices">
             <h5 class="pricing-header-text text-2xl font-bold">{{ planHeader.name }}</h5>
          </div>
          <div v-for="(feature, featureIndex) in sharedFeatures" :key="`feature-row-mobile-${feature.id}-${planHeader.id || planIndex}`" class="pricing-plans-feature-item medium-devices">
            <div class="pricing-feature-name">
              <p class="pricing-feature-text-2 text-lg font-medium">{{ feature.featureName }}</p>
              <div v-if="feature.tooltip" class="tooltip-wrapper flex-shrink-0 relative">
                <Icon name="ph:question" class="ml-1 text-gray-400 dark:text-gray-500 cursor-help w-4 h-4" />
                <div class="tooltip-text">{{ feature.tooltip }}</div>
              </div>
            </div>
            <div class="pricing-feature-icon">
               <template v-if="getFeatureAvailability(feature, planIndex) === 'included'">
                <span class="icon-wrapper h-5 w-5 flex-shrink-0 rounded-full bg-black flex items-center justify-center">
                  <span class="text-white text-xs font-bold">✓</span>
                </span>
              </template>
              <template v-else-if="getFeatureAvailability(feature, planIndex) === 'not_included'">
                <span class="text-gray-500 text-3xl font-medium">-</span>
              </template>
              <template v-else>
                <span class="pricing-feature-text-2 text-lg font-medium">{{ getFeatureCustomText(feature, planIndex) }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import type { FeatureComparisonTableBlock } from '../../../src/payload-types';

type FeatureComparisonTableBlockType = FeatureComparisonTableBlock;

type SharedFeatureItem = NonNullable<FeatureComparisonTableBlockType['sharedFeatures']>[number];
type PlanHeaderItem = any; // NonNullable<FeatureComparisonTableBlockType['planHeaders']>[number];

const props = defineProps<{
  block: FeatureComparisonTableBlockType; 
}>();

const sectionBgColorValue = computed(() => props.block?.sectionBackgroundColor);
const planHeaders = computed(() => props.block?.planHeaders || []);
const sharedFeatures = computed(() => props.block?.sharedFeatures || []);

const tableGridStyle = computed(() => {
  const numPlanColumns = planHeaders.value.length || 3;
  return { 
    '--plan-column-count': numPlanColumns,
  };
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
.pricing-header { padding: 1rem 1.5rem; text-align: center; }
.pricing-header.text-left { text-align: left; padding-left: 0; } 
.popular-column-bg { background-color: #FEFBF3; } 
.pricing-header-text { /* Font styles are applied directly in the template */ }

.feature-table-grid {
  display: grid;
  grid-template-columns: 2fr repeat(var(--plan-column-count, 3), 1fr);
  align-items: center;
}
.pricing-plans-header-wrapper.feature-table-grid {
  border-bottom: 1px solid #e5e7eb; 
}
.pricing-plans-feature-item.feature-table-grid {
  padding: 1rem 0; 
  border-bottom: 1px solid #e5e7eb; 
}
.pricing-plans-feature-item:last-child { border-bottom: none; }
.pricing-feature-name { padding-left: 0; display: flex; align-items: center; } 
.pricing-feature-name .pricing-feature-text-2 { margin-right: 0.5rem; }
.pricing-feature-icon { display: flex; justify-content: center; align-items: center; padding: 1rem 1.5rem; }
.pricing-feature-single-icon { /* No longer used directly for check/cross */ } 

/* Mobile comparison table specific styles */
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-list.medium-devices { 
  border: 1px solid #e5e7eb; 
  border-radius: 0.5rem; 
  overflow: hidden; 
}
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-list.medium-devices.popular-column-bg {
  /* Ensure popular background applies correctly */
}
.pricing-plans-feature-wrapper.medium-devices .pricing-header.medium-devices { 
  background-color: #f9fafb; /* Default header bg for mobile */
  padding: 0.75rem 1rem; 
  font-weight: 600; 
}
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-list.medium-devices.popular-column-bg .pricing-header.medium-devices {
  background-color: transparent; /* If parent has popular-column-bg, header might not need its own */
}
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-item.medium-devices { 
  display: flex; 
  justify-content: space-between; 
  padding: 0.75rem 1rem; 
  border-top: 1px solid #e5e7eb; 
}
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-list.medium-devices .pricing-plans-feature-item.medium-devices:first-of-type {
  border-top: none; /* For tables that are not the first feature list */
}
.pricing-plans-feature-wrapper.medium-devices .pricing-plans-feature-item.medium-devices .pricing-feature-icon { 
  padding: 0; 
}

/* Tooltip styles */
.tooltip-wrapper {
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  width: max-content;
  max-width: 200px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  font-size: 0.75rem;
  line-height: 1.25;
  white-space: normal;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>

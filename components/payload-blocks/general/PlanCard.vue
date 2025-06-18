<template>
  <div
    class="pricing-card flex flex-col shadow-lg rounded-xl" 
    :class="[
      cardOuterBackgroundColor, 
      planData.isMostPopular ? 'border-2 border-brand-primary scale-105 z-10 active' : 'border border-gray-200 dark:border-gray-700'
    ]"
  >
    <!-- Top section always with white background -->
    <div class="bg-white p-6 md:p-8 rounded-xl" :class="{ 'rounded-b-none': true }">
      <div v-if="planData.isMostPopular" class="pricing-tagline-wrapper mb-4 text-right">
        <span class="pricing-tagline-text bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">Popular</span>
      </div>
      <div class="pricing-card-top">
        <div class="pricing-name-tagline text-left">
          <p class="pricng-card-top-heading text-3xl font-bold leading-tight mb-1 text-black"> 
            {{ planData.name }}
          </p>
        </div>
        <div class="card-price-text mt-4 mb-6 text-left">
          <template v-if="displayPrice">
            <div class="flex items-baseline space-x-2">
              <h3 class="pricing-price text-5xl font-extrabold text-black">
                {{ displayPrice }}
              </h3>
              <p class="pricing-duration text-sm text-gray-500">
                  {{ displayPriceSuffix }}
              </p>
            </div>
            <p class="pricing-top-info-text text-base text-gray-700 min-h-[2em] mt-2">
              {{ planData.description }}
            </p>
          </template>
          <template v-else>
            <div class="min-h-[88px] flex items-start py-2">
              <span class="font-bold text-xl text-black">
                Available on request
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Features and Button section on card's main background -->
    <div class="pricing-card-body-footer flex flex-col flex-grow p-6 md:p-8 rounded-b-xl" :class="{'pt-0': true }">
      <div class="pricing-body-content flex-grow">
        <ul v-if="features && features.length > 0" class="pricing-card-features space-y-3 mb-8">
          <PlanFeature
            v-for="(featureItem, featureIndex) in features"
            :key="featureItem.id || `feature-${planData.name}-${featureIndex}`"
            :feature-text="featureItem.featureText || ''"
            :is-included="featureItem.isIncluded ?? true"
            :tooltip="featureItem.tooltip ?? undefined"
            :is-popular="planData.isMostPopular || false" 
          />
        </ul>
        <p v-else class="text-sm italic text-gray-500 mb-8">(No features listed for this plan)</p>
      </div>
      <BaseButton
        :to="planData.ctaButtonLink || '#'"
        :variant="planData.isMostPopular ? 'tertiary' : 'dark-pill'" 
        class="w-full mt-auto"
        :target="isExternalUrl(planData.ctaButtonLink || '#') ? '_blank' : undefined"
      >
        {{ planData.ctaButtonLabel || 'Select Plan' }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { PricingCardsBlock, PricingPlansBlock } from '../../../src/payload-types';
import PlanFeature from './PlanFeature.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// Create a flexible type that can handle both PricingCardsBlock and PricingPlansBlock plan structures
type PlanDataType = (NonNullable<PricingCardsBlock['plans']>[number]) | (NonNullable<PricingPlansBlock['plans']>[number]);

type PlanSpecificFeatureItem = {
  featureText?: string | null;
  isIncluded?: boolean | null;
  tooltip?: string | null;
  id?: string | null;
};

const props = defineProps({
  planData: { type: Object as PropType<PlanDataType>, required: true },
  features: { type: Array as PropType<PlanSpecificFeatureItem[]>, default: () => [] },
  planIndex: { type: Number, required: true },
  isYearlyBilling: { type: Boolean, required: true },
});

const isExternalUrl = (url: string): boolean => /^(https?:)?\/\//.test(url);

const displayPrice = computed(() => {
  return props.isYearlyBilling ? props.planData.annualPrice : props.planData.monthlyPrice;
});

const cardOuterBackgroundColor = computed(() => {
  if (props.planData.isMostPopular) {
    // For popular plans, use a default light purple if no specific color is set
    if (!props.planData.cardBackgroundColor || 
        props.planData.cardBackgroundColor === 'default' || 
        props.planData.cardBackgroundColor === 'none') {
      return 'bg-purple-200'; // Default popular background
    }
    return props.planData.cardBackgroundColor;
  }
  // For non-popular plans, use white as default
  if (!props.planData.cardBackgroundColor || 
      props.planData.cardBackgroundColor === 'default' || 
      props.planData.cardBackgroundColor === 'none') {
    return 'bg-white'; // Default non-popular card background is white
  }
  return props.planData.cardBackgroundColor;
});

const roundedClass = 'rounded-xl'; // Consistent 12px rounding

const displayPriceSuffix = computed(() => {
  const suffix = props.planData.priceSuffix || '/month';
  if (props.isYearlyBilling && suffix.includes('/month')) {
    return suffix.replace('/month', '/year');
  }
  return suffix;
});
</script>

<style scoped>
.pricing-card {
  min-height: 520px; 
}
.pricing-tagline-wrapper {
  min-height: 28px; 
}
</style>

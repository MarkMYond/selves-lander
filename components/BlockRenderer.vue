<template>
  <div v-if="blocks && blocks.length > 0">
    <template v-for="(block, i) in blocks" :key="block.id || i">
      <component :is="getComponentType(block)" :block="block as any" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { markRaw, defineAsyncComponent } from 'vue';

const blockComponents = {
  // Registry blocks
  regRichText: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/registry/RegContentBlock.vue'))
  ),
  regCallout: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/registry/RegCalloutBlock.vue'))
  ),
  regCode: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/registry/RegCodeBlock.vue'))
  ),
  regImageCarousel: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/registry/RegImageCarouselBlock.vue'))
  ),
  regColumns: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/registry/RegColumnsBlock.vue'))
  ),
  regAccordion: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/registry/RegAccordionBlock.vue'))
  ),
  regTable: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/registry/RegTableBlock.vue'))
  ),
  // Legacy and other blocks
  content: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/rich-text/ContentBlock.vue')
    )
  ),
  image: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/ImageBlock.vue'))
  ),
  // Web page blocks
  heroSection02: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/HeroSection02.vue'))
  ),
  brandLogos: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/BrandLogos.vue'))
  ),
  WhyChooseUsSection: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/WhyChooseUsSection.vue'))
  ),
  dashboardSection: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/DashboardSection.vue'))
  ),
  featuresWithIntroSection: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/FeaturesWithIntroSection.vue'))
  ),
  integrationsSection: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/IntegrationsSection.vue'))
  ),
  testimonialsSection: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/TestimonialsSection.vue'))
  ),
  faqSection: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/FaqSection.vue'))
  ),
  RecentArticles: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/RecentArticlesSection.vue'))
  ),
  pricingCards: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/general/PricingCards.vue'))
  ),
  featureComparisonTable: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/FeatureComparisonTable.vue'))
  ),
  ContactForm: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/ContactFormBlock.vue'))
  ),
};

interface BaseBlock {
  blockType?: string;
  id?: string | number;
  [key: string]: any;
}

const props = defineProps<{ blocks: BaseBlock[] }>();

const getComponentType = (block: BaseBlock | null | undefined) => {
  if (!block || !block.blockType) {
    return null;
  }
  const component = blockComponents[block.blockType as keyof typeof blockComponents];
  return component || null;
};
</script>

<template>
  <!-- Only render if blocks array is present and has items -->
  <div v-if="blocks && blocks.length > 0">
    <template v-for="(block, i) in blocks" :key="block.id || i">
      <component
        v-if="getComponentType(block)"
        :is="getComponentType(block)"
        :block="block"
      />
      <!-- Optional: Could add an else block here to render a placeholder or warning for unmapped blocks -->
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, markRaw, defineAsyncComponent } from 'vue'
import type { PropType } from 'vue'

// Define block types
export interface BaseBlock {
  id?: string | null // Allow id to be string, null, or undefined
  blockType: string
  [key: string]: any
}

// Define props for the component
const props = defineProps({
  blocks: {
    type: Array as PropType<BaseBlock[]>,
    default: () => [],
  },
})

// Map of block types to component names
const blockComponents = {
  // Wiki/Registry Blocks
  content: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/ContentBlock.vue')
    )
  ),
  image: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/ImageBlock.vue'))
  ),
  code: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/CodeBlock.vue')
    )
  ),
  divider: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/DividerBlock.vue')
    )
  ),
  expandable: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/ExpandableBlock.vue')
    )
  ),
  fileAttachment: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/FileAttachmentBlock.vue')
    )
  ),
  list: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/ListBlock.vue')
    )
  ),
  quote: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/QuoteBlock.vue')
    )
  ),
  sectionHeader: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/SectionHeaderBlock.vue')
    )
  ),
  table: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/TableBlock.vue')
    )
  ),
  taskList: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/TaskListBlock.vue')
    )
  ),
  videoEmbed: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/VideoEmbedBlock.vue')
    )
  ),
  genericEmbed: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/GenericEmbedBlock.vue')
    )
  ),
  callout: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/wiki-registry/CalloutBlock.vue')
    )
  ),

  // General Web Page Blocks
  // heroSection: markRaw(defineAsyncComponent(() => import('./payload-blocks/general/archive/HeroSection.vue'))), // Properly commented out
  b2HeroSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/B2HeroSection.vue')
    )
  ),
  aiSupportSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/AiSupportSection.vue')
    )
  ), // Match slug 'aiSupportSection'
  approachTabs: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/ApproachTabs.vue')
    )
  ),
  clientLogos: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/ClientLogos.vue')
    )
  ),
  customizedApproach: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/CustomizedApproach.vue')
    )
  ),
  featureSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/FeatureSection.vue')
    )
  ),
  servicesBenefits: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/ServicesBenefits.vue')
    )
  ),
  solutionCard: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/SolutionCard.vue')
    )
  ), // Note: Often nested
  solutionItem: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/SolutionItem.vue')
    )
  ), // Note: Often nested
  solutionsList: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/SolutionsList.vue')
    )
  ),
  stepList: markRaw(
    defineAsyncComponent(() => import('./payload-blocks/general/StepList.vue'))
  ),
  supportNinjaSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/SupportNinjaSection.vue')
    )
  ),
  talkToUs: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/TalkToUsSection.vue')
    )
  ),
  textImageSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/TextImageSection.vue')
    )
  ),
  testimonials: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/UpdatedTestimonialsCarousel.vue')
    )
  ),
  newTemplatesSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/NewTemplatesSection.vue')
    )
  ),
  // travelEraExplorer: markRaw(defineAsyncComponent(() => import('./payload-blocks/general/archive/TravelEraExplorer.vue'))), // Properly commented out
  // Add mappings for the missing blocks
  caseStudySection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/CaseStudiesSection.vue')
    )
  ),
  templateSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/TemplatesSection.vue')
    )
  ), // Component moved
  sectorsSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/SectorsSection.vue')
    )
  ), // Added mapping for SectorsSection
  // featureGrid: markRaw(defineAsyncComponent(() => import('./payload-blocks/general/FeatureGrid.vue'))), // Removed - Component likely doesn't exist / block is admin-only
  productFeatures: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/ProductFeatures.vue')
    )
  ), // Uncommented - File now exists
  pricingPlans: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/PricingPlans.vue')
    )
  ), // ADDED PRICING PLANS
  scheduleCallSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/ScheduleCallSection.vue')
    )
  ), // ADDED SCHEDULE CALL SECTION
  // travelers: markRaw(
  //   defineAsyncComponent(
  //     () => import('./payload-blocks/general/TravelersBlock.vue')
  //   )
  // ), // ADDED TRAVELERS BLOCK
  home03Hero: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/Home03Hero.vue')
    )
  ),
  brandLogos: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/BrandLogos.vue')
    )
  ),
  benefitsSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/BenefitsSection.vue')
    )
  ),
  faqSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/FaqSection.vue')
    )
  ),
  dashboardSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/DashboardSection.vue')
    )
  ),
  whatMakesUsDifferentSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/WhatMakesUsDifferentSection.vue')
    )
  ),
  integrationsSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/IntegrationsSection.vue')
    )
  ),
  testimonialsSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/TestimonialsSection.vue')
    )
  ),
  featuresWithIntroSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/general/FeaturesWithIntroSection.vue')
    )
  ),
  heroSection02: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/HeroSection02.vue')
    )
  ),
  WhyChooseUsSection: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/WhyChooseUsSection.vue')
    )
  ),
  HeroBlogCard: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/HeroBlogCardSection.vue')
    )
  ),
  RecentArticles: markRaw(
    defineAsyncComponent(
      () => import('./payload-blocks/RecentArticlesSection.vue')
    )
  ),
  ContactForm: markRaw( // Added ContactFormBlock
    defineAsyncComponent(
      () => import('./payload-blocks/ContactFormBlock.vue')
    )
  ),
}

// Function to determine which component to render based on the block type
const getComponentType = (block: BaseBlock | null | undefined) => {
  if (!block || !block.blockType) {
    console.warn('Block is missing blockType:', block)
    return null
  }

  const component =
    blockComponents[block.blockType as keyof typeof blockComponents]

  if (!component) {
    console.warn(`No component found for block type: ${block.blockType}`)
    return null
  }

  return component
}
</script>

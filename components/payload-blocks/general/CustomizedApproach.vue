<template>
  <section
    v-if="block"
    class="py-32 max-md:py-28 max-sm:py-16"
    :class="sectionBgClass"
  >
    <div
      class="relative px-56 mx-auto max-md:px-24 max-sm:px-12"
      :class="containerClass"
    >
      <div class="flex gap-14 max-md:flex-col max-md:gap-12 max-sm:gap-12">
        <div class="flex-1">
          <div class="flex-1 max-md:max-w-none">
            <h2
              v-if="block.title"
              class="mb-4 text-6xl leading-[71px] max-md:mb-4 max-md:text-6xl max-md:leading-[66px] max-sm:mb-3.5 max-sm:text-4xl max-sm:leading-10"
              v-html="block.title"
            />
            <p
              v-if="block.description"
              class="prose prose-xl max-w-none"
            >
              {{ block.description }}
            </p>
          </div>
        </div>
        <div class="flex-1">
          <ApproachTabs
            v-if="block.approachTabsData && block.approachTabsData.length > 0"
            :block="block.approachTabsData[0]"
          />
        </div>
      </div>
    </div>
  </section>
  <section
    v-else
    class="py-12 bg-brand-50"
  >
    <div class="container mx-auto px-4">
      <p class="text-center text-gray-500">
        Customized approach content unavailable
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ApproachTabs from './ApproachTabs.vue'

const props = defineProps<{
  block?: {
    blockType: 'customizedApproach'
    title?: string | null
    description?: string | null
    approachTabsData?: Array<any & { id?: string | null }> | null
    sectionBackgroundColor?: string | null
    contentBackgroundColor?: string | null
    containerWidth?: 'default' | 'medium' | 'wide' | 'full' | null
    id?: string | null
  }
}>()

const sectionBgClass = computed(() => {
  switch (props.block?.sectionBackgroundColor) {
    case 'white':
      return 'bg-white'
    case 'light-grey':
      return 'bg-brand-50'
    case 'brand-50':
      return 'bg-brand-50'
    case 'brand-900':
      return 'bg-brand-900'
    case 'brand-primary':
      return 'bg-brand-primary'
    default:
      return 'bg-brand-50'
  }
})

const containerClass = computed(() => {
  switch (props.block?.containerWidth) {
    case 'medium':
      return 'max-w-5xl'
    case 'wide':
      return 'max-w-7xl'
    case 'full':
      return 'max-w-none'
    default:
      return 'max-w-[1598px]'
  }
})
</script>

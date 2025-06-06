<template>
  <component
    :is="block.level || 'h2'"
    :id="anchorId"
    class="font-bold scroll-mt-20"
    :class="headingClasses"
  >
    <a
      v-if="anchorId"
      :href="`#${anchorId}`"
    >
      {{ block.title }}
    </a>
    <span v-else>{{ block.title }}</span>
  </component>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import slugify from 'slugify'

interface SectionHeaderBlockData {
  id?: string
  blockType: 'sectionHeaderBlock'
  title: string
  level?: 'h1' | 'h2' | 'h3' | 'h4'
  anchorId?: string
}

const props = defineProps({
  block: {
    type: Object as PropType<SectionHeaderBlockData>,
    required: true,
  },
})

const anchorId = computed(() => {
  if (props.block?.anchorId) {
    return slugify(props.block.anchorId, { lower: true, strict: true })
  }
  if (props.block?.title) {
    return slugify(props.block.title, { lower: true, strict: true })
  }
  return null
})

const headingClasses = computed(() => {
  const commonColorTracking =
    'text-brandNeutral-04 dark:text-brand-100 tracking-tight'
  const commonColorOnly = 'text-brandNeutral-04 dark:text-brand-100'

  switch (props.block?.level) {
    case 'h1':
      return `text-brandNeutral-04 dark:text-brand-100 text-6xl lg:text-7xl my-6`
    case 'h2':
      return `${commonColorTracking} text-3xl leading-tight max-md:text-2xl max-sm:text-xl mt-8 mb-4`
    case 'h3':
      return `${commonColorOnly} text-2xl leading-8 max-sm:text-lg max-sm:leading-7 text-center mt-6 mb-3`
    case 'h4':
      return `${commonColorOnly} text-lg lg:text-xl my-4`
    default:
      return `${commonColorTracking} text-3xl leading-tight max-md:text-2xl max-sm:text-xl mt-8 mb-4`
  }
})
</script>

<style scoped>
</style>

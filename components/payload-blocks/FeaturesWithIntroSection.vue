<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type {
  FeaturesWithIntroSectionBlock as FeaturesWithIntroSectionBlockType,
  Media,
} from '../../src/payload-types'
import TextImageSection from './general/TextImageSection.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

interface IntroContentType {
  superTitle?: string | null
  title: string
  description?: string | null
  eyebrowBackgroundColor?: string | null
  titleImage?: Media | string | null
}

const props = defineProps<{
  block: Omit<FeaturesWithIntroSectionBlockType, 'introContent'> & {
    id: string
    introContent?: IntroContentType | null
  }
}>()

const sectionBgClass = computed(() => {
  if (
    props.block?.sectionBackgroundColor === 'none' ||
    !props.block?.sectionBackgroundColor
  ) {
    return 'bg-transparent'
  }
  return 'bg-' + props.block.sectionBackgroundColor
})

const route = useRoute()
const isAboutPage = computed(() => {
  return (
    route.path === '/about' ||
    route.name === 'about' ||
    (route.name === 'slug' && route.params.slug === 'about')
  )
})
</script>

<template>
  <section :class="[sectionBgClass, 'block-section-padding']">
    <div class="container mx-auto px-2 sm:px-3 lg:px-4">
      <template v-if="isAboutPage">
        <div
          v-if="props.block.introContent && props.block.introContent.title"
          class="mb-12"
        >
          <SectionHeader
            :title="props.block.introContent.title"
            :subtitle="props.block.introContent.description"
            :eyebrow-text="props.block.introContent.superTitle"
            :eyebrow-background-color="props.block.introContent.eyebrowBackgroundColor"
            :title-image="typeof props.block.introContent.titleImage === 'object' && props.block.introContent.titleImage?.url ? props.block.introContent.titleImage.url : props.block.introContent.titleImage"
          />
        </div>
        <div class="max-w-4xl mx-auto">
          <div
            v-if="
              props.block.featureItems && props.block.featureItems.length > 0
            "
            class="space-y-12"
          >
            <template
              v-for="(item, index) in props.block.featureItems"
              :key="item.id || `feature-${index}`"
            >
              <TextImageSection
                :block="{
                  ...item,
                  blockType: 'textImageSection',
                  id: item.id || `feature-item-${index}`,
                  sectionBackgroundColor: 'none',
                  contentBackgroundColor: 'none',
                  removeTopPadding: true,
                  removeBottomPadding: true,
                }"
              />
            </template>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="max-w-4xl mx-auto">
          <div
            v-if="props.block.introContent && props.block.introContent.title"
            class="mb-12"
          >
            <SectionHeader
              :title="props.block.introContent.title"
              :subtitle="props.block.introContent.description"
              :eyebrow-text="props.block.introContent.superTitle"
              :eyebrow-background-color="props.block.introContent.eyebrowBackgroundColor"
              :title-image="typeof props.block.introContent.titleImage === 'object' && props.block.introContent.titleImage?.url ? props.block.introContent.titleImage.url : props.block.introContent.titleImage"
            />
          </div>
          <div
            v-if="
              props.block.featureItems && props.block.featureItems.length > 0
            "
            class="space-y-12"
          >
            <template
              v-for="(item, index) in props.block.featureItems"
              :key="item.id || `feature-${index}`"
            >
              <TextImageSection
                :block="{
                  ...item,
                  blockType: 'textImageSection',
                  id: item.id || `feature-item-${index}`,
                  sectionBackgroundColor: 'none',
                  contentBackgroundColor: 'none',
                  removeTopPadding: true,
                  removeBottomPadding: true,
                }"
              />
            </template>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

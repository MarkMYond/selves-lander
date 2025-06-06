<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProductFeaturesBlock, Media } from '../../../src/payload-types'
import { useMediaUrl } from '../../../composables/useMediaUrl'

const { getIconName } = useIcons()

const getIconWithVariant = (iconName: string) => {
  return getIconName(iconName.toLowerCase(), 'duotone')
}

const props = defineProps<{
  block: ProductFeaturesBlock
}>()

interface FeatureItem {
  title: string
  description?: string | null
  image: string | Media
  iconName?: string | null
  id?: string | null
}

const features = (props.block.features || []) as FeatureItem[]
const defaultImage = props.block.defaultImage as Media

const { getMediaUrl } = useMediaUrl()

const mappedContainerWidth = computed(() => {
  switch (props.block.containerWidth) {
    case 'medium':
      return 'max-w-5xl'
    case 'wide':
      return 'max-w-7xl'
    case 'full':
      return 'max-w-none'
    case 'default':
    default:
      return 'max-w-[1140px]'
  }
})

const mappedSectionBgColor = computed(() => {
  switch (props.block.sectionBackgroundColor) {
    // case 'light-grey': // Not a valid type for ProductFeaturesBlock.sectionBackgroundColor
    //   return 'bg-brand-50'
    case 'brand-50':
      return 'bg-brand-50'
    // case 'brand-900': // Not a valid type for ProductFeaturesBlock.sectionBackgroundColor
    //   return 'bg-brand-900 text-white'
    // case 'brand-primary': // Not a valid type for ProductFeaturesBlock.sectionBackgroundColor
    //   return 'bg-brand-primary text-white'
    case 'white':
    // Handle 'none', 'gradient', null, undefined explicitly if needed
    default:
      if (props.block?.sectionBackgroundColor === 'none' || !props.block?.sectionBackgroundColor) {
        return 'bg-transparent';
      }
      return 'bg-' + props.block.sectionBackgroundColor
  }
})

const mappedImageColumnBgColor = computed(() => {
  switch (props.block.imageColumnBackgroundColor) {
    // case 'light-grey': // Not a valid type for ProductFeaturesBlock.imageColumnBackgroundColor
    //   return 'bg-brand-50'
    case 'brand-50':
      return 'bg-brand-50'
    // case 'brand-900': // Not a valid type for ProductFeaturesBlock.imageColumnBackgroundColor
    //   return 'bg-brand-900 text-white'
    // case 'brand-primary': // Not a valid type for ProductFeaturesBlock.imageColumnBackgroundColor
    //   return 'bg-brand-primary text-white'
    case 'white':
    // Handle 'none', 'gradient', null, undefined explicitly if needed
    default:
      if (props.block?.imageColumnBackgroundColor === 'none' || !props.block?.imageColumnBackgroundColor) {
        return 'bg-transparent';
      }
      return 'bg-' + props.block.imageColumnBackgroundColor
  }
})

const selectedFeatureIndex = ref<number | null>(null)

function selectFeature(index: number) {
  selectedFeatureIndex.value = index
}
function clearSelection() {
  selectedFeatureIndex.value = null
}

const currentImageUrl = computed(() => {
  const selectedFeature =
    selectedFeatureIndex.value !== null
      ? features[selectedFeatureIndex.value]
      : null
  if (selectedFeature && selectedFeature.image) {
    return getMediaUrl(selectedFeature.image as Media)
  }
  return getMediaUrl(defaultImage)
})
</script>

<template>
  <section :class="['py-12 md:py-16', mappedSectionBgColor]">
    <div :class="['mx-auto px-4 sm:px-6 lg:px-8', mappedContainerWidth]">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
        <div class="md:col-span-2 divide-y divide-[#C9B7FF]">
          <div
            v-for="(feature, index) in features"
            :key="feature.id || index"
            class="group cursor-pointer p-4 transition-all duration-500 hover:bg-[#C9B7FF]"
            @mouseenter="selectFeature(index)"
            @mouseleave="clearSelection"
          >
            <div class="flex items-center mb-1">
              <Icon
                v-if="feature.iconName"
                :name="getIconWithVariant(feature.iconName)"
                class="w-6 h-6 mr-2 shrink-0 text-brand-primary group-hover:text-brand-900"
              />
              <h3
                class="text-xl [font-variant-ligatures:stylistic] [font-feature-settings:'ss01'] group-hover:text-brand-900"
              >
                {{ feature.title }}
              </h3>
            </div>
            <p
              v-if="feature.description"
              class="text-base opacity-80 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01'] group-hover:text-brand-900"
            >
              {{ feature.description }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'flex flex-col justify-center items-center md:col-span-3 p-10 h-full rounded-2xl border-[3px] border-brand-primary',
            mappedImageColumnBgColor,
          ]"
        >
          <img
            v-if="currentImageUrl"
            :src="currentImageUrl"
            alt="Feature image"
            class="max-w-full h-auto"
          >
          <div
            v-else
            class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"
          >
            <span class="text-gray-500">No image available</span>
          </div>
          <p class="text-xl mt-4">
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<template>
  <section class="why-choose-us-section-01 block-section-padding">
    <div
      class="w-layout-blockcontainer container mx-auto px-4 sm:px-6 lg:px-8 w-container"
    >
      <div class="why-choose-us-wrapper space-y-12">
        <div
          ref="sectionTitleRef"
          class="why-choose-section-title"
        >
          <SectionHeader
            :eyebrow-text="props.block.eyebrowText"
            :eyebrow-background-color="props.block.eyebrowBackgroundColor"
            :title="props.block.title"
            :subtitle="props.block.subTitle"
            :title-image="typeof props.block.titleImage === 'object' && props.block.titleImage?.url ? props.block.titleImage.url : (typeof props.block.titleImage === 'string' ? props.block.titleImage : null)"
            title-max-width="max-w-lg"
            subtitle-max-width="max-w-xl"
          />
        </div>

        <div
          v-if="props.block?.cards && props.block.cards.length > 0"
          ref="cardsWrapperRef"
          class="why-choose-us-single-card-wrapper grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div
            v-for="(card, index) in props.block.cards"
            :key="card.id || `card-${index}`"
            class="why-choose-us-single-card text-center rounded-2xl p-6 md:p-8 space-y-4"
            :class="[
              card.invertStyle
                ? card.iconBackgroundColor || 'bg-brandTheme-01'
                : 'border border-gray-200',
            ]"
          >
            <div
              v-if="card.icon && typeof card.icon === 'object' && card.icon.url"
              class="why-choose-us-card-icon inline-flex items-center justify-center rounded-xl p-3.5"
              :class="[
                card.invertStyle
                  ? 'bg-brandNeutral-01'
                  : card.iconBackgroundColor || 'bg-brandTheme-01',
              ]"
            >
              <img
                :src="getMediaUrl(card.icon)"
                loading="lazy"
                :alt="card.icon.alt || 'Feature Icon'"
                class="h-[42px] w-[42px]"
              >
            </div>
            <p
              v-if="card.cardTitle"
              class="why-choose-us-card-item text-body-20 font-semibold text-brandNeutral-04"
            >
              {{ card.cardTitle }}
            </p>
            <p
              v-if="card.cardText"
              class="text-body-16 text-brandNeutral-03"
            >
              {{ card.cardText }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType } from 'vue'
import { useScrollAnimations } from '@/composables/useScrollAnimations'
import { useMediaUrl } from '@/composables/useMediaUrl'
import type { WhyChooseUsSection, Media } from '@/src/payload-types'
import SectionHeader from '@/components/ui/SectionHeader.vue'

const props = defineProps({
  block: {
    type: Object as PropType<WhyChooseUsSection>,
    required: true,
  },
})

const { getMediaUrl } = useMediaUrl()
const { registerElement } = useScrollAnimations()

const sectionTitleRef = ref<HTMLElement | null>(null)
const cardsWrapperRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (sectionTitleRef.value) {
    const id = sectionTitleRef.value.getAttribute('data-w-id')
    if (id) registerElement(id, sectionTitleRef.value)
  }
  if (cardsWrapperRef.value) {
    const id = cardsWrapperRef.value.getAttribute('data-w-id')
    if (id) registerElement(id, cardsWrapperRef.value)
  }
})
</script>

<style scoped>
.why-choose-us-section-01.remove-bottom-padding {
  padding-bottom: 0;
}
</style>

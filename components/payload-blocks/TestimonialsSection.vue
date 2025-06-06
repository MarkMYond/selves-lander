<template>
  <section class="block-section-padding">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex flex-col gap-12">
        <SectionHeader
          v-if="block.title"
          :title="block.title"
          :subtitle="block.description"
          :eyebrow-text="block.eyebrowText"
          :title-image="block.titleImage"
          class=""
        />
        <div
          v-if="itemsToDisplay && itemsToDisplay.length"
          class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="(item, index) in itemsToDisplay"
            :key="item.id || index"
            class="flex flex-col py-11 px-8 bg-brandNeutral-02 rounded-xl"
          >
            <div
              v-if="item.companyLogo"
              class="flex justify-start mb-9"
            >
              <div
                class="inline-flex items-center justify-center rounded-xl p-3.5 w-16 h-16"
                :class="[getLogoBgClass(item.companyLogoBackgroundColor)]"
              >
                <img
                  :src="getMediaUrl(item.companyLogo)"
                  :alt="
                    typeof item.companyLogo === 'object' &&
                      item.companyLogo?.alt
                      ? item.companyLogo.alt
                      : 'Company Logo'
                  "
                  class="w-14 h-14 object-contain"
                >
              </div>
            </div>

            <blockquote class="flex-1 mb-9">
              <h3
                v-if="item.quoteTitle"
                class="text-h4 font-medium text-brandNeutral-04 mb-3 leading-tight"
              >
                {{ item.quoteTitle }}
              </h3>
              <p class="text-body-18 text-brandNeutral-04 leading-relaxed">
                {{ item.quote }}
              </p>
            </blockquote>

            <div class="mt-auto pt-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img
                      v-if="
                        item.authorImage &&
                          typeof item.authorImage === 'object' &&
                          item.authorImage.url
                      "
                      class="object-cover w-10 h-10 rounded-full bg-brandNeutral-stroke"
                      :src="getMediaUrl(item.authorImage)"
                      :alt="
                        typeof item.authorImage === 'object' &&
                          item.authorImage?.alt
                          ? item.authorImage.alt
                          : item.authorName
                      "
                    >
                    <div
                      v-else
                      class="flex items-center justify-center w-10 h-10 rounded-full bg-brandNeutral-stroke"
                    >
                      <svg
                        class="w-5 h-5 text-brandNeutral-03"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-body-16 font-medium text-brandNeutral-04">
                      {{ item.authorName }}
                    </p>
                    <p
                      v-if="item.authorRole"
                      class="text-body-14 text-brandNeutral-03"
                    >
                      {{ item.authorRole }}
                    </p>
                  </div>
                </div>

                <BaseButton
                  v-if="item.readMoreLink"
                  :href="item.readMoreLink"
                  target="_blank"
                  variant="border"
                >
                  Read More
                  <svg
                    class="w-4 h-4 ml-1 text-brandNeutral-03"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TestimonialsSectionBlock, Media } from '../../src/payload-types'
import { useMediaUrl } from '../../composables/useMediaUrl'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

interface CaseStudyItem {
  id?: string | null
  quoteTitle?: string
  quote: string
  authorName: string
  authorRole?: string
  companyLogo?: Media | string | null
  companyLogoBackgroundColor?: string | null
  authorImage?: Media | string | null
  readMoreLink?: string
}

interface Props {
  block: TestimonialsSectionBlock & {
    testimonials?: CaseStudyItem[]
    caseStudies?: CaseStudyItem[]
    eyebrowText?: string | null
    titleImage?: Media | string | null
  }
}

const props = defineProps<Props>()

const { getMediaUrl } = useMediaUrl()

const itemsToDisplay = computed(() => {
  if (props.block.caseStudies && props.block.caseStudies.length > 0) {
    return props.block.caseStudies
  }
  return props.block.testimonials || []
})

const getLogoBgClass = (bgColorValue?: string | null) => {
  switch (bgColorValue) {
    case 'theme-color-01':
      return 'bg-brandTheme-01'
    case 'theme-color-02':
      return 'bg-brandTheme-02'
    case 'theme-color-03':
      return 'bg-brandTheme-03'
    case 'theme-color-04':
      return 'bg-brandTheme-04'
    case 'purple':
      return 'bg-brandTheme-01'
    case 'green':
      return 'bg-brandTheme-03'
    case 'yellow':
      return 'bg-brandTheme-04'
    case 'purple-light':
      return 'bg-brandTheme-01'
    case 'default':
    default:
      return 'bg-brandNeutral-01'
  }
}
</script>

<style scoped>
</style>

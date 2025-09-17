<template>
  <section class="faq-section-01 block-section-padding">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="faq-wrapper-1 flex flex-col gap-6 max-w-4xl mx-auto">
        <SectionHeader
          v-if="block.title"
          :title="block.title"
          :subtitle="block.description"
          :eyebrow-text="block.eyebrow"
          :eyebrow-background-color="block.eyebrowBackgroundColor"
          :title-image="typeof block.titleImage === 'object' && block.titleImage?.url ? block.titleImage.url : (typeof block.titleImage === 'string' ? block.titleImage : null)"
          class=""
        />

        <div
          v-if="block.faqs && block.faqs.length"
          class="faq-list flex flex-col gap-0"
        >
          <div
            v-for="(faq, index) in block.faqs"
            :key="faq.id || `faq-${index}`"
            class="faq-item style-2 border-b border-[#45414033]"
          >
            <button
              class="faq-header style-2 w-full flex justify-between items-center py-6 text-left focus:outline-none"
              @click="toggleAccordion(index)"
            >
              <p class="faq-question text-xl font-semibold text-[#120a0b] pr-10">
                {{ faq.question }}
              </p>
              <div class="faq-item-icon">
                <svg
                  v-if="activeIndex !== index"
                  class="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 12H6"
                  />
                </svg>
              </div>
            </button>
            <div
              v-show="activeIndex === index"
              class="faq-item-content style-2 overflow-hidden transition-max-height duration-500 ease-in-out"
            >
              <p
                class="faq-item-content-p style-2 text-lg leading-relaxed text-[#454140] pb-6 pt-2 max-w-3xl"
              >
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { Media } from '@/src/payload-types'

interface FaqItem {
  id?: string
  question: string
  answer: string
}

interface FaqSectionBlockType {
  blockType: 'faqSection'
  eyebrow?: string
  eyebrowBackgroundColor?: string | null
  title?: string
  description?: string
  titleImage?: Media | string | null
  faqs?: FaqItem[]
}

const props = defineProps<{
  block: FaqSectionBlockType
}>()

const activeIndex = ref<number | null>(null)

const toggleAccordion = (index: number) => {
  if (activeIndex.value === index) {
    activeIndex.value = null
  } else {
    activeIndex.value = index
  }
}
</script>

<style scoped>
.faq-item-content {
}
</style>

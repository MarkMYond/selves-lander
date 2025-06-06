<template>
  <div
    :class="[
      'py-6 sm:py-8 md:py-10',
      sectionBackgroundColorClass,
      sectionPaddingClasses,
    ]"
  >
    <div
      :class="['container mx-auto px-4 sm:px-6 lg:px-8', containerWidthClass]"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div
          :class="[
            'md:pr-8',
            contentBackgroundColorClass,
            contentPaddingClasses,
          ]"
        >
          <h2
            v-if="block.title"
            :class="['font-bold mb-4', titleSizeClass]"
          >
            {{ block.title }}
          </h2>
          <div
            v-if="block.description"
            class="prose max-w-none"
            v-html="block.description"
          />
          <div
            v-if="block.buttons && block.buttons.length > 0"
            class="mt-6 space-x-4"
          >
            <a
              v-for="(button, index) in block.buttons"
              :key="index"
              :href="button.url"
              :class="[
                'inline-block px-6 py-3 rounded-md text-base font-medium',
                buttonStyle(button.style),
              ]"
            >
              {{ button.text }}
            </a>
          </div>
        </div>

        <div class="border-[3px] border-brand-primary rounded-lg p-4 md:p-6">
          <div class="flex mb-4 border-b border-gray-300">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              :class="[
                'py-2 px-4 font-medium text-sm focus:outline-none',
                activeTab === tab.id
                  ? 'border-b-2 border-brand-primary text-brand-primary'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>
          <div
            class="min-h-[200px] flex items-center justify-center bg-gray-50 rounded"
          >
            <p
              v-if="activeTabContent"
              class="text-gray-700 text-lg"
            >
              {{ activeTabContent }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import type { InteractiveChatBlock } from './builderTypes'

const props = defineProps({
  block: {
    type: Object as PropType<InteractiveChatBlock>,
    required: true,
  },
})

const activeTab = ref('lost-card')

const tabs = [
  { id: 'lost-card', name: 'Lost card', content: 'LostCardContent' },
  { id: 'fraud-check', name: 'Fraud check', content: 'FraudCheckContent' },
  { id: 'account-help', name: 'Account Help', content: 'AccountHelpContent' },
  { id: 'other', name: 'Other', content: 'OtherContent' },
]

const activeTabContent = computed(() => {
  const currentTab = tabs.find((tab) => tab.id === activeTab.value)
  return currentTab ? currentTab.content : ''
})

const sectionBackgroundColorClass = computed(() => {
  if (props.block.sectionBackgroundColor === 'brand-50') return 'bg-brand-50'
  if (props.block.sectionBackgroundColor === 'white') return 'bg-white'
  if (props.block.sectionBackgroundColor === 'light-grey')
    return 'bg-light-grey'
  if (props.block.sectionBackgroundColor === 'brand-900')
    return 'bg-brand-900 text-white'
  return 'bg-transparent'
})

const contentBackgroundColorClass = computed(() => {
  if (props.block.contentBackgroundColor === 'brand-50')
    return 'bg-brand-50 p-6 rounded-lg'
  if (props.block.contentBackgroundColor === 'white')
    return 'bg-white p-6 rounded-lg'
  if (props.block.contentBackgroundColor === 'light-grey')
    return 'bg-light-grey p-6 rounded-lg'
  if (props.block.contentBackgroundColor === 'brand-900')
    return 'bg-brand-900 text-white p-6 rounded-lg'
  return ''
})

const containerWidthClass = computed(() => {
  switch (props.block.containerWidth) {
    case 'fluid':
      return 'max-w-full'
    case 'xl':
      return 'max-w-screen-xl'
    case 'lg':
      return 'max-w-screen-lg'
    case 'md':
      return 'max-w-screen-md'
    default:
      return 'max-w-screen-xl'
  }
})

const sectionPaddingClasses = computed(() => {
  let classes = ''
  if (props.block.removeTopPadding) {
    classes += 'pt-0 '
  }
  if (props.block.removeBottomPadding) {
    classes += 'pb-0 '
  }
  return classes.trim()
})

const contentPaddingClasses = computed(() => {
  return !props.block.contentBackgroundColor ? 'py-4' : ''
})

const titleSizeClass = computed(() => {
  return props.block.titleStyle === 'large'
    ? 'text-4xl md:text-5xl lg:text-6xl'
    : 'text-3xl md:text-4xl'
})

const buttonStyle = (style: string | undefined) => {
  if (style === 'secondary') {
    return 'bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'
  }
  return 'bg-brand-primary text-white hover:bg-opacity-90'
}
</script>

<style scoped>
.prose :deep(p) {
  margin-bottom: 1em;
}
</style>

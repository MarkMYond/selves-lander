<template>
  <section
    :class="[
      mappedSectionBgColor,
      paddingClasses,
      {
        'flex flex-col min-h-[calc(100vh-var(--header-height,80px))]':
          isGetInTouchPage,
      },
    ]"
  >
    <div
      :class="[
        'mx-auto px-4 sm:px-6 lg:px-8',
        mappedContainerWidth,
        { 'flex-grow flex flex-col': isGetInTouchPage },
      ]"
    >
      <div
        :class="[
          'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16',
          { 'flex-grow': isGetInTouchPage },
        ]"
      >
        <InfoColumn
          :logo="
            typeof block.infoColumn?.infoColumnLogo === 'object'
              ? block.infoColumn.infoColumnLogo
              : null
          "
          :header-link="block.infoColumn?.infoColumnHeaderLink"
          :main-title-part1="block.infoColumn?.infoColumnMainTitlePart1"
          :main-title-part2="block.infoColumn?.infoColumnMainTitlePart2"
          :title-container-desktop-height="
            block.infoColumn?.infoColumnTitleContainerDesktopHeight
          "
          :footer-text="block.infoColumn?.infoColumnFooterText"
          :footer-links="block.infoColumn?.infoColumnFooterLinks"
          :text-color-class="textColorClass"
          @request-name-focus="handleRequestNameFocus"
        />

        <FormColumn
          ref="formColumnRef"
          :title="block.formColumn?.formTitle"
          :text-color-class="textColorClass"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ScheduleCallBlockPayload } from '../../../src/payload-types'
import InfoColumn from '../../contact/InfoColumn.vue'
import FormColumn from '../../contact/FormColumn.vue'

const props = defineProps<{
  block: ScheduleCallBlockPayload
}>()

const sectionBgColorValue = computed(() => props.block?.sectionBackgroundColor)
const mappedSectionBgColor = computed(() => {
  switch (sectionBgColorValue.value) {
    case 'light-grey':
      return 'bg-brand-50'
    case 'brand-50':
      return 'bg-brand-50'
    case 'brand-900':
      return 'bg-brand-900'
    case 'brand-primary':
      return 'bg-brand-primary'
    case 'white':
    default:
      return 'bg-white'
  }
})

const textColorClass = computed(() => {
  return sectionBgColorValue.value === 'brand-900' ||
    sectionBgColorValue.value === 'brand-primary'
    ? 'text-white'
    : 'text-brand-900'
})

const containerWidthValue = computed(() => props.block?.containerWidth)
const mappedContainerWidth = computed(() => {
  switch (containerWidthValue.value) {
    case 'medium':
      return 'max-w-5xl'
    case 'wide':
      return 'max-w-7xl'
    case 'full':
      return 'max-w-none'
    case 'default':
    default:
      return 'max-w-7xl'
  }
})

const route = useRoute()
const isGetInTouchPage = computed(() => route.path === '/get-in-touch')

const paddingClasses = computed(() => {
  const classes = []
  const fullTop = 'pt-16 md:pt-24'
  const fullBottom = 'pb-16 md:pb-24'
  const halfTop = 'pt-8 md:pt-12'
  const halfBottom = 'pb-8 md:pb-12'

  if (isGetInTouchPage.value || props.block?.reduceTopPadding) {
    classes.push(halfTop)
  } else {
    classes.push(fullTop)
  }

  if (isGetInTouchPage.value || props.block?.reduceBottomPadding) {
    classes.push(halfBottom)
  } else {
    classes.push(fullBottom)
  }
  return classes.join(' ')
})

const formColumnRef = ref<{ focusNameInput: () => void } | null>(null)

const handleRequestNameFocus = () => {
  formColumnRef.value?.focusNameInput()
}
</script>

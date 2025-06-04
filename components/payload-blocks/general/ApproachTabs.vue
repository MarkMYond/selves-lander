<template>
  <div v-if="block" class="relative" :class="contentBgClass">
    <!-- Apply content background -->
    <h3
      v-if="block.title"
      class="mb-6 text-2xl font-bold leading-8 max-md:mb-6 max-md:text-xl max-md:leading-8 max-sm:mb-5 max-sm:text-base max-sm:leading-6"
      v-html="block.title"
    ></h3>
    <div
      v-if="block.tabs && block.tabs.length > 0"
      class="flex relative flex-col"
    >
      <div
        role="tablist"
        class="flex relative mb-10 gap-[normal_7.92716px] max-md:mb-9 max-md:gap-[normal_7.33403px] max-sm:mb-5 max-sm:gap-[normal_7.02185px]"
      >
        <button
          role="tab"
          :aria-controls="`tab-panel-${0}`"
          :aria-selected="activeTab === 0"
          @click="setActiveTab(0)"
          class="flex relative flex-1 justify-center items-center px-4 py-1 max-w-full text-base leading-7 text-center align-top cursor-pointer rounded-[31.7086px] text-neutral-800 max-md:px-4 max-md:py-1 max-md:text-base max-md:leading-6 max-md:rounded-[29.3361px] max-sm:py-1 max-sm:pr-3.5 max-sm:pl-3 max-sm:text-base max-sm:leading-relaxed max-sm:rounded-3xl [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
          :class="
            activeTab === 0
              ? 'bg-brand-primary text-white'
              : 'hover:bg-brand-100' // Changed hover:bg-gray-100 to hover:bg-brand-100
          "
        >
          <span
            class="text-base leading-5 text-center cursor-pointer text-neutral-800 max-md:text-base max-md:leading-5 max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            :class="{ 'text-white': activeTab === 0 }"
            >{{ block?.tabs?.[0]?.tabTitle }}</span
          >
        </button>
        <button
          class="flex relative flex-1 justify-center items-center px-4 py-1 max-w-full text-base leading-7 text-center align-top cursor-pointer rounded-[31.7086px] text-neutral-800 max-md:px-4 max-md:py-1 max-md:text-base max-md:leading-6 max-md:rounded-[29.3361px] max-sm:py-1 max-sm:pr-3.5 max-sm:pl-3 max-sm:text-base max-sm:leading-relaxed max-sm:rounded-3xl [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
          :class="
            activeTab === 1
              ? 'bg-brand-primary text-white'
              : 'hover:bg-brand-100' // Changed hover:bg-gray-100 to hover:bg-brand-100
          "
          @click="setActiveTab(1)"
        >
          <span
            class="text-base leading-7 text-center cursor-pointer text-neutral-800 max-md:text-base max-md:leading-6 max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            :class="{ 'text-white': activeTab === 1 }"
            >{{ block?.tabs?.[1]?.tabTitle }}</span
          >
        </button>
      </div>

      <!-- Tab Content -->
      <div class="mt-8">
        <div v-show="activeTab === 0">
          <div
            class="text-base leading-relaxed text-neutral-800 max-md:text-base max-md:leading-relaxed max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            v-html="block?.tabs?.[0]?.steps"
          ></div>
        </div>
        <div v-show="activeTab === 1">
          <div
            class="text-base leading-relaxed text-neutral-800 max-md:text-base max-md:leading-relaxed max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            v-html="block?.tabs?.[1]?.steps"
          ></div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="flex justify-center mt-10">
        <a
          v-if="block.link && block.link.url"
          :href="block.link.url"
          class="relative px-6 py-3 w-full text-base font-medium leading-6 text-center border border-solid cursor-pointer bg-emerald-950 border-emerald-950 rounded-[68px] text-zinc-50 transition-[color,background-color,border-color] max-md:px-6 max-md:py-3 max-md:text-base max-md:leading-5 max-sm:px-5 max-sm:py-3 max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ block.link.text || 'Learn More' }}
        </a>
      </div>
    </div>
  </div>
  <div v-else class="p-4 bg-brand-50 text-center text-gray-500">
    Approach Tabs content unavailable
  </div>
  <!-- Changed bg-gray-100 to bg-brand-50 -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue' // Added computed
import StepList from './StepList.vue'

const activeTab = ref(0)

const setActiveTab = (index: number) => {
  activeTab.value = index
}

// Define props using generic type
const props = defineProps<{
  block?: {
    blockType: 'approachTabs'
    title?: string | null
    tabs?: Array<{
      tabTitle?: string | null
      steps?: string | null // Steps are a single string in Payload
      id?: string | null
    }> | null
    link?: {
      text?: string | null
      url?: string | null
    } | null
    // Only contentBackgroundColor is relevant here as it's nested
    contentBackgroundColor?: string | null
    id?: string | null
  }
}>()

// Background Class (only content background matters here)
const contentBgClass = computed(() => {
  switch (props.block?.contentBackgroundColor) {
    case 'light-grey':
      return 'bg-brand-50'
    default:
      return 'bg-' + props.block?.contentBackgroundColor
  }
})

// Removed hardcoded tabContents
</script>

<template>
  <div
    class="section-header text-left space-y-2 md:flex md:flex-row md:items-start md:gap-8"
  >
    <div
      :class="[
        titleImage ? 'md:w-3/4' : 'md:w-full',
        'space-y-2',
      ]"
    >
      <div
        v-if="eyebrowText"
        class="inline-block px-4 py-1 rounded-full"
        :class="[eyebrowBackgroundColorClass]"
      >
  <p class="text-body-14 font-medium text-neutral-dark">
          {{ eyebrowText }}
        </p>
      </div>
      <div class="space-y-4">
        <h2
          v-if="title"
          :class="['text-h3 md:text-h2 font-semibold text-neutral-dark leading-[1.1]', titleMaxWidth ? titleMaxWidth : 'max-w-xl']"
          v-html="title"
        />
        <p
          v-if="subtitle"
          :class="['text-body-18 text-neutral-medium', subtitleMaxWidth ? subtitleMaxWidth : 'max-w-2xl']"
          v-html="subtitle"
        />
      </div>
    </div>
    <div
      v-if="titleImage"
      class="hidden md:block md:w-1/4 mt-4 md:mt-0"
    >
      <img
        :src="getMediaUrl(titleImage)"
        :alt="title || 'Header image'"
        class="w-full h-auto rounded-lg object-contain mx-auto"
        style="transform: scale(0.8);"
        loading="lazy"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useMediaUrl } from '@/composables/useMediaUrl'
// Removed Media type reference; only using string | null for titleImage

const props = defineProps({
  eyebrowText: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },
  eyebrowBackgroundColor: {
    type: [String, null] as PropType<string | null>,
    required: false,
  default: 'bg-blue-light',
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },
  titleImage: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },
  titleMaxWidth: {
    type: String as PropType<string | null>,
    required: false,
    default: null,
  },
  subtitleMaxWidth: {
    type: String as PropType<string | null>,
    required: false,
    default: null,
  },
  // titleImageAlt: {
  //   type: String,
  //   required: false,
  // },
})

const { getMediaUrl } = useMediaUrl()

const eyebrowBackgroundColorClass = computed(() => {
  // If a specific class is passed, use it, otherwise use the default.
  // This allows direct Tailwind classes from Payload.
  return props.eyebrowBackgroundColor
})
</script>

<style scoped>
</style>

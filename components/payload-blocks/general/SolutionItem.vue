<template>
  <div
    role="listitem"
    class="h-full"
  >
    <NuxtLink
      v-if="solution"
      :to="solution.link?.url || '#'"
      class="flex items-start gap-5 p-6 max-w-full h-full border-t-[3px] border-solid cursor-pointer border-brand-primary group relative before:absolute before:w-0 before:h-[3px] before:bg-brand-primary before:transition-all hover:before:w-full before:left-0 before:top-0 before:duration-700"
    >
      <Icon
        v-if="iconNameFormatted"
        :name="iconNameFormatted"
        size="40"
        class="w-10 h-10 shrink-0 text-brand-primary"
      />
      <div
        v-else
        class="w-10 h-10 shrink-0 flex items-center justify-center bg-gray-200 rounded text-gray-500 text-base [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        title="Invalid icon name"
      >
        ?
      </div>

      <div class="flex flex-col flex-1 self-stretch cursor-pointer">
        <div class="cursor-pointer">
          <h3
            v-if="solution.solutionTitle"
            class="text-brand-900 dark:text-brand-100 text-2xl leading-snug mb-3 cursor-pointer"
          >
            {{ solution.solutionTitle }}
          </h3>
          <div
            v-if="solution.solutionDescription"
            class="max-w-none mb-5"
          >
            <p
              class="text-base leading-relaxed text-brand-900 dark:text-primary-300 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
            >
              {{ solution.solutionDescription }}
            </p>
          </div>
        </div>
        <div
          v-if="solution.link?.url"
          class="flex items-center cursor-pointer mt-auto pt-2"
        >
          <div
            class="text-base tracking-tight cursor-pointer duration-200 transition-[color] text-brand-primary hover:text-primary-600 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
          >
            {{
              solution.link?.text ||
                `Explore ${solution.solutionTitle || 'Solution'}`
            }}
          </div>
          <div class="flex ml-2 cursor-pointer">
            <div
              class="overflow-x-hidden overflow-y-hidden cursor-pointer h-4 w-4"
              v-html="arrowSvg"
            />
          </div>
        </div>
      </div>
    </NuxtLink>
    <div
      v-else
      class="p-6 border-t border-solid border-t-stone-300 text-gray-500"
    >
      Solution information unavailable
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const config = useRuntimeConfig()

const props = defineProps<{
  solution:
    | {
        iconName?: string
        solutionTitle?: string
        solutionDescription?: string
        link?: {
          text?: string
          url?: string
        } | null
        id?: string | null
      }
    | undefined
}>()

const { getIconName } = useIcons()

const iconNameFormatted = computed(() => {
  const iconName = props.solution?.iconName
  if (!iconName) return null

  return getIconName(iconName.toLowerCase(), 'duotone')
})

const arrowSvg = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.51 6.605L6.822 0.916999L5.076 2.654L7.83 5.408H0.657V7.784H7.83L5.076 10.547L6.822 12.293L12.51 6.605Z" fill="currentColor"></path>
</svg>`
</script>

<template>
  <nav
    v-if="prevPage || nextPage"
    class="mt-8 pt-8 border-t border-brand-50 dark:border-primary-700 flex justify-between items-center"
  >
    <div>
      <NuxtLink
        v-if="prevPage"
        :to="`/${section}/${prevPage.slug}`"
        class="inline-flex items-center text-sm font-medium text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 dark:text-brand-100 dark:hover:bg-purple-light dark:hover:text-primary-700 px-2 py-1 rounded-md transition-colors"
      >
        <!-- <PhArrowLeft
          :size="20"
          class="mr-2"
        /> -->
        <span>< Previous: {{ prevPage.title }}</span>
      </NuxtLink>
    </div>
    <div>
      <NuxtLink
        v-if="nextPage"
        :to="`/${section}/${nextPage.slug}`"
        class="inline-flex items-center text-sm font-medium text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 dark:text-brand-100 dark:hover:bg-purple-light dark:hover:text-primary-700 px-2 py-1 rounded-md transition-colors"
      >
        <span>Next: {{ nextPage.title }} ></span>
        <!-- <PhArrowRight
          :size="20"
          class="ml-2"
        /> -->
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
// import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
interface Props {
  navData: NavCategoryGroup[] | null
  currentPageSlug?: string
  section: 'wiki' | 'registry'
}

const props = defineProps<Props>()
const { navData, currentPageSlug, section } = toRefs(props)

const { prevPage, nextPage } = usePrevNextNavigation(
  navData,
  currentPageSlug
)
</script>

<style scoped>
</style>

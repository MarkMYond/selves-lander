<template>
  <nav v-if="prevPage || nextPage" class="mt-8 pt-8 border-t border-brand-50 dark:border-primary-700 flex justify-between items-center"> <!-- Changed border-gray-200 to border-brand-50 and dark:border-gray-700 to dark:border-primary-700 -->
    <div>
      <NuxtLink
        v-if="prevPage"
        :to="`/${section}/${prevPage.slug}`"
        class="inline-flex items-center text-sm font-medium text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 dark:text-brand-100 dark:hover:bg-purple-light dark:hover:text-primary-700 px-2 py-1 rounded-md transition-colors"
      >
        <PhArrowLeft :size="20" class="mr-2" />
        <span>Previous: {{ prevPage.title }}</span>
      </NuxtLink>
    </div>
    <div>
      <NuxtLink
        v-if="nextPage"
        :to="`/${section}/${nextPage.slug}`"
        class="inline-flex items-center text-sm font-medium text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 dark:text-brand-100 dark:hover:bg-purple-light dark:hover:text-primary-700 px-2 py-1 rounded-md transition-colors"
      >
        <span>Next: {{ nextPage.title }}</span>
        <PhArrowRight :size="20" class="ml-2" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue';
// NavCategoryGroup, usePrevNextNavigation, FlattenedNavPage, useNavigationStore
// should be auto-imported by Nuxt 3

interface Props {
  navData: NavCategoryGroup[] | null; // Nuxt should make NavCategoryGroup globally available
  currentPageSlug?: string;
  section: 'wiki' | 'registry';
}

const props = defineProps<Props>();
const { navData, currentPageSlug, section } = toRefs(props);

const navigationStore = useNavigationStore();

const { currentPage, prevPage, nextPage } = usePrevNextNavigation(
  navData,
  currentPageSlug
);

// handleNextClick is no longer needed as the special parent->child navigation and menu expansion are removed.
// const handleNextClick = () => {
//   if (currentPage.value && nextPage.value) {
//     // Check if current page is a parent and next page is its first child
//     const isParentAndNextIsFirstChild =
//       currentPage.value.children &&
//       currentPage.value.children.length > 0 &&
//       currentPage.value.children[0].id === nextPage.value.id;

//     if (isParentAndNextIsFirstChild) {
//       navigationStore.expandParent(currentPage.value.id);
//       // Potentially scroll to item in nav - this would be handled in WikiNavigation.vue
//     }
//   }
// };
</script>

<style scoped>
/* Add any specific styles if needed, though Tailwind should cover most */
</style>

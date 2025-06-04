<template>
  <!-- Sticky positioned just below the AppHeader -->
  <nav class="bg-white h-12 flex items-center px-4 border-b border-brand-50 sticky top-16 z-30"> <!-- Changed border-gray-200 to border-brand-50 -->
    <ul class="flex items-center gap-6">
      <!-- Fixed Wiki and Registry Links -->
      <li class="mr-2">
        <NuxtLink
          to="/wiki" 
          class="text-base leading-relaxed font-medium text-gray-600 hover:text-gray-900 transition-colors pb-3 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
          :class="{ 'text-primary border-b-2 border-primary': isWikiActive() }"
        >
          Wiki
        </NuxtLink>
      </li>
      <li class="mr-6">
        <NuxtLink
          to="/registry" 
          class="text-base leading-relaxed font-medium text-gray-600 hover:text-gray-900 transition-colors pb-3 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
          :class="{ 'text-primary border-b-2 border-primary': isRegistryActive() }"
        >
          Registry
        </NuxtLink>
      </li>
      <!-- Removed dynamic category rendering -->
      <!-- Add other static links like 'Help Centre' if needed -->
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
// Remove unused Category type and related logic
// import type { Category } from '../../../payload-cms/src/payload-types'; 

// Remove unused variables related to fetching/displaying categories
// const sections = ref<(Pick<Category, 'id' | 'name'> & { slug?: string })[]>([]);
// const loading = ref(false);
// const error = ref<Error | null>(null);
const route = useRoute();

// Remove unused API fetching logic
// const payloadApiUrl = import.meta.env.VITE_PAYLOAD_API_URL || 'http://localhost:3333';
// const categoriesApiUrl = '/api/categories?limit=100&sort=name'; 
// const { data: categoriesData, error: fetchError, pending } = await useFetch<PayloadCategoryResponse>(categoriesApiUrl, { ... });
// watch(categoriesData, ...);
// watch(fetchError, ...);
// watch(pending, ...);

// Remove unused isActive function for categories
// const isActive = (categorySlugOrName: string | undefined) => { ... };

// Function to check if we're on a Wiki page
const isWikiActive = () => {
  const pathSegments = route.path.split('/').filter(Boolean);
  return pathSegments[0] === 'wiki';
};

// Function to check if we're on a Registry page
const isRegistryActive = () => {
  const pathSegments = route.path.split('/').filter(Boolean);
  return pathSegments[0] === 'registry';
};
</script>

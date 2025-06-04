<template>
  <div class="wiki-navigation bg-light-grey text-gray-800 p-4 rounded-md h-full">
    <!-- Top-level title for the entire Wiki Nav -->
    <NuxtLink v-if="navTitle" to="/wiki" prefetch class="block text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 rounded-md transition-colors duration-150 -ml-2 -mr-2 mb-1">
      <h3 class="text-lg font-semibold">{{ navTitle }}</h3>
    </NuxtLink>

    <!-- Loop through processed items: could be categories or top-level pages (if API changes later) -->
    <ul v-if="navStore.processedNavigationItems && navStore.processedNavigationItems.length > 0" class="space-y-1">
      <li v-for="item in navStore.processedNavigationItems" :key="item.id">
        <!-- Item is a Category -->
        <div v-if="item.isCategory" class="category-item group">
          <div 
            @click="() => navStore.toggleExpand(item.id)"
            class="flex items-center justify-between cursor-pointer text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 rounded-md transition-colors duration-150"
            role="button"
            :aria-expanded="item.expanded ? 'true' : 'false'"
            :aria-controls="`category-children-${item.id}`"
          >
            <h4 class="font-semibold text-md align-middle uppercase text-brandNeutral-04">{{ item.title }}</h4>
            <button
              vif="item.children && item.children.length > 0"
              class="p-1 ml-2 rounded-md text-brandNeutral-04 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :aria-label="item.expanded ? `Collapse ${item.title}` : `Expand ${item.title}`"
            >
              <span>{{ item.expanded ? '-' : '+' }}</span>
            </button>
          </div>
          <ul v-if="item.expanded && item.children && item.children.length > 0" :id="`category-children-${item.id}`" class="ml-4 mt-1 pl-3 border-l border-primary-200 space-y-1">
            <!-- Loop through pages within this category -->
            <li v-for="page in item.children" :key="page.id" class="page-item">
              <div class="flex items-center justify-between group">
                <NuxtLink
                  :to="`/wiki/${page.slug}`"
                  prefetch
                  class="flex-grow text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 rounded-md transition-colors duration-150"
                  active-class="bg-purple-light text-primary-700 font-semibold"
                >
                  <!--
                  <component
                    v-if="page.icon"
                    :is="getIconComponent(page.icon)"
                    class="mr-2 inline-block h-5 w-5 align-middle"
                    aria-hidden="true"
                  />
                  <span v-else class="mr-2 inline-block h-5 w-5 align-middle"></span>
                  -->
                  <!-- <span class="mr-2 inline-block h-5 w-5 align-middle"></span> Placeholder removed -->
                  <span class="align-middle text-sm [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']">{{ page.title }}</span>
                </NuxtLink>
                <button
                  v-if="page.hasChildren"
                  @click="() => navStore.toggleExpand(page.id)"
                  class="p-1 ml-2 rounded-md text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  :aria-expanded="page.expanded ? 'true' : 'false'"
                  :aria-label="page.expanded ? `Collapse ${page.title}` : `Expand ${page.title}`"
                >
                  <span v-if="page.loadingChildren" class="text-xs">...</span>
                  <span>{{ page.expanded ? '-' : '+' }}</span>
                </button>
              </div>
              <!-- Sub-pages of this page (recursive structure for pages) -->
              <ul v-if="page.expanded && page.children && page.children.length > 0" class="ml-6 mt-1 pl-3 border-l border-primary-200 space-y-1">
                <li v-for="childPage in page.children" :key="childPage.id" class="sub-page-item">
                  <NuxtLink
                    :to="`/wiki/${childPage.slug}`"
                    prefetch
                    class="flex items-center text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 block rounded-md transition-colors duration-150 text-sm"
                    active-class="bg-purple-light text-primary-700 font-semibold"
                  >
                    <!--
                    <component 
                      v-if="childPage.icon" 
                      :is="getIconComponent(childPage.icon)"
                      class="mr-2 inline-block h-4 w-4 align-middle"
                      aria-hidden="true"
                    />
                    <span v-else class="mr-2 inline-block h-4 w-4 align-middle"></span>
                    -->
                    <!-- <span class="mr-2 inline-block h-4 w-4 align-middle"></span> Placeholder removed -->
                    <span class="align-middle [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']">{{ childPage.title }}</span>
                  </NuxtLink>
                </li>
              </ul>
               <p v-if="page.expanded && page.children && page.children.length === 0 && !page.loadingChildren && page.hasChildren" class="ml-6 mt-1 pl-3 text-xs text-gray-500">
                No sub-pages.
              </p>
            </li>
          </ul>
           <p v-if="item.expanded && (!item.children || item.children.length === 0)" class="ml-4 mt-1 pl-3 text-xs text-gray-500">
            No pages in this category.
          </p>
        </div>

        <!-- Item is a Page (should not happen at top level with current API, but good for future flexibility) -->
        <!-- This section is effectively duplicated from within category loop for pages -->
        <div v-else class="page-item">
           <div class="flex items-center justify-between group">
            <NuxtLink
              :to="`/wiki/${item.slug}`"
              prefetch
              class="flex-grow text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 rounded-md transition-colors duration-150"
              active-class="bg-purple-light text-primary-700 font-semibold"
            >
              <!--
              <component
                v-if="item.icon"
                :is="getIconComponent(item.icon)"
                class="mr-2 inline-block h-5 w-5 align-middle"
                aria-hidden="true"
              />
              <span v-else class="mr-2 inline-block h-5 w-5 align-middle"></span>
              -->
              <!-- <span class="mr-2 inline-block h-5 w-5 align-middle"></span> Placeholder removed -->
              <span class="align-middle text-sm [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']">{{ item.title }}</span>
            </NuxtLink>
            <button
              v-if="item.hasChildren" 
              @click="() => navStore.toggleExpand(item.id)"
              class="p-1 ml-2 rounded-md text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :aria-expanded="item.expanded ? 'true' : 'false'"
              :aria-label="item.expanded ? `Collapse ${item.title}` : `Expand ${item.title}`"
            >
              <span v-if="item.loadingChildren" class="text-xs">...</span>
              <span>{{ item.expanded ? '-' : '+' }}</span>
            </button>
          </div>
          <ul v-if="item.expanded && item.children && item.children.length > 0" class="ml-6 mt-1 pl-3 border-l border-primary-200 space-y-1">
            <li v-for="child in item.children" :key="child.id" class="sub-page-item">
              <NuxtLink
                :to="`/wiki/${child.slug}`"
                prefetch
                class="flex items-center text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 block rounded-md transition-colors duration-150 text-sm"
                active-class="bg-purple-light text-primary-700 font-semibold"
              >
                <component 
                  v-if="child.icon" 
                  :is="getIconComponent(child.icon)"
                  class="mr-2 inline-block h-4 w-4 align-middle"
                  aria-hidden="true"
                />
                <span v-else class="mr-2 inline-block h-4 w-4 align-middle"></span>
                <span class="align-middle [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']">{{ child.title }}</span>
                  </NuxtLink>
            </li>
          </ul>
          <p v-if="item.expanded && item.children && item.children.length === 0 && !item.loadingChildren && item.hasChildren" class="ml-6 mt-1 pl-3 text-xs text-gray-500">
            No sub-pages.
          </p>
        </div>
      </li>
    </ul>
    <p v-else-if="!navStore.pending && (!navStore.processedNavigationItems || navStore.processedNavigationItems.length === 0)">
      No categories or pages found for the wiki.
    </p>
    <p v-if="navStore.pending && !navStore.isInitialized" class="text-gray-600">Loading navigation...</p>
    <p v-if="navStore.error" class="text-red-500">Error loading navigation: {{ navStore.error.message }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { Component, PropType } from 'vue'
import { 
  PhFileText, PhBookOpen, PhFolder, PhLink, PhInfo, PhQuestion, PhGear, PhHouse 
} from '@phosphor-icons/vue'
import { useWikiNavStore } from '../../stores/wikiNavStore'

const iconComponents: Record<string, Component> = {
  FileText: PhFileText, BookOpen: PhBookOpen, Folder: PhFolder,
  Link: PhLink, Info: PhInfo, Question: PhQuestion,
  Gear: PhGear, House: PhHouse, Default: PhFileText
};
const getIconComponent = (iconName?: string): Component => (iconName && iconComponents[iconName]) || iconComponents.Default;

const props = defineProps({
  navTitle: { type: String, default: 'Wiki Menu' },
  currentParentId: { type: String as PropType<string | null | undefined>, default: null }, // No longer directly used by this component for top-level fetching
});

const navStore = useWikiNavStore();

onMounted(() => {
  navStore.ensureInitialized(); // This will now fetch categorized navigation
});
</script>

<style scoped>
.wiki-navigation ul {
  list-style: none;
  padding: 0;
}
.category-item > div[role="button"] { /* Target the clickable div for category */
  /* Styles for category header, e.g., slightly different background or font */
}
.page-item {
  /* Styles for page items if needed */
}
.sub-page-item {
  /* Styles for sub-page items if needed */
}
</style>

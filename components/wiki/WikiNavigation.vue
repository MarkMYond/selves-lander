<template>
  <div class="wiki-navigation bg-transparent text-gray-800 p-4 rounded-md h-full">
    <NuxtLink v-if="navTitle" to="/wiki" prefetch class="block text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-1 rounded-md transition-colors duration-150 -ml-1 -mr-1 mb-0.5">
      <h3 class="text-lg font-semibold">{{ navTitle }}</h3>
    </NuxtLink>

    <ul v-if="navStore.processedNavigationItems && navStore.processedNavigationItems.length > 0" class="space-y-1">
      <li v-for="item in navStore.processedNavigationItems" :key="item.id">
        <!-- Item is a Category -->
        <div v-if="item.isCategory" class="category-item group">
          <div 
            @click="() => navStore.toggleExpand(item.id)"
            class="flex items-center justify-between cursor-pointer text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-1 rounded-md transition-colors duration-150"
            role="button"
            :aria-expanded="item.expanded ? 'true' : 'false'"
            :aria-controls="`category-children-${item.id}`"
          >
            <h4 class="font-semibold text-sm align-middle uppercase text-brandNeutral-04">{{ item.title }}</h4>
            <button
              v-if="item.children && item.children.length > 0"
              class="p-1 ml-2 rounded-md text-brandNeutral-04 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :aria-label="item.expanded ? `Collapse ${item.title}` : `Expand ${item.title}`"
            >
              <span>{{ item.expanded ? '-' : '+' }}</span>
            </button>
          </div>
          <ul v-if="item.expanded && item.children && item.children.length > 0" :id="`category-children-${item.id}`" class="ml-4 mt-1 pl-3 border-l border-primary-200 space-y-0">
            <NavItemRecursive v-for="page in item.children" :key="page.id" :item="page" :level="0" />
          </ul>
           <p v-if="item.expanded && (!item.children || item.children.length === 0)" class="ml-4 mt-1 pl-3 text-xs text-gray-500">
            No pages in this category.
          </p>
        </div>

        <!-- Item is a Page (top level, if not under a category) -->
        <div v-else class="page-item">
          <NavItemRecursive :item="item" :level="0" />
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
import { onMounted, defineAsyncComponent } from 'vue'
import type { Component, PropType } from 'vue'
import { 
  PhFileText, PhBookOpen, PhFolder, PhLink, PhInfo, PhQuestion, PhGear, PhHouse 
} from '@phosphor-icons/vue'
import { useWikiNavStore } from '../../stores/wikiNavStore'

// Define NavItem type here as it's used by NavItemRecursive as well
interface NavItem {
  id: string;
  title: string;
  slug?: string; // Optional for categories
  icon?: string;
  isCategory?: boolean;
  children?: NavItem[];
  hasChildren?: boolean;
  expanded?: boolean;
  loadingChildren?: boolean;
}

// Asynchronously import NavItemRecursive to handle self-referencing for tree structure
const NavItemRecursive = defineAsyncComponent(() => 
  import('./NavItemRecursive.vue')
);

const iconComponents: Record<string, Component> = {
  FileText: PhFileText, BookOpen: PhBookOpen, Folder: PhFolder,
  Link: PhLink, Info: PhInfo, Question: PhQuestion,
  Gear: PhGear, House: PhHouse, Default: PhFileText
};
// This function might be moved to NavItemRecursive if icons are only on pages
const getIconComponent = (iconName?: string): Component => (iconName && iconComponents[iconName]) || iconComponents.Default;

const props = defineProps({
  navTitle: { type: String, default: 'Wiki Home' },
  currentParentId: { type: String as PropType<string | null | undefined>, default: null },
});

const navStore = useWikiNavStore();

onMounted(() => {
  navStore.ensureInitialized();
});
</script>

<style scoped>
.wiki-navigation ul {
  list-style: none;
  padding: 0;
}
/* Other styles remain as they were */
</style>

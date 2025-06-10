<template>
  <li class="nav-item-recursive">
    <div class="flex items-center justify-between group">
      <NuxtLink
        :to="`/wiki/${item.slug}`"
        prefetch
        class="flex-grow text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-1 rounded-md transition-colors duration-150 text-sm flex items-center"
        active-class="bg-purple-light text-primary-700 font-semibold"
      >
        <span
          v-if="item.icon && item.iconBackgroundColor && item.iconBackgroundColor !== 'none'"
          :class="[
            'w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0',
            item.iconBackgroundColor,
          ]"
        >
          <Icon
            :name="
              item.icon.startsWith('ph:')
                ? `ph:${item.icon.substring(3).toLowerCase()}`
                : `ph:${item.icon.toLowerCase()}`
            "
            class="h-4 w-4" 
          />
        </span>
        <Icon
          v-else-if="item.icon"
          :name="
            item.icon.startsWith('ph:')
              ? `ph:${item.icon.substring(3).toLowerCase()}`
              : `ph:${item.icon.toLowerCase()}`
          "
          class="mr-2 h-4 w-4 flex-shrink-0"
        />
        <span
          class="align-middle [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >{{ item.title }}</span>
      </NuxtLink>
      <button
        v-if="item.hasChildren"
        class="p-1 ml-2 rounded-md text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        :aria-expanded="item.expanded ? 'true' : 'false'"
        :aria-label="
          item.expanded ? `Collapse ${item.title}` : `Expand ${item.title}`
        "
        @click="() => navStore.toggleExpand(item.id)"
      >
        <span
          v-if="item.loadingChildren"
          class="text-xs"
        >...</span>
        <span v-else>{{ item.expanded ? '-' : '+' }}</span>
      </button>
    </div>
    <ul
      v-if="item.expanded && item.children && item.children.length > 0"
      :class="['mt-1 pl-3 border-l border-primary-200 space-y-0']"
      :style="{ marginLeft: `${(level + 1) * 0.5}rem` }"
    >
      <NavItemRecursive
        v-for="childItem in item.children"
        :key="childItem.id"
        :item="childItem"
        :level="level + 1"
      />
    </ul>
    <p
      v-if="
        item.expanded &&
          item.children &&
          item.children.length === 0 &&
          !item.loadingChildren &&
          item.hasChildren
      "
      :class="['mt-1 pl-3 text-xs text-gray-500']"
      :style="{ marginLeft: `${(level + 1) * 0.5}rem` }"
    >
      No sub-pages.
    </p>
  </li>
</template>

<script setup lang="ts">
import { type PropType, defineAsyncComponent } from 'vue'
import { useWikiNavStore } from '../../stores/wikiNavStore'

// Define NavItem type matching the one in WikiNavigation.vue or a shared types file
interface NavItem {
  id: string
  title: string
  slug?: string
  icon?: string
  iconBackgroundColor?: string; // Added for icon background
  isCategory?: boolean
  children?: NavItem[]
  hasChildren?: boolean
  expanded?: boolean
  loadingChildren?: boolean
}

// Props
const props = defineProps({
  item: {
    type: Object as PropType<NavItem>,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
})

const navStore = useWikiNavStore()

// Since this component is recursively calling itself, and it's loaded via defineAsyncComponent
// by its parent, Vue 3 should handle the recursive self-reference.
// No need to explicitly import itself with defineAsyncComponent here.
// const NavItemRecursive = defineAsyncComponent(() => import('./NavItemRecursive.vue')); // Not needed here

// Icon logic can be re-added here if you want icons at every level
// import { PhFileText, ... } from '@phosphor-icons/vue';
// import type { Component } from 'vue';
// const iconComponents: Record<string, Component> = { ... };
// const getIconComponent = (iconName?: string): Component => ...;
</script>

<style scoped>
/* Scoped styles for NavItemRecursive if needed */
</style>

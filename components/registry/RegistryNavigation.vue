<template>
  <div
    class="registry-navigation bg-[#FCFAF9] text-gray-800 p-6 rounded-md h-full"
  >
    <NuxtLink
      v-if="navTitle"
      to="/registry"
      class="block text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 rounded-md transition-colors duration-150 -ml-2 -mr-2 mb-1"
    >
      <h3 class="text-lg font-semibold">
        {{ navTitle }}
      </h3>
    </NuxtLink>
    <ul
      v-if="
        navStore.processedNavigationItems &&
          navStore.processedNavigationItems.length > 0
      "
      class="space-y-1"
    >
      <li
        v-for="item in navStore.processedNavigationItems"
        :key="item.id"
      >
        <div
          v-if="item.isCategory"
          class="category-item group"
        >
          <div
            class="flex items-center justify-between cursor-pointer text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 rounded-md transition-colors duration-150"
            role="button"
            :aria-expanded="item.expanded ? 'true' : 'false'"
            :aria-controls="`category-children-${item.id}`"
            @click="() => navStore.toggleExpand(item.id)"
          >
            <h4
              class="font-semibold text-sm align-middle uppercase text-brandNeutral-04"
            >
              {{ item.title }}
            </h4>
            <button
              vif="item.children && item.children.length > 0"
              class="p-1 ml-2 rounded-md text-brandNeutral-04 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :aria-label="
                item.expanded
                  ? `Collapse ${item.title}`
                  : `Expand ${item.title}`
              "
            >
              <span>{{ item.expanded ? '-' : '+' }}</span>
            </button>
          </div>
          <ul
            v-if="item.expanded && item.children && item.children.length > 0"
            :id="`category-children-${item.id}`"
            class="ml-4 mt-1 pl-3 border-l border-primary-200 space-y-1"
          >
            <li
              v-for="page in item.children"
              :key="page.id"
              class="page-item"
            >
              <div class="flex items-center justify-between group">
                <NuxtLink
                  :to="`/registry/${page.slug}`"
                  prefetch
                  class="flex-grow text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 rounded-md transition-colors duration-150 flex items-center"
                  active-class="bg-purple-light text-primary-700 font-semibold"
                >
                  <span
                    v-if="page.icon && page.iconBackgroundColor && page.iconBackgroundColor !== 'none'"
                    :class="[
                      'w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0',
                      page.iconBackgroundColor,
                    ]"
                  >
                    <Icon
                      :name="
                        page.icon.startsWith('ph:')
                          ? `ph:${page.icon.substring(3).toLowerCase()}`
                          : `ph:${page.icon.toLowerCase()}`
                      "
                      class="h-4 w-4"
                    />
                  </span>
                  <Icon
                    v-else-if="page.icon"
                    :name="
                      page.icon.startsWith('ph:')
                        ? `ph:${page.icon.substring(3).toLowerCase()}`
                        : `ph:${page.icon.toLowerCase()}`
                    "
                    class="mr-2 h-4 w-4 flex-shrink-0"
                  />
                  <span
                    class="align-middle text-sm [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
                  >{{ page.title }}</span>
                </NuxtLink>
                <button
                  v-if="page.hasChildren"
                  class="p-1 ml-2 rounded-md text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  :aria-expanded="page.expanded ? 'true' : 'false'"
                  :aria-label="
                    page.expanded
                      ? `Collapse ${page.title}`
                      : `Expand ${page.title}`
                  "
                  @click="() => navStore.toggleExpand(page.id)"
                >
                  <span
                    v-if="page.loadingChildren"
                    class="text-xs"
                  >...</span>
                  <span>{{ page.expanded ? '-' : '+' }}</span>
                </button>
              </div>
              <ul
                v-if="
                  page.expanded && page.children && page.children.length > 0
                "
                class="ml-6 mt-1 pl-3 border-l border-primary-200 space-y-1"
              >
                <li
                  v-for="childPage in page.children"
                  :key="childPage.id"
                  class="sub-page-item"
                >
                  <NuxtLink
                    :to="`/registry/${childPage.slug}`"
                    prefetch
                    class="flex items-center text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 block rounded-md transition-colors duration-150 text-sm"
                    active-class="bg-purple-light text-primary-700 font-semibold"
                  >
                    <span
                      v-if="childPage.icon && childPage.iconBackgroundColor && childPage.iconBackgroundColor !== 'none'"
                      :class="[
                        'w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0',
                        childPage.iconBackgroundColor,
                      ]"
                    >
                      <Icon
                        :name="
                          childPage.icon.startsWith('ph:')
                            ? `ph:${childPage.icon.substring(3).toLowerCase()}`
                            : `ph:${childPage.icon.toLowerCase()}`
                        "
                        class="h-4 w-4"
                      />
                    </span>
                    <Icon
                      v-else-if="childPage.icon"
                      :name="
                        childPage.icon.startsWith('ph:')
                          ? `ph:${childPage.icon.substring(3).toLowerCase()}`
                          : `ph:${childPage.icon.toLowerCase()}`
                      "
                      class="mr-2 h-4 w-4 flex-shrink-0"
                    />
                    <span
                      class="align-middle [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
                    >{{ childPage.title }}</span>
                  </NuxtLink>
                </li>
              </ul>
              <p
                v-if="
                  page.expanded &&
                    page.children &&
                    page.children.length === 0 &&
                    !page.loadingChildren &&
                    page.hasChildren
                "
                class="ml-6 mt-1 pl-3 text-xs text-gray-500"
              >
                No sub-pages.
              </p>
            </li>
          </ul>
          <p
            v-if="
              item.expanded && (!item.children || item.children.length === 0)
            "
            class="ml-4 mt-1 pl-3 text-xs text-gray-500"
          >
            No pages in this category.
          </p>
        </div>

        <div
          v-else
          class="page-item"
        >
          <div class="flex items-center justify-between group">
            <NuxtLink
              :to="`/registry/${item.slug}`"
              prefetch
              class="flex-grow text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 rounded-md transition-colors duration-150 flex items-center"
              active-class="bg-purple-light text-primary-700 font-semibold"
            >
              <span
                v-if="item.icon && item.iconBackgroundColor && item.iconBackgroundColor !== 'none'"
                :class="[
                  'w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0',
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
                class="align-middle text-sm [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
              >{{ item.title }}</span>
            </NuxtLink>
            <button
              v-if="item.hasChildren"
              class="p-1 ml-2 rounded-md text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :aria-expanded="item.expanded ? 'true' : 'false'"
              :aria-label="
                item.expanded
                  ? `Collapse ${item.title}`
                  : `Expand ${item.title}`
              "
              @click="() => navStore.toggleExpand(item.id)"
            >
              <span
                v-if="item.loadingChildren"
                class="text-xs"
              >...</span>
              <span>{{ item.expanded ? '-' : '+' }}</span>
            </button>
          </div>
          <ul
            v-if="item.expanded && item.children && item.children.length > 0"
            class="ml-6 mt-1 pl-3 border-l border-primary-200 space-y-1"
          >
            <li
              v-for="child in item.children"
              :key="child.id"
              class="sub-page-item"
            >
              <NuxtLink
                :to="`/registry/${child.slug}`"
                prefetch
                class="flex items-center text-brandNeutral-04 hover:bg-purple-light hover:text-primary-700 p-2 block rounded-md transition-colors duration-150 text-sm"
                active-class="bg-purple-light text-primary-700 font-semibold"
              >
                <span
                  class="align-middle [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
                >{{ child.title }}</span>
              </NuxtLink>
            </li>
          </ul>
          <p
            v-if="
              item.expanded &&
                item.children &&
                item.children.length === 0 &&
                !item.loadingChildren &&
                item.hasChildren
            "
            class="ml-6 mt-1 pl-3 text-xs text-gray-500"
          >
            No sub-pages.
          </p>
        </div>
      </li>
    </ul>
    <p
      v-else-if="
        !navStore.pending &&
          (!navStore.processedNavigationItems ||
            navStore.processedNavigationItems.length === 0)
      "
    >
      No categories or pages found for the registry.
    </p>
    <p
      v-if="navStore.pending && !navStore.isInitialized"
      class="text-gray-600"
    >
      Loading navigation...
    </p>
    <p
      v-if="navStore.error"
      class="text-red-500"
    >
      Error loading navigation: {{ navStore.error.message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { PropType } from 'vue' // Removed unused Component type
import { useRegistryNavStore } from '../../stores/registryNavStore'

const props = defineProps({
  navTitle: { type: String, default: 'Registry Home' },
  currentParentId: {
    type: String as PropType<string | null | undefined>,
    default: null,
  },
})

const navStore = useRegistryNavStore()

onMounted(() => {
  navStore.ensureInitialized()
})
</script>

<style scoped>
.registry-navigation ul {
  list-style: none;
  padding: 0;
}
</style>

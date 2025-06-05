<template>
  <div class="flex flex-col items-start lg:flex-row relative">
    <!-- Left Sidebar for Page Navigation -->
    <aside
      class="w-full fixed top-0 left-0 z-[11] pt-[5.5rem] overflow-scroll h-screen bg-light-grey lg:bg-light-grey lg:p-6 lg:h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:translate-x-0 lg:w-[21.6rem] lg:sticky lg:top-[5.5rem] transition-all duration-700 rounded-md lg:rounded-md m-2.5"
      :class="{
        'translate-x-[-100%]': !isLeftSidebarOpen,
        'translate-x-[0]': isLeftSidebarOpen,
      }"
    >
      <WikiNavigation :current-parent-id="navParentId" :nav-title="navTitle" />
      <button
        @click="$emit('closeLeftSidebar')"
        class="absolute top-[6.5rem] right-3 z-[12] lg:hidden h-[30px] w-[30px]"
        aria-title="Close wiki nav"
      >
        <Icon name="ph:x" size="24" />
      </button>
    </aside>

    <!-- Main Content Area -->
    <section class="flex-1 p-4 lg:p-8 overflow-y-auto lg:max-h-[calc(100vh-5.5rem)]">
      <div class="relative">
        <slot />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['closeLeftSidebar'])
const props = defineProps({
  backgroundImageUrl: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
  backgroundOverlay: {
    type: String,
    default: 'none',
  },
  // ID of the parent page for the navigation.
  // If the current page is a top-level section page, this could be its own ID.
  // If the current page is a child, this would be its parent's ID.
  // If null, WikiNavigation will fetch root-level pages.
  navParentId: {
    type: String as PropType<string | null>,
    default: null,
  },
  navTitle: {
    type: String,
    default: 'In this section',
  },
  isLeftSidebarOpen: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
/* Ensure the sidebar can scroll independently if content is long */
/* The lg:max-h-[calc(100vh-5.5rem)] and lg:overflow-y-auto on the aside should handle this now. */
/* Keeping the style block in case other specific styles are needed later. */
</style>

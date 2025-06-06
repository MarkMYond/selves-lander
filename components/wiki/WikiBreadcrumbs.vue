<template>
  <nav
    aria-label="Breadcrumb"
    class="text-base leading-relaxed text-gray-500 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
  >
    <ol class="flex flex-wrap items-center space-x-1.5">
      <li>
        <NuxtLink
          to="/wiki"
          class="hover:text-gray-700 flex items-center"
        >
          <!-- <PhHouse
            :size="14"
            class="mr-1 shrink-0"
          /> -->
          Home
        </NuxtLink>
      </li>
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb._id"
      >
        <div class="flex items-center">
          <span class="mx-1 text-gray-400">/</span>
          <NuxtLink
            :to="`/wiki/${crumb.slug?.current || ''}`"
            class="hover:text-gray-700"
            :class="{
              'font-medium text-gray-700': index === breadcrumbs.length - 1,
            }"
            :aria-current="
              index === breadcrumbs.length - 1 ? 'page' : undefined
            "
          >
            {{ crumb.title }}
          </NuxtLink>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// import { PhHouse } from '@phosphor-icons/vue'

interface WikiPage {
  _id: string
  title: string
  slug?: { current: string }
  parent?: any
}

const props = defineProps({
  currentPage: {
    type: Object as () => WikiPage | null,
    default: null,
  },
  allPages: {
    type: Array as () => WikiPage[],
    default: () => [],
  },
})

const pagesMap = computed(() => {
  const map = new Map<string, WikiPage>()
  props.allPages.forEach((page) => map.set(page._id, page))
  return map
})

const breadcrumbs = computed(() => {
  const crumbs: WikiPage[] = []
  let current: WikiPage | null = props.currentPage

  while (current) {
    crumbs.unshift(current)

    const parentAsAny = current.parent as any
    const parentId = parentAsAny?._id ?? parentAsAny?._ref

    current = parentId ? pagesMap.value.get(parentId) || null : null
  }

  return crumbs
})
</script>

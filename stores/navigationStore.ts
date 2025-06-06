import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  const expandedParentIds = ref<Set<string>>(new Set())

  function toggleExpand(parentId: string) {
    if (expandedParentIds.value.has(parentId)) {
      expandedParentIds.value.delete(parentId)
    } else {
      expandedParentIds.value.add(parentId)
    }
  }

  function expandParent(parentId: string) {
    expandedParentIds.value.add(parentId)
  }

  function collapseParent(parentId: string) {
    expandedParentIds.value.delete(parentId)
  }

  function isExpanded(parentId: string): boolean {
    return expandedParentIds.value.has(parentId)
  }

  return {
    expandedParentIds,
    toggleExpand,
    expandParent,
    collapseParent,
    isExpanded,
  }
})

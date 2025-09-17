// Registry-specific rich text renderer composable
import { computed } from 'vue'
import type { Ref } from 'vue'

export type RegistryRichTextRoot = any // Replace with your registry-specific type if needed

export function useRegistryRichTextRenderer(contentRoot: Ref<RegistryRichTextRoot | undefined>) {
  // Minimal rendering logic for registry rich text
  const renderedHtml = computed(() => {
    // Example: just return the raw HTML if present
    if (!contentRoot.value) return ''
    // You can add custom registry-specific rendering here
    return contentRoot.value.html || ''
  })

  return { renderedHtml }
}

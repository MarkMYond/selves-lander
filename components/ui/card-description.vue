<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <p
    :class="
      cn(
        'text-base leading-relaxed text-muted-foreground [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']',
        props.class
      )
    "
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AvatarRoot, type AvatarRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<AvatarRootProps & { class?: HTMLAttributes['class'] }>(),
  {},
)

const computedClasses = computed(() =>
  cn(
    'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
    props.class,
  ),
)
</script>

<template>
  <AvatarRoot :class="computedClasses">
    <slot />
  </AvatarRoot>
</template>

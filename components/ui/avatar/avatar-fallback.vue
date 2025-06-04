<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AvatarFallback, type AvatarFallbackProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes['class'] }>()

const computedClasses = computed(() =>
  cn(
    'flex h-full w-full items-center justify-center rounded-full bg-muted',
    props.class,
  ),
)
</script>

<template>
  <AvatarFallback v-bind="props" :class="computedClasses">
    <slot />
  </AvatarFallback>
</template>

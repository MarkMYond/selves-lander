<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps & { class?: HTMLAttributes['class'] }>()

const computedClasses = computed(() => cn('-mx-1 my-1 h-px bg-muted', props.class))
</script>

<template>
  <DropdownMenuSeparator :class="computedClasses" />
</template>

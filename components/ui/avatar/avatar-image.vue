<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AvatarImage, type AvatarImageProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  AvatarImageProps & { class?: HTMLAttributes['class'] }
>()

const computedClasses = computed(() =>
  cn('aspect-square h-full w-full', props.class)
)
</script>

<template>
  <AvatarImage
    v-bind="props"
    :class="computedClasses"
  />
</template>

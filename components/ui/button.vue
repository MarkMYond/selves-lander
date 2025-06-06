<script setup lang="ts">
import { type HTMLAttributes, computed, resolveComponent } from 'vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils' // Assuming Nuxt alias resolves ./lib/utils.ts

const NuxtLink = resolveComponent('NuxtLink') // Resolve NuxtLink for dynamic component

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-remixco-blue text-white hover:bg-remixco-blue/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Define props including 'to' and 'href' for navigation
interface Props {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  as?: string
  class?: HTMLAttributes['class']
  to?: string | null
  href?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  to: null,
  href: null,
})

const componentIs = computed(() => {
  if (props.to) return NuxtLink
  if (props.href) return 'a'
  return props.as
})

const linkProps = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return {}
})
</script>

<template>
  <component
    :is="componentIs"
    v-bind="linkProps"
    :class="
      cn(
        buttonVariants({ variant: props.variant, size: props.size }),
        props.class
      )
    "
  >
    <slot />
  </component>
</template>

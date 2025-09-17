<template>
  <component
    :is="componentTag"
    :to="to"
    :href="href"
    :target="target"
    :rel="isExternalLink ? 'noopener noreferrer' : undefined"
    :class="buttonClasses"
    v-bind="nonClickAttrs"
    @click="combinedClickHandler"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, type PropType, useAttrs, resolveComponent } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'border' | 'dark-pill' // Added dark-pill

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const props = defineProps({
  to: {
    type: [String, Object] as PropType<string | object | undefined>,
    default: undefined,
  },
  href: {
    type: String,
    default: undefined,
  },
  variant: {
    type: String as PropType<ButtonVariant>,
    default: 'primary',
    validator: (value: string) =>
      ['primary', 'secondary', 'tertiary', 'border', 'dark-pill'].includes(value), // Added dark-pill
  },
  target: {
    type: String,
    default: undefined,
  },
  // Add other props like 'disabled', 'type' (for button tag) if needed later
})

const attrs = useAttrs()

const combinedClickHandler = (event: MouseEvent) => {
  // Call the listener passed from the parent, if any
  if (typeof attrs.onClick === 'function') {
    ;(attrs.onClick as (event: MouseEvent) => void)(event)
  }
  // Always emit the click event from BaseButton itself
  emit('click', event)
}

const nonClickAttrs = computed(() => {
  const { onClick, ...rest } = attrs
  return rest
})

const isExternalLink = computed(() => !!props.href && !props.to)
const componentTag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button' // Default to button if no link provided
})

const baseClasses =
  'inline-flex items-center justify-center px-5 py-2.5 text-body-16 font-medium rounded-xl border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out cursor-pointer'

const buttonClasses = computed(() => {
  let variantClasses = ''
  switch (props.variant) {
    case 'primary':
      variantClasses =
        'bg-primary text-primary-foreground hover:brightness-90 border-transparent focus:ring-primary'
      break
    case 'secondary':
      variantClasses =
        'bg-secondary text-secondary-foreground hover:bg-neutral-900 hover:text-neutral-50 border-transparent focus:ring-secondary'
      break
    case 'tertiary':
      variantClasses =
        'bg-neutral-50 text-neutral-900 hover:bg-neutral-100 border-transparent focus:ring-neutral-300'
      break
    case 'border':
      variantClasses =
        'bg-transparent hover:bg-neutral-100 border-neutral-900 text-neutral-900 focus:ring-neutral-900'
      break
    case 'dark-pill':
      variantClasses =
        'bg-black text-white hover:bg-gray-800 border-transparent focus:ring-black rounded-full px-8 py-3' // Specific padding for pill shape
      break
    default: // Should not happen due to validator, but good practice
      variantClasses =
        'bg-primary text-primary-foreground hover:brightness-90 border-transparent focus:ring-primary'
      break
  }
  return `${baseClasses} ${variantClasses}`
})
</script>

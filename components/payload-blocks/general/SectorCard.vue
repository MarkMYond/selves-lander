<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'
import type { Media } from '../../../src/payload-types'

interface SectorCardProps {
  title: string
  image?: Media | string | null | undefined // Make image optional
  backgroundColor: string // This will be the semantic value like 'sand', 'primary-50'
  href: string
  iconName?: string // Add optional iconName
}

const props = defineProps<SectorCardProps>()

// Get the getMediaUrl function from the composable
const { getMediaUrl } = useMediaUrl()

// Resolve the image URL using the returned function
const imageUrl = computed(() => getMediaUrl(props.image)) // Make imageUrl computed

// Import useIcons composable
const { getIconName } = useIcons()

// Convert icon name to Nuxt Icon format with duotone variant
const iconNameFormatted = computed(() => {
  const iconName = props.iconName
  if (!iconName) return null

  // Use getIconName to format with duotone variant
  return getIconName(iconName.toLowerCase(), 'duotone')
})

// Computed property to map semantic color names to Tailwind CSS classes
const mappedBackgroundColorClass = computed(() => {
  // Note: Ensure these Tailwind classes are defined in your project
  // This is an example mapping; adjust Tailwind classes as per your project's design system.
  switch (
    props.backgroundColor?.toLowerCase() // Use optional chaining and toLowerCase for robustness
  ) {
    case 'white':
      return 'bg-white'
    case 'default':
      return 'bg-white' // Default card background
    case 'default-gradient':
      return 'bg-gradient-to-br from-gray-100 to-gray-200' // Placeholder gradient
    case 'primary-25':
      return 'bg-brand-primary-25' // Assuming brand-primary-XX classes exist
    case 'primary-50':
      return 'bg-brand-primary-50'
    case 'primary-100':
      return 'bg-brand-primary-100'
    case 'primary-200':
      return 'bg-brand-primary-200'
    case 'primary-300':
      return 'bg-brand-primary-300'
    case 'primary-400':
      return 'bg-brand-primary-400'
    case 'primary-500':
      return 'bg-brand-primary-500'
    case 'primary-600':
      return 'bg-brand-primary-600'
    case 'primary-700':
      return 'bg-brand-primary-700'
    case 'primary-800':
      return 'bg-brand-primary-800'
    case 'primary-900':
      return 'bg-brand-primary-900' // This could be text-white if the bg is very dark
    case 'primary-950':
      return 'bg-brand-primary-950' // This could be text-white
    case 'sand':
      return 'bg-sand' // Assuming 'bg-sand' is a custom color in Tailwind config
    case 'pink-light':
      return 'bg-pink-100'
    case 'coral-light':
      return 'bg-red-200' // Coral is often reddish/orange/pink
    case 'pink-mid':
      return 'bg-pink-300'
    case 'purple-light':
      return 'bg-purple-200'
    case 'blue-light':
      return 'bg-blue-200'
    case 'aqua-light':
      return 'bg-cyan-200'
    case 'green-light':
      return 'bg-green-200'
    case 'light-green':
      return 'bg-lime-200'
    case 'grass-light':
      return 'bg-emerald-200'
    case 'light-grey':
      return 'bg-brand-50' // Changed bg-gray-100 to bg-brand-50
    case 'navy-dark':
      return 'bg-navy-700' // Assuming 'bg-navy-700' or similar exists
    default:
      // If a value is passed but doesn't match, and it starts with 'bg-', assume it's a direct Tailwind class
      if (props.backgroundColor && props.backgroundColor.startsWith('bg-')) {
        return props.backgroundColor
      }
      return 'bg-white' // Fallback for unmatched or empty values
  }
})
</script>

<template>
  <NuxtLink :to="href" class="cursor-pointer">
    <!-- Apply border, rounding, flex, and background here -->
    <div
      :class="mappedBackgroundColorClass"
      class="overflow-hidden h-full transition-transform duration-[0.2s] hover:scale-[1.02] rounded-2xl border-[3px] border-solid border-brand-primary flex flex-col p-8"
    >
      <!-- Icon or Image container -->
      <div class="flex flex-grow justify-center items-center">
        <!-- Adjusted min-height -->
        <Icon
          v-if="iconNameFormatted"
          :name="iconNameFormatted"
          size="80"
          class="w-10 h-10 md:w-20 md:h-20 text-brand-primary"
        />
        <img
          v-else-if="imageUrl"
          :alt="title || 'Sector visual'"
          decoding="async"
          :src="imageUrl"
          class="max-w-full max-h-full object-contain h-auto w-auto"
        />
        <!-- Optional: Placeholder if neither icon nor image -->
        <div v-else class="text-gray-500 text-sm">Visual not available</div>
      </div>

      <!-- Text container with padding -->
      <div class="flex flex-col pt-4">
        <h3
          class="text-brand-900 dark:text-brand-100 text-2xl leading-8 max-sm:text-lg max-sm:leading-7 text-center font-semibold"
        >
          {{ title }}
        </h3>
      </div>
    </div>
  </NuxtLink>
</template>

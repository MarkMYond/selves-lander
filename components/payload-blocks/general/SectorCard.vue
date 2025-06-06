<script setup lang="ts">
import { computed } from 'vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'
import type { Media } from '../../../src/payload-types'

interface SectorCardProps {
  title: string
  image?: Media | string | null | undefined
  backgroundColor: string
  href: string
  iconName?: string
}

const props = defineProps<SectorCardProps>()

const { getMediaUrl } = useMediaUrl()

const imageUrl = computed(() => getMediaUrl(props.image))

const { getIconName } = useIcons()

const iconNameFormatted = computed(() => {
  const iconName = props.iconName
  if (!iconName) return null

  return getIconName(iconName.toLowerCase(), 'duotone')
})

const mappedBackgroundColorClass = computed(() => {
  switch (
    props.backgroundColor?.toLowerCase()
  ) {
    case 'white':
      return 'bg-white'
    case 'default':
      return 'bg-white'
    case 'default-gradient':
      return 'bg-gradient-to-br from-gray-100 to-gray-200'
    case 'primary-25':
      return 'bg-brand-primary-25'
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
      return 'bg-brand-primary-900'
    case 'primary-950':
      return 'bg-brand-primary-950'
    case 'sand':
      return 'bg-sand'
    case 'pink-light':
      return 'bg-pink-100'
    case 'coral-light':
      return 'bg-red-200'
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
      return 'bg-brand-50'
    case 'navy-dark':
      return 'bg-navy-700'
    default:
      if (props.backgroundColor && props.backgroundColor.startsWith('bg-')) {
        return props.backgroundColor
      }
      return 'bg-white'
  }
})
</script>

<template>
  <NuxtLink
    :to="href"
    class="cursor-pointer"
  >
    <div
      :class="mappedBackgroundColorClass"
      class="overflow-hidden h-full transition-transform duration-&lsqb;0.2s&rsqb; hover:scale-[1.02] rounded-2xl border-[3px] border-solid border-brand-primary flex flex-col p-8"
    >
      <div class="flex flex-grow justify-center items-center">
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
        >
        <div
          v-else
          class="text-gray-500 text-sm"
        >
          Visual not available
        </div>
      </div>

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

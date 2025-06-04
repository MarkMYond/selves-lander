<script setup lang="ts">
interface TemplateCardProps {
  href: string
  imageUrl?: string | null // Made imageUrl optional
  imageAlt?: string
  title: string
  category?: string | null
  backgroundColor?: string
  hasBorder?: boolean
  iconName?: string | null // Added iconName prop
}

const props = defineProps<TemplateCardProps>()

// Helper to check if a URL is external (starts with http:// or https:// or //)
const isExternalUrl = (url: string): boolean => {
  return /^(https?:)?\/\//.test(url)
}

// Import useIcons composable
const { getIconName } = useIcons()

// Convert icon name to Nuxt Icon format with duotone variant
const iconNameFormatted = computed(() => {
  const iconName = props.iconName
  if (!iconName) return null

  // Use getIconName to format with duotone variant
  return getIconName(iconName.toLowerCase(), 'duotone')
})
</script>

<template>
  <!-- Use NuxtLink for internal URLs, regular anchor for external -->
  <NuxtLink
    v-if="!isExternalUrl(href)"
    :to="href"
    :class="[
      'relative flex flex-col justify-center p-4 md:p-6 rounded-2xl transition-shadow cursor-pointer duration-[0.2s] z-[2] max-sm:shrink-0 max-sm:w-60 max-sm:transition-none max-sm:duration-0',
      imageUrl ? 'aspect-[3/4]' : 'min-h-[150px] md:min-h-[200px]',
      backgroundColor || 'bg-white',
      hasBorder ? 'border-[3px] border-solid border-brand-primary' : '',
    ]"
  >
    <!-- Image Area: Only render if imageUrl is present -->
    <div
      v-if="imageUrl"
      class="flex-grow mb-4 flex items-center justify-center"
    >
      <img
        :alt="imageAlt || title || 'Template visual'"
        :src="imageUrl"
        class="inline-block w-full max-w-full h-auto max-h-48 object-contain align-middle select-none"
      />
    </div>

    <!-- Bottom section with Icon + Text -->
    <div
      class="pt-4 flex flex-row items-start"
      :class="{ 'mt-auto': imageUrl }"
    >
      <!-- Icon Column -->
      <div v-if="iconNameFormatted" class="mr-4 flex-shrink-0">
        <Icon :name="iconNameFormatted" size="40" class="text-brand-primary" />
      </div>
      <!-- Text Column (Title & Category) -->
      <div class="flex flex-col flex-grow">
        <div class="mb-1 cursor-pointer">
          <p
            class="text-brand-900 dark:text-brand-100 text-2xl leading-8 cursor-pointer"
          >
            {{ title }}
          </p>
        </div>
        <p
          v-if="category"
          class="text-base leading-relaxed uppercase cursor-pointer text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ category }}
        </p>
      </div>
    </div>
  </NuxtLink>

  <!-- External link version -->
  <a
    v-else
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="[
      'relative flex flex-col justify-center p-4 md:p-6 rounded-2xl transition-shadow cursor-pointer duration-[0.2s] z-[2] max-sm:shrink-0 max-sm:w-60 max-sm:transition-none max-sm:duration-0',
      imageUrl ? 'aspect-[3/4]' : 'min-h-[150px] md:min-h-[200px]',
      backgroundColor || 'bg-white',
      hasBorder ? 'border-[3px] border-solid border-brand-primary' : '',
    ]"
  >
    <!-- Image Area: Only render if imageUrl is present -->
    <div
      v-if="imageUrl"
      class="flex-grow mb-4 flex items-center justify-center"
    >
      <img
        :alt="imageAlt || title || 'Template visual'"
        :src="imageUrl"
        class="inline-block w-full max-w-full h-auto max-h-48 object-contain align-middle select-none"
      />
    </div>

    <!-- Bottom section with Icon + Text -->
    <div
      class="pt-4 flex flex-row items-start"
      :class="{ 'mt-auto': imageUrl }"
    >
      <!-- Icon Column -->
      <div v-if="iconNameFormatted" class="mr-4 flex-shrink-0">
        <Icon :name="iconNameFormatted" size="40" class="text-brand-primary" />
      </div>
      <!-- Text Column (Title & Category) -->
      <div class="flex flex-col flex-grow">
        <div class="mb-1 cursor-pointer">
          <p
            class="text-brand-900 dark:text-brand-100 text-2xl leading-8 cursor-pointer"
          >
            {{ title }}
          </p>
        </div>
        <p
          v-if="category"
          class="text-base leading-relaxed uppercase cursor-pointer text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ category }}
        </p>
      </div>
    </div>
  </a>
</template>

<template>
  <section
    ref="sectionRef"
    class="hero-blog-card-section block-section-padding"
    :data-w-id="
      props.block?.animationId || '504b0f0e-891f-785a-1291-8c4be535afcc'
    "
    style="opacity: 0"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div
          class="hero-blog-card flex flex-col md:flex-row md:justify-between p-6 md:p-8 bg-brandNeutral-02 rounded-xl shadow-lg"
        >
          <div
            class="blog-left-block md:w-2/5 flex flex-col justify-between space-y-6 mb-8 md:mb-0"
          >
            <div class="hero-blog-category-content space-y-4">
              <div
                v-if="props.block?.categoryText"
                class="blog-category inline-block"
              >
                <p
                  class="text-body-14 font-medium bg-brandTheme-02 text-brandNeutral-04 px-3 py-1 rounded-full"
                >
                  {{ props.block.categoryText }}
                </p>
              </div>
              <div class="hero-blog-content space-y-3">
                <NuxtLink
                  v-if="props.block?.title && isLinkValid"
                  :to="getLinkUrl(props.block.link)"
                  :target="props.block.link?.newTab ? '_blank' : undefined"
                  class="w-inline-block group"
                >
                  <h2
                    class="blog-card-title-large text-h3 md:text-h2 font-bold text-brandNeutral-04 group-hover:text-brandTheme-01 transition-colors leading-[1.1]"
                  >
                    {{ props.block.title }}
                  </h2>
                </NuxtLink>
                <h2
                  v-else-if="props.block?.title"
                  class="blog-card-title-large text-h3 md:text-h2 font-bold text-brandNeutral-04 leading-[1.1]"
                >
                  {{ props.block.title }}
                </h2>
                <p
                  v-if="props.block?.excerpt"
                  class="blog-excerpt text-brandNeutral-03 text-body-16 lg:text-body-18"
                >
                  {{ props.block.excerpt }}
                </p>
              </div>
            </div>
            <BaseButton
              v-if="isButtonDataValid"
              :to="getLinkUrl(props.block.link)"
              :target="props.block.link?.newTab ? '_blank' : undefined"
              class="mt-4 md:self-start bg-brandNeutral-04 text-brandNeutral-01 hover:bg-opacity-90"
            >
              {{ props.block.buttonText }}
            </BaseButton>
          </div>
          <NuxtLink
            v-if="
              props.block?.image &&
                typeof props.block.image === 'object' &&
                props.block.image.url &&
                isLinkValid
            "
            :to="getLinkUrl(props.block.link)"
            :target="props.block.link?.newTab ? '_blank' : undefined"
            class="blog-right-block md:w-2/5 w-inline-block group"
          >
            <img
              :src="getMediaUrl(props.block.image)"
              loading="lazy"
              :alt="
                props.block.image.alt || props.block.title || 'Blog post image'
              "
              class="blog-card-image w-full h-auto object-cover rounded-lg shadow-md group-hover:opacity-90 transition-opacity"
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType, computed } from 'vue'
import { useScrollAnimations } from '@/composables/useScrollAnimations'
import { useMediaUrl } from '@/composables/useMediaUrl'
import type { HeroBlogCardBlock, Media, WebPage } from '@/src/payload-types'
import BaseButton from '@/components/ui/BaseButton.vue'

interface LinkData {
  type?: 'internal' | 'external' | null
  label?: string | null
  internalLink?: string | WebPage | null
  externalLink?: string | null
  newTab?: boolean | null
}

const props = defineProps({
  block: {
    type: Object as PropType<HeroBlogCardBlock>,
    required: true,
  },
})

const { getMediaUrl } = useMediaUrl()
const { registerElement } = useScrollAnimations()
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (sectionRef.value) {
    const id = sectionRef.value.getAttribute('data-w-id')
    if (id) registerElement(id, sectionRef.value)
  }
})

const isLinkValid = computed(() => {
  const details = props.block.link
  if (!details || !details.type) return false
  if (details.type === 'internal' && details.internalLink) return true
  if (details.type === 'external' && details.externalLink) return true
  return false
})

const isButtonDataValid = computed(() => {
  return props.block.buttonText && isLinkValid.value
})

const getLinkUrl = (linkData?: LinkData | null): string => {
  if (!linkData) return '#'
  if (linkData.type === 'internal' && linkData.internalLink) {
    const internalValue = linkData.internalLink
    if (
      typeof internalValue === 'object' &&
      internalValue !== null &&
      'slug' in internalValue &&
      typeof (internalValue as WebPage).slug === 'string'
    ) {
      return `/${(internalValue as WebPage).slug}`
    }
    if (typeof internalValue === 'string') {
      return internalValue.startsWith('/') ? internalValue : `/${internalValue}`
    }
  }
  if (linkData.type === 'external' && linkData.externalLink) {
    return linkData.externalLink
  }
  return '#'
}
</script>

<style scoped>
</style>

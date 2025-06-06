<template>
  <section class="hero-background-pattern">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        ref="heroWrapperRef"
        data-w-id="cf4bb090-9bc9-05d3-4165-d605cde8167b"
        style="opacity: 0"
        class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
      >
        <div class="lg:w-1/2 space-y-8 text-left">
          <div class="space-y-6">
            <div
              v-if="props.block?.eyebrowText"
              class="flex justify-start"
            >
              <p
                class="text-body-14 font-medium text-brandNeutral-04 bg-brandTheme-02 rounded-full inline-block px-3 py-1"
              >
                {{ props.block.eyebrowText }}
              </p>
            </div>
            <h1
              class="text-5xl md:text-display-h1 font-bold tracking-custom-tightest text-brandNeutral-04 leading-1"
              v-html="
                props.block?.heading || 'Transform the way your team works<br>'
              "
            />
            <div class="max-w-xl">
              <p
                class="text-body-18 md:text-body-20 leading-1.7 text-brandNeutral-03"
              >
                {{
                  props.block?.subheading ||
                    'Streamline your workflow, manage projects, and empower your team with task management solution.'
                }}
              </p>
            </div>
          </div>
          <div class="flex flex-row items-center justify-start gap-4">
            <BaseButton
              v-if="props.block?.buttons && props.block.buttons[0]"
              v-bind="resolveLinkProps(props.block.buttons[0])"
              :variant="props.block.buttons[0].variant || 'primary'"
            >
              {{ props.block?.buttons?.[0]?.label || 'Book a Demo' }}
            </BaseButton>
            <BaseButton
              v-if="props.block?.buttons && props.block.buttons[1]"
              v-bind="resolveLinkProps(props.block.buttons[1])"
              :variant="props.block.buttons[1].variant || 'secondary'"
            >
              {{ props.block?.buttons?.[1]?.label || 'Get in Touch' }}
            </BaseButton>
          </div>
        </div>
        <div class="lg:w-1/2 mt-10 lg:mt-0">
          <div
            v-if="props.block?.heroImage"
            class="transform transition-transform duration-500 hover:scale-105"
          >
            <img
              :src="
                mediaHelpers.getMediaUrl(props.block.heroImage) ||
                  '/webflow-assets/images/hero-card-2.1.png'
              "
              loading="lazy"
              :alt="getImageAlt(props.block.heroImage) || 'Hero Image'"
              class="w-3/4 mx-auto lg:w-full h-auto object-cover rounded-xl shadow-lg"
            >
          </div>
          <div
            v-else
            class="w-full h-auto bg-brandNeutral-02 rounded-xl shadow-lg flex items-center justify-center aspect-[4/3]"
          >
            <p class="text-brandNeutral-03">
              Hero image placeholder
            </p>
          </div>

          <div
            v-if="props.block?.arrowButtonText"
            class="mt-6 flex justify-end"
          >
            <div
              class="inline-flex items-center p-3 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:brightness-90 transition-colors duration-150 ease-in-out"
            >
              <div class="mr-2">
                <p class="text-body-14 font-medium">
                  {{ props.block?.arrowButtonText }}
                </p>
              </div>
              <img
                src="~/assets/images/shape-1.svg"
                loading="lazy"
                alt="Arrow Shape"
                class="h-5 w-5"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type PropType } from 'vue'
import { useScrollAnimations } from '@/composables/useScrollAnimations'
import { useHeroAnimations } from '@/composables/useHeroAnimations'
import { useMediaUrl } from '@/composables/useMediaUrl'
import { useLinkResolver } from '@/composables/useLinkResolver' // Import the new composable
import type { HeroSection02Payload, Media, WebPage } from '@/src/payload-types'
import BaseButton from '@/components/ui/BaseButton.vue'

const { resolveLinkProps } = useLinkResolver(); // Instantiate the composable

const props = defineProps({
  block: {
    type: Object as PropType<HeroSection02Payload>,
    required: true,
  },
})

const mediaHelpers = useMediaUrl()

const getImageAlt = (
  imageField: string | Media | null | undefined
): string | undefined => {
  if (imageField && typeof imageField === 'object' && imageField?.alt) {
    return imageField.alt
  }
  return undefined
}

const { registerElement: registerScrollElement } = useScrollAnimations()
const { initializeHeroAnimations } = useHeroAnimations()

const heroWrapperRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (heroWrapperRef.value) {
    const id = heroWrapperRef.value.getAttribute('data-w-id')
    if (id) {
      registerScrollElement(id, heroWrapperRef.value)
    }
  }
  initializeHeroAnimations()
})
</script>

<style scoped>
.hero-background-pattern {
  position: relative;
  top: -5.625rem;
  background-image: url('~/assets/images/pattern-shape2.png');
  background-position: 0% 0%;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 145px;
  padding-bottom: 56px;
  overflow: hidden;
  margin-bottom: -5.625rem;
}
</style>

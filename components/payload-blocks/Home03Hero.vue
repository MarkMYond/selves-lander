<template>
  <section class="">
    <div class="container mx-auto px-[30px] max-w-[1500px]">
      <div
        class="relative z-10 flex flex-col gap-20 bg-[#f8f4f1] bg-[url('/webflow-assets/images/pattern-hero3.png')] bg-center bg-no-repeat bg-cover rounded-tl-[24px] rounded-tr-[24px] max-w-[1360px] mx-auto pt-10 px-10"
      >
        <div
          class="flex flex-col items-center gap-6 text-center max-w-[934px] mx-auto"
        >
          <div class="flex flex-col items-center gap-4 mx-auto">
            <div
              v-if="block.taglinePrefix || block.taglineSuffix"
              class="flex items-center gap-2 p-[4px_20px_4px_8px] bg-white rounded-full"
            >
              <div
                v-if="block.taglinePrefix"
                class="bg-[#c9ff85] text-[#454140] px-4 py-0.5 rounded-full text-sm font-medium"
              >
                <p>{{ block.taglinePrefix }}</p>
              </div>
              <p
                v-if="block.taglineSuffix"
                class="text-base font-medium text-[#120a0b] leading-[1.7]"
              >
                {{ block.taglineSuffix }}
              </p>
            </div>
            <h1
              class="text-[72px] font-bold text-[#120a0b] leading-[1.15] tracking-[-0.02em] mb-0"
            >
              <span v-html="block.headline" />
            </h1>
            <div
              v-if="block.subheadline"
              class="max-w-[650px] mx-auto"
            >
              <p class="text-xl text-[#454140] leading-[1.7]">
                {{ block.subheadline }}
              </p>
            </div>
          </div>
          <div class="w-full max-w-[521px] mx-auto">
            <form
              class="flex flex-col sm:flex-row gap-4 w-full"
              @submit.prevent="handleSubmit"
            >
              <input
                v-model="email"
                class="block w-full h-14 px-6 py-3 font-medium text-[#120a0b] bg-white border-0 rounded-full placeholder:text-[#120a0b] placeholder:text-base focus:ring-2 focus:ring-indigo-500"
                maxlength="256"
                name="Email-Address"
                :placeholder="block.formPlaceholder || 'Enter your email'"
                type="email"
                required
              >
              <button
                type="submit"
                class="w-full sm:w-auto flex-shrink-0 h-14 px-[30px] py-3 border border-transparent rounded-full shadow-sm text-base font-bold text-[#120a0b] bg-[#ffd86f] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffd86f]"
              >
                {{ block.formButtonText || 'Get Started for free' }}
              </button>
            </form>
          </div>
        </div>

        <div
          class="relative z-10 flex items-center justify-between w-full gap-6 mx-auto"
        >
          <div class="flex flex-col w-1/4 gap-3.5">
            <div
              v-if="getImageUrl(block.imageTopLeft)"
              class="w-full"
            >
              <img
                :src="getImageUrl(block.imageTopLeft)"
                :alt="getImageAlt(block.imageTopLeft) || 'Hero image'"
                class="rounded-[24px] shadow-[0_4px_10px_rgba(240,227,220,0.5)] object-cover w-full h-auto"
              >
            </div>
            <div
              v-if="getImageUrl(block.imageTopRight)"
              class="w-full p-1 bg-[#f2e9e4] border-2 border-dashed border-[#e7d5cb] rounded-xl"
            >
              <img
                :src="getImageUrl(block.imageTopRight)"
                :alt="getImageAlt(block.imageTopRight) || 'Hero image'"
                class="rounded-[24px] shadow-[0_4px_10px_rgba(240,227,220,0.5)] object-cover w-full h-auto -rotate-[5.04deg]"
              >
            </div>
          </div>
          <div
            v-if="getImageUrl(block.imageCenter)"
            class="w-[46%]"
          >
            <img
              :src="getImageUrl(block.imageCenter)"
              :alt="getImageAlt(block.imageCenter) || 'Hero image'"
              class="rounded-t-[24px] rounded-b-none shadow-none object-cover w-full aspect-[4/3]"
            >
          </div>
          <div
            v-if="getImageUrl(block.imageBottom)"
            class="w-1/4"
          >
            <img
              :src="getImageUrl(block.imageBottom)"
              :alt="getImageAlt(block.imageBottom) || 'Hero image'"
              class="rounded-[24px] shadow-[0_4px_10px_rgba(240,227,220,0.5)] object-cover w-full h-auto"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMediaUrl } from '@/composables/useMediaUrl'
import type { Media } from '@/src/payload-types'

interface Home03HeroBlock {
  blockType: 'home03Hero'
  taglinePrefix?: string
  taglineSuffix?: string
  headline: string
  subheadline?: string
  formPlaceholder?: string
  formButtonText?: string
  imageTopLeft?: Media | string
  imageTopRight?: Media | string
  imageCenter?: Media | string
  imageBottom?: Media | string
}

const props = defineProps<{
  block: Home03HeroBlock
}>()

const email = ref('')
const { getMediaUrl } = useMediaUrl()

const handleSubmit = () => {
  if (email.value) {
    console.log('Form submitted with email:', email.value)
    alert(`Thank you! Your email ${email.value} has been received (simulated).`)
    email.value = ''
  }
}

const getImageUrl = (image: Media | string | undefined): string => {
  return getMediaUrl(image)
}

const getImageAlt = (image: Media | string | undefined): string => {
  if (!image) return ''
  if (typeof image === 'object' && image.alt) {
    return image.alt
  }
  return ''
}
</script>

<style scoped>
</style>

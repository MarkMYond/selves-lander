<template>
  <div>
    <section
      v-if="ctaEnabled"
      class="cta-section relative z-10 py-6 sm:py-8 lg:py-10"
    >
      <div
        class="w-layout-blockcontainer container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div class="max-w-4xl mx-auto">
          <div
            class="cta-wrapper bg-[#FCFAF9] rounded-xl pt-12 pb-12 pl-12 pr-0 md:py-16 md:pl-9 lg:py-18 lg:pl-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-xl"
          >
            <div
              class="cta-left-block w-full md:w-3/5 lg:w-1/2 text-left mb-10 md:mb-0 flex flex-col items-start gap-6 md:gap-8"
            >
              <SectionHeader
                v-if="ctaTitle"
                :eyebrow-text="ctaPreTitle"
                :eyebrow-background-color="
                  getEyebrowBgClass(ctaEyebrowBackgroundColor)
                "
                :title="ctaTitle"
                :subtitle="ctaDescription"
                class="w-full"
              />
              <div
                v-if="ctaButtonText && ctaButtonLink"
                class="cta-button"
              >
                <BaseButton
                  :href="ctaButtonLink"
                  variant="primary"
                >
                  {{ ctaButtonText }}
                </BaseButton>
              </div>
            </div>
            <div
              v-if="ctaImage && ctaImage.url"
              class="cta-right-block hidden md:flex md:w-2/5 lg:w-1/2 justify-center items-center mt-8 md:mt-0"
            >
              <img
                :src="getMediaUrl(ctaImage.url)"
                :alt="ctaImage.alt || 'CTA Decorative Image'"
                class="rounded-xl shadow-lg max-h-72 sm:max-h-80 lg:max-h-96 object-contain"
              >
            </div>
            <div
              class="cta-shape absolute top-0 bottom-0 right-[-110px] w-[70%] bg-no-repeat bg-contain hidden lg:block"
              style="
                background-image: url('/webflow-assets/images/cta-shape.svg');
                z-index: -1;
              "
            />
          </div>
        </div>
      </div>
      <div
        class="cta-bg absolute bottom-0 left-0 right-0 h-[38%] bg-brandNeutral-04 -z-10"
      />
    </section>

    <footer
      class="footer-section _2 bg-brandNeutral-04 text-brandNeutral-02 pt-8 lg:pt-10 pb-[64px]"
    >
      <div
        class="w-layout-blockcontainer container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div class="footer-wrapper flex flex-col gap-[48px] md:gap-[56px]">
          <div
            class="footer-top-block grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-x-8"
          >
            <div
              class="footer-left-block lg:col-span-4 flex flex-col gap-6 lg:pr-20"
            >
              <NuxtLink
                to="/"
                class="navbar-brand-footer inline-block"
              >
                <img
                  v-if="logo && logo.url"
                  :src="getMediaUrl(logo.url)"
                  :alt="logo.alt || 'TaskHub Logo'"
                  class="footer-logo h-9"
                >
                <svg
                  v-else
                  width="120"
                  height="36"
                  viewBox="0 0 303 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-9 w-auto text-white"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.482267 20.68C18.0131 41.1066 37.5109 44.8134 59.5396 27C68.1172 19.4134 110.44 -23.2 151.077 18.1466C178.489 -9.08003 208.593 -3.98659 240.505 22.7867C252.597 32.4801 272.283 53.5734 302.092 21.5201C299.703 65.1067 261.879 95.6133 205.072 87.7466C182.205 84.0133 164.944 71.2266 151.499 55.68C123.911 84.5733 104.704 95.84 53.2125 85.2133C18.3369 74.0933 3.0188 54 0.482267 20.68Z"
                    fill="currentColor"
                  />
                </svg>
              </NuxtLink>
              <p
                v-if="tagline"
                class="text-brandNeutral-02 opacity-70 text-body-18 leading-1.7"
              >
                {{ tagline }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-4">
              <div
                v-for="(column, index) in footerColumns.slice(0, 2)"
                :key="`col-${column.id || index}`"
                class="footer-widget flex flex-col gap-4"
              >
                <p
                  class="footer-widget-title text-brandNeutral-01 text-body-18 font-medium capitalize"
                >
                  {{ column.title }}
                </p>
                <div class="footer-widget-list flex flex-col gap-3">
                  <NuxtLink
                    v-for="(link, linkIndex) in column.links"
                    :key="link.id || linkIndex"
                    :to="link.url"
                    class="footer-link text-brandNeutral-02 opacity-70 hover:opacity-100 hover:text-brandTheme-01 text-body-18 font-normal capitalize transition-all duration-300"
                  >
                    {{ link.text }}
                  </NuxtLink>
                </div>
              </div>
            </div>

            <div
              class="footer-widget lg:col-span-4 lg:pl-20 md:col-span-2 lg:col-start-auto md:col-start-1"
            >
              <p
                v-if="newsletterTitle"
                class="footer-widget-title text-brandNeutral-01 text-body-18 font-medium mb-4"
              >
                {{ newsletterTitle }}
              </p>
              <div class="w-form">
                <form
                  class="footer-form flex rounded-full bg-brandNeutral-04 border border-brandNeutral-03 focus-within:ring-2 focus-within:ring-brandTheme-02 focus-within:border-brandTheme-02 transition-all duration-300 overflow-hidden"
                  @submit.prevent="handleSubscribe"
                >
                  <input
                    v-model="emailForSubscription"
                    type="email"
                    :placeholder="subscribePlaceholder || 'Enter your email'"
                    class="footer-text-field flex-grow px-4 py-3 text-body-14 text-brandNeutral-02 placeholder:text-brandNeutral-02 placeholder:opacity-50 bg-transparent border-0 focus:outline-none"
                    required
                  >
                  <BaseButton
                    type="submit"
                    variant="secondary"
                    class="!rounded-l-none !rounded-r-full !border-l-0 !py-3 !px-6"
                  >
                    Subscribe
                  </BaseButton>
                </form>
              </div>
            </div>
          </div>

          <div
            class="footer-bottom-block border-t border-brandNeutral-03 border-opacity-30 pt-6 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <div
              v-if="directCopyrightHtml"
              class="copyright text-brandNeutral-02 opacity-60 text-body-14 font-medium"
              v-html="directCopyrightHtml"
            />
            <p
              v-else
              class="copyright text-brandNeutral-02 opacity-60 text-body-14 font-medium"
            >
              &copy; {{ new Date().getFullYear() }} TaskHub, Inc. All rights
              reserved.
            </p>
            <div class="social-icons flex space-x-[18px]">
              <a
                v-for="(social, index) in socialLinks"
                :key="`soc-${social.id || index}`"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link text-brandNeutral-01 hover:text-brandTheme-01 transition-colors w-[15px] h-[15px] flex justify-center items-center"
              >
                <Icon
                  v-if="social.iconName"
                  :name="`ph:${social.iconName}`"
                  class="footer-icon text-lg"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// import type { Ref } from 'vue'; // Ref import might be removed if not used elsewhere
import { useRuntimeConfig } from 'nuxt/app'
// RichTextRenderer and RichTextRoot removed as copyright will be direct HTML
import { useMediaUrl } from '../composables/useMediaUrl'
import type {
  Footer as FooterType,
  Media as MediaType,
} from '../src/payload-types'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue' // Import SectionHeader

const { getMediaUrl } = useMediaUrl()
const emailForSubscription = ref('')

const handleSubscribe = () => {
  console.log('Subscribing with email:', emailForSubscription.value)
  emailForSubscription.value = ''
}

const config = useRuntimeConfig()
const payloadApiFullUrl = config.public.payloadApiFullUrl as string
const footerEndpointPath = 'globals/footer?depth=2'

const { data: footerData } = await useAsyncData<FooterType | null>(
  'footer-global-data',
  async () => {
    if (!payloadApiFullUrl) {
      console.error('Footer: Payload API URL is not configured.')
      return null
    }
    try {
      return await $fetch(footerEndpointPath, { baseURL: payloadApiFullUrl })
    } catch (e) {
      console.error('Failed to fetch footer data from Payload:', e)
      if (payloadApiFullUrl.includes('localhost:3333')) {
        console.warn(
          'Footer fetch attempt was made to localhost:3333. Check NUXT_PUBLIC_PAYLOAD_API_URL.'
        )
      }
      return null
    }
  }
)

// CTA Fields
const ctaEnabled = computed(() => footerData.value?.ctaEnable ?? false)
const ctaPreTitle = computed(() => footerData.value?.ctaPreTitle ?? '')
const ctaTitle = computed(() => footerData.value?.ctaTitle ?? '')
const ctaDescription = computed(() => footerData.value?.ctaDescription ?? '')
const ctaButtonText = computed(() => footerData.value?.ctaButtonText ?? '')
const ctaButtonLink = computed(() => footerData.value?.ctaButtonLink ?? '#')
const ctaImage = computed(
  () => (footerData.value?.ctaImage as MediaType | undefined) ?? null
)
const ctaEyebrowBackgroundColor = computed(
  () => footerData.value?.ctaEyebrowBackgroundColor ?? null
) // Added for SectionHeader

// Existing Footer Fields
const logo = computed(
  () => (footerData.value?.logo as MediaType | undefined) ?? null
)
const tagline = computed(() => footerData.value?.tagline ?? null)
const footerColumns = computed(() => footerData.value?.linkColumns || [])
const newsletterTitle = computed(
  () => footerData.value?.newsletterTitle ?? 'Stay updated'
)
const subscribePlaceholder = computed(
  () => footerData.value?.subscribePlaceholder ?? 'Enter your email'
)
const socialLinks = computed(() => footerData.value?.socialLinks || [])
// Assuming footerData.value.copyright is a direct HTML string or simple text
const directCopyrightHtml = computed(() => {
  const copyrightField = footerData.value?.copyright
  if (typeof copyrightField === 'string') {
    return copyrightField
  }
  // Fallback if copyrightField is not a string (e.g. old RichText object)
  // This part might need adjustment based on how `copyright` is structured if it's not a simple string.
  // For now, if it's an object, we'll assume it might be the old RichText structure and try to access a text property.
  // A more robust solution would be to ensure the CMS field is definitely a string.
  if (
    typeof copyrightField === 'object' &&
    copyrightField !== null &&
    'root' in copyrightField &&
    (copyrightField as any).root?.children?.[0]?.children?.[0]?.text
  ) {
    // Attempt to extract simple text if it's an old RichText structure with a single paragraph and text node.
    // This is a guess and might not cover all cases of old data.
    // Ideally, the CMS field `copyright` should be updated to be a simple text/HTML string field.
    // console.warn("Copyright field appears to be RichText, attempting to extract simple text. Please update CMS field to plain text/HTML for best results.");
    // return (copyrightField as any).root.children[0].children[0].text;
    return '' // Safer to return empty if structure is complex/unknown RichText
  }
  return ''
})

const isExternalUrl = (url: string): boolean => {
  return /^(https?:)?\/\//.test(url)
}

const getEyebrowBgClass = (bgColorValue?: string | null) => {
  // Mapping based on the options defined in Footer.ts (eyebrowBgColorOptions)
  // Ensure this matches the options and desired Tailwind classes.
  switch (bgColorValue) {
    case 'theme-color-01':
    case 'purple':
    case 'purple-light':
      return 'bg-brandTheme-01'
    case 'theme-color-02':
    case 'default': // 'default' from Payload maps to theme-color-02
      return 'bg-brandTheme-02'
    case 'theme-color-03':
    case 'green':
      return 'bg-brandTheme-03'
    case 'theme-color-04':
    case 'yellow':
      return 'bg-brandTheme-04'
    // Add other specific mappings if needed
    default:
      return 'bg-brandTheme-02' // Fallback default if value is unexpected or null
  }
}
</script>

<style scoped>
.footer-form input.footer-text-field:-webkit-autofill,
.footer-form input.footer-text-field:-webkit-autofill:hover,
.footer-form input.footer-text-field:-webkit-autofill:focus,
.footer-form input.footer-text-field:-webkit-autofill:active {
  /* Updated to use a brand neutral color for autofill background if possible, or a generic dark one */
  -webkit-box-shadow: 0 0 0 30px theme('colors.brandNeutral.04') inset !important;
  -webkit-text-fill-color: theme('colors.brandNeutral.02') !important;
  caret-color: theme('colors.brandNeutral.02') !important;
}

.footer-form:focus-within input.footer-text-field {
  border-color: transparent;
}
</style>

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
              v-if="ctaImageUrl"
              class="cta-right-block hidden md:flex md:w-2/5 lg:w-1/2 justify-center items-center mt-8 md:mt-0"
            >
              <img
                :src="ctaImageUrl"
                :alt="ctaImageAlt"
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
        class="cta-bg absolute bottom-0 left-0 right-0 h-[38%] bg-gray-950 -z-10"
      />
    </section>

    <footer
  class="footer-section _2 bg-gray-950 text-white pt-8 lg:pt-10 pb-[64px]"
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
                  src="/white-logo.svg"
                  :alt="siteName + ' Logo'"
                  class="footer-logo h-9"
                >
              </NuxtLink>
              <p
                v-if="tagline"
                class="text-white opacity-70 text-body-18 leading-1.7"
              >
                {{ tagline }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-4">
              <div
                v-for="(column, index) in filteredFooterColumns.slice(0, 2)"
                :key="`col-${column.id || index}`"
                class="footer-widget flex flex-col gap-4"
              >
                <p
                  class="footer-widget-title text-white text-body-18 font-medium capitalize"
                >
                  {{ column.title }}
                </p>
                <div class="footer-widget-list flex flex-col gap-3">
                  <NuxtLink
                    v-for="(link, linkIndex) in column.links"
                    :key="link.id || linkIndex"
                    :to="link.url"
                    class="footer-link text-white opacity-70 hover:opacity-100 hover:text-secondary text-body-18 font-normal capitalize transition-all duration-300"
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
                class="footer-widget-title text-white text-body-18 font-medium mb-4"
              >
                {{ newsletterTitle }}
              </p>
              <div class="w-form">
                <form
                  class="footer-form flex rounded-full bg-gray-800 border border-gray-600 focus-within:ring-2 focus-within:ring-secondary focus-within:border-secondary transition-all duration-300 overflow-hidden"
                  @submit.prevent="handleSubscribe"
                >
                  <input
                    v-model="emailForSubscription"
                    type="email"
                    :placeholder="subscribePlaceholder || 'Enter your email'"
                    class="footer-text-field flex-grow px-4 py-3 text-body-14 text-white placeholder:text-gray-400 placeholder:opacity-70 bg-transparent border-0 focus:outline-none"
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
            class="footer-bottom-block border-t border-gray-600 border-opacity-30 pt-6 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <div
              v-if="directCopyrightHtml"
              class="copyright text-white opacity-60 text-body-14 font-medium"
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
                class="social-link text-white hover:text-secondary transition-colors w-[15px] h-[15px] flex justify-center items-center"
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
import type { Footer as FooterType } from '../src/payload-types'
import { ref, computed } from 'vue'
// import type { Ref } from 'vue'; // Ref import might be removed if not used elsewhere
import { useRuntimeConfig } from 'nuxt/app'
// RichTextRenderer and RichTextRoot removed as copyright will be direct HTML
import { useMediaUrl } from '../composables/useMediaUrl'
// Removed missing type import for FooterType and MediaType
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
const siteName = computed(() => (config.public.siteName as string) || 'Site')
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
const ctaPreTitle = computed(() => (footerData.value as any)?.ctaPreTitle ?? '')
const ctaTitle = computed(() => footerData.value?.ctaTitle ?? '')
const ctaDescription = computed(() => footerData.value?.ctaDescription ?? '')
const ctaButtonText = computed(() => footerData.value?.ctaButtonText ?? '')
const ctaButtonLink = computed(() => footerData.value?.ctaButtonLink ?? '#')
const ctaImage = computed(() => footerData.value?.ctaImage ?? null)
const ctaImageUrl = computed(() => {
  const img = ctaImage.value as any
  if (img && typeof img === 'object' && 'url' in img && img.url) {
    return getMediaUrl(img.url)
  }
  return undefined
})
const ctaImageAlt = computed(() => {
  const img = ctaImage.value as any
  if (img && typeof img === 'object' && 'alt' in img && img.alt) {
    return img.alt as string
  }
  return 'CTA Decorative Image'
})
const ctaEyebrowBackgroundColor = computed(
  () => footerData.value?.ctaEyebrowBackgroundColor ?? null
) // Added for SectionHeader

// Existing Footer Fields
const logo = computed(
  () => footerData.value?.logo ?? null
)
const tagline = computed(() => footerData.value?.tagline ?? null)
const footerColumns = computed(() => Array.isArray(footerData.value?.linkColumns) ? footerData.value.linkColumns : [])

// Remove Contact and Registry links from footer columns
const filteredFooterColumns = computed(() => {
  const cols = footerColumns.value || []
  const isDisallowed = (url?: string) => {
    if (!url) return false
    // Normalize and match common variants
    const u = url.trim()
    return /^\/contact\/?$/i.test(u) || /^\/registry(\/.*)?$/i.test(u)
  }
  return cols.map((col: any) => ({
    ...col,
    links: Array.isArray(col?.links) ? col.links.filter((l: any) => !isDisallowed(l?.url)) : []
  }))
})
const newsletterTitle = computed(
  () => footerData.value?.newsletterTitle ?? 'Stay updated'
)
const subscribePlaceholder = computed(
  () => footerData.value?.subscribePlaceholder ?? 'Enter your email'
)
const socialLinks = computed(() => Array.isArray(footerData.value?.socialLinks) ? footerData.value.socialLinks : [])
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
  -webkit-box-shadow: 0 0 0 30px theme('colors.neutral.100') inset !important;
  -webkit-text-fill-color: theme('colors.neutral.900') !important;
  caret-color: theme('colors.neutral.900') !important;
}

.footer-form:focus-within input.footer-text-field {
  border-color: transparent;
}
</style>

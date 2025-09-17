<template>
  <section class="contact-form-content-section py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
        <div
          class="left-content-column md:w-1/2 space-y-6 flex flex-col justify-center order-2 md:order-2 lg:order-1"
        >
          <template
            v-if="block.contentImage && block.contentImagePosition === 'above'"
          >
            <img
              v-if="
                typeof block.contentImage === 'object' && block.contentImage.url
              "
              :src="getMediaUrl(block.contentImage)"
              :alt="
                block.contentImage.alt || block.contentTitle || 'Content Image'
              "
              class="w-3/5 h-auto object-cover rounded-lg shadow-md mb-6"
            >
          </template>

          <div
            v-if="block.contentEyebrow"
            class="inline-block self-start"
          >
            <p
              class="text-sm font-medium bg-brandTheme-02 text-brandNeutral-04 px-3 py-1 rounded-full"
            >
              {{ block.contentEyebrow }}
            </p>
          </div>
          <h2
            v-if="block.contentTitle"
            class="text-3xl lg:text-4xl font-semibold text-brandNeutral-04"
          >
            {{ block.contentTitle }}
          </h2>
          <div
            v-if="block.contentDescription"
            class="text-brand-gray-50 text-3xl italic leading-snug border-l-4 border-brand-gray-300 pl-6 py-4 max-w-none"
          >
            <p>{{ block.contentDescription }}</p>
          </div>

          <template
            v-if="block.contentImage && block.contentImagePosition === 'below'"
          >
            <img
              v-if="
                typeof block.contentImage === 'object' && block.contentImage.url
              "
              :src="getMediaUrl(block.contentImage)"
              :alt="
                block.contentImage.alt || block.contentTitle || 'Content Image'
              "
              class="w-3/5 h-auto object-cover rounded-lg shadow-md mt-6"
            >
          </template>
        </div>

        <div
          class="right-form-column md:w-1/2 flex order-1 md:order-1 lg:order-2"
        >
          <div
            class="form-card w-full bg-brandNeutral-02 p-8 md:p-10 rounded-xl shadow-xl flex flex-col"
          >
            <h3
              v-if="block.formTitle"
              class="text-xl font-semibold text-brandNeutral-04 mb-6 text-center"
            >
              {{ block.formTitle }}
            </h3>
            <form
              class="space-y-5 flex-grow flex flex-col"
              @submit.prevent="handleSubmit"
            >
              <div v-if="block.showNameField">
                <label
                  for="contact-name"
                  class="block text-base font-medium text-brandNeutral-03 mb-1"
                >Your Name</label>
                <input
                  id="contact-name"
                  v-model="name"
                  type="text"
                  name="contact-name"
                  placeholder="Enter your name"
                  :required="Boolean(block.requireNameField)"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-base"
                >
              </div>
              <div>
                <label
                  for="contact-email"
                  class="block text-base font-medium text-brandNeutral-03 mb-1"
                >Your Email</label>
                <input
                  id="contact-email"
                  v-model="email"
                  type="email"
                  name="contact-email"
                  placeholder="Enter your email"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-base"
                >
              </div>
              <div v-if="block.showCompanyField">
                <label
                  for="contact-company"
                  class="block text-base font-medium text-brandNeutral-03 mb-1"
                >Company</label>
                <input
                  id="contact-company"
                  v-model="company"
                  type="text"
                  name="contact-company"
                  placeholder="Company Name"
                  :required="Boolean(block.requireCompanyField)"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-base"
                >
              </div>
              <div v-if="block.showSubjectField">
                <label
                  for="contact-subject"
                  class="block text-base font-medium text-brandNeutral-03 mb-1"
                >Subject</label>
                <input
                  id="contact-subject"
                  v-model="subject"
                  type="text"
                  name="contact-subject"
                  placeholder="Write your subject"
                  :required="Boolean(block.requireSubjectField)"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-base"
                >
              </div>
              <div
                v-if="block.showMessageField"
                class="flex-grow flex flex-col"
              >
                <label
                  for="contact-message"
                  class="block text-base font-medium text-brandNeutral-03 mb-1"
                >{{ block.messageFieldLabel || 'Your Message' }}</label>
                <textarea
                  id="contact-message"
                  v-model="message"
                  name="contact-message"
                  rows="4"
                  placeholder="Write your message..."
                  :required="Boolean(block.requireMessageField)"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brandTheme-01 focus:border-brandTheme-01 sm:text-base flex-grow"
                />
              </div>

              <div
                v-if="block.link && block.link.type"
                class="pt-1"
              >
                <label class="flex items-center">
                  <input
                    id="agree-privacy-contact"
                    v-model="agreePrivacy"
                    name="agree-privacy-contact"
                    type="checkbox"
                    :required="Boolean(block.link && block.link.type)"
                    class="h-4 w-4 text-brandTheme-01 border-gray-300 rounded focus:ring-brandTheme-01"
                  >
                  <span
                    for="agree-privacy-contact"
                    class="ml-2 block text-sm text-brandNeutral-03"
                  >
                    {{
                      block.privacyPolicyText ||
                        'By reaching out to us, you agree to our'
                    }}
                    <NuxtLink
                      :to="getLinkUrl(block.link)"
                      :target="block.link.newTab ? '_blank' : undefined"
                      class="font-medium text-brandTheme-01 hover:text-brandTheme-01/80"
                    >
                      {{ block.link.label || 'Privacy Policy.' }}
                    </NuxtLink>
                  </span>
                </label>
              </div>

              <div
                v-if="submissionMessage"
                class="mt-4 text-sm"
                :class="{
                  'text-green-600': submissionStatus === 'success',
                  'text-red-600': submissionStatus === 'error',
                }"
              >
                {{ submissionMessage }}
              </div>

              <div class="pt-1">
                <BaseButton
                  type="submit"
                  variant="primary"
                  class="w-full flex justify-center items-center"
                  :disabled="submissionStatus === 'loading'"
                >
                  <span v-if="submissionStatus === 'loading'">Sending...</span>
                  <span v-else>{{
                    block.submitButtonText || 'Send Message'
                  }}</span>
                  <svg
                    v-if="submissionStatus !== 'loading'"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5 ml-2"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import type {
  ContactFormBlock as ContactFormBlockType,
  WebPage,
  Media,
} from '@/src/payload-types'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useMediaUrl } from '@/composables/useMediaUrl'

const name = ref('')
const email = ref('')
const company = ref('')
const subject = ref('')
const message = ref('')
const agreePrivacy = ref(false)

const submissionStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const submissionMessage = ref('')

interface LinkData {
  type?: 'internal' | 'external' | null
  label?: string | null
  internalLink?: string | WebPage | null
  externalLink?: string | null
  newTab?: boolean | null
}

const props = defineProps({
  block: {
    type: Object as PropType<ContactFormBlockType>,
    required: true,
  },
})

const { getMediaUrl } = useMediaUrl()

const handleSubmit = async () => {
  if (props.block.link && props.block.link.type && !agreePrivacy.value) {
    submissionStatus.value = 'error'
    submissionMessage.value = 'You must agree to the privacy policy.'
    return
  }

  submissionStatus.value = 'loading'
  submissionMessage.value = ''

  const formData = {
    name: props.block.showNameField ? name.value : undefined,
    email: email.value,
    company: props.block.showCompanyField ? company.value : undefined,
    subject: props.block.showSubjectField ? subject.value : undefined,
    message: props.block.showMessageField ? message.value : undefined,
    recipientEmail: props.block.recipientEmail,
  }

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    if (response.ok) {
      submissionStatus.value = 'success'
      submissionMessage.value = result.message || 'Message sent successfully!'
      name.value = ''
      email.value = ''
      company.value = ''
      subject.value = ''
      message.value = ''
      agreePrivacy.value = false
    } else {
      submissionStatus.value = 'error'
      submissionMessage.value =
        result.message || 'An error occurred. Please try again.'
    }
  } catch (error) {
    console.error('Contact form submission error:', error)
    submissionStatus.value = 'error'
    submissionMessage.value = 'A network error occurred. Please try again.'
  }
}

const getLinkUrl = (linkData?: LinkData | null): string => {
  if (!linkData) return '#'
  if (linkData.type === 'internal' && linkData.internalLink) {
    const internalValue = linkData.internalLink
    if (
      typeof internalValue === 'object' &&
      internalValue !== null &&
      'slug' in internalValue &&
      typeof internalValue.slug === 'string'
    ) {
      return `/${internalValue.slug}`
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

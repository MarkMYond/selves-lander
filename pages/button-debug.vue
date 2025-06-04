<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Button Debug Page</h1>
    
    <div class="space-y-8">
      <!-- Test BaseButton with different configurations -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">BaseButton Test Cases</h2>
        
        <!-- Internal link test -->
        <div class="space-y-2">
          <h3 class="text-lg">Internal Navigation (should work)</h3>
          <BaseButton to="/contact" variant="primary" @click="logClick('internal-contact')">
            Go to Contact (Internal)
          </BaseButton>
        </div>
        
        <!-- External link test -->
        <div class="space-y-2">
          <h3 class="text-lg">External Link (should work)</h3>
          <BaseButton href="https://google.com" target="_blank" variant="secondary" @click="logClick('external-google')">
            Go to Google (External)
          </BaseButton>
        </div>
        
        <!-- Regular button test -->
        <div class="space-y-2">
          <h3 class="text-lg">Button with Click Handler (should work)</h3>
          <BaseButton @click="handleTestClick" variant="tertiary">
            Click Me (Handler)
          </BaseButton>
        </div>
        
        <!-- Test Hero02 button simulation -->
        <div class="space-y-2">
          <h3 class="text-lg">Hero02 Button Simulation</h3>
          <BaseButton
            :to="isInternalLinkTest(testButton) ? getButtonUrlTest(testButton) : undefined"
            :href="!isInternalLinkTest(testButton) ? getButtonUrlTest(testButton) : undefined"
            :target="shouldOpenInNewTabTest(testButton) ? '_blank' : undefined"
            variant="primary"
            @click="logClick('hero02-sim')"
          >
            {{ testButton?.label || 'Test Button' }}
          </BaseButton>
        </div>
      </div>
      
      <!-- Debug info -->
      <div class="mt-8 p-4 bg-gray-100 rounded">
        <h3 class="font-semibold">Debug Info</h3>
        <div class="mt-2 space-y-1">
          <p>Click count: {{ clickCount }}</p>
          <p>Last clicked: {{ lastClicked }}</p>
          <p>Current route: {{ $route.path }}</p>
          <p>Test button data: <code class="bg-gray-200 px-2 py-1 rounded">{{ JSON.stringify(testButton) }}</code></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const clickCount = ref(0)
const lastClicked = ref('')

// Test button data structure similar to Hero02
const testButton = ref({
  label: 'Test Contact Button',
  type: 'internal',
  internalLink: '/contact',
  newTab: false,
  variant: 'primary'
})

const handleTestClick = () => {
  clickCount.value++
  lastClicked.value = 'test-handler'
  console.log('Test button clicked!', clickCount.value)
}

const logClick = (buttonType) => {
  clickCount.value++
  lastClicked.value = buttonType
  console.log(`Button clicked: ${buttonType}`)
}

// Test versions of Hero02 helper functions
const getButtonUrlTest = (button) => {
  if (!button) {
    console.log('getButtonUrlTest: No button provided')
    return '#'
  }

  console.log('getButtonUrlTest: Processing button:', button)

  if (button.internalLink) { 
    console.log('getButtonUrlTest: Found internalLink:', button.internalLink)
    const internalValue = button.internalLink
    if (typeof internalValue === 'object' && internalValue !== null && 'slug' in internalValue) {
      const url = `/${internalValue.slug}`
      console.log('getButtonUrlTest: Internal WebPage object URL:', url)
      return url
    }
    if (typeof internalValue === 'string') {
      const url = internalValue.startsWith('/') ? internalValue : `/${internalValue}`
      console.log('getButtonUrlTest: Internal string URL:', url)
      return url
    }
  }
  
  if (button.externalLink) {
    console.log('getButtonUrlTest: Found externalLink:', button.externalLink)
    return button.externalLink
  }
  
  console.log('getButtonUrlTest: No valid link found, returning #')
  return '#'
}

const isInternalLinkTest = (button) => {
  if (!button) {
    console.log('isInternalLinkTest: No button provided')
    return false
  }
  console.log('isInternalLinkTest: Processing button:', button)
  
  if (button.type) {
    const isInternal = button.type === 'internal'
    console.log('isInternalLinkTest: Using type field:', button.type, 'isInternal:', isInternal)
    return isInternal
  }
  
  const hasInternal = !!button.internalLink
  const hasExternal = !!button.externalLink
  const isInternal = hasInternal && !hasExternal
  console.log('isInternalLinkTest: Fallback logic - hasInternal:', hasInternal, 'hasExternal:', hasExternal, 'isInternal:', isInternal)
  return isInternal
}

const shouldOpenInNewTabTest = (button) => {
  if (!button) {
    console.log('shouldOpenInNewTabTest: No button provided')
    return false
  }
  
  console.log('shouldOpenInNewTabTest: Processing button:', button)
  
  const shouldOpen = !!button?.externalLink || !!button?.newTab
  console.log('shouldOpenInNewTabTest: externalLink:', !!button?.externalLink, 'newTab:', !!button?.newTab, 'shouldOpen:', shouldOpen)
  return shouldOpen
}
</script>

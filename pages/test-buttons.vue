<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Button Testing Page</h1>
    
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">BaseButton Test</h2>
      
      <!-- Test internal link -->
      <div class="space-y-2">
        <h3 class="text-lg">Internal Navigation Test</h3>
        <BaseButton to="/contact" variant="primary">
          Go to Contact (Internal)
        </BaseButton>
      </div>
      
      <!-- Test external link -->
      <div class="space-y-2">
        <h3 class="text-lg">External Link Test</h3>
        <BaseButton href="https://google.com" target="_blank" variant="secondary">
          Go to Google (External)
        </BaseButton>
      </div>
      
      <!-- Test regular button -->
      <div class="space-y-2">
        <h3 class="text-lg">Regular Button Test</h3>
        <BaseButton @click="handleClick" variant="tertiary">
          Click Me (Handler)
        </BaseButton>
      </div>
      
      <!-- Debug info -->
      <div class="mt-8 p-4 bg-gray-100 rounded">
        <h3 class="font-semibold">Debug Info</h3>
        <p>Click count: {{ clickCount }}</p>
        <p>Current route: {{ $route.path }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const clickCount = ref(0)

const handleClick = () => {
  clickCount.value++
  console.log('Button clicked!', clickCount.value)
}

// Add console log to see if page loads
console.log('Test buttons page loaded')
</script>

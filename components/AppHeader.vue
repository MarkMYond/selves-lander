<template>
  <header class="sticky top-0 z-50 pt-4">
    <div class="container mx-auto px-5">
      <div class="bg-white rounded-xl w-full p-4 border border-brandNeutral-stroke">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-[72px]">
                  <NuxtLink to="/" class="flex items-center">
                    <img :src="logoSrc" alt="Company Logo" class="h-[44px] w-auto" />
                  </NuxtLink>
                  <nav class="hidden lg:flex">
                    <ul class="flex items-center gap-[30px]">
                      <!-- Only Knowledge Base and Get Started remain in desktop nav -->
                    </ul>
                  </nav>
      </div>
          <div class="hidden lg:flex items-center gap-6">
            <BaseButton to="/wiki" variant="primary">Knowledge Base</BaseButton>
          </div>
                <div class="lg:hidden">
                  <button
                    type="button"
                    class="p-2 rounded-lg text-[#120a0b] hover:text-[#9886fe] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#9886fe]"
                    aria-controls="mobile-menu"
                    :aria-expanded="isMobileMenuOpen"
                    @click="isMobileMenuOpen = !isMobileMenuOpen"
                  >
                    <span class="sr-only">Open main menu</span>
                    <svg v-if="!isMobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
          </div>
        </div>
      </div>

      <div v-show="isMobileMenuOpen" id="mobile-menu" class="lg:hidden bg-white shadow-lg rounded-b-xl mx-5 border border-brandNeutral-stroke border-t-0">
        <div class="pt-2 pb-3 space-y-1 px-2">
              <NuxtLink to="/" class="mobile-nav-link" @click="closeMobileMenu">Home</NuxtLink>
              <hr class="my-2 border-gray-200" />
          <BaseButton to="/wiki" variant="primary" class="block w-full text-center my-2 shadow-sm" @click="closeMobileMenu">Knowledge Base</BaseButton>
          <div class="flex justify-end py-2 pr-2">
            <!-- elevenlabs widget removed -->
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const isMobileMenuOpen = ref(false)
const megaMenuVisible = ref(false)
const mobileMegaMenuOpen = ref(false)

// Use a bound src so Vite doesn't rewrite to an import on Vercel
const logoSrc = '/logo.svg'

const toggleMegaMenu = () => {
  if (window.innerWidth < 1024) {
    megaMenuVisible.value = !megaMenuVisible.value
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  mobileMegaMenuOpen.value = false
}
</script>

<style scoped>
/* Utility classes handled by Tailwind in templates */
</style>

<template>
  <header class="sticky top-0 z-50 pt-4">
    <div class="container mx-auto px-5">
      <div
        class="bg-white rounded-xl w-full p-4 border border-brandNeutral-stroke"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-[72px]">
            <NuxtLink
              to="/"
              class="flex items-center"
            >
              <img
                src="~/assets/images/logo.svg"
                alt="Company Logo"
                class="h-[44px] w-auto"
              >
            </NuxtLink>

            <nav class="hidden lg:flex">
              <ul class="flex items-center gap-[30px]">
                <li>
                  <NuxtLink
                    to="/wiki"
                    class="nav-link"
                  >
                    Knowledge Base
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/about"
                    class="nav-link"
                  >
                    About
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/contact"
                    class="nav-link"
                  >
                    Contact
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </div>

          <div class="hidden lg:flex items-center gap-6">
            <NuxtLink
              to="/registry"
              class="nav-link"
            >
              Registry
            </NuxtLink>
            <BaseButton
              to="/contact"
              variant="primary"
            >
              Get Started
            </BaseButton>
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
              <svg
                v-if="!isMobileMenuOpen"
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="isMobileMenuOpen"
      id="mobile-menu"
      class="lg:hidden bg-white shadow-lg rounded-b-xl mx-5 border border-brandNeutral-stroke border-t-0"
    >
      <div class="pt-2 pb-3 space-y-1 px-2">
        <NuxtLink
          to="/"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          Home
        </NuxtLink>

        <NuxtLink
          to="/wiki"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          Knowledge Base
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          About
        </NuxtLink>
        <NuxtLink
          to="/registry"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          Registry
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          Contact
        </NuxtLink>
        <hr class="my-2 border-gray-200">
        <BaseButton
          to="/contact"
          variant="primary"
          class="block w-full text-center mt-2 mb-2 shadow-sm"
          @click="closeMobileMenu"
        >
          Get Started
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue' // Changed to @ alias

const isMobileMenuOpen = ref(false)
const megaMenuVisible = ref(false) // For desktop mega menu hover state
const mobileMegaMenuOpen = ref(false) // For mobile mega menu accordion state

// const { getIconName } = useIcons(); // Not used in the new template
// const userFocusDuotone = getIconName('user-focus', 'duotone'); // Not used

const toggleMegaMenu = () => {
  // For click-to-toggle on mobile if needed, or for accessibility.
  // Desktop is hover-driven by mouseenter/mouseleave on the group.
  if (window.innerWidth < 1024) {
    // lg breakpoint
    megaMenuVisible.value = !megaMenuVisible.value
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  mobileMegaMenuOpen.value = false // Also close sub-menu
}
</script>

<style scoped>
.nav-link {
  @apply text-[#120a0b] hover:text-[#9886fe] text-base font-medium py-2 capitalize transition-colors duration-300;
}
.nav-dropdown-link {
  @apply block text-[#120a0b] opacity-85 hover:text-[#9886fe] hover:opacity-100 text-base font-medium py-1 px-[10px] capitalize transition-colors duration-300;
}
.nav-dropdown-link.current-page {
  @apply text-[#9886fe] opacity-100;
}

.mobile-nav-link {
  @apply block pl-3 pr-4 py-2 text-base font-medium text-[#120a0b] hover:bg-gray-100 hover:text-[#9886fe] transition-colors duration-200;
}
.mobile-nav-link-sub {
  @apply block pl-7 pr-4 py-1.5 text-sm text-[#120a0b] hover:bg-gray-100 hover:text-[#9886fe] transition-colors duration-200;
}
.mobile-nav-link-sub.current-page {
  @apply text-[#9886fe] font-semibold;
}
</style>

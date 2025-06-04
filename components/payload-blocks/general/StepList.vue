<template>
  <ul
    class="flex-col gap-y-5 gap-20 mb-10 max-md:gap-y-5 max-md:gap-20 max-md:mb-9 max-md:min-h-[293px] max-sm:gap-y-4 max-sm:gap-16 max-sm:mb-9 max-sm:min-h-[281px]"
    aria-label="Process steps"
  >
    <li
      v-for="(step, index) in steps"
      :key="index"
      class="flex relative items-start pb-5 gap-[normal_23.7815px] max-md:pb-5 max-md:gap-[normal_22.0021px] max-sm:pb-5 max-sm:gap-[normal_21.0656px]"
    >
      <!-- Vertical line connecting steps -->
      <div
        v-if="index < steps.length - 1"
        class="absolute shrink-0 w-px bg-zinc-50 bottom-[-31.7086px] left-[19.8179px] top-[15.8543px] max-md:bottom-[-29.3361px] max-md:left-[18.3351px] max-md:top-[14.6681px] max-sm:bottom-[-28.0874px] max-sm:left-[17.5546px] max-sm:top-[14.0437px]"
      ></div>

      <!-- Step number circle -->
      <div
        class="flex relative shrink-0 justify-center items-center w-10 h-10 text-base font-bold leading-6 bg-zinc-50 rounded-[400px] z-[5] max-md:text-base max-md:leading-5 max-md:h-[37px] max-md:w-[37px] max-sm:text-base max-sm:leading-relaxed max-sm:h-[35px] max-sm:w-[35px] [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
      >
        <span
          class="relative text-base font-bold leading-6 max-md:text-base max-md:leading-5 max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ index + 1 }}
        </span>
      </div>

      <!-- Step text -->
      <p class="text-base leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']">{{ step }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  steps: string[]
}>()
</script>

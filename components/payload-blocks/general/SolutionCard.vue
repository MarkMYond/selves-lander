<template>
  <div
    role="listitem"
    class="relative flex-1 w-full transition-transform max-md:shrink-0 max-md:mr-4 max-md:basis-auto max-md:grow-0 max-md:w-[216px]"
  >
    <label
      class="flex relative flex-col flex-1 justify-start items-center px-2 py-6 min-h-full text-base leading-relaxed tracking-wide text-center uppercase rounded-xl cursor-pointer bg-zinc-50 bg-opacity-50 gap-[normal_15.9147px] gap-[normal_15.9147px] transition-[box-shadow,background-color] max-md:px-2 max-md:py-6 max-md:text-base max-md:leading-relaxed max-md:rounded-xl max-md:gap-[normal_14.6681px] max-md:gap-[normal_14.6681px] max-sm:px-2 max-sm:py-5 max-sm:text-base max-sm:leading-relaxed max-sm:rounded-xl max-sm:gap-[normal_14.0437px] max-sm:gap-[normal_14.0437px] [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
    >
      <div
        class="absolute mt-4 mr-4 -ml-5 w-4 h-4 text-base leading-relaxed tracking-wide text-center uppercase rounded rounded-tl rounded-tr rounded-br rounded-bl border border-t border-r border-b border-l border-solid cursor-pointer border-zinc-600 right-[0%] top-[0%] transition-[box-shadow,border-color] max-md:mt-4 max-md:mr-4 max-md:text-base max-md:leading-relaxed max-md:h-[15px] max-md:w-[15px] max-sm:mt-3.5 max-sm:mr-3.5 max-sm:w-3.5 max-sm:h-3.5 max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
      />
      <input
        type="checkbox"
        :name="solution.name"
        :value="solution.value"
        class="absolute text-base opacity-0 cursor-default accent-red-500 z-[-1] max-md:text-base max-sm:text-base [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
      >
      <img
        width="150"
        alt=""
        :src="solution.icon"
        class="object-contain shrink-0 max-w-full text-base leading-relaxed tracking-wide text-center uppercase align-middle transition-opacity cursor-pointer duration-300 h-[119px] overflow-x-clip overflow-y-clip w-[119px] max-md:text-base max-md:leading-relaxed max-md:h-[110px] max-md:w-[110px] max-sm:text-base max-sm:leading-relaxed max-sm:h-[105px] max-sm:w-[105px] [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
      >
      <span
        for="Solution"
        class="mt-4 text-base font-bold leading-6 text-center cursor-pointer max-md:mt-4 max-md:text-base max-md:leading-5 max-sm:mt-3.5 max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
      >{{ solution.name }}</span>
      <div
        class="hidden text-base leading-relaxed tracking-wide text-center uppercase cursor-pointer max-md:text-base max-md:leading-relaxed max-md:leading-3 max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
      >
        <span
          class="text-base leading-relaxed tracking-wide text-center uppercase cursor-pointer max-md:text-base max-md:leading-relaxed max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >{{ solution.value }}</span>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { Solution } from '../builderTypes'

defineProps<{
  solution: Solution
}>()
</script>

<template>
  <div
    class="flex items-center text-base leading-relaxed max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01'] mb-6"
  >
    <div
      class="overflow-x-hidden overflow-y-hidden relative mr-2 h-4 text-base leading-relaxed rounded-2xl cursor-pointer select-none max-sm:text-base max-sm:leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
      @click="toggleBilling"
      role="switch"
      :aria-checked="modelValue"
      tabindex="0"
      @keydown.space.prevent="toggleBilling"
      @keydown.enter.prevent="toggleBilling"
    >
      <div
        class="px-1 h-4 text-base font-bold tracking-wide leading-4 text-white uppercase border-white cursor-pointer outline-white select-none decoration-white duration-[0.2s] rounded-[30px] w-[29px] [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        :class="modelValue ? 'bg-primary-700' : 'bg-primary-400'"
      >
        <div
          class="absolute inset-y-0 my-auto ml-2 w-2.5 h-2.5 text-base font-bold tracking-wide leading-none text-white uppercase border-white transition-opacity cursor-pointer outline-white select-none decoration-white duration-[0.25s] [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        ></div>
        <div
          class="bottom-0 my-auto mr-2 w-2.5 h-2.5 text-base font-bold tracking-wide leading-none text-white uppercase border-white opacity-0 transition-opacity cursor-pointer outline-white select-none decoration-white duration-[0.25s] [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        ></div>
      </div>
      <div
        class="absolute top-0.5 w-3 h-3 text-base leading-5 bg-white rounded-full cursor-pointer select-none duration-500 transition-all max-sm:text-base max-sm:leading-5 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        :class="modelValue ? 'left-[calc(100%_-_14px)]' : 'left-[2px]'"
      ></div>
      <input
        type="checkbox"
        :checked="modelValue"
        class="overflow-x-hidden overflow-y-hidden absolute -m-px w-px h-px text-base text-black border-black cursor-default outline-black select-none decoration-black [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        @change="toggleBilling"
      />
    </div>
    <span
      class="[font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
    >
      <slot :isYearly="modelValue">
        {{ modelValue ? 'Billed yearly' : 'Billed monthly' }}
      </slot>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BillingToggle',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const toggleBilling = () => {
      emit('update:modelValue', !props.modelValue)
    }

    return {
      toggleBilling,
    }
  },
})
</script>

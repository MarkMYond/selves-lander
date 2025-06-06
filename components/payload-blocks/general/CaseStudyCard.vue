<script setup lang="ts">
interface CaseStudyProps {
  imageUrl: string
  title: string
  linkUrl: string
  bgColor?: string
}

const props = defineProps<CaseStudyProps>()
</script>

<template>
  <div
    role="listitem"
    class="overflow-x-hidden overflow-y-hidden relative rounded-xl duration-&lsqb;0.2s&rsqb; ease-&lsqb;cubic-bezier(0.215,0.61,0.355,1)&rsqb; size-full"
  >
    <div
      :class="
        props.bgColor ? props.bgColor : 'bg-white'
      "
      class="flex overflow-x-hidden overflow-y-hidden flex-col gap-0 rounded-2xl border-[3px] border-solid border-brand-primary size-full p-8"
    >
      <img
        :src="props.imageUrl"
        alt=""
        class="w-full align-middle select-none overflow-x-clip overflow-y-clip pb-6 mx-auto max-w-[35vw] max-h-[100px]"
      >
      <div class="flex flex-col gap-4 gap-y-4 justify-between items-baseline">
        <p
          class="text-xl leading-8 text-brand-900 dark:text-brand-100 max-sm:text-lg max-sm:leading-7 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          {{ props.title }}
        </p>
        <span
          v-if="props.linkUrl === '#'"
          class="text-brand-primary text-base font-medium [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >
          Coming soon
        </span>
        <a
          v-else
          :href="props.linkUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-brand-primary hover:underline text-base font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
        >Read now
          <Icon
            name="ph:arrow-right"
            class="w-4 h-4 ml-1"
          />
        </a>
      </div>
    </div>
  </div>
</template>

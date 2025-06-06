<template>
  <section class="travel-era-explorer py-16 md:py-24 bg-slate-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ heading || 'Travel Through Technology Eras' }}
        </h2>
        <p
          v-if="subheading"
          class="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          {{ subheading }}
        </p>
      </div>

      <div class="travel-section mb-16">
        <div class="travel-header text-center mb-8">
          <h3 class="text-2xl font-bold mb-2">
            {{ travelHeading || 'Travel through time' }}
          </h3>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ travelDescription }}
          </p>
        </div>

        <div
          v-if="categories && categories.length"
          class="filter-categories flex flex-wrap justify-center gap-2 mb-8"
        >
          <button
            v-for="category in categories"
            :key="category.id"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-brand-primary text-gray-700 hover:bg-gray-50',
            ]"
            @click="setActiveCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>

        <div
          class="timeline-nav relative flex justify-between items-center mb-12 max-w-4xl mx-auto"
        >
          <div class="timeline-track h-1 bg-gray-300 absolute w-full" />
          <div
            v-for="(era, index) in filteredEras"
            :key="era.id"
            class="timeline-point relative z-10 cursor-pointer"
            :class="{ active: activeEraId === era.id }"
            @click="setActiveEra(era.id)"
          >
            <div
              class="h-6 w-6 rounded-full border-2 transition-all duration-300"
              :class="[
                activeEraId === era.id
                  ? 'border-primary-600 bg-primary-600 scale-125'
                  : 'border-brand-primary bg-white hover:border-brand-primary',
              ]"
            />
            <div
              class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-base leading-relaxed font-medium [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']"
              :class="{
                'text-primary-600': activeEraId === era.id,
                'text-gray-600': activeEraId !== era.id,
              }"
            >
              {{ era.name }}
            </div>
          </div>
        </div>

        <div
          v-if="activeEra"
          class="era-content mt-16"
        >
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="era-image md:w-1/2">
              <img
                v-if="activeEra.image?.url"
                :src="activeEra.image.url"
                :alt="activeEra.image.alt || activeEra.name"
                class="rounded-lg shadow-lg w-full h-auto object-cover"
              >
              <div
                v-else
                class="bg-gray-100 rounded-lg w-full aspect-video flex items-center justify-center"
              >
                <span
                  class="text-gray-400 [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']"
                >No image available</span>
              </div>
            </div>

            <div class="era-details md:w-1/2">
              <h3 class="text-2xl font-bold mb-4">
                {{ activeEra.title }}
              </h3>
              <p
                class="text-gray-700 mb-6 [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']"
              >
                {{ activeEra.description }}
              </p>

              <div
                v-if="activeEra.features && activeEra.features.length"
                class="key-features mb-6"
              >
                <h4 class="font-semibold text-lg mb-2">
                  Key Features
                </h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li
                    v-for="(feature, index) in activeEra.features"
                    :key="index"
                    class="text-gray-700 [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']"
                  >
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <div
                v-if="activeEra.technologies && activeEra.technologies.length"
                class="technologies"
              >
                <h4 class="font-semibold text-lg mb-2">
                  Technologies
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(tech, index) in activeEra.technologies"
                    :key="index"
                    class="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-base leading-relaxed [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  heading: {
    type: String,
    default: '',
  },
  subheading: {
    type: String,
    default: '',
  },
  travelHeading: {
    type: String,
    default: '',
  },
  travelDescription: {
    type: String,
    default: '',
  },
  categories: {
    type: Array,
    default: () => [],
  },
  travelEras: {
    type: Array,
    default: () => [],
  },
})

const activeEraId = ref('')
const activeCategory = ref('all')

const filteredEras = computed(() => {
  if (activeCategory.value === 'all') {
    return props.travelEras
  }
  return props.travelEras.filter((era) => {
    return era.categories && era.categories.includes(activeCategory.value)
  })
})

const activeEra = computed(() => {
  if (!activeEraId.value && filteredEras.value.length) {
    return filteredEras.value[0]
  }
  return filteredEras.value.find((era) => era.id === activeEraId.value) || null
})

const setActiveEra = (eraId) => {
  activeEraId.value = eraId
}

const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId
  activeEraId.value = ''
}

onMounted(() => {
  if (props.travelEras && props.travelEras.length) {
    activeEraId.value = props.travelEras[0].id
  }
})
</script>

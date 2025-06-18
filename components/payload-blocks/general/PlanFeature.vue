<template>
  <li class="pricing-single-feature flex items-center py-1 space-x-3">
    <template v-if="customText">
      <!-- Custom text display (no icon, but keep alignment) -->
      <span class="h-5 w-5 flex-shrink-0"></span> <!-- Spacing placeholder to align with icon -->
      <p class="pricing-feature-text text-base text-gray-700 dark:text-gray-300">{{ customText }}</p>
    </template>
    <template v-else-if="isIncluded">
      <span 
        class="icon-wrapper h-5 w-5 flex-shrink-0 rounded-full bg-black flex items-center justify-center"
      >
        <span class="text-white text-xs font-bold">✓</span>
      </span>
      <p 
        class="pricing-feature-text text-base font-medium text-gray-900" 
      >
        {{ featureText }}
      </p>
    </template>
    <template v-else>
      <span class="icon-wrapper h-5 w-5 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
        <span class="text-gray-500 text-xs font-bold">✗</span>
      </span>
      <p 
        class="pricing-feature-text text-base line-through font-medium text-gray-500"
      >
        {{ featureText }}
      </p>
    </template>

    <span v-if="tooltip" class="tooltip-wrapper flex-shrink-0 relative ml-1">
      <Icon
        name="ph:info"
        class="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help"
      />
      <span class="tooltip-text">
        {{ tooltip }}
      </span>
    </span>
  </li>
</template>

<script setup lang="ts">
defineProps({
  featureText: {
    type: String,
    required: true,
  },
  isIncluded: { 
    type: Boolean,
    default: true, 
  },
  customText: { 
    type: String,
    required: false,
  },
  tooltip: {
    type: String,
    required: false,
  },
  isPopular: { 
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
li.pricing-single-feature {
  list-style: none;
}

.tooltip-wrapper {
  display: inline-block; /* Or flex, depending on desired alignment with icon */
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  width: max-content;
  max-width: 200px; /* Adjust as needed */
  background-color: #333; /* Dark background */
  color: #fff; /* White text */
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 10;
  bottom: 125%; /* Position above the icon */
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  font-size: 0.75rem; /* text-xs */
  line-height: 1.25;
  white-space: normal; /* Allow text to wrap */
}

/* Arrow for the tooltip */
.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent; /* Arrow pointing down */
}

.tooltip-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>

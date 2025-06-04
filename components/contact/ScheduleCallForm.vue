<template>
  <div class="flex gap-5 max-md:flex-col">
    <div class="w-full"> <!-- Changed from w-6/12 to w-full since we're commenting out the right column -->
      <InfoColumn />
    </div>
    <!-- Commented out form column to focus on fixing the left side
    <div class="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
      <FormColumn />
    </div>
    -->
  </div>
</template>

<script setup lang="ts">
import InfoColumn from './InfoColumn.vue'
// import FormColumn from './FormColumn.vue' - Commented out as we're not using it temporarily
</script>

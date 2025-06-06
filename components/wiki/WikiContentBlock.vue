<template>
  <div
    class="wiki-content-block prose prose-slate max-w-none dark:prose-invert"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.wiki-content-block {
}

.wiki-content-block h2 {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: 600;
}

.wiki-content-block h3 {
  margin-top: 1.25em;
  margin-bottom: 0.5em;
  font-weight: 500;
}

.wiki-content-block ul {
  margin-left: 1em;
  margin-bottom: 1em;
}

.wiki-content-block li {
  margin-bottom: 0.5em;
}
</style>

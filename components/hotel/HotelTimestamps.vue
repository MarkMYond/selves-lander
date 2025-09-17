<template>
  <div class="mb-6 pt-4 border-t border-gray-200">
    <div class="flex gap-6 text-sm text-gray-500">
      <div v-if="createdAt">
        <span class="font-medium">Created:</span> {{ formatDate(createdAt) }}
      </div>
      <div v-if="updatedAt">
        <span class="font-medium">Updated:</span> {{ formatDate(updatedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  createdAt?: string | null;
  updatedAt?: string | null;
}>();

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
};
</script>

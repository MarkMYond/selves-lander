<template>
  <div v-if="fileUrl" class="my-4 p-3 border rounded bg-brand-50"> <!-- Changed bg-gray-50 to bg-brand-50 -->
    <a
      :href="fileUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
    >
      <PhFile :size="18" class="mr-2 shrink-0" />
      <span class="font-medium">{{ displayLabel }}</span>
    </a>
    <!-- Optional: Display file size or type if available in media object -->
    <!-- <span v-if="fileSize" class="text-xs text-gray-500 ml-2">({{ fileSize }})</span> -->
  </div>
  <div v-else class="my-4 p-3 border rounded bg-red-50 text-red-700">
    File not available. (Check if the file relation is populated).
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { PhFile } from '@phosphor-icons/vue';
import type { Media } from '../../../payload-cms/src/payload-types'
import { useMediaUrl } from '../../composables/useMediaUrl';

// Assuming structure for FileAttachmentBlock data from Payload
interface FileAttachmentBlockData {
  id?: string;
  blockType: 'fileAttachmentBlock';
  file: Media | string; // Could be populated Media object or just ID string
  label?: string;
}

const props = defineProps({
  block: {
    type: Object as PropType<FileAttachmentBlockData>,
    required: true,
  },
})

// Use our composable to handle media URLs
const { getMediaUrl } = useMediaUrl();

// Extract file URL and filename, handling both populated and unpopulated cases
const fileDetails = computed(() => {
  if (!props.block?.file) return { url: null, filename: null };

  if (typeof props.block.file === 'object' && props.block.file !== null) {
    // Use our composable to get the correct URL
    return {
      url: getMediaUrl(props.block.file),
      filename: props.block.file.filename || 'Download File'
    };
  }
  
  // If just an ID is provided, we can't resolve without fetching
  return { url: null, filename: 'Download File' };
})

// Use computed properties to extract the values
const fileUrl = computed(() => fileDetails.value.url)
const fileName = computed(() => fileDetails.value.filename)

// Use label if provided, otherwise fall back to filename
const displayLabel = computed(() => props.block?.label || fileName.value || 'Download File')
</script>

<style scoped>
/* Add specific styling if needed */
</style>

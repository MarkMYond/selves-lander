<template>
  <div
    v-if="fileUrl"
    class="my-4 p-3 border rounded bg-brand-50"
  >
    <a
      :href="fileUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
    >
      <!-- <PhFile
        :size="18"
        class="mr-2 shrink-0"
      /> -->
      <span class="font-medium">[F] {{ displayLabel }}</span> <!-- Placeholder for File icon -->
    </a>
  </div>
  <div
    v-else
    class="my-4 p-3 border rounded bg-red-50 text-red-700"
  >
    File not available. (Check if the file relation is populated).
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
// import { PhFile } from '@phosphor-icons/vue'
import type { Media } from '../../../src/payload-types'
import { useMediaUrl } from '../../composables/useMediaUrl'

interface FileAttachmentBlockData {
  id?: string
  blockType: 'fileAttachmentBlock'
  file: Media | string
  label?: string
}

const props = defineProps({
  block: {
    type: Object as PropType<FileAttachmentBlockData>,
    required: true,
  },
})

const { getMediaUrl } = useMediaUrl()

const fileDetails = computed(() => {
  if (!props.block?.file) return { url: null, filename: null }

  if (typeof props.block.file === 'object' && props.block.file !== null) {
    return {
      url: getMediaUrl(props.block.file),
      filename: props.block.file.filename || 'Download File',
    }
  }

  return { url: null, filename: 'Download File' }
})

const fileUrl = computed(() => fileDetails.value.url)
const fileName = computed(() => fileDetails.value.filename)

const displayLabel = computed(
  () => props.block?.label || fileName.value || 'Download File'
)
</script>

<style scoped>
</style>

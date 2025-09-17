<template>
  <div v-if="mediaItems && mediaItems.length > 0" class="bg-purple-50 p-6 rounded-lg">
    <h2 class="text-lg font-semibold mb-4">Media</h2>
    <div class="flex flex-wrap gap-5">
      <div 
        v-for="(item, index) in mediaItems" 
        :key="index"
        class="w-[120px] h-[120px] bg-gray-200 rounded overflow-hidden flex-shrink-0"
      >
        <img 
          v-if="item.url" 
          :src="item.url" 
          :alt="item.alt_text || 'Hotel image'"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          No Image
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MediaItem {
  url?: string;
  alt_text?: string;
  [key: string]: any;
}

const props = defineProps<{
  media: MediaItem[] | string | null;
}>();

// Parse JSON if it's a string
const parsedMedia = computed(() => {
  if (typeof props.media === 'string') {
    try {
      return JSON.parse(props.media) as MediaItem[];
    } catch {
      return [];
    }
  }
  return Array.isArray(props.media) ? props.media : [];
});

const mediaItems = computed(() => parsedMedia.value);
</script>

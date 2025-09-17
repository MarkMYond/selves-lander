<template>
  <div v-if="referencesItems && referencesItems.length > 0" class="bg-purple-50 p-6 rounded-lg mb-6">
    <h2 class="text-lg font-semibold mb-4">References</h2>
    <div class="space-y-4">
      <div 
        v-for="(reference, index) in referencesItems" 
        :key="index"
        class="flex items-start gap-4"
      >
        <!-- Favicon placeholder -->
        <div class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 mt-1">
          <img 
            v-if="reference.favicon" 
            :src="reference.favicon" 
            :alt="`${reference.handle} favicon`"
            class="w-6 h-6 rounded"
          />
          <div v-else class="w-4 h-4 bg-gray-400 rounded"></div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- Handle -->
          <h3 class="font-semibold text-gray-900 mb-1">{{ reference.handle }}</h3>
          
          <!-- Description -->
          <p class="text-gray-700 text-sm mb-2 leading-relaxed">{{ reference.description }}</p>
          
          <!-- See more link -->
          <a 
            v-if="reference.url" 
            :href="reference.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            See more
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Reference {
  handle: string;
  description: string;
  url: string;
  favicon?: string;
}

const props = defineProps<{
  references: Reference[] | string | null;
}>();

// Parse JSON if it's a string
const parsedReferences = computed(() => {
  if (typeof props.references === 'string') {
    try {
      const parsed = JSON.parse(props.references);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // Handle single object
      if (typeof parsed === 'object' && parsed !== null) {
        return [parsed];
      }
      return [];
    } catch {
      return [];
    }
  }
  
  if (Array.isArray(props.references)) {
    return props.references;
  }
  
  return [];
});

const referencesItems = computed(() => 
  parsedReferences.value.filter(ref => ref && ref.handle && ref.description)
);
</script>

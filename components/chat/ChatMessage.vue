<template>
  <div :class="['flex items-start mb-4 message-item', isUser ? 'justify-end' : 'justify-start']">
    <!-- Avatar (for AI responses only) -->
    <div v-if="!isUser && avatarUrl" class="flex-shrink-0 mr-3">
      <img :src="avatarUrl" :alt="senderName" class="w-8 h-8 rounded-full object-cover" />
    </div>
    <!-- Default avatar if none provided -->
    <div v-else-if="!isUser" class="flex-shrink-0 mr-3">
      <div class="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
        {{ senderName.charAt(0) }}
      </div>
    </div>
    
    <!-- Message content -->
    <div 
      :class="[
        'max-w-[75%] p-3 rounded-2xl',
        isUser 
          ? 'bg-brand-primary text-white rounded-tr-none' 
          : 'bg-gray-50 text-gray-900 rounded-tl-none min-w-[250px]' // Added min-w, Changed for better contrast
      ]"
    >
      <!-- Header with name and timestamp -->
      <div class="flex justify-between items-center mb-1">
        <span class="font-medium text-sm">{{ senderName }}</span>
        <span class="text-xs opacity-70">{{ formattedTime }}</span>
      </div>
      
      <!-- Message content with markdown support, ensuring proper text color -->
      <div 
        :class="[
          'prose prose-sm max-w-none', 
          isUser ? 'text-white prose-invert' : 'text-gray-800' // Ensure AI message prose is dark
        ]" 
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Props {
  content: string;
  timestamp: Date;
  isUser: boolean;
  senderName: string;
  avatarUrl?: string;
}

const props = defineProps<Props>();

// Format the timestamp
const formattedTime = computed(() => {
  const date = new Date(props.timestamp);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
});

// Render markdown and sanitize HTML
const renderedContent = computed(() => {
  // Only render markdown for AI responses
  if (props.isUser) {
    return DOMPurify.sanitize(props.content.replace(/\n/g, '<br>'));
  }
  
  // Parse markdown and sanitize for AI responses
  // Use marked as a synchronous function
  const markedContent = marked(props.content) as string;
  return DOMPurify.sanitize(markedContent);
});
</script>

<style scoped>
/* Add any specific styling for the markdown content */
:deep(.prose) {
  /* Override any prose styles as needed */
  line-height: 1.4;
}

:deep(.prose pre) {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 8px;
  margin: 8px 0;
  overflow-x: auto;
}

:deep(.prose code) {
  font-family: monospace;
  font-size: 0.9em;
}

/* Ensure code blocks in AI messages have dark text for contrast */
:deep(.prose:not(.prose-invert) code) {
  color: theme('colors.gray.800');
}
</style>

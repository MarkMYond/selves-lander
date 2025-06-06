<template>
  <div
    :class="[
      'flex items-start mb-4 message-item',
      isUser ? 'justify-end' : 'justify-start',
    ]"
  >
    <div
      v-if="!isUser && avatarUrl"
      class="flex-shrink-0 mr-3"
    >
      <img
        :src="avatarUrl"
        :alt="senderName"
        class="w-8 h-8 rounded-full object-cover"
      >
    </div>
    <div
      v-else-if="!isUser"
      class="flex-shrink-0 mr-3"
    >
      <div
        class="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold"
      >
        {{ senderName.charAt(0) }}
      </div>
    </div>

    <div
        :class="[
          'max-w-[75%] p-3 rounded-2xl',
          isUser
            ? 'bg-brand-primary text-white rounded-tr-none'
            : 'bg-gray-50 text-gray-900 rounded-tl-none min-w-[250px]',
        ]"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="font-medium text-sm">{{ senderName }}</span>
          <span class="text-xs opacity-70">{{ formattedTime }}</span>
        </div>

        <div
          :class="[
            'prose prose-sm max-w-none',
            isUser ? 'text-white prose-invert' : 'text-gray-800',
          ]"
          v-html="renderedContent"
        />
      </div>
    </div>
  </template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface Props {
  content: string
  timestamp: Date
  isUser: boolean
  senderName: string
  avatarUrl?: string
}

const props = defineProps<Props>()

const formattedTime = computed(() => {
  const date = new Date(props.timestamp)
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
})

const renderedContent = computed(() => {
  if (props.isUser) {
    return DOMPurify.sanitize(props.content.replace(/\n/g, '<br>'))
  }

  const markedContent = marked(props.content) as string
  return DOMPurify.sanitize(markedContent)
})
</script>

<style scoped>
:deep(.prose) {
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

:deep(.prose:not(.prose-invert) code) {
  color: theme('colors.gray.800');
}
</style>

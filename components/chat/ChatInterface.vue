<template>
  <div class="flex flex-col h-[450px]">
    <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto p-4 space-y-2 bg-white rounded-xl relative"
      @scroll="handleScroll"
    >
      <!-- Messages -->
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :content="message.content"
        :timestamp="message.timestamp"
        :is-user="message.isUser"
        :sender-name="message.isUser ? 'You' : assistantName"
        :avatar-url="avatarUrl"
      />
    </div>

    <div
      v-if="isGenerating"
      class="flex items-center space-x-2 text-gray-500 p-2 border-t border-gray-100"
    >
      <span class="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
      <span
        class="w-2 h-2 bg-brand-primary rounded-full animate-pulse delay-150"
      />
      <span
        class="w-2 h-2 bg-brand-primary rounded-full animate-pulse delay-300"
      />
      <span class="text-sm ml-2">{{ assistantName }} is typing...</span>
    </div>

    <div class="mt-4 border-t pt-4">
      <form
        class="flex items-center space-x-2"
        @submit.prevent="sendMessage"
      >
        <input
          v-model="userInput"
          type="text"
          :placeholder="defaultPrompt || 'Type your message...'"
          class="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          :disabled="isGenerating"
        >
        <button
          type="submit"
          class="bg-brand-primary text-white px-4 py-2 rounded-xl hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          :disabled="isGenerating || !userInput.trim()"
        >
          <span>Send</span>
        </button>
      </form>
    </div>

    <button
      v-if="showScrollToLatestButton"
      class="absolute bottom-20 right-6 bg-brand-primary text-white rounded-full p-2 shadow-md hover:bg-brand-700 transition-opacity"
      aria-label="Scroll to latest message"
      @click="scrollToLatestMessage"
    >
      <Icon
        name="ph:arrow-up-bold"
        size="24"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import ChatMessage from './ChatMessage.vue'

interface Message {
  id: string
  content: string
  timestamp: Date
  isUser: boolean
  isInitial?: boolean
}

interface Props {
  defaultPrompt?: string
  systemPrompt?: string
  assistantName: string
  avatarUrl?: string
  tabId: string // Unique identifier for this tab
  initialUserMessage?: string
  initialAIResponse?: string
  modelName?: string // AI model to use
  savedMessages?: Array<{
    id: string
    content: string
    timestamp: Date
    isUser: boolean
    isInitial?: boolean
  }>
}

const props = withDefaults(defineProps<Props>(), {
  defaultPrompt: '',
  systemPrompt: 'You are a helpful assistant.',
  assistantName: 'Assistant',
  avatarUrl: undefined,
  initialUserMessage: '',
  initialAIResponse: '',
  modelName: 'gpt-4.1-2025-04-14',
})

const userInput = ref('')
const messages = reactive<Message[]>([])
const isGenerating = ref(false)
const messageContainer = ref<HTMLElement | null>(null)
const showScrollToLatestButton = ref(false)

if (props.savedMessages && props.savedMessages.length > 0) {
  props.savedMessages.forEach((msg) => {
    messages.push({
      id: msg.id || uuidv4(),
      content: msg.content,
      timestamp:
        msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
      isUser: msg.isUser,
      isInitial: msg.isInitial,
    })
  })
}

const emit = defineEmits<{
  (e: 'message-sent', message: Message): void
  (e: 'update:messages', messages: Message[]): void
}>()

function useDefaultPrompt() {
  if (props.defaultPrompt) {
    userInput.value = props.defaultPrompt
    sendMessage()
  }
}

async function sendMessage() {
  if (!userInput.value.trim() || isGenerating.value) return

  // Add user message
  const userMessage: Message = {
    id: uuidv4(),
    content: userInput.value,
    timestamp: new Date(),
    isUser: true,
  }

  messages.push(userMessage)
  emit('message-sent', userMessage)

  userInput.value = ''

  await nextTick()
  scrollToBottom()

  await generateResponse(userMessage.content)
}

async function generateResponse(userMessage: string) {
  try {
    isGenerating.value = true

    const history = messages.map((msg) => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    const requestBody = {
      systemPrompt: props.systemPrompt,
      messages: history,
      tabId: props.tabId,
      modelName: props.modelName,
    }

    const aiMessageId = uuidv4()
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      timestamp: new Date(),
      isUser: false,
    }

    messages.push(aiMessage)

    await nextTick()
    scrollToBottom()

    try {
      const streamResponse = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!streamResponse.ok || !streamResponse.body) {
        throw new Error(
          `Streaming API failed with status: ${streamResponse.status}`
        )
      }

      const reader = streamResponse.body.getReader()
      const decoder = new TextDecoder()
      let responseText = ''

       
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        const chunk = decoder.decode(value, { stream: true })
        responseText += chunk

        const messageIndex = messages.findIndex((msg) => msg.id === aiMessageId)
        if (messageIndex !== -1) {
          messages[messageIndex].content = responseText
        }

        await nextTick()
        scrollToBottom()
      }
      // console.log('Streaming finished.')
    } catch (streamError) {
      // console.error(
      //   'Streaming API failed, attempting fallback to regular API:',
      //   streamError
      // )

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          // console.error(
          //   'Fallback regular API also failed:',
          //   response.status,
          //   errorData
          // )
          throw new Error(
            `Fallback regular API failed with status: ${response.status}. Details: ${JSON.stringify(errorData)}`
          )
        }

        const data = await response.json()

        const messageIndex = messages.findIndex((msg) => msg.id === aiMessageId)
        if (messageIndex !== -1) {
          messages[messageIndex].content = data.response
        } else {
          // console.error(
          //   'Failed to find AI message placeholder to update with fallback response.'
          // )
        }
      } catch (fallbackError) {
        // console.error(
        //   'All API attempts (streaming and fallback) failed:',
        //   fallbackError
        // )
        const messageIndex = messages.findIndex((msg) => msg.id === aiMessageId)
        if (messageIndex !== -1) {
          messages[messageIndex].content =
            'Sorry, I encountered an error connecting to the AI. Please try again.'
        } else {
          messages.push({
            id: uuidv4(),
            content: 'Sorry, a critical error occurred. Please try refreshing.',
            timestamp: new Date(),
            isUser: false,
          })
        }
      }
    }

    await nextTick()
    scrollToBottom()
  } catch (error) {
    // console.error('Error generating response:', error)

    // Add error message
    messages.push({
      id: uuidv4(),
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date(),
      isUser: false,
    })
  } finally {
    isGenerating.value = false
  }
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

function scrollToLatestMessage() {
  if (messageContainer.value) {
    const messageElements =
      messageContainer.value.querySelectorAll('.message-item')
    if (messageElements.length > 0) {
      const latestMessage = messageElements[
        messageElements.length - 1
      ] as HTMLElement
      // Scroll to the top of the latest message element
      messageContainer.value.scrollTo({
        top: latestMessage.offsetTop,
        behavior: 'smooth',
      })
    }
  }
}

const handleScroll = () => {
  if (messageContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = messageContainer.value
    if (scrollHeight > clientHeight) {
      showScrollToLatestButton.value =
        scrollTop < scrollHeight - clientHeight - clientHeight * 0.5
    } else {
      showScrollToLatestButton.value = false
    }
  }
}

const shouldShowSuggestion = computed(() => false)

watch(
  messages,
  () => {
    nextTick(scrollToBottom)
    emit('update:messages', [...messages])
  },
  { deep: true }
)

defineExpose({
  addMessage: (content: string, isUser: boolean = false) => {
    messages.push({
      id: uuidv4(),
      content,
      timestamp: new Date(),
      isUser,
    })
  },
  clearChat: () => {
    messages.splice(0, messages.length)
  },
})

function sendInitialMessage() {
  if (props.initialUserMessage) {
    // console.log('Sending initial user message:', props.initialUserMessage)

    const userMessage: Message = {
      id: uuidv4(),
      content: props.initialUserMessage,
      timestamp: new Date(),
      isUser: true,
      isInitial: true,
    }

    messages.push(userMessage)
    emit('message-sent', userMessage)

    nextTick(() => {
      scrollToBottom()
      generateResponse(props.initialUserMessage)
    })
  } else {
    // console.log('No initial user message provided')
  }
}

onMounted(() => {
  // console.log('ChatInterface mounted with props:', {
  //   initialUserMessage: props.initialUserMessage,
  //   initialAIResponse: props.initialAIResponse ? 'Present (truncated)' : 'None',
  //   assistantName: props.assistantName,
  //   tabId: props.tabId,
  //   defaultPrompt: props.defaultPrompt,
  // })

  nextTick(() => {
    scrollToBottom()
    setTimeout(() => {
      sendInitialMessage()
    }, 500)
  })
})
</script>

<style scoped>
</style>

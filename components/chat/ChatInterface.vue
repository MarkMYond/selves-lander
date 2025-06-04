<template>
  <div class="flex flex-col h-[450px]">
    <!-- Message history area - Scrollable container -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2 bg-white rounded-xl relative" ref="messageContainer" @scroll="handleScroll">
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
    
    <!-- Typing indicator when AI is generating response - Fixed at the bottom of the chat -->
    <div v-if="isGenerating" class="flex items-center space-x-2 text-gray-500 p-2 border-t border-gray-100">
      <span class="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
      <span class="w-2 h-2 bg-brand-primary rounded-full animate-pulse delay-150"></span>
      <span class="w-2 h-2 bg-brand-primary rounded-full animate-pulse delay-300"></span>
      <span class="text-sm ml-2">{{ assistantName }} is typing...</span>
    </div>
    
    <!-- Input area -->
    <div class="mt-4 border-t pt-4">
      <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
        <input
          v-model="userInput"
          type="text"
          :placeholder="defaultPrompt || 'Type your message...'"
          class="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          :disabled="isGenerating"
        />
        <button
          type="submit"
          class="bg-brand-primary text-white px-4 py-2 rounded-xl hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          :disabled="isGenerating || !userInput.trim()"
        >
          <span>Send</span>
        </button>
      </form>
    </div>

    <!-- Scroll to latest message button -->
    <button
      v-if="showScrollToLatestButton"
      @click="scrollToLatestMessage"
      class="absolute bottom-20 right-6 bg-brand-primary text-white rounded-full p-2 shadow-md hover:bg-brand-700 transition-opacity"
      aria-label="Scroll to latest message"
    >
      <Icon name="ph:arrow-up-bold" size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage.vue';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
  isInitial?: boolean; // Flag to indicate it's an initial pre-loaded message
}

interface Props {
  defaultPrompt?: string;
  systemPrompt?: string;
  assistantName: string;
  avatarUrl?: string;
  tabId: string; // Unique identifier for this tab
  initialUserMessage?: string;
  initialAIResponse?: string;
  modelName?: string; // AI model to use
  savedMessages?: Array<{
    id: string;
    content: string;
    timestamp: Date;
    isUser: boolean;
    isInitial?: boolean;
  }>;
}

const props = withDefaults(defineProps<Props>(), {
  defaultPrompt: '',
  systemPrompt: 'You are a helpful assistant.',
  assistantName: 'Assistant',
  avatarUrl: undefined,
  initialUserMessage: '',
  initialAIResponse: '',
  modelName: 'gpt-4.1-2025-04-14' // Default model name
});

// State
const userInput = ref('');
const messages = reactive<Message[]>([]);
const isGenerating = ref(false);
const messageContainer = ref<HTMLElement | null>(null);
const showScrollToLatestButton = ref(false);

// Initialize messages from saved messages if available
if (props.savedMessages && props.savedMessages.length > 0) {
  // Convert saved messages to Message objects
  props.savedMessages.forEach(msg => {
    messages.push({
      id: msg.id || uuidv4(),
      content: msg.content,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
      isUser: msg.isUser,
      isInitial: msg.isInitial
    });
  });
}

// Emit events
const emit = defineEmits<{
  (e: 'message-sent', message: Message): void;
  (e: 'update:messages', messages: Message[]): void;
}>();

// Functions
function useDefaultPrompt() {
  if (props.defaultPrompt) {
    userInput.value = props.defaultPrompt;
    sendMessage();
  }
}

async function sendMessage() {
  if (!userInput.value.trim() || isGenerating.value) return;
  
  // Add user message
  const userMessage: Message = {
    id: uuidv4(),
    content: userInput.value,
    timestamp: new Date(),
    isUser: true
  };
  
  messages.push(userMessage);
  emit('message-sent', userMessage);
  
  // Clear input
  userInput.value = '';
  
  // Scroll to bottom
  await nextTick();
  scrollToBottom();
  
  // Generate AI response
  await generateResponse(userMessage.content);
}

async function generateResponse(userMessage: string) {
  try {
    isGenerating.value = true;
    
    // Prepare conversation history for the API
    const history = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Create request body
    const requestBody = {
      systemPrompt: props.systemPrompt,
      messages: history,
      tabId: props.tabId,
      modelName: props.modelName // Include the selected model name
    };
    
    // Create a placeholder for the AI response
    const aiMessageId = uuidv4();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      timestamp: new Date(),
      isUser: false
    };
    
    // Add empty AI message that will be populated
    messages.push(aiMessage);
    
    // Scroll to bottom to show the incoming message
    await nextTick();
    scrollToBottom();

    try {
      // Attempt streaming API first
      const streamResponse = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!streamResponse.ok || !streamResponse.body) {
        // If streamResponse is not ok or body is null, throw to fallback
        throw new Error(`Streaming API failed with status: ${streamResponse.status}`);
      }

      const reader = streamResponse.body.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        responseText += chunk;
        
        const messageIndex = messages.findIndex(msg => msg.id === aiMessageId);
        if (messageIndex !== -1) {
          messages[messageIndex].content = responseText;
        }
        
        await nextTick();
        scrollToBottom();
      }
      console.log('Streaming finished.');

    } catch (streamError) {
      console.error('Streaming API failed, attempting fallback to regular API:', streamError);
      
      // Fallback to regular REST API if streaming fails
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty obj
          console.error('Fallback regular API also failed:', response.status, errorData);
          throw new Error(`Fallback regular API failed with status: ${response.status}. Details: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        
        const messageIndex = messages.findIndex(msg => msg.id === aiMessageId);
        if (messageIndex !== -1) {
          messages[messageIndex].content = data.response;
        } else {
          console.error("Failed to find AI message placeholder to update with fallback response.");
        }
      } catch (fallbackError) {
        console.error('All API attempts (streaming and fallback) failed:', fallbackError);
        // Update the placeholder message with an error
        const messageIndex = messages.findIndex(msg => msg.id === aiMessageId);
        if (messageIndex !== -1) {
          messages[messageIndex].content = 'Sorry, I encountered an error connecting to the AI. Please try again.';
        } else {
           // If even the placeholder isn't there, add a new error message
            messages.push({
              id: uuidv4(),
              content: 'Sorry, a critical error occurred. Please try refreshing.',
              timestamp: new Date(),
              isUser: false,
            });
        }
        // Optionally, re-throw or handle more gracefully
        // For now, we'll let the finally block handle isGenerating
      }
    }
    
    // Final scroll after all content is loaded (or error displayed)
    await nextTick();
    scrollToBottom();
    
  } catch (error) {
    console.error('Error generating response:', error);
    
    // Add error message
    messages.push({
      id: uuidv4(),
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date(),
      isUser: false
    });
    
  } finally {
    isGenerating.value = false;
  }
}

function scrollToBottom() {
  if (messageContainer.value) {
    // Simply scroll to the actual bottom of the content
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}

function scrollToLatestMessage() {
  if (messageContainer.value) {
    const messageElements = messageContainer.value.querySelectorAll('.message-item');
    if (messageElements.length > 0) {
      const latestMessage = messageElements[messageElements.length - 1] as HTMLElement;
      // Scroll to the top of the latest message element
      messageContainer.value.scrollTo({ top: latestMessage.offsetTop, behavior: 'smooth' });
    }
  }
}

const handleScroll = () => {
  if (messageContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = messageContainer.value;
    // Show button if user has scrolled up significantly (e.g., more than half a viewport height from the bottom)
    // and there's enough content to scroll
    if (scrollHeight > clientHeight) {
      showScrollToLatestButton.value = scrollTop < scrollHeight - clientHeight - (clientHeight * 0.5);
    } else {
      showScrollToLatestButton.value = false;
    }
  }
};

// Suggestion feature removed
const shouldShowSuggestion = computed(() => false);

// Auto-scroll on new messages and emit updates to parent
watch(messages, () => {
  nextTick(scrollToBottom);
  // Emit the updated messages to the parent component
  emit('update:messages', [...messages]);
}, { deep: true });

// Methods exposed to parent
defineExpose({
  // Add the provided message to the history
  addMessage: (content: string, isUser: boolean = false) => {
    messages.push({
      id: uuidv4(),
      content,
      timestamp: new Date(),
      isUser
    });
  },
  // Clear the chat history
  clearChat: () => {
    messages.splice(0, messages.length);
  }
});

// Function to automatically send the initial message
function sendInitialMessage() {
  if (props.initialUserMessage) {
    console.log('Sending initial user message:', props.initialUserMessage);
    
    // Add the initial user message
    const userMessage: Message = {
      id: uuidv4(),
      content: props.initialUserMessage,
      timestamp: new Date(),
      isUser: true,
      isInitial: true // Mark as initial message
    };
    
    messages.push(userMessage);
    emit('message-sent', userMessage);
    
    // Generate AI response to the initial message
    nextTick(() => {
      scrollToBottom();
      generateResponse(props.initialUserMessage);
    });
  } else {
    console.log('No initial user message provided');
  }
}

onMounted(() => {
  // Log debug information
  console.log('ChatInterface mounted with props:', {
    initialUserMessage: props.initialUserMessage,
    initialAIResponse: props.initialAIResponse ? 'Present (truncated)' : 'None',
    assistantName: props.assistantName,
    tabId: props.tabId,
    defaultPrompt: props.defaultPrompt
  });
  
  // Scroll to bottom to show the conversation
  nextTick(() => {
    scrollToBottom();
    // Auto-send the initial message after a short delay to ensure UI is ready
    setTimeout(() => {
      sendInitialMessage();
    }, 500);
  });
});
</script>

<style scoped>
/* Add any specific styling here */
</style>

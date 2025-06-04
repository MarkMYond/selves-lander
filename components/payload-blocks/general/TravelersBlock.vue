<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
// Assuming payload-types.ts is correctly updated after generation
import type { TravelersBlock as TravelersBlockType } from '../../../../payload/src/payload-types'; // Adjusted path
// Import the composable instead of a component
import { useRichTextRenderer, type RichTextRoot } from '../../../composables/useRichTextRenderer';

// Define props to accept a block prop
const props = defineProps<{
  block: TravelersBlockType & { // Use the imported and aliased type
    id: string;
    removeTopPadding?: boolean | null;
    removeBottomPadding?: boolean | null;
    // tabsFeature is part of TravelersBlockType
  }
}>();

const { getMediaUrl } = useMediaUrl(); // Keep if buttons or other parts might use media

// Map Payload background color values to Tailwind classes
const sectionBgClass = computed(() => {
  switch (props.block.sectionBackgroundColor) {
    case 'white': return 'bg-white';
    case 'light-grey': return 'bg-brand-50';
    case 'brand-50': return 'bg-brand-50';
    case 'brand-900': return 'bg-brand-900';
    case 'brand-primary': return 'bg-brand-primary';
    default: return 'bg-white';
  }
});

const contentBgClass = computed(() => {
  switch (props.block.contentBackgroundColor) {
    case 'white': return 'bg-white';
    case 'light-grey': return 'bg-brand-50';
    case 'brand-50': return 'bg-brand-50';
    case 'brand-900': return 'bg-brand-900';
    case 'brand-primary': return 'bg-brand-primary';
    default: return 'bg-white';
  }
});

// Container width class
const containerClass = computed(() => {
  switch (props.block.containerWidth) {
    case 'medium': return 'max-w-5xl';
    case 'wide': return 'max-w-7xl';
    case 'full': return 'max-w-none';
    default: return 'max-w-7xl'; // Default to wide
  }
});

// Button classes based on style - Large Oval Style
const getButtonClasses = (style: string | undefined | null) => {
  const baseClasses = 'inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-base [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']';
  if (style === 'secondary') {
    return `${baseClasses} border-[3px] border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white`;
  }
  return `${baseClasses} border border-transparent text-white bg-brand-primary hover:bg-brand-900`;
};

// Computed class for padding
const paddingClasses = computed(() => {
  const classes = [];
  const defaultTopPadding = 'pt-40 max-md:pt-40 max-sm:pt-24'; // Doubled from pt-20/pt-12
  const defaultBottomPadding = 'pb-32'; // Doubled from pb-16

  if (props.block.removeTopPadding) {
    classes.push('pt-0');
  } else {
    classes.push(defaultTopPadding);
  }

  if (props.block.removeBottomPadding) {
    classes.push('pb-0');
  } else {
    classes.push(defaultBottomPadding);
  }
  return classes.join(' ');
});

// Tab logic
const activeTabIndex = ref(0);

// Track which tabs have chat activated
const activatedChats = ref<Set<number>>(new Set());

// Store chat histories for each tab
const tabChatHistories = reactive<{[key: number]: Array<{id: string, content: string, timestamp: Date, isUser: boolean}>}>({});

// References to chat components for each tab
  activeTabIndex.value = index;
  // Reset isGenerating flag when switching tabs
  // This ensures typing indicators don't persist between tabs

// Use the composable for the active tab's rich text content
const activeTabRichTextRoot = computed(() => activeTabContent.value?.tabContent?.root as RichTextRoot | undefined);
const { renderedHtml: renderedHtmlForActiveTab } = useRichTextRenderer(activeTabRichTextRoot);

</script>

// Check if chat is activated for the current tab
const isChatActivated = computed(() => {
  return activatedChats.value.has(activeTabIndex.value);
});

  tabChatHistories[index] = [...messages];
};

// Get a reference to the chat interface for a specific tab
const registerChatRef = (index: number, ref: any) => {
  chatRefs.value[index] = ref;
};

// Check if chat is activated for the current tab
const isChatActivated = computed(() => {
  return activatedChats.value.has(activeTabIndex.value);
});

// Directly extract the active tab to avoid reactive issues
const activeTabContent = computed(() => {
  if (props.block.tabsFeature && props.block.tabsFeature[activeTabIndex.value]) {
    // Make a defensive copy to ensure all properties are properly tracked
    const tab = { ...props.block.tabsFeature[activeTabIndex.value] };
    return tab;
  }
  return null;
});

// Default mock values for local development - these match what's expected in the schema
// but aren't present in the current remote data
const DEFAULT_INITIAL_MESSAGE = 'I want a city break to London as a couple looking at the Royal Family';
const DEFAULT_INITIAL_RESPONSE = "I'd be happy to help you plan a Royal Family-focused city break to London! The British monarchy is a fascinating institution with a rich history. Here are some key attractions you might want to include:\n\n- Buckingham Palace (try to catch the Changing of the Guard)\n- Kensington Palace (former home of Princess Diana)\n- Windsor Castle (a short trip from central London)\n- Westminster Abbey (site of royal weddings and coronations)\n\nWhen would you like to visit, and how many days are you planning to stay?";

// Debug computed values that are important for the chat component
const getChatProps = computed(() => {
  const tab = activeTabContent.value; // Use the existing computed property for active tab data
  let systemPromptContent = tab?.systemPrompt || 'You are a helpful travel assistant specializing in London trips.';
  
  // Use the tab title to create a relevant default message if the tab's theme is known
  let defaultMsg = DEFAULT_INITIAL_MESSAGE;
  if (tab?.tabTitle) {
    // If we have a tab title, customize the initial message to match the tab's theme
    const title = tab.tabTitle.toLowerCase();
    if (title.includes('agentic')) {
      defaultMsg = "How would an agentic travel assistant help me plan a trip to London?";
      // Append instruction for Markdown code blocks to the agentic tab's system prompt
      systemPromptContent += "\n\nWhen outputting structured data, logs, or agent-to-agent messages, please use Markdown code blocks (e.g., ```json\n{\n  \"key\": \"value\"\n}\n```) or inline code (`like_this`) for clarity.";
    } else if (title.includes('gen-ai')) {
      defaultMsg = "Tell me all about London's attractions for a Royal Family enthusiast.";
    } else if (title.includes('web') || title.includes('ota')) {
      defaultMsg = "What are the best hotels near Buckingham Palace?";
    } else if (title.includes('human')) {
      defaultMsg = "What local tips would a London travel agent give me for visiting the Royal Family locations?";
    }
  }

  // Ensure that if a modelName is provided from CMS, it's an OpenAI model, otherwise default.
  let resolvedModelName = 'gpt-4.1-2025-04-14'; // Default OpenAI model
  if (tab?.modelName) {
    if (tab.modelName.startsWith('gpt-')) {
      resolvedModelName = tab.modelName;
    } else {
      // If CMS provides a non-OpenAI model (e.g., old Gemini model), log and use default OpenAI
      console.warn(`CMS provided non-OpenAI model '${tab.modelName}', defaulting to '${resolvedModelName}'.`);
    }
  }
  
  return {
    defaultPrompt: props.block.defaultConversationStarter || 'Ask me about travel to London!',
    systemPrompt: systemPromptContent,
    assistantName: tab?.avatarName || 'Travel Assistant',
    initialUserMessage: tab?.initialUserMessage || defaultMsg,
    initialAIResponse: tab?.initialAIResponse || DEFAULT_INITIAL_RESPONSE,
    modelName: resolvedModelName,
    tabImageUrl: tab?.tabImage?.url || ''
  };
});

const formattedTabDescription = computed(() => {
  if (activeTabContent.value?.tabContent) {
    // Replace **text** with <strong>text</strong>
    // Ensure to escape HTML in the original content before adding <strong> tags
    // to prevent XSS if the content isn't fully trusted.
    // However, since it's from CMS, we'll assume basic trust for now.
    // A more robust solution would sanitize before processing.
      <div
        class="flex gap-12 items-start mx-auto w-full max-lg:flex-col max-md:gap-9 max-sm:gap-9"
        :class="[
          // Apply max-width only lg and up
          {
            'lg:max-w-5xl': props.block.containerWidth === 'medium',
            'lg:max-w-7xl': props.block.containerWidth === 'wide' || !props.block.containerWidth || props.block.containerWidth === 'default',
            'lg:max-w-none': props.block.containerWidth === 'full'
          }
        ]"
      >
        <!-- Left Side: Text Content Area -->
        <div class="flex-1 lg:w-1/2">
          <div class="mx-auto max-w-[618px] max-md:max-w-none px-4 lg:px-0">
            <h2
              v-if="props.block.title"
              :class="[
                'text-brand-900 dark:text-brand-100 mb-10 tracking-tight',
                props.block.titleStyle === 'large'
                  ? 'text-8xl leading-[96px] max-md:text-7xl max-md:leading-[76px] max-sm:text-5xl max-sm:leading-[56px]'
                  : 'text-7xl leading-[86px] max-md:text-6xl max-md:leading-[66px] max-sm:text-4xl max-sm:leading-10'
              ]"
              v-html="props.block.title"
            ></h2>
            <div v-if="props.block.description" class="mb-10">
               <p class="text-xl leading-8 text-brand-900 dark:text-brand-100 max-md:mb-7 max-sm:mb-7 max-w-none [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']">{{ props.block.description }}</p>
            </div>
            <div v-if="props.block.buttons && props.block.buttons.length > 0" class="flex flex-wrap gap-4">
              <a
                v-for="(button, index) in props.block.buttons"
                :key="index"
                :href="button.url"
                :class="getButtonClasses(button.style)"
                :aria-label="button.text"
                target="_blank" rel="noopener noreferrer"
              >
                {{ button.text }}
              </a>
            </div>
          </div>
        </div>

        <!-- Right Side: Tabs Feature -->
        <div class="flex-1 lg:w-1/2 p-4">
          <div class="border-[3px] border-brand-primary rounded-2xl shadow-lg"> <!-- Changed to 3px border with more rounded corners -->
            <!-- Tab Buttons -->
            <div role="tablist" class="flex w-full overflow-hidden relative border-b-[3px] border-brand-primary">
              <!-- Active tab indicator removed -->
              <button
                class="flex-1 text-center relative"
                v-for="(tab, index) in props.block.tabsFeature"
                :key="index"
                role="tab"
                :id="`tab-${props.block.id}-${index}`"
                :aria-selected="activeTabIndex === index"
                :aria-controls="`panel-${props.block.id}-${index}`"
                @click="selectTab(index)"
                @keydown.right.prevent="selectTab((index + 1) % (props.block.tabsFeature?.length || 1))"
                @keydown.left.prevent="selectTab((index - 1 + (props.block.tabsFeature?.length || 1)) % (props.block.tabsFeature?.length || 1))"
                :class="[
                  'py-3 text-lg font-medium focus:outline-none transition-all duration-200',
                  activeTabIndex === index
                    ? 'bg-brand-primary text-white relative z-10'
                    : 'text-gray-700 hover:bg-gray-100',
                  // Specific tab border logic per requirements
                  {
                    // Tab 2 (index 1) has both left and right borders
              <ClientOnly>
                <div v-if="renderedHtmlForActiveTab" class="prose max-w-none dark:prose-invert" v-html="renderedHtmlForActiveTab"></div>
                <template #fallback>
                  <div class="py-4">Loading content...</div>
                </template>
              </ClientOnly>
                  index !== 0 && index !== activeTabIndex
          </div>
            </div>
                ]"
                :tabindex="activeTabIndex === index ? 0 : -1"
              >
                <!-- No need for this span anymore -->
                {{ tab.tabTitle }}
              </button>
            </div>

            <!-- Tab Content Area -->
            <div 
              v-if="activeTabContent" 
              role="tabpanel"
              :id="`panel-${props.block.id}-${activeTabIndex}`"
              :aria-labelledby="`tab-${props.block.id}-${activeTabIndex}`"
              class="flex flex-col p-6 min-h-[480px] min-w-[400px]"
            >
              <!-- Debug removed -->
              
              <!-- Initial State: Description with Try Now Button -->
              <div v-if="!isChatActivated" class="flex flex-col h-[450px] max-sm:h-[420px] justify-between">
                <!-- Stacked Layout: Image, then Text in the upper part -->
                <div class="flex flex-col w-full gap-4">
                  <!-- Tab Image with improved error handling - 1.5x larger -->
                  <div class="w-full flex-shrink-0">
                    <img 
                      v-if="activeTabContent?.tabImage?.url" 
                      :src="getMediaUrl(activeTabContent.tabImage.url)" 
                      :alt="activeTabContent.tabImage.alt || activeTabContent.tabTitle"
                      class="w-full h-auto rounded-2xl object-cover max-w-[336px] max-sm:max-w-[280px] mx-auto transform scale-90"
                      @error="($event.target as HTMLImageElement).style.display = 'none'"
                      ref="tabImage"
                    />
                    <div v-else
                         class="bg-gray-100 rounded-2xl flex items-center justify-center h-full min-h-[180px] max-w-[336px] max-sm:max-w-[280px] mx-auto transform scale-90">
                      <div class="text-gray-400 text-center">Image placeholder</div>
                    </div>
                  </div>
                  
                  <!-- Text Content Area -->
                  <div class="w-full text-center mb-4">
                    <div class="whitespace-pre-wrap max-w-[600px] mx-auto">
                      <p class="text-xl leading-8 text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']">{{ activeTabContent.tabContent }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Try Now Button - Centered -->
                <div class="flex justify-center mt-4">
                  <button
                    @click="activateChatForTab(activeTabIndex)"
                    class="inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-base border border-transparent text-white bg-brand-primary hover:bg-brand-900"
                  >
                    Try Now
                    <div class="whitespace-pre-wrap max-w-[600px] mx-auto">
                      <p 
                        class="text-xl leading-8 text-brand-900 dark:text-brand-100 [font-variant-ligatures:stylistic] [font-feature-settings:\'ss01\']" 
                        v-html="formattedTabDescription"
                      ></p>
                    </div>
                  </div>
                </div>
                
                <!-- Try Now Button - Centered -->
                <div class="flex justify-center">
                  <button
                    @click="activateChatForTab(activeTabIndex)"
                    class="inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-base border border-transparent text-white bg-brand-primary hover:bg-brand-900"
                  >
                    Try Now
                  </button>
                </div>
              </div>
              
              <!-- Chat Interface (shown after Try Now is clicked) -->
              <div v-else class="flex-1">
                <ChatInterface 
                  :key="`chat-${props.block.id}-tab-${activeTabIndex}`" 
                  ref="chatInterface"
                  :default-prompt="props.block.defaultConversationStarter || ''"
                  :system-prompt="getChatProps.systemPrompt"
                  :assistant-name="getChatProps.assistantName"
                  :avatar-url="activeTabContent?.avatarImage?.url ? getMediaUrl(activeTabContent.avatarImage.url) : undefined"
                  :tab-id="`${props.block.id}-tab-${activeTabIndex}`"
  :initial-user-message="!tabChatHistories[activeTabIndex] || tabChatHistories[activeTabIndex].length === 0 ? getChatProps.initialUserMessage : ''"
  :initial-ai-response="!tabChatHistories[activeTabIndex] || tabChatHistories[activeTabIndex].length === 0 ? getChatProps.initialAIResponse : ''"
  :model-name="getChatProps.modelName"
  :saved-messages="tabChatHistories[activeTabIndex] || []"
                  @update:messages="saveTabChatHistory(activeTabIndex, $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

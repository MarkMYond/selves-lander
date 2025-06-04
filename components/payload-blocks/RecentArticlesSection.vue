<template>
  <section class="recent-articles-section blog-section-01 block-section-padding"> <!-- Removed section-padding -->
    <div class="w-layout-blockcontainer container mx-auto px-4 sm:px-6 lg:px-8 w-container">
      <div 
        class="blog-wrapper-1 space-y-6"
        ref="sectionTitleRef" 
      >
        <SectionHeader
          v-if="props.block.title"
          :eyebrowText="props.block.eyebrowText"
          :eyebrowBackgroundColor="getEyebrowBgClass(props.block.eyebrowBackgroundColor)"
          :title="props.block.title"
          :subtitle="props.block.subTitle"
          class="" 
        />
        <!-- SectionHeader does not have internal bottom margin. 
             The space-y-12/md:space-y-16 on blog-wrapper-1 will handle spacing to the grid. -->

        <div 
          v-if="props.block?.articles && props.block.articles.length > 0"
          class="blog-collection-list-wrapper"
          ref="cardsWrapperRef"
        >
          <div class="blog-collection-list _2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div 
              v-for="(article, index) in props.block.articles" 
              :key="article.id || `article-${index}`" 
              class="blog-card flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl p-6 space-y-4"
            >
              <!-- Eyebrow moved to top of card -->
              <div v-if="article.eyebrowText" class="inline-block self-start">
                <p 
                  class="text-body-14 font-medium text-brandNeutral-04 px-3 py-1 rounded-full"
                  :class="[getEyebrowBgClass(article.articleEyebrowBackgroundColor)]"
                >
                  {{ article.eyebrowText }}
                </p>
              </div>
              <NuxtLink 
                v-if="article.link"
                :to="getLinkUrl(article.link)" 
                :target="article.link?.newTab ? '_blank' : undefined"
                class="blog-image-wrapper block h-48 md:h-56 overflow-hidden"
              >
                <img 
                  v-if="article.image && typeof article.image === 'object' && article.image.url"
                  :src="getMediaUrl(article.image)" 
                  loading="lazy" 
                  :alt="article.image.alt || article.articleTitle || 'Article image'" 
                  class="blog-card-image w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                >
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400">Placeholder</span>
                </div>
              </NuxtLink>
              
              <div class="blog-content-button flex flex-col justify-between flex-grow space-y-4">
                <div class="space-y-3">
                  
                  <!-- Article Title -->
                  <NuxtLink 
                    v-if="article.articleTitle && article.link"
                    :to="getLinkUrl(article.link)" 
                    :target="article.link?.newTab ? '_blank' : undefined"
                    class="w-inline-block group"
                  >
                    <h3 class="blog-card-title-small text-xl font-semibold text-brand-800 group-hover:text-primary-600 transition-colors leading-tight">
                      {{ article.articleTitle }}
                    </h3>
                  </NuxtLink>
                  <h3 v-else-if="article.articleTitle" class="blog-card-title-small text-xl font-semibold text-brand-800 leading-tight">
                    {{ article.articleTitle }}
                  </h3>

                  <!-- Article Excerpt -->
                  <p v-if="article.articleExcerpt" class="blog-para text-sm text-gray-600 line-clamp-3">
                    {{ article.articleExcerpt }}
                  </p>
                </div>
                <NuxtLink 
                  v-if="article.buttonText && article.link"
                  :to="getLinkUrl(article.link)" 
                  :target="article.link?.newTab ? '_blank' : undefined"
                  class="mt-auto self-start"
                >
                  <BaseButton
                    variant="border"
                  >
                    {{ article.buttonText }}
                  </BaseButton>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <p>No articles to display.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { PropType } from 'vue';
import { useScrollAnimations } from '@/composables/useScrollAnimations';
import { useMediaUrl } from '@/composables/useMediaUrl';
// Remove LinkField import, define local type for link data
import type { RecentArticlesBlock, Media, WebPage } from '@/src/payload-types';
import BaseButton from '@/components/ui/BaseButton.vue'; // Import BaseButton
import SectionHeader from '@/components/ui/SectionHeader.vue'; // Import SectionHeader

// Define a local interface for the shape of the 'link' group data
interface ArticleLinkDataType { // This is for the button link, not directly related to eyebrow color
  type?: 'internal' | 'external' | null;
  label?: string | null; // The label from the link group itself
  internalLink?: string | WebPage | null; // ID string or populated WebPage object
  externalLink?: string | null;
  newTab?: boolean | null;
}

const props = defineProps({
  block: {
    type: Object as PropType<RecentArticlesBlock>,
    required: true,
  },
});

const { getMediaUrl } = useMediaUrl();
const { registerElement } = useScrollAnimations();

const sectionTitleRef = ref<HTMLElement | null>(null);
const cardsWrapperRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (sectionTitleRef.value) {
    const id = sectionTitleRef.value.getAttribute('data-w-id');
    if (id) registerElement(id, sectionTitleRef.value);
  }
  if (cardsWrapperRef.value) {
    const id = cardsWrapperRef.value.getAttribute('data-w-id');
    if (id) registerElement(id, cardsWrapperRef.value);
  }
});

const getLinkUrl = (linkData?: ArticleLinkDataType | null): string => { // Use the new local interface
  if (!linkData) return '#';

  if (linkData.type === 'internal' && linkData.internalLink) { // Check internalLink directly
    const internalValue = linkData.internalLink; // internalValue is string | WebPage
    if (typeof internalValue === 'object' && internalValue !== null && 'slug' in internalValue && typeof internalValue.slug === 'string') {
      return `/${internalValue.slug}`; // It's a WebPage object
    }
    if (typeof internalValue === 'string') {
      // It's an ID or a slug/path string
      return internalValue.startsWith('/') ? internalValue : `/${internalValue}`;
    }
  }
  if (linkData.type === 'external' && linkData.externalLink) {
    return linkData.externalLink;
  }
  return '#';
};

const getEyebrowBgClass = (bgColorValue?: string | null) => { // Renamed from getArticleEyebrowBgClass
  // Mapping based on the options defined in RecentArticlesBlock.ts
  // and SectionHeader's default prop value for consistency.
  switch (bgColorValue) {
    case 'theme-color-01':
    case 'purple':
    case 'purple-light':
      return 'bg-brandTheme-01';
    case 'theme-color-02': // This is the default from Payload
    case 'default': 
      return 'bg-brandTheme-02';
    case 'theme-color-03':
    case 'green':
      return 'bg-brandTheme-03';
    case 'theme-color-04':
    case 'yellow':
      return 'bg-brandTheme-04';
    // Add cases for direct Tailwind classes if your select field stores them
    // e.g., case 'bg-red-500': return 'bg-red-500';
    default:
      return 'bg-brandTheme-02'; // Fallback default
  }
};
</script>

<style scoped>
/* Scoped styles specific to RecentArticlesSection */
.section-padding { /* From Webflow */
  padding-top: var(--heading--global-section-padding, 130px);
  padding-bottom: var(--heading--global-section-padding, 130px);
}
.blog-section-01 { /* From Webflow */
  /* padding-top: 100px; */ /* Overridden by section-padding or py-16 */
  /* padding-bottom: 140px; */ /* Overridden by section-padding or py-16 */
}

.bg-theme-color-02 { /* For eyebrow, if not globally defined */
  background-color: var(--color--theme-color-02, #c9ff85); 
}
.bg-theme-color-02 p {
   color: var(--color--neutral-04, #120a0b);
}

/* Additional styling to match Webflow if Tailwind utilities are not sufficient */
.blog-card-title-small {
  /* Webflow might have specific line-height, letter-spacing, etc. */
}
.blog-para {
  /* Webflow might have specific line-height, letter-spacing, etc. */
}
.button.border-button {
  /* Ensure this matches Webflow's border button style if different from Tailwind defaults */
  /* Example: border-color: var(--color--neutral-04); color: var(--color--neutral-04); */
}
</style>

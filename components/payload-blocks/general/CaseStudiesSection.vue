<script setup lang="ts">
import CaseStudyCard from './CaseStudyCard.vue'
import { useMediaUrl } from '../../../composables/useMediaUrl'

interface CaseStudyPayload {
  image: {
    id: string
    url?: string
    filename?: string
  } | any // Using any to accommodate Media type expected by useMediaUrl
  title: string
  link: string
  bgColor?: string
  id?: string
}

interface CaseStudySectionData {
  blockType: 'caseStudySection'
  title?: string
  caseStudies: CaseStudyPayload[]
  sectionBackgroundColor?: string
  containerWidth?: string
  removeTopPadding?: boolean | null;
  removeBottomPadding?: boolean | null;
}

// Accept a block prop instead of individual props
const props = defineProps<{
  block: CaseStudySectionData
}>()

// Computed class for padding
const paddingClasses = computed(() => {
  const classes = [];
  const defaultTopPadding = 'pt-16 md:pt-24';
  const defaultBottomPadding = 'pb-16 md:pb-24';

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

// Get the getMediaUrl function from the media URL composable
const { getMediaUrl } = useMediaUrl();
</script>

<template>
  <section
    :class="[
      paddingClasses, // Use new padding classes
      block.sectionBackgroundColor ? block.sectionBackgroundColor : 'bg-brand-50',
    ]"
  >
    <div
      :class="[
        'mx-auto w-full',
        block.containerWidth === 'medium' ? 'max-w-5xl' :
        block.containerWidth === 'full' ? 'max-w-none' :
        'max-w-7xl',
        'max-sm:relative',
      ]"
    >
      <div class="px-3 mx-6 max-sm:px-5">
        <div> <!-- Removed pt-16 pb-32 etc. from this div -->
          <div>
            <header v-if="block.title" class="mx-auto mb-10 w-[480px] max-sm:w-full">
              <h2
                class="self-stretch text-brand-900 dark:text-brand-100 text-4xl tracking-tighter text-center leading-[56px] max-md:self-center max-sm:text-3xl max-sm:leading-10"
              >
                {{ block.title }}
              </h2>
            </header>
            <div class="w-full">
              <div
                v-if="block.caseStudies && block.caseStudies.length > 0"
                role="list"
                class="grid gap-4 gap-y-4 w-full grid-rows-[auto]"
                style="
                  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                "
              >
                <CaseStudyCard
                  v-for="caseStudy in block.caseStudies"
                  :key="caseStudy.id"
                  :imageUrl="getMediaUrl(caseStudy.image as any)"
                  :title="caseStudy.title"
                  :linkUrl="caseStudy.link"
                  :bgColor="caseStudy.bgColor"
                />
              </div>
              <div v-else class="text-center text-gray-500">
                No case studies available.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

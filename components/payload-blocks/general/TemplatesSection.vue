<script setup lang="ts">
import TemplateCard from './TemplateCard.vue'

interface TemplateItem {
  id: number
  href: string
  imageUrl: string
  imageAlt: string
  title: string
  category: string
  backgroundColor: string
  hasBorder?: boolean
}

// Template data
const templates: TemplateItem[] = [
  {
    id: 1,
    href: 'https://slite.com/templates/okr-template',
    imageUrl:
      'https://cdn.prod.website-files.com/5f84417443f34a30444f52d3/64ff1b7b47964e4c53be78f9_Illustration-Marketing-playbook.webp',
    imageAlt: 'Icon Marketing playbook',
    title: 'OKRs',
    category: 'Planning',
    backgroundColor: 'bg-red-200',
  },
  {
    id: 2,
    href: 'https://slite.com/templates/product-roadmap',
    imageUrl:
      'https://cdn.prod.website-files.com/5f84417443f34a30444f52d3/64e324b8b25b77698e267f02_illustration-sl.png',
    imageAlt: '',
    title: 'Product planning',
    category: 'Project documentation',
    backgroundColor: 'bg-orange-400',
  },
  {
    id: 3,
    href: 'https://slite.com/templates/employee-onboarding',
    imageUrl:
      'https://cdn.prod.website-files.com/5f84417443f34a30444f52d3/64ff1c024de75d7cf9b7d225_Illustration-Employee-Handbook.webp',
    imageAlt: 'Icon Employee Handbook',
    title: 'Employee Handbook',
    category: 'Onboarding',
    backgroundColor: 'bg-white',
  },
  {
    id: 4,
    href: 'https://slite.com/templates/product-specs',
    imageUrl:
      'https://cdn.prod.website-files.com/5f84417443f34a30444f52d3/64ff1c23279a74890ecd914d_Illustration-Product-specs.webp',
    imageAlt: 'Icon Product specs',
    title: 'Product specs',
    category: 'Project documentations',
    backgroundColor: 'bg-white',
  },
  {
    id: 5,
    href: 'https://slite.com/templates/daily-check-ins',
    imageUrl:
      'https://cdn.prod.website-files.com/5f84417443f34a30444f52d3/64ff1c4b16ba2b512aa754eb_Illustration-Standup-meetings.webp',
    imageAlt: 'Icon Standup meetings',
    title: 'Standup meetings',
    category: 'Meeting',
    backgroundColor: 'bg-orange-100',
  },
  {
    id: 6,
    href: 'https://slite.com/templates',
    imageUrl:
      'https://cdn.prod.website-files.com/5f84417443f34a30444f52d3/64e324b8b25b77698e267f02_illustration-sl.png',
    imageAlt: '',
    title: 'Many many more',
    category: '→',
    backgroundColor: 'bg-brand-50',
    hasBorder: true,
  },
]
</script>

<template>
  <section class="bg-brand-50">
    <div class="mx-auto w-full max-w-[1140px] max-sm:relative">
      <div class="px-3 mx-6 max-sm:px-5">
        <div class="py-10 max-md:py-16 max-sm:py-12">
          <div class="grid gap-8 gap-y-8 grid-rows-[auto]">
            <div
              class="grid row-span-1 gap-6 gap-y-6 grid-rows-[auto_auto] max-sm:flex max-sm:overflow-x-scroll max-sm:overflow-y-scroll"
            >
              <TemplateCard
                v-for="template in templates"
                :key="template.id"
                :href="template.href"
                :image-url="template.imageUrl"
                :image-alt="template.imageAlt"
                :title="template.title"
                :category="template.category"
                :background-color="template.backgroundColor"
                :has-border="template.hasBorder"
              />
            </div>

            <div
              class="flex flex-col gap-0 gap-y-0 self-center max-md:-order-last"
            >
              <header class="mb-4 max-md:mb-6 max-sm:mb-5">
                <p
                  class="text-base leading-relaxed font-bold uppercase whitespace-pre-line border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
                >
                  Templates
                </p>
              </header>
              <div class="mb-4 max-md:mb-6 max-sm:mb-5">
                <h3 class="text-2xl leading-8">
                  Beat the blank canvas
                </h3>
              </div>
              <div class="mb-8 max-md:mb-12">
                <p
                  class="text-base leading-6 [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
                >
                  Use our ready-made templates to get started in minutes, and
                  keep your company docs consistent across all teams.
                </p>
              </div>
              <div>
                <a
                  href="https://slite.com/templates"
                  class="px-4 py-2.5 text-base text-center text-white border-white cursor-pointer outline-white bg-zinc-800 decoration-white duration-&lsqb;0.2s&rsqb; rounded-[50px] max-sm:w-full [font-variant-ligatures:stylistic] [font-feature-settings:'ss01']"
                  aria-label="Browse all templates"
                  target="_blank"
                  rel="noopener noreferrer"
                >Browse all templates</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

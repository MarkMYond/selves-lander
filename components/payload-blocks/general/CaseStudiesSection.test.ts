import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CaseStudiesSection from './CaseStudiesSection.vue'
import CaseStudyCard from './CaseStudyCard.vue'

const mockCaseStudiesData = {
  blockType: 'caseStudySection' as const,
  title: "Slite's helped more companies, read more:",
  caseStudies: [
    {
      id: '1',
      title: 'How GraphXSource ditched Obsidian and Notion for Slite',
      link: 'https://slite.com/customers/graphx-source',
      image: {
        id: 'img1',
        url: 'https://cdn.prod.website-files.com/5fda3048302e579473bfb454/67c81e196901b2a16f4eb20f_GraphX%20Source-p-1080.png',
      },
    },
    {
      id: '2',
      title: 'How TSN Lab synced their team at the speed of innovation',
      link: 'https://slite.com/customers/tsn-lab',
      image: {
        id: 'img2',
        url: 'https://cdn.prod.website-files.com/5fda3048302e579473bfb454/67976f27547ed937c85d9bac_TSN%20lab-p-1080.png',
      },
    },
    {
      id: '3',
      title:
        'How Filmustage uses documentation to empower the next generation of filmmaking',
      link: 'https://slite.com/customers/filmustage',
      image: {
        id: 'img3',
        url: 'https://cdn.prod.website-files.com/5fda3048302e579473bfb454/6790bacba82850ef10e34bb9_Filmustage-p-1080.png',
      },
    },
  ],
}

describe('CaseStudiesSection', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(CaseStudiesSection, {
      props: {
        block: mockCaseStudiesData,
      },
    })

    expect(wrapper.find('h2').text()).toContain(
      "Slite's helped more companies, read more:"
    )

    expect(wrapper.findAllComponents(CaseStudyCard)).toHaveLength(3)
  })

  it('passes correct props to CaseStudyCard components', () => {
    const wrapper = mount(CaseStudiesSection, {
      props: {
        block: mockCaseStudiesData,
      },
    })
    const cards = wrapper.findAllComponents(CaseStudyCard)

    expect(cards[0].props('imageUrl')).toBe(
      'https://cdn.prod.website-files.com/5fda3048302e579473bfb454/67c81e196901b2a16f4eb20f_GraphX%20Source-p-1080.png'
    )
    expect(cards[0].props('title')).toBe(
      'How GraphXSource ditched Obsidian and Notion for Slite'
    )
    expect(cards[0].props('linkUrl')).toBe(
      'https://slite.com/customers/graphx-source'
    )

    expect(cards[1].props('imageUrl')).toBe(
      'https://cdn.prod.website-files.com/5fda3048302e579473bfb454/67976f27547ed937c85d9bac_TSN%20lab-p-1080.png'
    )
    expect(cards[1].props('title')).toBe(
      'How TSN Lab synced their team at the speed of innovation'
    )
    expect(cards[1].props('linkUrl')).toBe(
      'https://slite.com/customers/tsn-lab'
    )

    expect(cards[2].props('imageUrl')).toBe(
      'https://cdn.prod.website-files.com/5fda3048302e579473bfb454/6790bacba82850ef10e34bb9_Filmustage-p-1080.png'
    )
    expect(cards[2].props('title')).toBe(
      'How Filmustage uses documentation to empower the next generation of filmmaking'
    )
    expect(cards[2].props('linkUrl')).toBe(
      'https://slite.com/customers/filmustage'
    )
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(CaseStudiesSection, {
      props: {
        block: mockCaseStudiesData,
      },
    })

    expect(wrapper.find('[role="list"]').exists()).toBe(true)

    expect(wrapper.findAllComponents(CaseStudyCard)).toHaveLength(3)
  })
})

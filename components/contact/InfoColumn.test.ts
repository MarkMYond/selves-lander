import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InfoColumn from './InfoColumn.vue'

describe('InfoColumn', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(InfoColumn)
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct heading text', () => {
    const heading = wrapper.find('h1')
    expect(heading.text()).toContain("Let's see if we're a good fit.")
    expect(heading.text()).toContain('Schedule a call with our team today.')
  })

  it('contains the Gibson logo', () => {
    const logo = wrapper.find('img[alt="Gibson Logo"]')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('src')).toBe(
      'https://assets.website-files.com/62d05a592fa7fc4c367e8625/62d067c756d0f96ca3d5678e_gibson-logo.svg'
    )
  })

  it('has a "Learn more" button', () => {
    const learnMoreButton = wrapper
      .findAll('a')
      .find((a) => a.text().includes('Learn more'))
    expect(learnMoreButton.exists()).toBe(true)
  })

  it('contains footer links', () => {
    const footerLinks = wrapper.findAll('footer a')
    expect(footerLinks.length).toBe(2)
    expect(footerLinks[0].text()).toBe('Terms')
    expect(footerLinks[1].text()).toBe('Content policy')
  })

  it('applies responsive classes', () => {
    const section = wrapper.find('section')
    expect(section.classes()).toContain('max-md:h-auto')
    expect(section.classes()).toContain('max-sm:pb-4')

    const heading = wrapper.find('h1')
    expect(heading.classes()).toContain('max-sm:text-3xl')
  })

  it('hides footer on mobile devices', () => {
    const footer = wrapper.find('footer')
    expect(footer.classes()).toContain('max-md:hidden')
  })
})

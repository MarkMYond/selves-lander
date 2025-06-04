import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CaseStudyCard from './CaseStudyCard.vue'

describe('CaseStudyCard', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/image.jpg',
    title: 'Test Case Study',
    linkUrl: 'https://example.com/case-study',
  }

  it('renders with correct props', () => {
    const wrapper = mount(CaseStudyCard, {
      props: defaultProps,
    })

    // Check if image has correct src
    expect(wrapper.find('img').attributes('src')).toBe(defaultProps.imageUrl)

    // Check if title is rendered correctly
    expect(wrapper.find('h3').text()).toBe(defaultProps.title)

    // Check if link has correct href
    expect(wrapper.find('a').attributes('href')).toBe(defaultProps.linkUrl)
    expect(wrapper.find('a').text()).toBe('Read now')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(CaseStudyCard, {
      props: defaultProps,
    })

    // Check if card has proper role
    expect(wrapper.attributes('role')).toBe('listitem')

    // Check if link is accessible
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe(defaultProps.linkUrl)
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(CaseStudyCard, {
      props: defaultProps,
    })

    // Check if card has border styling
    const cardContainer = wrapper.find('div > div')
    expect(cardContainer.classes()).toContain('border')
    expect(cardContainer.classes()).toContain('border-black')
    expect(cardContainer.classes()).toContain('rounded-2xl')

    // Check if button has correct styling
    const button = wrapper.find('a')
    expect(button.classes()).toContain('outline')
    expect(button.classes()).toContain('rounded-[50px]')
  })
})

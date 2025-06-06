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

    expect(wrapper.find('img').attributes('src')).toBe(defaultProps.imageUrl)

    expect(wrapper.find('h3').text()).toBe(defaultProps.title)

    expect(wrapper.find('a').attributes('href')).toBe(defaultProps.linkUrl)
    expect(wrapper.find('a').text()).toBe('Read now')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(CaseStudyCard, {
      props: defaultProps,
    })

    expect(wrapper.attributes('role')).toBe('listitem')

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe(defaultProps.linkUrl)
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(CaseStudyCard, {
      props: defaultProps,
    })

    const cardContainer = wrapper.find('div > div')
    expect(cardContainer.classes()).toContain('border')
    expect(cardContainer.classes()).toContain('border-black')
    expect(cardContainer.classes()).toContain('rounded-2xl')

    const button = wrapper.find('a')
    expect(button.classes()).toContain('outline')
    expect(button.classes()).toContain('rounded-[50px]')
  })
})

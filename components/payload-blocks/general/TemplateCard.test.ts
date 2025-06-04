import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateCard from './TemplateCard.vue'

describe('TemplateCard', () => {
  const defaultProps = {
    href: 'https://example.com',
    imageUrl: 'https://example.com/image.jpg',
    imageAlt: 'Test image',
    title: 'Test Title',
    category: 'Test Category',
    backgroundColor: 'bg-red-200',
  }

  it('renders the component correctly', () => {
    const wrapper = mount(TemplateCard, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('p.text-2xl').text()).toBe('Test Title')
    expect(wrapper.find('p.text-xs').text()).toBe('Test Category')
  })

  it('applies the correct background color class', () => {
    const wrapper = mount(TemplateCard, { props: defaultProps })
    expect(wrapper.classes()).toContain('bg-red-200')
  })

  it('renders with border when hasBorder is true', () => {
    const wrapper = mount(TemplateCard, {
      props: { ...defaultProps, hasBorder: true },
    })
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('border-zinc-800')
  })

  it('sets the correct href attribute', () => {
    const wrapper = mount(TemplateCard, { props: defaultProps })
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })

  it('renders the image with correct attributes', () => {
    const wrapper = mount(TemplateCard, { props: defaultProps })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(img.attributes('alt')).toBe('Test image')
  })
})

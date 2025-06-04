import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplatesSection from './TemplatesSection.vue'
import TemplateCard from './TemplateCard.vue'

describe('TemplatesSection', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(TemplatesSection)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Beat the blank canvas')
  })

  it('renders all template cards', () => {
    const wrapper = mount(TemplatesSection)
    const cards = wrapper.findAllComponents(TemplateCard)
    expect(cards.length).toBe(6)
  })

  it('has the correct CTA button', () => {
    const wrapper = mount(TemplatesSection)
    const cta = wrapper.find('a[href="https://slite.com/templates"]')
    expect(cta.exists()).toBe(true)
    expect(cta.text()).toBe('Browse all templates')
  })

  it('has proper responsive classes', () => {
    const wrapper = mount(TemplatesSection)
    const container = wrapper.find('.max-sm\\:relative')
    expect(container.exists()).toBe(true)

    const cardsContainer = wrapper.find(
      '.max-sm\\:flex.max-sm\\:overflow-x-scroll'
    )
    expect(cardsContainer.exists()).toBe(true)
  })
})

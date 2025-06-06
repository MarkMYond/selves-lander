import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PricingPlans from './PricingPlans.vue'
import PlanCard from './PlanCard.vue'
import BillingToggle from './BillingToggle.vue'

describe('PricingPlans', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(PricingPlans)
    expect(wrapper.find('h1').text()).toBe(
      'Plans for every stage of your company'
    )
    expect(wrapper.findAllComponents(PlanCard)).toHaveLength(3)
  })

  it('renders all three plan cards with correct titles', () => {
    const wrapper = mount(PricingPlans)
    const planCards = wrapper.findAllComponents(PlanCard)

    expect(planCards[0].props('title')).toBe('Standard')
    expect(planCards[1].props('title')).toBe('Premium')
    expect(planCards[2].props('title')).toBe('Enterprise')
  })

  it('renders correct pricing information', () => {
    const wrapper = mount(PricingPlans)
    const planCards = wrapper.findAllComponents(PlanCard)

    expect(planCards[0].props('price')).toBe('$8')
    expect(planCards[1].props('price')).toBe('$12.5')
    expect(planCards[2].props('price')).toBe('')
  })
})

describe('PlanCard', () => {
  it('renders the card with correct content', () => {
    const wrapper = mount(PlanCard, {
      props: {
        title: 'Test Plan',
        description: 'Test description',
        price: '$10',
        bgColorClass: 'bg-white',
        ctaText: 'Sign Up',
        ctaLink: 'https://example.com',
      },
    })

    expect(wrapper.find('h3').text()).toBe('Test Plan')
    expect(wrapper.find('p').text()).toBe('Test description')
    expect(wrapper.find('b').text()).toBe('$10')
    expect(wrapper.find('a').text()).toBe('Sign Up')
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
  })

  it('renders the billing toggle when price is provided', () => {
    const wrapper = mount(PlanCard, {
      props: {
        title: 'Test Plan',
        description: 'Test description',
        price: '$10',
        bgColorClass: 'bg-white',
        ctaText: 'Sign Up',
        ctaLink: 'https://example.com',
      },
    })

    expect(wrapper.findComponent(BillingToggle).exists()).toBe(true)
  })

  it('does not render the billing toggle when price is not provided', () => {
    const wrapper = mount(PlanCard, {
      props: {
        title: 'Enterprise',
        description: 'Test description',
        price: '',
        bgColorClass: 'bg-indigo-300',
        ctaText: 'Contact Us',
        ctaLink: 'https://example.com',
      },
    })

    expect(wrapper.text()).toContain("Let's chat")
    expect(wrapper.findComponent(BillingToggle).exists()).toBe(false)
  })
})

describe('BillingToggle', () => {
  it('emits update event when clicked', async () => {
    const wrapper = mount(BillingToggle, {
      props: {
        modelValue: true,
      },
    })

    await wrapper.find('div[role="switch"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('renders with correct accessibility attributes', () => {
    const wrapper = mount(BillingToggle, {
      props: {
        modelValue: true,
      },
    })

    const toggle = wrapper.find('div[role="switch"]')
    expect(toggle.attributes('role')).toBe('switch')
    expect(toggle.attributes('aria-checked')).toBe('true')
    expect(toggle.attributes('tabindex')).toBe('0')
  })
})

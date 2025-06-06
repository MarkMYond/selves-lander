import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ScheduleCallForm from './ScheduleCallForm.vue'
import InfoColumn from './InfoColumn.vue'
import FormColumn from './FormColumn.vue'

vi.mock('./InfoColumn.vue', () => ({
  default: {
    name: 'InfoColumn',
    render: () => null,
  },
}))

vi.mock('./FormColumn.vue', () => ({
  default: {
    name: 'FormColumn',
    render: () => null,
  },
}))

describe('ScheduleCallForm', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ScheduleCallForm)
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('contains InfoColumn and FormColumn components', () => {
    expect(wrapper.findComponent(InfoColumn).exists()).toBe(true)
    expect(wrapper.findComponent(FormColumn).exists()).toBe(true)
  })

  it('has the correct layout structure', () => {
    const columns = wrapper.findAll('.w-6/12')
    expect(columns.length).toBe(2)
  })

  it('applies responsive classes for mobile view', () => {
    const container = wrapper.find('.flex')
    expect(container.classes()).toContain('max-md:flex-col')
  })
})

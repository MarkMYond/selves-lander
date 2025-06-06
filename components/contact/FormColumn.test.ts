import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FormColumn from './FormColumn.vue'

describe('FormColumn', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(FormColumn)
  })

  it('renders the form component', () => {
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('contains all required form fields', () => {
    expect(wrapper.find('input[name="First-name"]').exists()).toBe(true)
    expect(wrapper.find('input[name="Last-name"]').exists()).toBe(true)
    expect(wrapper.find('input[name="Email"]').exists()).toBe(true)
    expect(wrapper.find('input[name="Twitter"]').exists()).toBe(true)
    expect(wrapper.find('input[name="Instagram"]').exists()).toBe(true)
    expect(wrapper.find('input[name="LinkedIn"]').exists()).toBe(true)
    expect(wrapper.find('input[value="Designer"]').exists()).toBe(true)
    expect(wrapper.find('input[value="Researcher"]').exists()).toBe(true)
    expect(wrapper.find('input[value="Developer"]').exists()).toBe(true)
    expect(wrapper.find('input[value="Manager"]').exists()).toBe(true)
  })

  it('updates form data when inputs change', async () => {
    const firstNameInput = wrapper.find('input[name="First-name"]')
    await firstNameInput.setValue('John')
    expect((wrapper.vm as any).formData.firstName).toBe('John')

    const emailInput = wrapper.find('input[name="Email"]')
    await emailInput.setValue('john@example.com')
    expect((wrapper.vm as any).formData.email).toBe('john@example.com')

    const roleInput = wrapper.find('input[value="Designer"]')
    await roleInput.setValue(true)
    expect((wrapper.vm as any).formData.role).toBe('Designer')
  })

  it('submits the form and shows success message', async () => {
    await wrapper.find('input[name="First-name"]').setValue('John')
    await wrapper.find('input[name="Last-name"]').setValue('Doe')
    await wrapper.find('input[name="Email"]').setValue('john@example.com')
    await wrapper.find('input[value="Designer"]').setValue(true)

    await wrapper.find('form').trigger('submit')

    await flushPromises()

    expect((wrapper.vm as any).formState.success).toBe(true)
    expect(wrapper.find('[aria-label="Email Form success"]').isVisible()).toBe(
      true
    )
  })

  it('handles form submission errors', async () => {
    const originalConsoleError = console.error
    console.error = vi.fn()

    vi.spyOn(wrapper.vm as any, 'handleSubmit').mockImplementation(async () => {
      ;(wrapper.vm as any).formState.error = true
      ;(wrapper.vm as any).formState.submitting = false
      throw new Error('Test error')
    })

    await wrapper.find('input[name="First-name"]').setValue('John')
    await wrapper.find('input[name="Last-name"]').setValue('Doe')
    await wrapper.find('input[name="Email"]').setValue('john@example.com')
    await wrapper.find('input[value="Designer"]').setValue(true)

    await wrapper.find('form').trigger('submit')

    await flushPromises()

    expect((wrapper.vm as any).formState.error).toBe(true)
    expect(wrapper.find('[aria-label="Email Form failure"]').isVisible()).toBe(
      true
    )

    console.error = originalConsoleError
  })
})

import { ref, onMounted, onUnmounted } from 'vue'

export const useScrollAnimations = () => {
  const animatedElements = ref<Map<string, HTMLElement>>(new Map())
  const observer = ref<IntersectionObserver | null>(null)

  const registerElement = (id: string, element: HTMLElement) => {
    animatedElements.value.set(id, element)
    if (observer.value) {
      observer.value.observe(element)
    }
  }

  const unregisterElement = (id: string) => {
    const element = animatedElements.value.get(id)
    if (element && observer.value) {
      observer.value.unobserve(element)
    }
    animatedElements.value.delete(id)
  }

  const initializeObserver = () => {
    if (process.client) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement
            const elementId = element.getAttribute('data-w-id')

            if (entry.isIntersecting) {
              // Add animation class when element enters viewport
              element.classList.add('animate-in')
              element.style.opacity = '1'
              element.style.transform = 'translateY(0)'
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      )

      // Observe all registered elements
      animatedElements.value.forEach((element) => {
        observer.value?.observe(element)
      })
    }
  }

  onMounted(() => {
    initializeObserver()
  })

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })

  return {
    registerElement,
    unregisterElement,
  }
}

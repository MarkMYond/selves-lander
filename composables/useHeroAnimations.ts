import { ref, onMounted, onUnmounted } from 'vue'

export const useHeroAnimations = () => {
  const animationTimers = ref<NodeJS.Timeout[]>([])
  
  const initializeHeroAnimations = () => {
    if (process.client) {
      // Animate Charles and You elements with staggered timing
      animateCharlesAndYouElements()
      
      // Animate hero arrows with floating effect
      animateHeroArrows()
      
      // Animate hero bottom arrows with pulse effect
      animateHeroBottomArrows()
      
      // Add hover interactions for Charles/You elements
      addCharlesYouInteractions()
    }
  }

  const animateCharlesAndYouElements = () => {
    // First, try to find hero-specific elements (for index page)
    const charlesElement = document.querySelector('.charles-point-right-wrapper.hero-left') as HTMLElement
    const youElement = document.querySelector('.charles-point-left-wrapper.hero-right') as HTMLElement
    
    if (charlesElement && youElement) {
      // Initial state - hidden
      charlesElement.style.opacity = '0'
      charlesElement.style.transform = 'translateX(-50px) scale(0.8)'
      youElement.style.opacity = '0'
      youElement.style.transform = 'translateX(50px) scale(0.8)'
      
      // Animate Charles first
      const timer1 = setTimeout(() => {
        charlesElement.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        charlesElement.style.opacity = '1'
        charlesElement.style.transform = 'translateX(0) scale(1)'
        
        // Add floating animation
        charlesElement.style.animation = 'heroFloat 3s ease-in-out infinite'
      }, 500)
      
      // Animate You element second
      const timer2 = setTimeout(() => {
        youElement.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        youElement.style.opacity = '1'
        youElement.style.transform = 'translateX(0) scale(1)'
        
        // Add floating animation with offset
        youElement.style.animation = 'heroFloat 3s ease-in-out infinite 1.5s'
      }, 800)
      
      animationTimers.value.push(timer1, timer2)
    } else {
      // Fallback: animate all Charles/James elements (for sign-in/sign-up pages and other hero variants)
      const charlesElements = document.querySelectorAll('.charles-point-right-wrapper, .hero-2-arrow-button .charles-point-right-wrapper') as NodeListOf<HTMLElement>
      
      charlesElements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0'
        element.style.transform = 'scale(0.8)'
        
        // Animate with staggered timing
        const timer = setTimeout(() => {
          element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          element.style.opacity = '1'
          element.style.transform = 'scale(1)'
          
          // Add floating animation with slight delay offset for each element
          setTimeout(() => {
            element.style.animation = `heroFloat 3s ease-in-out infinite ${index * 0.5}s`
          }, 200)
        }, 500 + (index * 300))
        
        animationTimers.value.push(timer)
      })
    }
  }

  const animateHeroArrows = () => {
    const arrows = document.querySelectorAll('.charles-point-right-icon, .charles-point-left-icon, .hero-2-arrow-button .charles-point-right-icon')
    
    arrows.forEach((arrow, index) => {
      const arrowElement = arrow as HTMLElement
      const timer = setTimeout(() => {
        arrowElement.style.transition = 'all 0.6s ease-out'
        arrowElement.style.animation = 'arrowBounce 2s ease-in-out infinite'
      }, 1200 + (index * 200))
      
      animationTimers.value.push(timer)
    })
  }

  const animateHeroBottomArrows = () => {
    const heroBottomRightIcon = document.querySelector('.hero-bottom-right-icon[data-w-id="dca238e7-d096-a005-69db-d020ae18b69c"]') as HTMLElement
    const heroBottomLeftIcon = document.querySelector('.hero-bottom-left-icon') as HTMLElement
    
    if (heroBottomRightIcon) {
      const timer1 = setTimeout(() => {
        heroBottomRightIcon.style.animation = 'arrowPulse 2.5s ease-in-out infinite'
      }, 1500)
      animationTimers.value.push(timer1)
    }
    
    if (heroBottomLeftIcon) {
      const timer2 = setTimeout(() => {
        heroBottomLeftIcon.style.animation = 'arrowPulse 2.5s ease-in-out infinite 1.25s'
      }, 1700)
      animationTimers.value.push(timer2)
    }
  }

  const addCharlesYouInteractions = () => {
    // First try hero-specific elements
    const charlesWrapper = document.querySelector('.charles-point-right-wrapper.hero-left') as HTMLElement
    const youWrapper = document.querySelector('.charles-point-left-wrapper.hero-right') as HTMLElement
    
    let wrappers = [charlesWrapper, youWrapper].filter(Boolean) as HTMLElement[]
    
    // If no hero-specific elements found, get all Charles elements (including hero-2 variant)
    if (wrappers.length === 0) {
      wrappers = Array.from(document.querySelectorAll('.charles-point-right-wrapper, .hero-2-arrow-button .charles-point-right-wrapper')) as HTMLElement[]
    }
    
    wrappers.forEach((wrapper) => {
      if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
          wrapper.style.transform = 'scale(1.1)'
          wrapper.style.transition = 'transform 0.3s ease-out'
        })
        
        wrapper.addEventListener('mouseleave', () => {
          wrapper.style.transform = 'scale(1)'
        })
        
        // Add click ripple effect
        wrapper.addEventListener('click', (e: MouseEvent) => {
          const ripple = document.createElement('div')
          ripple.className = 'click-ripple'
          wrapper.appendChild(ripple)
          
          const rect = wrapper.getBoundingClientRect()
          const size = Math.max(rect.width, rect.height)
          ripple.style.width = ripple.style.height = size + 'px'
          ripple.style.left = (e.clientX - rect.left - size / 2) + 'px'
          ripple.style.top = (e.clientY - rect.top - size / 2) + 'px'
          
          setTimeout(() => {
            ripple.remove()
          }, 600)
        })
      }
    })
  }

  const cleanupAnimations = () => {
    animationTimers.value.forEach((timer) => {
      clearTimeout(timer)
    })
    animationTimers.value = []
  }

  onMounted(() => {
    const timer = setTimeout(() => {
      initializeHeroAnimations()
    }, 100) // Small delay to ensure DOM is ready
    
    animationTimers.value.push(timer)
  })

  onUnmounted(() => {
    cleanupAnimations()
  })

  return {
    initializeHeroAnimations,
    cleanupAnimations
  }
}

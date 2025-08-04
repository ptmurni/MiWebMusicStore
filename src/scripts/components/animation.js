/**
 * Animation Utilities
 * Handles scroll animations, fade effects, and interactive animations
 */

export class AnimationUtils {
  static observers = [];
  static animatedElements = new WeakSet();

  /**
   * Initialize animation system
   */
  static init() {
    // Initialize scroll animations
    AnimationUtils.initScrollAnimations();
    
    // Initialize hover animations
    AnimationUtils.initHoverAnimations();
    
    // Initialize loading animations
    AnimationUtils.initLoadingAnimations();

    console.log('✅ Animation utilities initialized');
  }

  /**
   * Initialize scroll-triggered animations
   */
  static initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !AnimationUtils.animatedElements.has(entry.target)) {
          AnimationUtils.triggerAnimation(entry.target);
          AnimationUtils.animatedElements.add(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      observer.observe(element);
    });

    AnimationUtils.observers.push(observer);
  }

  /**
   * Trigger animation on element
   */
  static triggerAnimation(element) {
    const animationType = element.getAttribute('data-animate');
    const delay = parseInt(element.getAttribute('data-delay')) || 0;
    const duration = parseInt(element.getAttribute('data-duration')) || 600;

    setTimeout(() => {
      switch (animationType) {
        case 'fade-in':
          AnimationUtils.fadeIn(element, duration);
          break;
        case 'slide-up':
          AnimationUtils.slideUp(element, duration);
          break;
        case 'slide-down':
          AnimationUtils.slideDown(element, duration);
          break;
        case 'slide-left':
          AnimationUtils.slideLeft(element, duration);
          break;
        case 'slide-right':
          AnimationUtils.slideRight(element, duration);
          break;
        case 'scale':
          AnimationUtils.scale(element, duration);
          break;
        case 'bounce':
          AnimationUtils.bounce(element, duration);
          break;
        case 'rotate':
          AnimationUtils.rotate(element, duration);
          break;
        default:
          AnimationUtils.fadeIn(element, duration);
      }
    }, delay);
  }

  /**
   * Fade in animation
   */
  static fadeIn(element, duration = 600) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  /**
   * Slide up animation
   */
  static slideUp(element, duration = 600) {
    element.style.transform = 'translateY(50px)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    });
  }

  /**
   * Slide down animation
   */
  static slideDown(element, duration = 600) {
    element.style.transform = 'translateY(-50px)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    });
  }

  /**
   * Slide left animation
   */
  static slideLeft(element, duration = 600) {
    element.style.transform = 'translateX(50px)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    });
  }

  /**
   * Slide right animation
   */
  static slideRight(element, duration = 600) {
    element.style.transform = 'translateX(-50px)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    });
  }

  /**
   * Scale animation
   */
  static scale(element, duration = 600) {
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });
  }

  /**
   * Bounce animation
   */
  static bounce(element, duration = 600) {
    element.style.transform = 'translateY(30px)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    });
  }

  /**
   * Rotate animation
   */
  static rotate(element, duration = 600) {
    element.style.transform = 'rotate(-10deg) scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'rotate(0deg) scale(1)';
      element.style.opacity = '1';
    });
  }

  /**
   * Initialize hover animations
   */
  static initHoverAnimations() {
    // Card hover effects
    const cards = document.querySelectorAll('.card, .service-card, .feature-card');
    cards.forEach(card => {
      AnimationUtils.addHoverEffect(card, 'lift');
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
      AnimationUtils.addHoverEffect(button, 'scale');
    });

    // Icon hover effects
    const icons = document.querySelectorAll('.icon, iconify-icon');
    icons.forEach(icon => {
      AnimationUtils.addHoverEffect(icon, 'bounce');
    });
  }

  /**
   * Add hover effect to element
   */
  static addHoverEffect(element, effect) {
    let isAnimating = false;

    element.addEventListener('mouseenter', () => {
      if (isAnimating) return;
      isAnimating = true;

      switch (effect) {
        case 'lift':
          element.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          element.style.transform = 'translateY(-5px)';
          element.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
          break;
        case 'scale':
          element.style.transition = 'transform 0.2s ease';
          element.style.transform = 'scale(1.05)';
          break;
        case 'bounce':
          element.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          element.style.transform = 'scale(1.1)';
          break;
        case 'rotate':
          element.style.transition = 'transform 0.3s ease';
          element.style.transform = 'rotate(5deg)';
          break;
      }

      setTimeout(() => {
        isAnimating = false;
      }, 300);
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
      if (effect === 'lift') {
        element.style.boxShadow = '';
      }
    });
  }

  /**
   * Initialize loading animations
   */
  static initLoadingAnimations() {
    // Add loading state to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          AnimationUtils.addLoadingState(submitBtn);
        }
      });
    });
  }

  /**
   * Add loading state to button
   */
  static addLoadingState(button) {
    const originalText = button.textContent;
    const originalHTML = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = `
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        <span>Memproses...</span>
      </div>
    `;

    // Simulate loading (remove this in real implementation)
    setTimeout(() => {
      AnimationUtils.removeLoadingState(button, originalHTML);
    }, 2000);
  }

  /**
   * Remove loading state from button
   */
  static removeLoadingState(button, originalHTML) {
    button.disabled = false;
    button.innerHTML = originalHTML;
  }

  /**
   * Animate number counting
   */
  static animateNumber(element, start, end, duration = 2000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      
      element.textContent = Math.floor(current).toLocaleString('id-ID');
    }, 16);
  }

  /**
   * Smooth scroll to element
   */
  static scrollToElement(targetSelector, offset = 0, duration = 800) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const targetPosition = target.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = AnimationUtils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  /**
   * Easing function for smooth animations
   */
  static easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  /**
   * Parallax effect
   */
  static initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    function updateParallax() {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }

    window.addEventListener('scroll', AnimationUtils.throttle(updateParallax, 16));
  }

  /**
   * Throttle function for performance
   */
  static throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  /**
   * Stagger animation for multiple elements
   */
  static staggerAnimation(elements, animationType = 'fade-in', staggerDelay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        AnimationUtils.triggerAnimation(element);
      }, index * staggerDelay);
    });
  }

  /**
   * Cleanup animations and observers
   */
  static cleanup() {
    AnimationUtils.observers.forEach(observer => {
      observer.disconnect();
    });
    AnimationUtils.observers = [];
    AnimationUtils.animatedElements = new WeakSet();
  }

  /**
   * Reset all animations
   */
  static resetAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      element.style.opacity = '';
      element.style.transform = '';
      element.style.transition = '';
    });
    AnimationUtils.animatedElements = new WeakSet();
  }
}

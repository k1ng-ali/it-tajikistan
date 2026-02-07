<!-- ScrollToTop.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const isVisible = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Плавное появление
  gsap.to('.scroll-top-btn', {
    opacity: 0,
    scale: 0.8,
    duration: 0
  })
})

const handleScroll = () => {
  isVisible.value = window.scrollY > 500

  if (isVisible.value) {
    gsap.to('.scroll-top-btn', {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  } else {
    gsap.to('.scroll-top-btn', {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in'
    })
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <button
      class="scroll-top-btn"
      :class="{ 'visible': isVisible }"
      @click="scrollToTop"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<style scoped lang="scss">
.scroll-top-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #a7fb00;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 999;
  opacity: 0;
  transform: scale(0.8);

  &:hover {
    background: rgba(167, 251, 0, 0.1);
    border-color: rgba(167, 251, 0, 0.4);
    box-shadow: 0 0 30px rgba(167, 251, 0, 0.2);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 768px) {
  .scroll-top-btn {
    right: 20px;
    bottom: 20px;
    width: 45px;
    height: 45px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
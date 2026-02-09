<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const sections = ref([])
const activeIndex = ref(0)
let triggers = []

const scrollTo = (el) => {
  gsap.to(window, {
    scrollTo: el,
    duration: 1,
    ease: 'power2.out'
  })
}

onMounted(() => {
  const nodes = gsap.utils.toArray('[data-nav]')

  sections.value = nodes.map(el => ({
    el,
    label: el.dataset.nav
  }))

  triggers = sections.value.map((section, i) =>
      ScrollTrigger.create({
        trigger: section.el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => (activeIndex.value = i),
        onEnterBack: () => (activeIndex.value = i)
      })
  )
})

onUnmounted(() => {
  triggers.forEach(t => t.kill())
})
</script>

<template>
  <nav class="section-nav">
    <div
        v-for="(section, i) in sections"
        :key="i"
        class="nav-item"
        :class="{ active: activeIndex === i }"
        @click="scrollTo(section.el)"
    >
      <span class="label">{{ section.label }}</span>
      <!-- Для мобилки добавляем индикатор -->
      <span class="mobile-indicator"></span>
    </div>
  </nav>
</template>


<style scoped lang="scss">
.section-nav {
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 1000;

  // 🔥 МОБИЛЬНАЯ ВЕРСИЯ - внизу экрана
  @media (max-width: 768px) {
    // Меняем позиционирование
    right: auto;
    top: auto;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    // Горизонтальное расположение
    flex-direction: row;
    gap: 12px;

    // Стильный фон для мобилки
    background: rgba(42, 42, 42, 0.3);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 12px 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
}

.nav-item {
  position: relative;
  width: 6px;
  height: 28px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #a7fb00;
    transform: scaleY(1.3);
  }

  &.active {
    background: #a7fb00;
    box-shadow: 0 0 10px rgba(167, 251, 0, 0.8);
  }

  // 🔥 МОБИЛЬНАЯ ВЕРСИЯ - компактные точки
  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
    border-radius: 50%; // Круглые точки
    background: rgba(255, 255, 255, 0.4);

    &:hover {
      transform: scale(1.3);
    }

    &.active {
      width: 28px; // Вытягиваем активный элемент
      border-radius: 12px;
      background: #a7fb00;
      box-shadow: 0 0 16px rgba(167, 251, 0, 0.6);
    }

    // На мобилке убираем label при наведении
    // Вместо этого используем тактильный фидбек
    &:active {
      transform: scale(0.85);
    }
  }
}

.label {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;

  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  color: #fff;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;

  .nav-item:hover & {
    opacity: 1;
    transform: translate(-6px, -50%);
  }

  // 🔥 На мобилке полностью скрываем labels
  @media (max-width: 768px) {
    display: none;
  }
}

// Мобильный индикатор (не используется на десктопе)
.mobile-indicator {
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
}
</style>
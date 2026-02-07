<!-- Background.vue -->
<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  // Плавный параллакс для сетки
  gsap.to('.grid-main', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5
    }
  })

  // Более медленный параллакс для второй сетки
  gsap.to('.grid-secondary', {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  })

  // Определяем секции для смены цвета (адаптируем под ваш сайт)
  const sections = [
    { selector: '.hero', color: '#291d1a' },
    { selector: '.about', color: '#131327' },
    { selector: '.services', color: '#2d2d7e' },
    { selector: '.team', color: '#1b1b3a' },
    { selector: '.contacts-title', color: '#0f0f1a' } // для контактов
  ]

  // Создаем анимацию смены цвета фона
  const bgAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      markers: false
    }
  })

  // Добавляем ключевые точки для смены цвета
  sections.forEach((section, index) => {
    const progress = index / (sections.length - 1)

    bgAnimation.to('.layer-1', {
      backgroundColor: section.color,
      duration: 0.5
    }, progress)

    // Меняем прозрачность градиентов для создания атмосферы
    bgAnimation.to('.gradient-1', {
      opacity: 0.3 + (index * 0.1),
      duration: 0.5
    }, progress)

    bgAnimation.to('.gradient-2', {
      opacity: 0.2 + (index * 0.05),
      duration: 0.5
    }, progress)
  })
})
</script>

<template>
  <div class="bg">
    <!-- Базовый слой с основным цветом -->
    <div class="layer-1"></div>

    <!-- Простые градиенты без анимации движения -->
    <div class="gradient-1"></div>
    <div class="gradient-2"></div>

    <!-- Основная сетка с параллаксом -->
    <div class="grid-main"></div>

    <!-- Вторичная сетка для глубины -->
    <div class="grid-secondary"></div>

    <!-- Тонкая текстура -->
    <div class="texture"></div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.layer-1 {
  position: absolute;
  inset: 0;
  background: #0f0f1a; // Начальный цвет
  transition: background-color 0.5s ease;
}

.gradient-1,
.gradient-2 {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  mix-blend-mode: screen;
  opacity: 0.3;
  transition: opacity 0.5s ease;
}

.gradient-1 {
  top: -40vh;
  left: -20vw;
  width: 80vw;
  height: 80vh;
  background: radial-gradient(circle,
      rgba(167, 251, 0, 0.25) 0%,
      transparent 60%);
}

.gradient-2 {
  bottom: -40vh;
  right: -20vw;
  width: 70vw;
  height: 70vh;
  background: radial-gradient(circle,
      rgba(100, 150, 255, 0.2) 0%,
      transparent 60%);
}

.grid-main,
.grid-secondary {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-repeat: repeat;
}

.grid-main {
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;

  /* Легкая маска для фокуса в центре */
  mask-image: radial-gradient(
          ellipse at center,
          rgba(0, 0, 0, 0.8) 30%,
          rgba(0, 0, 0, 0.3) 70%,
          transparent 100%
  );
}

.grid-secondary {
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 120px 120px;
  opacity: 0.08;
}

.texture {
  position: absolute;
  inset: 0;
  /* Минималистичная текстура шума */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: 0.1;
  mix-blend-mode: overlay;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .gradient-1,
  .gradient-2 {
    filter: blur(80px);
  }

  .gradient-1 {
    width: 100vw;
    height: 100vh;
    top: -30vh;
  }

  .gradient-2 {
    width: 90vw;
    height: 90vh;
    bottom: -30vh;
  }

  .grid-main {
    background-size: 40px 40px;
  }

  .grid-secondary {
    background-size: 80px 80px;
  }
}

@media (max-width: 768px) {
  .grid-main {
    background-size: 30px 30px;
  }

  .grid-secondary {
    background-size: 60px 60px;
  }
}
</style>
<template>
  <nav class="nav-container">
    <div class="bottom-bar">
      <!-- Контейнер для делений -->
      <div class="ticks-wrapper">
        <div v-for="i in 30" :key="i" class="tick"></div>
      </div>
      <!-- Активный красный маркер -->
      <div ref="markerRef" class="active-marker"></div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const markerRef = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    // Анимация маркера вдоль всей ширины контейнера
    gsap.to(markerRef.value, {
      // Используем x, а не xPercent для точного контроля
      // Двигает маркер от начала до конца родителя (минус отступы)
      x: () =>
          markerRef.value.parentElement.clientWidth -
          markerRef.value.offsetWidth - 15,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end:  () => document.documentElement.scrollHeight - window.innerHeight,
        scrub: 0.5,
      }
    });
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<style scoped>
.nav-container {
  position: fixed;
  bottom: 40px;
  left: 50px;
  z-index: 1000;
  pointer-events: none;
}

.bottom-bar {
  position: relative;
  width: 200px;
  height: 25px;
  display: flex;
  align-items: center;
  padding: 0 8px;

  /* Эффект стекла */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px) saturate(160%);
  -webkit-backdrop-filter: blur(15px) saturate(160%);

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 7px; /* Сделаем форму капсулы */
  box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.2);
}

.ticks-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between; /* Равномерно распределяем деления */
  align-items: center;
}

.tick {
  width: 1px;
  height: 8px;
  background: rgba(142, 142, 142, 0.75);
  border-radius: 1px;
}

.active-marker {
  position: absolute;
  left: 8px; /* Стартовая позиция */
  width: 3px;
  height: 18px;
  background: #ff3e3e;
  border-radius: 4px;
  box-shadow: 0 0 6px rgb(255, 62, 62);
  z-index: 2;
}
</style>

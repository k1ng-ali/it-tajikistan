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
}

.nav-item {
  position: relative;
  width: 6px;
  height: 28px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.25s ease;
}

.nav-item:hover {
  background: #a7fb00;
  transform: scaleY(1.3);
}

.nav-item.active {
  background: #a7fb00;
  box-shadow: 0 0 10px rgba(167, 251, 0, 0.8);
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
}

.nav-item:hover .label {
  opacity: 1;
  transform: translate(-6px, -50%);
}

</style>

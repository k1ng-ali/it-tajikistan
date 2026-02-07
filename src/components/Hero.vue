<script setup>
  import {gsap} from "gsap";
  import {ScrollTrigger} from "gsap/ScrollTrigger";
  import {onMounted} from "vue";
  import {useMouse} from "@vueuse/core";
  import { computed } from 'vue'
  import logo from "../assets/Logo.svg";

  onMounted(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=200%',
        scrub: 1.5,
        pin: true,
      }
    });

    tl.to(".hero", {
      backgroundColor: "rgba(42,42,42,0)",
      ease: "none",
    });
    tl.to(".hero-title", {
      color: "#2a2a2a",
      opacity: 0.2,
      ease: "none"
    }, 0);

    gsap.set(".content", {
      opacity: 0,
      xPercent: -50,
      y: 20
    });

    tl.to(".content", {
      opacity: 1,
      y: 0,
      ease: "none",
    }, 0);
  })

  const {x,y} = useMouse({touch: false});

  const rotateX = computed(() => {
    return ((y.value / window.innerHeight) - 0.5) * -20
  })

  const rotateY = computed(() => {
    return ((x.value / window.innerWidth) - 0.5) * 20
  })
</script>


<template>
  <div class="hero" data-nav="hero">
    <h1 class="hero-title"
      :style="{
      '--rx': rotateX + 'deg',
      '--ry': rotateY + 'deg'}">
      <logo class="logotype"/> Tajikistan <span class="dot">●</span>
    </h1>
    <div class="content">
      <h3 class="hero-desc">
        Современные IT-решения для бизнеса и стартапов
      </h3>
      <p class="hero-text">
        Мы — команда молодых IT-специалистов из Таджикистана.
        Создаём веб-продукты, автоматизируем процессы, защищаем данные и строим надёжную инфраструктуру.
      </p>
      <button class="hero-button">Связаться с нами</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .hero{
    position: relative;
    height: 100vh;
    background: #f5f5f5;
  }
  .logotype {
    width: 75px;
    margin-right: 15px;
    fill: #2a2a2a;
  }

  .hero-title {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-10%)
      rotateX(var(--rx))
      rotateY(var(--ry));
    font-size: clamp(48px, 8vw, 120px);
    font-weight: 700;
    color: #2a2a2a;
    z-index: 2;
    transform-style: preserve-3d;
    transition: transform 0.15s ease-out;
  }
  .dot {
    margin-left: 10px;
    transform: translateY(2px);
    animation: impulse 2s ease infinite;
  }

  @keyframes impulse {
    0% {
      opacity: 1;
  }
    40% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .content {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 25%;
    left: 50%;
    width: 70vw;
    opacity: 0;
    z-index: 3;
    align-items: center;
  }
  .hero-desc {
    max-width: 600px;
    font-size: 20px;
    line-height: 1.5;
    color: #f5f5f5;
  }
  .hero-text {
    max-width: 600px;
    font-size: 20px;
    line-height: 1.5;
    color: #f5f5f5;
  }
  .hero-button {
    width: 200px;
    height: 50px;
    border-radius: 20px;
    border: none;
    font-size: large;
    font-weight: bold;
    color: #2a2a2a;
    margin: 0 auto;
  }
</style>
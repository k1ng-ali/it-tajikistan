<script setup>
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {onMounted, onUnmounted} from "vue";
import {useMouse} from "@vueuse/core";
import { computed } from 'vue'
import logo from "../assets/Logo.svg";

let mm; // MatchMedia instance

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  mm = gsap.matchMedia();

  // ========== DESKTOP VERSION (>768px) ==========
  mm.add("(min-width: 769px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=200%',
        scrub: 1.5,
        pin: true,

        onEnter: () => {
          gsap.set([".hero", ".hero-title", ".content"], {
            willChange: "transform, opacity, color, background"
          })
        },
        onLeave: () => {
          gsap.set([".hero", ".hero-title",  ".content"], {
            willChange: "auto"
          })
        },
        onEnterBack: () => {
          gsap.set([".hero", ".hero-title",  ".content"], {
            willChange: "transform, opacity, color, background"
          })
        },
      },
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

    return () => {}; // cleanup для десктопа
  });

  // ========== MOBILE VERSION (<=768px) ==========
  mm.add("(max-width: 768px)", () => {
    // Сбрасываем инлайн стили
    gsap.set([".hero", ".hero-title", ".content", ".white-curtain"], { clearProps: "all" });

    // Начальные состояния для мобилки
    gsap.set(".hero", {
      backgroundColor: "rgba(42,42,42,0)" // Прозрачный фон изначально
    });

    gsap.set(".hero-title", {
      opacity: 1,
      color: "#2a2a2a",
      zIndex: 10 // Над шторкой
    });

    gsap.set(".white-curtain", {
      y: 0 // Изначально закрывает экран
    });

    gsap.set(".content", {
      opacity: 1, // Уже видимый
      y: -20,
      scale: 1,
      zIndex: 1 // Под шторкой
    });

    // Анимация заголовка - уменьшается и исчезает
    gsap.to(".hero-title", {
      opacity: 0,
      scale: 0.85,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=40%',
        scrub: 1,
      }
    });

    // ГЛАВНАЯ АНИМАЦИЯ - белая шторка уезжает вверх (ВОРОТА ОТКРЫВАЮТСЯ)
    gsap.to(".white-curtain", {
      y: "-100%", // Уезжает полностью вверх
      ease: "none",
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=70%', // Быстро уезжает
        scrub: 1.2,
      }
    });

    // Контент медленно поднимается из-под шторки
    gsap.fromTo(".content",
        {
          y: 0, // Начинает ниже
        },
        {
          y: 0, // Поднимается на место
          scrollTrigger: {
            trigger: '.hero',
            start: '10% top',
            end: '20% top', // Медленнее чем шторка
            scrub: 2, // Более плавно
          }
        }
    );

    // Отдельные элементы контента появляются поэтапно
    gsap.set([".hero-desc", ".hero-text", ".hero-button"], {
      opacity: 1,
      y: 30
    });

    gsap.to(".hero-desc", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: '10% top',
        end: '+=80%',
        scrub: 1.5,
      }
    });

    gsap.to(".hero-text", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: '20% top',
        end: '+=90%',
        scrub: 1.5,
      }
    });

    gsap.to(".hero-button", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: '20% top',
        end: '+=100%',
        scrub: 1.5,
      }
    });

    return () => {}; // cleanup для мобилки
  });
});

onUnmounted(() => {
  if (mm) mm.revert();
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});

const {x, y} = useMouse({touch: false});

const rotateX = computed(() => {
  // Отключаем 3D эффект на мобилке
  if (window.innerWidth <= 768) return 0;
  return ((y.value / window.innerHeight) - 0.5) * -20
})

const rotateY = computed(() => {
  // Отключаем 3D эффект на мобилке
  if (window.innerWidth <= 768) return 0;
  return ((x.value / window.innerWidth) - 0.5) * 20
})
</script>


<template>
  <div class="hero" data-nav="hero">
    <!-- Белая шторка только для мобилки -->
    <div class="white-curtain"></div>

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
.hero {
  position: relative;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden; // Важно для скрытия уезжающей шторки

  @media (max-width: 768px) {
    min-height: 150vh;
    height: auto;
    padding-bottom: 60px;
    background: transparent; // Прозрачный фон на мобилке
  }
}

// Белая шторка (только на мобилке)
.white-curtain {
  display: none; // Скрыта на десктопе

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    z-index: 5; // Над контентом, но под заголовком
    will-change: transform;
  }
}

// 🔥 РЕШЕНИЕ: синхронизация размера логотипа с текстом
.logotype {
  // Используем относительный размер от font-size родителя
  height: 0.75em; // 75% от высоты шрифта заголовка
  width: auto; // Сохраняем пропорции
  margin-right: 0.15em; // Отступ тоже относительный
  fill: #2a2a2a;
  vertical-align: middle; // Выравнивание по центру текста

  // Небольшая коррекция для идеального выравнивания
  transform: translateY(-0.05em);
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
  line-height: 1.2; // Для предсказуемой высоты

  @media (max-width: 768px) {
    font-size: clamp(32px, 10vw, 60px);
    transform: none; // Центрируем
    transition: none; // Отключаем transition для GSAP
    padding: 0 20px;
    text-align: center;
    z-index: 10; // Над шторкой
    height: 80vh;
  }
}

.dot {
  margin-left: 0.1em; // Относительный отступ
  transform: translateY(0.05em); // Небольшая коррекция
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

  @media (max-width: 768px) {
    top: 35%; // Ниже на мобилке (было 35%)
    left: 0;
    width: 90vw;
    padding:50vh 20px 0 20px;
    transform: none; // Убираем transform для GSAP
    opacity: 1; // Видимый изначально
    z-index: 1; // Под шторкой
  }
}

.hero-desc {
  max-width: 600px;
  font-size: 20px;
  line-height: 1.5;
  color: #f5f5f5;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 18px;
    max-width: 100%;
  }
}

.hero-text {
  max-width: 600px;
  font-size: 20px;
  line-height: 1.5;
  color: #f5f5f5;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
    max-width: 100%;
    margin-top: 15px;
  }
}

.hero-button {
  width: 200px;
  height: 50px;
  border-radius: 20px;
  border: none;
  font-size: large;
  font-weight: bold;
  color: #2a2a2a;
  margin: 20px auto 0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 180px;
    height: 45px;
    font-size: medium;
    margin-top: 25px;

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
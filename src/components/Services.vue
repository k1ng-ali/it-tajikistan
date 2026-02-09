<!-- Services.vue -->
<script setup>
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {onMounted} from "vue";

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // Плавное появление из предыдущей секции
  gsap.fromTo(".services",
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".services",
          start: "top 90%",
          end: "top 50%",

        }
      }
  )

  // Появление заголовка
  gsap.fromTo(".services-title",
      {
        opacity: 0,
        scale: 0.8,
        y: 30
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".services",
          start: "top 80%",
          end: "top 40%",
          scrub: 0.5
        }
      }
  )

  // Пин секции и горизонтальный скролл
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".services",
      start: "top top",
      end: "+=300%",
      pin: true,
      anticipatePin: 1,
      markers: false,
      scrub: 0.5,

      onEnter: () => gsap.set(".services *", { willChange: "transform" }),
      onLeave: () => gsap.set(".services *", { willChange: "auto" }),
      onEnterBack: () => gsap.set(".services *", { willChange: "transform" })
    }
  })

  // Появление карточек одна за другой
  const cards = gsap.utils.toArray(".service")

  cards.forEach((card, index) => {
    gsap.set(card, {
      opacity: 0,
      x: 100,
      y: 40,
      scale: 0.95
    })

    tl.to(card, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    }, index * 0.15)
  })


  // Горизонтальный скролл после появления всех карточек
  tl.to(".services-content", {
    x: () => {
      const cardWidth = cards[0].offsetWidth
      const gap = 100
      return -(cardWidth + gap) * (cards.length - 1)
    },
    ease: "none",
    duration: 1.5
  }, "+=0.2")
})
</script>

<template>
  <div class="services"  data-nav="services">
    <div class="services-header">
      <h1 class="services-title">
        Наши направления
      </h1>
      <div class="services-subtitle">
        Комплексный подход к решению ваших задач
      </div>
    </div>

    <div class="services-container">
      <div class="services-content">
        <div class="service">
          <div class="service-icon">🧩</div>
          <h3>Full-stack разработка</h3>
          <p class="service-desc">Разрабатываем веб-приложения и сайты любой сложности — от идеи и дизайна до готового продукта и поддержки.</p>
        </div>
        <div class="service">
          <div class="service-icon">🤖</div>
          <h3>Автоматизация процессов</h3>
          <p class="service-desc">Создаём Telegram-ботов, системы автоматизации и программные решения, которые экономят время и ресурсы бизнеса.</p>
        </div>
        <div class="service">
          <div class="service-icon">🔐</div>
          <h3>Информационная безопасность</h3>
          <p class="service-desc">Обеспечиваем защиту данных, анализ уязвимостей и безопасность цифровых продуктов на всех этапах разработки.</p>
        </div>
        <div class="service">
          <div class="service-icon">☁️</div>
          <h3>Серверы и инфраструктура</h3>
          <p class="service-desc">Подбираем и настраиваем серверы, домены и хостинг под любые задачи — от небольших проектов до масштабных систем.</p>
        </div>
      </div>
    </div>

    <div class="services-footer">
      <div class="scroll-indicator">
        <div class="line"></div>
        <span>Прокрутите для знакомства с командой</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.services {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
        transparent 0%,
        rgba(167, 251, 0, 0.3) 50%,
        transparent 100%);
  }
}

.services-header {
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  z-index: 2;
}

.services-title {
  font-size: clamp(48px, 8vw, 96px);
  margin-bottom: 20px;
  will-change: transform, opacity;
}

.services-subtitle {
  font-size: clamp(18px, 2vw, 22px);
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
}

.services-container {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-bottom: 60px;
}

.services-content {
  display: flex;
  gap: 100px;
  padding: 0 50px;

  &:before, &:after {
    content: '';
    flex: 0 0 50px;
  }
}

.service {
  flex: 0 0 auto;
  width: 400px;
  padding: 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(167, 251, 0, 0.1);
  transform-origin: center bottom;
  will-change: transform, opacity;

  .service-icon {
    font-size: 48px;
    margin-bottom: 25px;
  }

  h3 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #fff;
  }
}

.service-desc {
  font-size: 17px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
}

.services-footer {
  text-align: center;
}

.scroll-indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  opacity: 0.6;

  .line {
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg,
        transparent 0%,
        #a7fb00 50%,
        transparent 100%);
  }

  span {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.7);
  }
}

@media (max-width: 1024px) {
  .services-content {
    gap: 60px;
    padding: 0 30px;

    &:before, &:after {
      flex: 0 0 30px;
    }
  }

  .service {
    width: 350px;
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .services {
    padding: 40px 20px;
  }

  .services-header {
    margin-bottom: 50px;
  }

  .services-content {
    gap: 40px;
    padding: 0 20px;

    &:before, &:after {
      flex: 0 0 20px;
    }
  }

  .service {
    width: 280px;
    padding: 25px;

    h3 {
      font-size: 22px;
    }

    .service-icon {
      font-size: 36px;
    }
  }

  .service-desc {
    font-size: 15px;
  }
}
</style>
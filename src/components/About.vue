<!-- About.vue -->
<script setup>
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {onMounted} from "vue";
import {SplitText} from "gsap/SplitText";

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  // 1. Появление заголовка (из центра)
  gsap.fromTo(
      ".about-title",
      {
        opacity: 0,
        scale: 1.5,
        y: 50
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about",
          start: "top 80%",
          end: "top 30%",
          scrub: 0.5,
          markers: false
        }
      }
  )

  // 2. Пин секции
  const pinTrigger = ScrollTrigger.create({
    trigger: ".about",
    start: "top top",
    end: "+=100%",
    pin: true,
    scrub: 1,
    anticipatePin: 1
  });

  // 3. Постепенное появление текста (связь со следующей секцией)
  const split = new SplitText(".about-text", {
    type: "lines, words",
    linesClass: "line",
    wordsClass: "word"
  });

  gsap.from(split.words, {
    opacity: 0,
    y: 30,
    stagger: 0.03,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".about",
      start: "top 40%",
      end: "+=100%",
      scrub: 0.5,
      toggleActions: "play none none reverse"
    }
  })

  // 4. Плавный переход к следующей секции
  gsap.to(".about", {
    opacity: 0,
    scale: 0.95,
    scrollTrigger: {
      trigger: ".about",
      start: "bottom 30%",
      end: "bottom top",
      scrub: 1,
      onLeave: () => {
        // Плавный переход к Services
        gsap.to("body", {
          scrollTo: ".services",
          duration: 1,
          ease: "power2.inOut"
        })
      }
    }
  })
})
</script>

<template>
  <div class="about" data-nav="about">
    <div class="about-content">
      <h1 class="about-title">
        Кто мы такие
      </h1>
      <div class="about-text-container">
        <p class="about-text">
          <span class="highlight">IT Tajikistan</span> — это не просто группа разработчиков.
          <br><br>
          Мы объединились вокруг одной цели — создавать качественные, безопасные и современные IT-решения, которые реально работают и приносят пользу бизнесу.
          <br><br>
          Каждый из нас отвечает за своё направление, поэтому клиенты получают комплексный подход, а не набор случайных услуг.
        </p>
      </div>
      <div class="scroll-hint">
        <div class="arrow"></div>
        <span>Наши услуги</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
            ellipse at 50% 50%,
            rgba(167, 251, 0, 0.05) 0%,
            transparent 60%
    );
    pointer-events: none;
    z-index: -1;
  }
}

.about-content {
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-title {
  font-size: clamp(48px, 8vw, 96px);
  text-align: center;
  margin-bottom: 60px;
  opacity: 0;
  will-change: transform, opacity;
}

.about-text-container {
  position: relative;
  max-width: 800px;
  width: 100%;
  margin-bottom: 80px;
}

.about-text {
  font-size: clamp(18px, 2vw, 22px);
  line-height: 1.8;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);

  .line {
    overflow: hidden;
    margin-bottom: 1.5em;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .word {
    display: inline-block;
    opacity: 0;
    transform: translateY(30px);
  }
}

.highlight {
  color: #a7fb00;
  font-weight: 700;
}

.scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  opacity: 0.7;
  animation: pulse 2s infinite;
  margin-top: 40px;

  span {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.arrow {
  width: 24px;
  height: 24px;
  border-right: 2px solid #a7fb00;
  border-bottom: 2px solid #a7fb00;
  transform: rotate(45deg);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: rotate(45deg) translateY(0);
  }
  40% {
    transform: rotate(45deg) translateY(-10px);
  }
  60% {
    transform: rotate(45deg) translateY(-5px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 20px;
  }

  .about-title {
    margin-bottom: 40px;
  }

  .about-text {
    font-size: 16px;
    line-height: 1.6;
  }

  .scroll-hint {
    margin-top: 30px;
  }
}
</style>
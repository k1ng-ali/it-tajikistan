<!-- Team.vue - Optimized for Mobile -->
<script setup>
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { onMounted, onUnmounted, ref } from "vue"

gsap.registerPlugin(ScrollTrigger)

const activeIndex = ref(0)
let animations = []

onMounted(() => {
  const isMobile = window.innerWidth <= 768

  if (isMobile) {
    initMobileAnimations()
  } else {
    initDesktopAnimations()
  }
})

onUnmounted(() => {
  animations.forEach(anim => anim.kill())
  ScrollTrigger.getAll().forEach(st => st.kill())
})

function initMobileAnimations() {
  const cards = gsap.utils.toArray(".member")

  // Заголовок
  const titleAnim = gsap.fromTo(".team-title",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".team",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
  )
  animations.push(titleAnim)

  // Карточки - последовательное появление
  cards.forEach((card, index) => {
    // Начальное состояние
    gsap.set(card, {
      opacity: 0,
      y: 50,
      scale: 0.95
    })

    // Анимация появления
    const cardAnim = gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })
    animations.push(cardAnim)

    // Эффект подсветки при прокрутке
    const highlightAnim = gsap.to(card, {
      borderColor: "rgba(167, 251, 0, 0.4)",
      backgroundColor: "rgba(50, 50, 50, 0.7)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(167, 251, 0, 0.15)",
      duration: 0.3,
      scrollTrigger: {
        trigger: card,
        start: "top 60%",
        end: "top 20%",
        scrub: 0.5
      }
    })
    animations.push(highlightAnim)
  })
}

function initDesktopAnimations() {
  const cards = gsap.utils.toArray(".member")
  const track = document.querySelector(".team-track")

  // Устанавливаем начальное состояние
  cards.forEach((card, index) => {
    gsap.set(card, {
      opacity: index === 0 ? 1 : 0.7,
      scale: index === 0 ? 1 : 0.9
    })
  })

  // Рассчитываем общую ширину для смещения
  const cardWidth = cards[0].offsetWidth
  const gap = 80
  const totalWidth = (cardWidth + gap) * (cards.length - 1)

  // Оптимизируем вычисления
  let rafId = null
  let lastProgress = 0
  const updateThreshold = 0.01

  const updateActiveCard = (progress) => {
    const index = Math.floor(progress * (cards.length - 1))
    const newActiveIndex = Math.min(index, cards.length - 1)

    if (newActiveIndex !== activeIndex.value) {
      activeIndex.value = newActiveIndex

      cards.forEach((card, idx) => {
        const targetOpacity = idx === newActiveIndex ? 1 : 0.7
        const targetScale = idx === newActiveIndex ? 1 : 0.9

        gsap.to(card, {
          opacity: targetOpacity,
          scale: targetScale,
          duration: 0.2,
          ease: "power1.out",
          overwrite: true
        })
      })
    }
  }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        overwrite: 'auto'
      })
    })

    card.addEventListener('mouseleave', () => {
      const idx = cards.indexOf(card)
      const isActive = idx === activeIndex.value

      gsap.to(card, {
        scale: isActive ? 1 : 0.9,
        opacity: isActive ? 1 : 0.7,
        duration: 0.3,
        overwrite: 'auto'
      })
    })
  })

  // Основная анимация горизонтального скролла
  const scrollAnim = gsap.to(track, {
    x: () => `-${totalWidth}px`,
    ease: "none",
    scrollTrigger: {
      trigger: ".team",
      start: "top top",
      end: () => `+=${cards.length * 100}%`,
      scrub: 0.3,
      pin: true,
      anticipatePin: 1,
      onUpdate(self) {
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            const progress = self.progress

            if (Math.abs(progress - lastProgress) > updateThreshold) {
              updateActiveCard(progress)
              lastProgress = progress
            }
            rafId = null
          })
        }
      },
      onEnter: () => {
        activeIndex.value = 0
        updateActiveCard(0)
        gsap.set([".team", ".member"], {
          willChange: "transform, opacity"
        })
      },
      onLeaveBack: () => {
        activeIndex.value = 0
        updateActiveCard(0)
        gsap.set([".team", ".member"], {
          willChange: "auto"
        })
      },
      onLeave: () => {
        activeIndex.value = cards.length
        updateActiveCard(1)
        gsap.set([".team", ".member"], {
          willChange: "transform, opacity"
        })
      }
    }
  })
  animations.push(scrollAnim)
}
</script>

<template>
  <section class="team" data-nav="team">
    <h1 class="team-title">
      Наша команда
    </h1>
    <div class="team-track">
      <div v-for="(member, index) in [
        {
          name: ['SAFIALLOH', 'AMINJONZODA'],
          role: 'Information Security & SMM',
          desc: 'Надёжная защита данных и цифровой инфраструктуры.',
          contact: '+992885788000',
          photo: './team/safialloh.png',
          tg: {
            title:'𝐀𝐌𝐈𝐍𝐉𝐎𝐍𝐙𝐎𝐃𝐀 𝐒',
            link:'https://t.me/safiolloh332'
            }
        },
        {
          name: ['ШАХЗОД', 'ГАНИЕВ'],
          role: 'Automation engineer',
          desc: 'Telegram-боты, автоматизация и программные решения для бизнеса.',
          contact: '+992005550003',
          photo: './team/shaxzod.png',
           tg: {
            title:'Shakhzod',
            link:'https://t.me/Shakhzod_oo3'
            }
        },
        {
          name: ['ФАРИДУН', 'КАСИМОВ'],
          role: 'Servers & System administrator',
          desc: 'Серверы, домены и хостинг под любые требования и бюджеты.',
          contact: 'dcn.tj',
          photo: './team/faridun.png',
          tg: {
            title:'𝓓𝓒𝓝',
            link:'https://t.me/dcntj'
            }
        },
        {
          name: ['МУХАММАДАЛИ'],
          role: 'Full-stack developer',
          desc: 'От идеи до рабочего продукта — архитектура, код и результат.',
          contact: 'im.ali@astanaqulov.ru',
          photo: './team/mukhammadali.png',
          tg: {
            title:'Mukhammad Ali',
            link:'https://t.me/King_a1i',
            },
        }
      ]"
           :key="index"
           class="member"
           :class="{ 'active': index === activeIndex }">
        <div
            v-if="member.photo"
            class="member-photo"
            :style="{ backgroundImage: `url(${member.photo})` }"
        />
        <div
            v-else
            class="img-placeholder"
        />
        <h3 class="name" v-for="(namePart, i) in member.name" :key="i">
          {{ namePart }}
        </h3>
        <p class="member-text">
          <span class="highlight">{{ member.role }}</span>
          {{ member.desc }}
        </p>
        <p class="contact">
          {{ member.contact }}
        </p>
        <a class="tg-button"
           :href="member.tg.link"
           target="_blank"
           rel="noopener noreferrer"
        >
          {{ member.tg.title }}
        </a>

      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.team {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  contain: layout style;
  overflow: hidden;
}

.team-track {
  display: flex;
  gap: 80px;
  align-items: center;
  padding-left: calc(50vw - 170px);
  padding-right: calc(50vw + 170px);
  will-change: transform;

  &:after {
    content: '';
    min-width: calc(50vw - 170px);
    flex-shrink: 0;
  }
}

.team-title {
  text-align: center;
  font-size: clamp(48px, 6vw, 96px);
  margin-bottom: 70px;
  flex-shrink: 0;
}

.member {
  flex: 0 0 auto;
  width: 340px;
  opacity: 0.3;
  transform-origin: center center;

  padding: 32px;
  border-radius: 24px;
  background: rgba(42, 42, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);

  position: relative;
  transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 24px;
    z-index: -1;
  }

  &:hover {
    cursor: pointer;
  }

  &.active {
    opacity: 1;
    transform: scale(1);

    background: rgba(50, 50, 50, 0.51);
    border-color: rgba(167, 251, 0, 0.3);
    box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(167, 251, 0, 0.1);

    &:hover {
      transform: scale(1.05);
    }
  }
}

.img-placeholder {
  width: 100%;
  height: 200px;
  border-radius: 20px;
  background: linear-gradient(135deg, #333 0%, #444 50%, #333 100%);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 2s infinite;
  }
}

.member-photo {
  width: 100%;
  height: 200px;
  border-radius: 20px;
  margin-bottom: 20px;

  background-size: cover;
  background-position: start;
  background-repeat: no-repeat;

  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
            180deg,
            rgba(0,0,0,0.05),
            rgba(0,0,0,0.25)
    );
  }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
  margin-top: 4px;
}

.member-text {
  margin-top: 15px;
  line-height: 1.6;
  font-size: 15px;
}

.highlight {
  color: #a7fb00;
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
}

.contact {
  margin-top: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.tg-button {
  display: flex;
  padding: 2px 10px;
  width: max-content;
  margin-top: 8px;
  font-size: 14px;
  opacity: 1;
  border-radius: 7px;
  border: none;
  background: rgb(255, 255, 255);
  color: #2b2b2b;
  box-shadow: #2a2a2a 1px 1px 10px;
  transition: background 0.2s ease-in-out, transform 0.2s ease;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    transform: scale(1.04);
    background: rgba(255, 255, 255, 0.8);
  }
}

// 🔥 МОБИЛЬНАЯ ОПТИМИЗАЦИЯ
@media (max-width: 768px) {
  .team {
    height: auto; // Убираем фиксированную высоту
    min-height: 100vh;
    padding: 60px 0;
    justify-content: flex-start;
  }

  .team-title {
    margin-bottom: 50px;
    padding: 0 20px;
  }

  // Grid-сетка вместо горизонтального flex
  .team-track {
    display: grid;
    grid-template-columns: 1fr; // Одна колонка
    gap: 40px;
    padding: 0 20px; // Обычные отступы
    width: 95vw; // Ограничиваем ширину viewport'ом
    max-width: 100vw; // Важно! Не даём выйти за пределы экрана

    &:after {
      display: none; // Убираем псевдоэлемент
    }
  }

  .member {
    width: 80vw; // Полная ширина контейнера
    max-width: 400px; // Но не больше 400px
    margin: 0 auto; // Центрируем
    opacity: 1; // На мобилке все карточки видимы

    // Оптимизация производительности
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-font-smoothing: subpixel-antialiased;

    &.active {
      // На мобилке убираем активное состояние через класс
      // Оставляем только hover
    }

    &:hover {
      transform: scale(1.02) translateZ(0);
    }
  }

  .member-photo,
  .img-placeholder {
    height: 180px;
  }

  .name {
    font-size: 18px;
  }

  .member-text {
    font-size: 14px;
  }
}

// Очень маленькие экраны
@media (max-width: 480px) {
  .team {
    padding: 40px 0;
  }

  .team-title {
    margin-bottom: 40px;
  }

  .team-track {
    gap: 30px;
    padding: 0 15px;
  }

  .member {
    padding: 24px;
    max-width: 100%; // На очень маленьких экранах используем всю ширину

    .member-photo,
    .img-placeholder {
      height: 160px;
    }
  }

  .name {
    font-size: 17px;
  }

  .member-text {
    font-size: 13px;
    margin-top: 12px;
  }

  .tg-button {
    font-size: 13px;
    padding: 6px 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .member {
    transition: none !important;
  }

  .img-placeholder::after {
    animation: none;
  }
}
</style>
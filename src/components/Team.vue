<!-- Team.vue -->
<script setup>
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { onMounted, ref } from "vue"

gsap.registerPlugin(ScrollTrigger)

const activeIndex = ref(0)

onMounted(() => {
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

  // Рассчитываем смещение для центрирования
  const viewportCenter = window.innerWidth / 2
  const cardCenter = cardWidth / 2
  const initialOffset = viewportCenter - cardCenter

  // Оптимизируем вычисления
  let rafId = null
  let lastProgress = 0
  const updateThreshold = 0.01 // Обновляем только при значительном изменении

  const updateActiveCard = (progress) => {
    const index = Math.floor(progress * (cards.length - 1))
    const newActiveIndex = Math.min(index, cards.length - 1)

    if (newActiveIndex !== activeIndex.value) {
      activeIndex.value = newActiveIndex

      // Анимируем только при изменении индекса
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
  gsap.to(track, {
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
        // Троттлинг обновлений
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            const progress = self.progress

            // Обновляем только при значительном изменении
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
      },
      onLeaveBack: () => {
        activeIndex.value = 0
        updateActiveCard(0)
      },
      onLeave: () => {
        activeIndex.value = cards.length
        updateActiveCard(1)
      }
    }
  })

  // Очистка
  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }
})
</script>

<template>
  <section class="team" data-nav="team">
    <h1 class="team-title">
      Наша команда
    </h1>
    <div class="team-track">
      <div v-for="(member, index) in [
        {
          name: ['САФИАЛЛОХ', 'АМИНЧОНЗОДА'],
          role: 'Information Security & SMM',
          desc: 'Надёжная защита данных и цифровой инфраструктуры.',
          contact: '+992885788000',
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
           tg: {
            title:'Shakhzod',
            link:'https://t.me/Shakhzod_oo3'
            }
        },
        {
          name: ['ФАРИДУН', 'КАСИМОВ'],
          role: 'Servers & Hosting',
          desc: 'Серверы, домены и хостинг под любые требования и бюджеты.',
          contact: 'dcn.tj',
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
          tg: {
            title:'Mukhammad Ali',
            link:'https://t.me/King_a1i',
            },
        }
      ]"
           :key="index"
           class="member"
           :class="{ 'active': index === activeIndex }">
        <div class="img-placeholder"></div>
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
  overflow: hidden; /* Важно: скрываем переполнение */
}

.team-track {
  display: flex;
  gap: 80px;
  align-items: center;
  /* Убираем статические padding, они мешают анимации */
  padding-left: calc(50vw - 170px);
  padding-right: calc(50vw + 170px);
  will-change: transform;

  /* Добавляем отступ справа для последней карточки */
  &:after {
    content: '';
    min-width: calc(50vw - 170px);
    flex-shrink: 0;
  }
}

.team-title {
  text-align: center;
  font-size: clamp(48px, 6vw, 96px);
  margin-bottom: 120px;
  flex-shrink: 0;
}

.member {
  flex: 0 0 auto; /* Не позволяем карточкам сжиматься */
  width: 340px;
  opacity: 0.3;
  transform-origin: center center;

  padding: 32px;
  border-radius: 24px;
  background: rgba(42, 42, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);

  position: relative;

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

    background: rgba(50, 50, 50, 0.95);
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

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.member-text {
  margin-top: 12px;
  line-height: 1.6;
  font-size: 15px;
}

.highlight {
  color: #a7fb00;
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
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
  transition:background 0.2s ease-in-out;
  cursor: pointer;
  font-weight: bold;
  direction: none;

  &:hover {
    scale: 1.04;
    transition:background 0.2s ease-in-out;
    background: rgba(255, 255, 255, 0.8);;
  }
}

/* Медиа-запросы */
@media (max-width: 768px) {
  .team-track {
    gap: 40px;
    padding-left: calc(50vw - 150px);
    padding-right: calc(50vw + 150px);

    &:after {
      min-width: calc(50vw - 150px);
    }
  }

  .member {
    width: 300px;
    padding: 24px;
  }

  .img-placeholder {
    height: 150px;
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
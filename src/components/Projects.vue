<script setup>
import { gsap } from "gsap";
import { onMounted, onUnmounted, nextTick } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let splits = [];
let scrollTriggers = [];
let mm; // MatchMedia instance

onMounted(() => {
  nextTick(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const projects = gsap.utils.toArray('.project');
    const projectsSection = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');

    if (!projectsSection || projects.length === 0) return;

    // Создаём MatchMedia для адаптивности
    mm = gsap.matchMedia();

    // ========== DESKTOP VERSION (>768px) ==========
    mm.add("(min-width: 769px)", () => {
      const projectDuration = 1000;
      const totalScrollHeight = projects.length * projectDuration;

      // Устанавливаем начальные состояния для десктопа
      projects.forEach((project, i) => {
        const left = project.querySelector('.project-left');
        const right = project.querySelector('.project-right');
        const description = project.querySelector('.project-description');
        const heading = project.querySelector('h3');
        const buttons = project.querySelector('.buttons');

        gsap.set(project, {
          opacity: 0,
          zIndex: i + 1,
          pointerEvents: 'none',
          visibility: 'hidden'
        });
        gsap.set([left, right], { opacity: 0, y: 60 });
        gsap.set([heading, buttons], { opacity: 0, y: 30 });

        const split = new SplitText(description, {
          type: "lines, words",
          linesClass: "line",
          wordsClass: "word"
        });
        splits.push(split);
        gsap.set(split.words, { opacity: 0, y: 20 });
      });

      // Пинаем всю секцию
      const mainTrigger = ScrollTrigger.create({
        trigger: projectsSection,
        start: 'top top',
        end: `+=${totalScrollHeight}vh`,
        pin: true,
        pinSpacing: true,
      });
      scrollTriggers.push(mainTrigger);

      // Анимация заголовка
      gsap.fromTo(projectsTitle,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: projectsSection,
              start: 'top 80%',
              end: 'top 20%',
              scrub: true,
            }
          }
      );

      // Мастер-таймлайн
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: projectsSection,
          start: 'top 40%',
          end: `+=${totalScrollHeight}vh`,
          scrub: 1,
        }
      });

      // Анимации проектов
      projects.forEach((project, i) => {
        const left = project.querySelector('.project-left');
        const right = project.querySelector('.project-right');
        const description = project.querySelector('.project-description');
        const heading = project.querySelector('h3');
        const buttons = project.querySelector('.buttons');
        const split = splits[i];

        const fadeInDuration = 10;
        const holdDuration = 10.5;
        const fadeOutDuration = 10;
        const projectStart = i * (fadeInDuration + holdDuration + fadeOutDuration);

        // ВХОД
        masterTl.set(project, { visibility: 'visible', pointerEvents: 'auto' }, projectStart);
        masterTl.to(project, { opacity: 1, duration: fadeInDuration * 0.3 }, projectStart);
        masterTl.to(left, { opacity: 1, y: 0, duration: fadeInDuration * 0.4 }, projectStart + fadeInDuration * 0.1);
        masterTl.to(right, { opacity: 1, y: 0, duration: fadeInDuration * 0.4 }, projectStart + fadeInDuration * 0.15);
        masterTl.to(heading, { opacity: 1, y: 0, duration: fadeInDuration * 0.3 }, projectStart + fadeInDuration * 0.2);
        masterTl.to(split.words, { opacity: 1, y: 0, stagger: 0.01, duration: fadeInDuration * 0.5 }, projectStart + fadeInDuration * 0.3);
        masterTl.to(buttons, { opacity: 1, y: 0, duration: fadeInDuration * 0.3 }, projectStart + fadeInDuration * 0.5);

        // ВЫХОД (кроме последнего)
        if (i < projects.length - 1) {
          const exitStart = projectStart + fadeInDuration + holdDuration;
          masterTl.to(buttons, { opacity: 0, y: -30, duration: fadeOutDuration * 0.3 }, exitStart);
          masterTl.to(split.words, { opacity: 0, y: -20, stagger: 0.005, duration: fadeOutDuration * 0.4 }, exitStart + fadeOutDuration * 0.05);
          masterTl.to(heading, { opacity: 0, y: -30, duration: fadeOutDuration * 0.3 }, exitStart + fadeOutDuration * 0.15);
          masterTl.to([left, right], { opacity: 0, y: -60, duration: fadeOutDuration * 0.5 }, exitStart + fadeOutDuration * 0.2);
          masterTl.to(project, { opacity: 0, duration: fadeOutDuration * 0.3 }, exitStart + fadeOutDuration * 0.4);
          masterTl.set(project, { visibility: 'hidden', pointerEvents: 'none' }, exitStart + fadeOutDuration);
        }
      });

      // Функция очистки для десктопа
      return () => {
        splits.forEach(split => split.revert());
        splits = [];
      };
    });

    // ========== MOBILE VERSION (<=768px) ==========
    mm.add("(max-width: 768px)", () => {
      // Сбрасываем все инлайн стили
      projects.forEach((project) => {
        gsap.set(project, { clearProps: "all" });
        gsap.set(project.querySelector('.project-left'), { clearProps: "all" });
        gsap.set(project.querySelector('.project-right'), { clearProps: "all" });
        gsap.set(project.querySelector('h3'), { clearProps: "all" });
        gsap.set(project.querySelector('.buttons'), { clearProps: "all" });
      });

      // Простая анимация заголовка
      gsap.fromTo(projectsTitle,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: projectsSection,
              start: 'top 80%',
              end: 'top 60%',
              scrub: true,
            }
          }
      );

      // Анимация появления каждого проекта
      projects.forEach((project, i) => {
        const right = project.querySelector('.project-right');
        const heading = project.querySelector('h3');
        const description = project.querySelector('.project-description');
        const buttons = project.querySelector('.buttons');

        // Начальное состояние для блоков
        gsap.set([right, heading, buttons], { opacity: 0, y: 40 });

        // Анимация блоков (без текста)
        gsap.to([right, heading], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: project,
            start: 'top 75%',
            end: 'top 50%',
            scrub: 1,
          }
        });

        // SplitText для анимации слов
        const split = new SplitText(description, {
          type: "lines, words",
          linesClass: "line",
          wordsClass: "word",
        });
        splits.push(split);

        // Начальное состояние слов
        gsap.set(split.words, { opacity: 0, y: 20 });

        // Анимация слов
        gsap.to(split.words, {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: description,
            start: "top 80%",
            end: "top 60%",
            scrub: 0.5,
          }
        });

        // Анимация кнопок
        gsap.to(buttons, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: buttons,
            start: "top 90%",
            end: "top 70%",
            scrub: 1,
          }
        });
      });

      // Функция очистки для мобилки
      return () => {
        splits.forEach(split => split.revert());
        splits = [];
      };
    });
  });
});

onUnmounted(() => {
  if (mm) mm.revert();
  scrollTriggers.forEach(trigger => trigger.kill());
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});

onUnmounted(() => {
  if (mm) mm.revert();
  scrollTriggers.forEach(trigger => trigger.kill());
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<template>
  <section class="projects" data-nav="projects">
    <!-- ПИННЕНЫЙ ЗАГОЛОВОК -->
    <h2 class="projects-title">Проекты</h2>

    <!-- ОБЛАСТЬ СМЕНЫ ПРОЕКТОВ -->
    <div class="projects-stage">
      <div class="project">
        <div class="project-left">
          <h3>Dovtalab</h3>
          <p class="project-description">
            Dovtalab — образовательная платформа для подготовки к экзаменам и закрепления знаний через практику: интерактивные викторины с реальными форматами заданий, прогресс и статистика попыток.
            Телеграмный бот ежедневно приносит пользу более +750 абитуриентам.
            Сейчас активно идёт разработка веб-приложения и ядра платформы (backend + база), чтобы всё работало стабильно и одинаково для всех клиентов.
          </p>
          <div class="buttons">
            <a href="https://t.me/Dovtalabbot" target="_blank" class="btn">Открыть бот</a>
            <a href="https://t.me/mmt_taj" target="_blank" class="btn">Сообщество</a>
          </div>
        </div>

        <div class="project-right glass">
          <div class="img-placeholder">
            <span>Изображение проекта</span>
          </div>
          <div class="stack">
            <span>Vue</span>
            <span>GSAP</span>
            <span>Vite</span>
            <span>Node.js</span>
            <span>MongoDB</span>
          </div>
        </div>
      </div>

      <div class="project">
        <div class="project-left">
          <h3>Второй проект</h3>
          <p class="project-description">
            Это описание второго проекта. Здесь можно рассказать о технологиях, задачах и результатах.
            Анимация будет плавно переключаться между проектами при скролле.
            Каждый проект появляется и исчезает последовательно.
          </p>
          <div class="buttons">
            <a href="#" target="_blank" class="btn">Открыть</a>
            <a href="#" target="_blank" class="btn">GitHub</a>
          </div>
        </div>

        <div class="project-right glass">
          <div class="img-placeholder">
            <span>Изображение проекта 2</span>
          </div>
          <div class="stack">
            <span>React</span>
            <span>TypeScript</span>
            <span>Next.js</span>
          </div>
        </div>
      </div>

      <div class="project">
        <div class="project-left">
          <h3>Третий проект</h3>
          <p class="project-description">
            Описание третьего проекта. Последний проект останется на экране и не будет исчезать.
            Это позволяет пользователю взаимодействовать с ссылками и изучить детали.
          </p>
          <div class="buttons">
            <a href="#" target="_blank" class="btn">Демо</a>
            <a href="#" target="_blank" class="btn">Подробнее</a>
          </div>
        </div>

        <div class="project-right glass">
          <div class="img-placeholder">
            <span>Изображение проекта 3</span>
          </div>
          <div class="stack">
            <span>Python</span>
            <span>Django</span>
            <span>PostgreSQL</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px;

  @media (max-width: 768px) {
    padding-top: 40px;
    min-height: auto; // Убираем фиксированную высоту на мобилке
  }
}

.projects-title {
  font-size: clamp(32px, 5vw, 64px);
  z-index: 100;
  text-align: center;
  pointer-events: none;
  margin: 0 0 60px 0;
  position: relative;

  @media (max-width: 768px) {
    font-size: clamp(24px, 8vw, 48px);
    margin-bottom: 40px;
  }
}

.projects-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 70vh;

  @media (max-width: 768px) {
    flex-direction: column; // Вертикальный стек на мобилке
    min-height: auto;
    gap: 80px; // Расстояние между проектами
    padding-bottom: 20vh;
  }
}

.project {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 50px;
  width: 90vw;
  height: max-content;
  will-change: opacity;

  @media (max-width: 768px) {
    position: relative; // НЕ absolute на мобилке!
    inset: auto;
    grid-template-columns: 1fr;
    gap: 30px;
    width: 90vw;
    margin-top: 0;
    will-change: auto; // Убираем will-change для производительности
  }
}

.project-left {
  order: 1;

  h3 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    will-change: opacity, transform;

    @media (max-width: 768px) {
      font-size: 2rem;
      will-change: auto;
    }
  }

  @media (max-width: 768px) {
    order: 2; // Описание снизу
  }
}

.project-description {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.85);

  :deep(.word) {
    display: inline-block;
    margin-right: 0.3em;
    will-change: transform, opacity;

    @media (max-width: 768px) {
      will-change: auto; // Убираем для производительности
    }
  }

  :deep(.line) {
    overflow: hidden;
    display: block;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }
}

.buttons {
  display: flex;
  gap: 20px;
  margin-top: 2rem;
  will-change: opacity, transform;

  @media (max-width: 768px) {
    will-change: auto;
    flex-wrap: wrap;
  }

  .btn {
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      padding: 10px 20px;
      font-size: 0.9rem;
    }
  }
}

.project-right {
  display: flex;
  will-change: opacity, transform;
  align-items: center;
  order: 2;

  @media (max-width: 768px) {
    order: 1; // Изображение сверху
    will-change: auto;
  }
}

.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 768px) {
    padding: 20px;
    gap: 20px;
    backdrop-filter: blur(10px) saturate(140%); // Менее интенсивный blur
  }
}

.img-placeholder {
  width: 100%;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;

  @media (max-width: 768px) {
    height: 200px;
    font-size: 1rem;
  }
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  span {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 0.9rem;

    @media (max-width: 768px) {
      padding: 6px 12px;
      font-size: 0.8rem;
    }
  }
}
</style>
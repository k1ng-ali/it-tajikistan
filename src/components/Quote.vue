<script setup>
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {onMounted} from "vue";
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.fromTo(".quote-text",
  {
    opacity: 0,
    scale: 0.8,
    y: 24,
  },
      {
    opacity: 1,
    scale: 1,
    y: 0,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".quote",
      start: "top 70%",
      end: "top 30%",
      scrub: true
    }
})
})


</script>
<template>
  <div class="quote"  data-nav="quote">
    <h2 class="quote-text">
      «Хороший код — это не просто работающая программа. <br>
      Это <span>доверие</span>.»
    </h2>
  </div>
</template>

<style scoped lang="scss">
.quote {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quote-text {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;

  font-size: clamp(24px, 4vw, 42px);
  line-height: 1.5;
  font-weight: 600;
  text-align: center;

  color: rgba(255, 255, 255, 0.92);
}

.quote span {
  color: #a7fb00;
  font-weight: 700;
}

</style>
<script setup>
  import "./assets/main.css"
  import Background from "@/components/Background.vue";
  import { onMounted } from 'vue'
  import Hero from "@/components/Hero.vue"
  import {ScrollSmoother} from "gsap/ScrollSmoother";
  import About from "@/components/About.vue";
  import Services from "@/components/Services.vue";
  import Team from "@/components/Team.vue";
  import OurJob from "@/components/OurJob.vue";
  import Quote from "@/components/Quote.vue";
  import Navigation from "@/components/Navigation.vue";
  import ScrollToTop from "@/components/ScrollToTop.vue";

  onMounted(() => {
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
    })
  });
</script>

<template class="app">
  <Background />
  <Navigation />

  <div id="smooth-wrapper">
    <div id="smooth-content">
      <Hero id="hero"/>
      <About id="about"/>
      <Services id="services" />
      <Team id="team"/>
      <OurJob id="our-job"/>
      <Quote/>
    </div>
  </div>
</template>

<style scoped lang="scss">
#smooth-wrapper {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

#smooth-content {
  will-change: transform;
}
</style>

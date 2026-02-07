import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollSmoother} from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

createApp(App).mount('#app')

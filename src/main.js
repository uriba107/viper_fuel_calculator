// Import CSS first to ensure styles load before Vue components render
import './assets/falcon_fuel_calc.css'

import { createApp } from 'vue'
import App from './App.vue'

// Wait for DOM to be ready and initial styles to process
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure CSS is processed
  requestAnimationFrame(() => {
    createApp(App).mount('#app')
  })
})

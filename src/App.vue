
<template>
  <div id="app" class="min-h-screen bg-f16-app text-f16-primary-text transition-colors duration-300">
    <Header :selectedSim="selectedSim"/>

    <main class="pb-16">
      <CalculatorWrapper @setSim="setSim"/>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from './composables/useTheme.js'
import CalculatorWrapper from './components/structure/calculatorWrapper.vue';
import Header from './components/structure/header.vue';
import Footer from './components/structure/footer.vue';

const selectedSim = ref(' ')
const setSim = (value) => {
  selectedSim.value = value
}

// Initialize theme management
const { initTheme } = useTheme()
let cleanupTheme

onMounted(() => {
  cleanupTheme = initTheme()
})

onUnmounted(() => {
  if (cleanupTheme) {
    cleanupTheme()
  }
})
</script>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
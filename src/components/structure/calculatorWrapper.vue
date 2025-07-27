<template>
  <fuelCalculator @setSim="setSim"/>
</template>

<script setup>
import fuelCalculator from '../calculator/fuelCalculator.vue'
const emit = defineEmits(['setSim'])
const setSim = (value) => {
  emit('setSim',value)
}
</script>

<style scoped></style>

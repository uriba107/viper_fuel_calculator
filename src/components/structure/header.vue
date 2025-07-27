<template>
    <header class="bg-f16-primary text-white p-4 f16-shadow-md transition-colors duration-300" :class="simSelectedClass">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-center justify-between">
                <div v-if="props.selectedSim === 'DCS'">
                    <object class="flex items-center h-8 w-auto" type="image/svg+xml"
                        data="./dcs-world-logo.svg"></object>
                </div>
                <div v-if="props.selectedSim === 'BMS'" class="flex justify h-16 f16-logo">
                    <img src="/bms-site-logo.png"></img>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-white">Viper Fuel Planner</h1>
                    <p class="text-blue-100 text-sm mt-1">F-16 Mission Fuel Planning</p>
                </div>

                <div class="flex items-center space-x-4">
                    <button
                        class="f16-button-secondary text-sm flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
                        @click="showHelp = !showHelp">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Help</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Help Popup -->
        <HelpPopup :show="showHelp" @close="showHelp = false" />
    </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import HelpPopup from './HelpPopup.vue'

const showHelp = ref(false)
const props = defineProps({
    selectedSim: {
        type: String,
        required: true
    }
})

const simSelectedClass = computed(() => {
    if (props.selectedSim === 'BMS') {
        return 'bg-f16-bms'
    } else if (props.selectedSim === 'DCS') {
        return 'bg-f16-dcs'
    }
    return 'bg-f16-primary'
})
</script>

<style scoped></style>
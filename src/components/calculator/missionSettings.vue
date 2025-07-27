<template>
  <div class="f16-card">
    <div class="f16-legend">Aircraft Configuration</div>
    
    <!-- Responsive flex layout for grouped settings -->
    <div class="flex flex-col sm:flex-row lg:items-start space-y-6 lg:space-y-0">
      
      <!-- Left Group: Simulator and Compute Mode -->
      <div class="flex flex-col space-y-4 flex-shrink-0">
        <!-- Simulator Selection -->
        <div class="f16-form-section">
          <label class="f16-form-label">Simulator:</label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input 
                type="radio" 
                name="simulator" 
                value="false" 
                v-model="calcSettings.isDCS" 
                @change="setDCS"
                class="f16-checkbox mr-2"
              />
              <span class="text-sm">BMS</span>
            </label>
            <label class="flex items-center">
              <input 
                type="radio" 
                name="simulator" 
                value="true" 
                v-model="calcSettings.isDCS" 
                @change="setDCS"
                class="f16-checkbox mr-2"
              />
              <span class="text-sm">DCS</span>
            </label>
          </div>
        </div>

        <!-- Compute Mode -->
        <div class="f16-form-section">
          <label class="f16-form-label" for="computeMode">Compute Mode:</label>
          <select 
            id="computeMode"
            v-model="calcSettings.computeMode"
            class="f16-select w-full max-w-44"
          >
            <option value="MilSim">MilSim</option>
            <option value="AirQuake" title="Not implemented yet" disabled>
              AirQuake
            </option>
          </select>
        </div>
      </div>
      <div class="flex-grow"></div>
      <!-- Right Group: F-16 Model and CFT -->
      <div class="flex flex-col space-y-4 flex-shrink-0 flex-jusify-end-safe ">
        <!-- Aircraft Type -->
        <div class="f16-form-section">
          <label class="f16-form-label" for="aircraftType">F-16 Model:</label>
          <select 
            id="aircraftType"
            v-model="aircraft.type" 
            :disabled="calcSettings.isDCS === true"
            @change="setAircraft"
            class="f16-select w-full max-w-64"
          >
            <option value="C">F-16C</option>
            <option value="D">F-16D</option>
          </select>
        </div>

        <!-- CFT Option -->
          <button
            type="button"
            @click="toggleCFT"
            :disabled="calcSettings.isDCS === true"
            :class="[
              'px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 w-full max-w-64 text-left flex items-center justify-between',
              aircraft.cft 
                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              calcSettings.isDCS === true ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
          >
            <span>Conformal Fuel Tanks (CFT)</span>
          </button>
      </div>
    </div>

    <!-- Info messages -->
    <div v-if="calcSettings.isDCS === true" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-sm text-yellow-800">
        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        DCS mode: Only F-16C available, CFT disabled
      </p>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['setAircraft','setSim'])
const props = defineProps({
  aircraft: {
    type: Object,
    required: true,
  },
  calcSettings: {
    type: Object,
    required: true,
  }
})


const setDCS = (event) => {
    props.calcSettings.isDCS = (event.target.value === 'true')
    if (props.calcSettings.isDCS === true) {
        props.aircraft.type = 'C'
        props.aircraft.cft = false
        if (props.aircraft.loadout.inboard == 'W600') {
            props.aircraft.loadout.inboard = ''
        }
    }
    emit('setSim',props.calcSettings.isDCS?'DCS':'BMS')
}

const toggleCFT = () => {
  props.aircraft.cft = !props.aircraft.cft
  emit('setAircraft')
}

const setAircraft = (event) => {
    emit('setAircraft')
}
</script>

<style scoped>
</style>

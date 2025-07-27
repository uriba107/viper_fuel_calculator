<template>

  <!-- Results Display -->
  <div class="f16-card">
    <div class="f16-legend">Fuel Calculation Results</div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Required Fuel -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 transition-colors duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-blue-900 dark:text-blue-200">Required Mission Fuel</h3>
            <p class="text-2xl font-bold text-blue-800 dark:text-blue-300">{{ fuelOutput.requiredMissionFuel }} lbs</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-full transition-colors duration-300">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Available Fuel -->
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 transition-colors duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-green-900 dark:text-green-200">Available Fuel</h3>
            <p class="text-2xl font-bold text-green-800 dark:text-green-300">{{ fuelOutput.AvailableMissionFuel }} lbs</p>
            <p class="text-sm text-green-700 dark:text-green-400 text-sm" v-if="fuelOutput.tankerFuel > 0">Aircraft: {{ fuelOutput.AvailableAircraftFuel }} lbs</p>
            <p class="text-sm text-green-700 dark:text-green-400 text-sm" v-if="fuelOutput.tankerFuel > 0">Tanker: {{ fuelOutput.tankerFuel }} lbs</p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-800/30 rounded-full transition-colors duration-300">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Fuel Balance -->
      <div class="rounded-lg p-4 transition-colors duration-300" :class="fuelBalanceClass">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium" :class="fuelBalanceTextClass">Fuel Balance</h3>
            <p class="text-2xl font-bold" :class="fuelBalanceTextClass">
              {{ fuelOutput.fuelBalance >= 0 ? '+' : '' }}{{ fuelOutput.fuelBalance }} lbs
            </p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-full transition-colors duration-300">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <!-- <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /> -->

                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Bingo Fuel Flight Profile Infographic -->
    <div class="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg transition-colors duration-300">
      <!-- Header with Toggle Button -->
      <div class="flex items-center justify-between p-6 pb-4 cursor-pointer" @click="toggleBingoCollapse">
        <div class="text-center flex-1">
          <div class="flex items-center justify-center space-x-3 mb-2">
            <div class="p-3 bg-yellow-100 dark:bg-yellow-800/30 rounded-full transition-colors duration-300">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-yellow-900 dark:text-yellow-200">Bingo Fuel Flight Profile</h3>
          </div>
          <p class="text-3xl font-bold text-yellow-800 dark:text-yellow-300">{{ fuelOutput.bingoFuel.fuel }} lbs</p>
        </div>
        
        <!-- Toggle Button -->
        <div class="ml-4">
          <button class="p-2 hover:bg-yellow-200 dark:hover:bg-yellow-800/30 rounded-full transition-colors">
            <svg class="w-5 h-5 text-yellow-700 dark:text-yellow-400 transition-transform duration-200" 
                 :class="{ 'rotate-180': !isBingoCollapsed }" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Collapsible Content -->
      <div v-if="!isBingoCollapsed" class="px-6 pb-6">
        <div class="relative">
          <!-- Flight Profile Diagram -->
          <div class="flex items-center justify-between mb-6">
            <!-- Climb Phase -->
            <div class="flex flex-col items-center flex-1">
              <div class="bg-blue-100 dark:bg-blue-800/30 rounded-full p-3 mb-2 transition-colors duration-300">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <h4 class="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-2">CLIMB</h4>
              <div class="text-center space-y-1">
                <p class="text-xs text-blue-700 dark:text-blue-400"><strong>Power:</strong> Full MIL</p>
                <p class="text-xs text-blue-700 dark:text-blue-400"><strong>Speed:</strong> {{ fuelOutput.bingoFuel.climb }} kts IAS</p>
                <p class="text-xs text-blue-700 dark:text-blue-400"><strong>Transition:</strong> {{ fuelOutput.bingoFuel.mach }} Mach</p>
                <p class="text-xs text-blue-700 dark:text-blue-400"><strong>Altitude:</strong> {{ fuelOutput.bingoFuel.alt }} ft</p>
              </div>
            </div>

            <!-- Flight Path Arrow -->
            <div class="flex-1 flex items-center justify-center">
              <svg class="w-16 h-8 text-f16-muted-text" fill="none" stroke="currentColor" viewBox="0 0 64 32">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16L56 16M48 8L56 16L48 24" />
              </svg>
            </div>

            <!-- Descent Phase -->
            <div class="flex flex-col items-center flex-1">
                            <div class="bg-green-100 dark:bg-green-800/30 rounded-full p-3 mb-2 transition-colors duration-300">
                  <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <h4 class="font-semibold text-green-800 dark:text-green-300 text-sm mb-2">DESCENT</h4>
              <div class="text-center space-y-1">
                <p class="text-xs text-green-700 dark:text-green-400"><strong>Start:</strong> {{ fuelOutput.bingoFuel.topOfDescend }} NM</p>
                <p class="text-xs text-green-700 dark:text-green-400"><strong>Power:</strong> IDLE</p>
                <p class="text-xs text-green-700 dark:text-green-400"><strong>AOA:</strong> 6 degrees</p>
                <p class="text-xs text-green-700 dark:text-green-400"><strong>Speed:</strong> ~{{ fuelOutput.bingoFuel.descend }} kts IAS</p>
              </div>
            </div>
          </div>

          <!-- Final Result -->
          <div class="text-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 transition-colors duration-300">
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p class="text-sm font-semibold text-yellow-800 dark:text-yellow-300">This profile brings you home with <strong>1200 lbs</strong> remaining fuel</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loadout Display -->
    <div class="mt-6 bg-f16-elevated border border-f16-primary-border rounded-lg p-4 transition-colors duration-300">
      <h3 class="text-lg font-semibold text-f16-primary-text mb-3">Current Loadout</h3>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- INSERT_YOUR_CODE -->
        <template v-for="(station, idx) in ['outboard', 'inboard', 'center', 'inboard', 'outboard']" :key="idx">
          <div class="text-center">
            <div class="text-sm font-medium text-f16-secondary-text">
              {{ station.charAt(0).toUpperCase() + station.slice(1) }}<br> (Station {{ idx + 3 }})
            </div>
            <div class="mt-1 px-3 py-1 bg-f16-surface border border-f16-secondary-border rounded text-sm text-f16-primary-text transition-colors duration-300">
              {{ CurrentAircraft.loadout[station] || 'Empty' }}
            </div>
          </div>
        </template>

      </div>
    </div>

    <!-- AAR Warning -->
    <div v-if="calcSettings.planAAR" class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg transition-colors duration-300">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Air-to-Air Refueling Required</h3>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">Mission cannot be completed with internal and external fuel alone. AAR is
            required.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  fuelOutput: {
    type: Object,
    required: true
  },
  calcSettings: {
    type: Object,
    required: true
  },
  CurrentAircraft: {
    type: Object,
    required: true
  }
});

const isBingoCollapsed = ref(true);

const toggleBingoCollapse = () => {
  isBingoCollapsed.value = !isBingoCollapsed.value;
};

// Computed classes for fuel balance styling
const fuelBalanceClass = computed(() => {
  if (props.fuelOutput.fuelBalance >= 0) {
    return 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700';
  } else {
    return 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700';
  }
});

const fuelBalanceTextClass = computed(() => {
  if (props.fuelOutput.fuelBalance >= 0) {
    return 'text-green-900 dark:text-green-200';
  } else {
    return 'text-red-900 dark:text-red-200';
  }
});
</script>

<style scoped>
</style>
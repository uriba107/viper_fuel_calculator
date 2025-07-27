<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeHelp"></div>
    
    <!-- Modal -->
    <div class="relative bg-f16-surface rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden mx-4 border border-f16-primary-border">
      <!-- Header -->
      <div class="bg-f16-primary text-white px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-bold">Viper Fuel Planner Help</h2>
        <button @click="closeHelp" class="text-white hover:text-gray-200 text-2xl transition-colors">&times;</button>
      </div>
      
      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)] bg-f16-surface">
        <div class="space-y-6">
          <!-- What is this -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-f16-primary mb-3">What is this?</h3>
            <p class="text-f16-secondary-text">
              This is a fuel calculator for F-16 flight simulation based on original aircraft documents. The calculations use rough estimates that have been averaged and simplified to provide quick fuel planning for simulator missions.
            </p>
          </div>

          <!-- Getting Started -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-f16-primary mb-3">Getting Started</h3>
            <ul class="list-disc pl-6 space-y-2 text-f16-secondary-text text-sm">
              <li>Select your mission type (A2A or A2G) - the calculator will automatically configure appropriate loadouts</li>
              <li>Choose flight profiles based on threat environment and operational requirements</li>
              <li>Plan to return with approximately 2,000 lbs fuel remaining for safe operations</li>
              <li>High altitude cruise is most fuel efficient for long-range transit missions</li>
              <li>Low altitude flight dramatically increases fuel consumption but reduces exposure to threats</li>
              <li>Aircraft loadout is automatically configured to standard mission profiles and dynamically adjusted based on fuel requirements</li>
              <li>Bingo fuel is calculated from low altitude at the target, assuming flight along the planned egress route without shortcuts, and includes the optimal bingo flight profile with proper climb, cruise, and descent phases</li>
              <li>Use loiter time sliders to plan for extended target area operations</li>
              <li>All calculations include approximately 10% safety margin for operational flexibility</li>
            </ul>
          </div>

          <!-- Flight Profiles -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-f16-primary mb-3">Flight Profiles</h3>
            <div class="space-y-3">
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">High Altitude (25,000ft @ M0.78)</h4>
                <p class="text-f16-secondary-text text-sm">8NM/Min, 4,100-6,200 PPH fuel consumption. Most fuel-efficient for long-range transit.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Low Altitude @ 480kts</h4>
                <p class="text-f16-secondary-text text-sm">8NM/Min, 7,200-13,000 PPH (varies by aircraft configuration). High fuel burn but minimal exposure to surface threats when flying low-level penetration.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Low Altitude @ 420kts</h4>
                <p class="text-f16-secondary-text text-sm">7NM/Min, 5,700-8,000 PPH. More fuel efficient than 480kts but increased exposure to surface threats.</p>
              </div>
            </div>
          </div>

          <!-- Mission Loadouts -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-f16-primary mb-3">Mission Loadouts</h3>
            <div class="space-y-3">
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Air-To-Air (A2A)</h4>
                <p class="text-f16-secondary-text text-sm">6×AIM-120 missiles for air superiority missions.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Air-To-Ground (A2G)</h4>
                <p class="text-f16-secondary-text text-sm">4×AIM-120 missiles plus 2000lbs class weapons (e.g. GBU-31) for strike missions.</p>
              </div>
            </div>
          </div>

          <!-- Fuel Allocations -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-f16-primary mb-3">Fuel Reserves Explained</h3>
            <div class="space-y-3">
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Ground Operations (2,000 lbs)</h4>
                <p class="text-f16-secondary-text text-sm">Covers engine start, taxi, takeoff, approach, and landing procedures. Essential for safe ground and pattern operations.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Base Threat Reserve (1,000 lbs)</h4>
                <p class="text-f16-secondary-text text-sm">Emergency fuel for unexpected situations like weather diversions, holding patterns, or minor route changes. Can be doubled to 2,000 lbs for high-risk missions.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">High Threat Environment (+1,000 lbs)</h4>
                <p class="text-f16-secondary-text text-sm">Extra reserve when operating in contested airspace where evasive maneuvers, defensive actions, or emergency route changes may be needed.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Pop-up Attack (1,500 lbs)</h4>
                <p class="text-f16-secondary-text text-sm">Fuel for low-altitude attack profile: accelerate to 540kts at 20nm from target, full MIL power from 10nm to target, full afterburner during attack maneuver, plus 10nm egress at MIL power.</p>
              </div>
            </div>
          </div>

          <!-- Bingo Fuel -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-f16-primary mb-3">Understanding Bingo Fuel</h3>
            <p class="text-f16-secondary-text text-sm mb-2">
              Bingo fuel is your "go home now" fuel level. It represents the minimum fuel required to safely return to base using optimized flight profiles.
              When you hit bingo fuel, immediately abort the mission and head for fuel (home base, alternate airfield, or tanker).
            </p>
            <p class="text-f16-secondary-text text-sm mb-2">
              The calculation is based on data from the original F-16 flight manual, including:
            </p>
            <ul class="list-disc pl-6 space-y-1 text-f16-secondary-text text-sm mb-2">
              <li>Climb fuel requirements to cruise altitude</li>
              <li>Optimized cruise altitude and speed profiles</li>
              <li>Descent and approach fuel consumption</li>
              <li>Ground operations and taxi fuel</li>
            </ul>
            <p class="text-f16-secondary-text text-sm">
              A built-in safety margin ensures adequate fuel for normal traffic patterns, one approach and go-around if needed, plus reserves for minor route deviations.
            </p>
          </div>

          <!-- External Fuel -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-f16-primary mb-3">External Fuel Configurations</h3>
            <div class="space-y-3">
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">CL300 (Centerline - 2,000 lbs)</h4>
                <p class="text-f16-secondary-text text-sm">Centerline fuel tank with minimal drag penalty. First choice for additional fuel.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">W370 (Wing - 4,800 lbs)</h4>
                <p class="text-f16-secondary-text text-sm">Wing-mounted fuel tanks for extended range. Compatible with DCS and BMS.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">W600 (Wing - 7,900 lbs)</h4>
                <p class="text-f16-secondary-text text-sm">Large wing tanks for maximum range. BMS only configuration.</p>
              </div>
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">CFT (Conformal - 2,900 lbs)</h4>
                <p class="text-f16-secondary-text text-sm">Conformal Fuel Tanks provide additional internal fuel with no drag penalty. BMS only configuration.</p>
              </div>
            </div>
          </div>

          <!-- Loiter at Target -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-f16-primary mb-3">Loiter at Target</h3>
            <p class="text-f16-secondary-text text-sm mb-3">
              The loiter feature allows you to plan for extended time on target, automatically calculating additional fuel requirements for holding patterns and target area persistence.
            </p>
            <div class="space-y-3">
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Loiter Profiles</h4>
                <p class="text-f16-secondary-text text-sm mb-2">Two loiter profiles are available, each optimized for different operational requirements:</p>
                <ul class="list-disc pl-6 space-y-1 text-f16-secondary-text text-sm">
                  <li>Use the time sliders to set your required loiter duration</li>
                  <li>The calculator automatically adds the required loiter fuel to your target waypoint</li>
                  <li>Fuel consumption accounts for altitude and flight profile during loiter operations</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Planned Features -->
          <div class="help-section">
            <h3 class="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-3">Planned Features (Future Releases)</h3>
            <div class="space-y-3">
              <div class="bg-f16-elevated p-4 rounded-lg border border-f16-primary-border">
                <h4 class="font-medium text-f16-primary-text mb-2">Air-to-Air Refueling (AAR)</h4>
                <p class="text-f16-secondary-text text-sm">Automatic fuel configuration optimization and AAR procedure calculations when fuel requirements exceed aircraft capacity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const closeHelp = () => {
  emit('close')
}
</script>

<style scoped>
.help-section {
  @apply transition-colors duration-300;
}
</style> 
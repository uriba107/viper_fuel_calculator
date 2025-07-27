<template>
  <div class="space-y-6">
    <div class="f16-card">
      <div class="f16-legend">Mission Configuration</div>

      <div class="f16-form-grid">
        <!-- Mission Type -->
        <div class="f16-form-section">
          <label class="f16-form-label">Mission Type:</label>
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input type="radio" name="missionType" :checked="missionData.type === 'AA'" @change="setMissionType"
                class="f16-checkbox mr-2" />
              <span class="text-sm">Air to Air</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="missionType" :checked="missionData.type === 'AG'" @change="setMissionType"
                class="f16-checkbox mr-2" />
              <span class="text-sm">Air to Ground</span>
            </label>
          </div>
        </div>
        <div v-if="missionData.planAAR" class="f16-form-section">
          <label class="f16-form-label">Flight size:</label>
          <label class="flex items-center">
            <select id="flightSize" v-model.number="missionData.flightSize" class="f16-select w-full max-w-44">
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
            <!-- <span class="text-sm"></span> -->
          </label>
        </div>
        <!-- Low Level Attack (only for AG missions) -->
        <div v-if="missionData.type === 'AG'" class="f16-form-section">
          <label class="f16-form-label">Attack Profile:</label>
          <label class="flex items-center">
            <input type="checkbox" v-model="missionData.lowlevelattack" class="f16-checkbox mr-2"
              @change="updateRoute" />
            <span class="text-sm">Low level attack (pop-up/toss)</span>
          </label>
        </div>
        <div class="f16-form-section">
          <label class="f16-form-label">Extra Fuel Buffer</label>
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 transition-colors duration-300">
            <label class="flex items-start">
              <input type="checkbox" v-model="missionData.highThreat" class="f16-checkbox mr-3 mt-0.5"
                @change="updateRoute" />
              <div>
                <span class="text-sm font-medium text-blue-900 dark:text-blue-200">Add 1,000 lbs contingency fuel</span>
                <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Recommended for high-threat environments, adverse weather, or missions requiring extended loiter time
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Route Planning -->
      <div class="mt-6">
        <div class="f16-legend">Route Planning</div>
        <div class="space-y-4">
          <MissionWaypoint v-for="(wp, idx) in missionData.route" :key="idx" :waypoint="wp" :idx="idx"
            :tgtWpt="missionData.TgtWp" :isLastWpt="idx === missionData.route.length - 1"
            @deleteWaypoint="deleteWaypoint" @addWaypoint="addWaypoint" @setTarget="setTarget"
            @updateRoute="updateRoute" />
        </div>
        <!-- Mission Info -->
        <div v-if="missionData.type === 'AG'" class="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg transition-colors duration-300">
          <p class="text-sm text-orange-800 dark:text-orange-200 text-center">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Air to Ground mission selected - weapons drag will be calculated until target waypoint
          </p>
        </div>
        <!-- Loiter Time Settings (Collapsible) -->
        <div class="f16-form-section mt-6">
          <button @click="showLoiterSettings = !showLoiterSettings"
            class="w-full flex items-center justify-between f16-legend cursor-pointer hover:text-f16-primary-dark transition-colors duration-200">
            <span>Loiter on Target</span>
            <svg class="w-5 h-5 transform transition-transform duration-200"
              :class="{ 'rotate-180': showLoiterSettings }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-show="showLoiterSettings" class="mt-4 space-y-4 f16-fade-in">
            <!-- Side-by-side Loiter Controls -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- High Altitude Loiter -->
              <div>
                <label class="f16-form-label">
                  High Altitude (25,000ft @ M0.80)
                  <div class="mt-2 flex items-center space-x-3">
                    <input type="range" min="0" max="1" step="0.01666666667" value="0"
                      :class="missionData.loiter.high > 0 ? 'f16-slider-dynamic flex-1' : 'f16-slider-inactive flex-1'"
                      :style="missionData.loiter.high > 0 ? `--slider-intensity: ${missionData.loiter.high}` : ''"
                      id="LoiterHigh" v-model="missionData.loiter.high" @input="updateRoute">
                    <span class="text-sm font-medium text-f16-primary-text min-w-[50px]">
                      <span id="LoiterHighValue">{{ Math.round(missionData.loiter.high * 60) }}</span> min
                    </span>
                  </div>
                </label>
              </div>

              <!-- Low Altitude Loiter -->
              <div>
                <label class="f16-form-label">
                  Low Altitude (420kts)
                  <div class="mt-2 flex items-center space-x-3">
                    <input type="range" min="0" max="1" step="0.01666666667" value="0"
                      :class="missionData.loiter.low > 0 ? 'f16-slider-dynamic flex-1' : 'f16-slider-inactive flex-1'"
                      :style="missionData.loiter.low > 0 ? `--slider-intensity: ${missionData.loiter.low}` : ''"
                      id="LoiterLow" v-model="missionData.loiter.low" @input="updateRoute">
                    <span class="text-sm font-medium text-f16-primary-text min-w-[50px]">
                      <span id="LoiterLowValue">{{ Math.round(missionData.loiter.low * 60) }}</span> min
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Output Components -->
    <CalcOutput :fuelOutput="fuelOutput" :calcSettings="calcSettingsWithAAR" :CurrentAircraft="aircraft" />

    <RouteChart v-if="missionData.route[0].fuel > 0" :missionData="missionData" :fuelAvailable="aircraft.TotalFuel" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import {
  ExternalFuelData,
  storesDrag,
  FuelConst,
  getFuelConsumption,
  getFlightTime,
  getBingoFuel,
  getDistanceFromFuel,
} from "../../../data.js";

import MissionWaypoint from "./missionWaypoint.vue";
import CalcOutput from "./output/general.vue";
import RouteChart from "./output/chart.vue";

onMounted(() => {
  updateRoute()
})

const props = defineProps({
  aircraft: {
    type: Object,
    required: true,
  },
  calcSettings: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updateAircraft"]);

// Reactive data
const showLoiterSettings = ref(false);

// Computed settings that includes planAAR from missionData
const calcSettingsWithAAR = computed(() => ({
  ...props.calcSettings,
  planAAR: missionData.value.planAAR
}));

// Mission data - moved from fuelCalculator.vue
const missionData = ref({
  route: [
    { profile: "low_420", distance: 50 },
    { profile: "high", distance: 50 },
  ],
  loiter: {
    high: 0,
    low: 0,
  },
  type: "AA",
  TgtWp: 2, // 0-based index
  planAAR: false, // Moved from calcSettings to prevent infinite recursion
  flightSize: 2
});

// Fuel output - moved from fuelCalculator.vue
const fuelOutput = ref({
  fuelBalance: computed(
    () => props.aircraft.TotalFuel - fuelOutput.value.requiredMissionFuel + (missionData.value.TankerData?.tankerGive || 0)
  ),
  requiredMissionFuel: computed(() => missionFuel.value.requiredMissionFuel), // for now start with default route fuel requirements. it's updated on the fly anyway
  AvailableAircraftFuel: computed(() => props.aircraft.TotalFuel),
  AvailableMissionFuel: computed(() => props.aircraft.TotalFuel + (missionData.value.TankerData?.tankerGive || 0)),
  bingoFuel: computed(() => missionFuel.value.bingoFuel),
  tankerFuel: computed(() => missionData.value.TankerData?.tankerGive || 0),
});

// AG Weapon Drag computation - moved from fuelCalculator.vue
const AGWeaponDrag = computed(() => {
  const aircraft = props.aircraft;
  let drag = 0;
  for (const pylon of Object.keys(aircraft.loadout)) {
    if (aircraft.loadout[pylon] == "AG") {
      drag += storesDrag["AG"];
    }
  }
  return drag;
});

// Mission fuel calculations - moved from fuelCalculator.vue
const missionFuel = ref({});

missionFuel.value.requiredMissionFuel = computed(() => {
  const aircraft = props.aircraft;

  // Reset AAR flag at start of each calculation
  missionData.value.planAAR = false;
  missionData.value.TankerData = null;

  let requiredFuel = FuelConst.GroundOps + FuelConst.threat;
  if (missionData.value.highThreat) {
    requiredFuel += FuelConst.threat;
  }

  let route = missionData.value.route.slice().reverse();
  for (const [idx, wp] of route.entries()) {
    wp["fuel"] = getFuelConsumption(
      wp.distance,
      wp.profile,
      wp.drag,
      aircraft.cft
    );
    if (idx == route.length - missionData.value.TgtWp + 1) {
      if (missionData.value.type == "AG" && missionData.value.lowlevelattack) {
        wp.fuel += FuelConst.popup;
      }
      if (missionData.value.loiter.high > 0) {
        wp.fuel += getFuelConsumption(0, "high", aircraft.drag, aircraft.cft, missionData.value.loiter.high);
      }
      if (missionData.value.loiter.low > 0) {
        wp.fuel += getFuelConsumption(0, "low_420", aircraft.drag, aircraft.cft, missionData.value.loiter.low);
      }
    }
    requiredFuel += wp.fuel;
  }

  // if (requiredFuel > aircraft.maxTotalFuel) {
  //   missionData.value.planAAR = true;
  // }

  // Only try to update external fuel if we haven't already determined AAR is needed
  if (!missionData.value.planAAR) {
    updateExternalFuel(
      aircraft,
      requiredFuel - aircraft.TotalFuel,
      props.calcSettings.isDCS
    );
  }

  if (missionData.value.planAAR) {
    let fuelToTake = Math.max(4000, Math.min(8000, requiredFuel - aircraft.TotalFuel))
    let TankerData = computeAARfuel(requiredFuel)
    missionData.value.TankerData = TankerData
  }
  return Math.ceil(requiredFuel / 50) * 50;
  // fuelOutput.value.requiredMissionFuel = Math.ceil(requiredFuel / 50) * 50;
  // return fuelOutput.value.requiredMissionFuel;
});

// Simple targeted fix: Watch for BMS/DCS changes and replace invalid W600 tanks
watch(() => props.calcSettings.isDCS, (isDCS) => {
  if (isDCS && props.aircraft.loadout.inboard === "W600") {
    // Replace W600 with W370 when switching to DCS (W600 not available in DCS)
    props.aircraft.loadout.inboard = "W370";
    // Trigger recalculation
    updateRoute();
  }
});
watch(() => missionData.value.flightSize, () => {
  updateRoute();
})

missionFuel.value.bingoFuel = computed(() => {
  let tgtWp = missionData.value.route[missionData.value.TgtWp - 2];
  let returnRoute = missionData.value.route.slice(
    missionData.value.TgtWp - 1,
    missionData.value.route.length
  );
  let returnDistance = returnRoute.reduce((acc, wp) => acc + wp.distance, 0);
  return getBingoFuel(returnDistance, tgtWp.drag, props.aircraft.cft);
});

// External fuel management - moved from fuelCalculator.vue
const updateExternalFuel = (aircraft, fuelToAdd, isDcs = false) => {
  let inboardAvailable =
    aircraft.loadout.inboard == "" || aircraft.loadout.inboard == "AG";
  let centerAvailable = aircraft.loadout.center == "";
  let changed = false;
  if (fuelToAdd > -250) {
    if (aircraft.externalFuel + fuelToAdd +
      FuelConst.AAR > aircraft
        .maxExternalFuel) {
      missionData.value.planAAR = true;
    }

    if (centerAvailable && fuelToAdd <= ExternalFuelData["CL300"].fuel) {
      aircraft.loadout.center = "CL300";
      return true;
    }
    if (inboardAvailable) {
      if (
        aircraft.externalFuel + fuelToAdd <= ExternalFuelData["W370"].fuel &&
        !centerAvailable
      ) {
        aircraft.loadout.center = "";
        fuelToAdd += ExternalFuelData["CL300"].fuel;
      }
      if (fuelToAdd <= ExternalFuelData["W370"].fuel) {
        aircraft.loadout.inboard = "W370";
        return true;
      }
    }
    if (!isDcs) {
      if (
        aircraft.externalFuel + fuelToAdd <= ExternalFuelData["W600"].fuel &&
        (!centerAvailable || aircraft.loadout.inboard == "W370")
      ) {
        if (!centerAvailable) {
          aircraft.loadout.center = "";
          fuelToAdd += ExternalFuelData["CL300"].fuel;
        }
        if (aircraft.loadout.inboard == "W370") {
          if (aircraft.loadout.outboard == "AG") {
            aircraft.loadout.inboard = "AG";
          }
          aircraft.loadout.inboard = "";
          fuelToAdd += ExternalFuelData["W370"].fuel;
        }
      }
      if (fuelToAdd <= ExternalFuelData["W600"].fuel) {
        aircraft.loadout.inboard = "W600";
        return true;
      }
    }
  }
  if (fuelToAdd < -250 && (!centerAvailable || !inboardAvailable)) {
    if (!centerAvailable && fuelToAdd + ExternalFuelData["CL300"].fuel < -250) {
      fuelToAdd += ExternalFuelData["CL300"].fuel;
      aircraft.loadout.center = "";
      changed = true;
    }
    if (
      !inboardAvailable &&
      fuelToAdd + ExternalFuelData[aircraft.loadout.inboard]?.fuel < - 250
    ) {
      fuelToAdd += ExternalFuelData[aircraft.loadout.inboard].fuel;
      aircraft.loadout.inboard = "";
      if (aircraft.loadout.outboard == "AG") {
        aircraft.loadout.inboard = "AG";
      }
      changed = true;
    }
    // This will replace 600 Gal tanks with 370 Gal tanks. skipping 370+CL on the downsize. (drag reduction)
    if (!inboardAvailable && aircraft.loadout.inboard == "W600") {
      let wingTanksDiff = ExternalFuelData["W600"].fuel - (ExternalFuelData["W370"].fuel);
      if (fuelToAdd + wingTanksDiff < -250) {
        fuelToAdd += wingTanksDiff;
        aircraft.loadout.inboard = "W370";
        changed = true;
      }
    }
  }

  // if (changed) {
  //   emit("updateAircraft");
  // }
  return changed;
};

// Payload management - moved from fuelCalculator.vue
const setPayloadforMission = (payload) => {
  const aircraft = props.aircraft;
  if (payload) {
    if (aircraft.loadout.outboard == "" || aircraft.loadout.outboard == "AA") {
      aircraft.loadout.outboard = "AG";
    }
    if (aircraft.loadout.inboard == "") {
      aircraft.loadout.inboard = "AG";
    }
  } else {
    if (aircraft.loadout.outboard == "AG") {
      aircraft.loadout.outboard = "AA";
    }
    if (aircraft.loadout.inboard == "AG") {
      aircraft.loadout.inboard = "";
    }
  }
  emit("updateAircraft");
};

const computeAARfuel = (missionFuel) => {
  let refuelData = { fuelUsage: 0, profile: "high", afterWp: missionData.value.TgtWp - 2, distanceIntoLeg: 0, distanceFromTgt: 0, distanceFromHome: 0, refuelTimeHours: 0, tankerGive: 0 }
  let routeFuel = missionData.value.route.slice().reduce((fuel, wp) => { return fuel + wp.fuel }, 0)
  let unusableFuel = missionFuel - routeFuel
  let usablefuel = props.aircraft.TotalFuel - unusableFuel
  let fuelCounter = usablefuel - FuelConst.AAR
  for (let idx = missionData.value.route.length - 1; idx >= 0; idx--) {
    if (fuelCounter - missionData.value.route[idx].fuel < 0) {
      refuelData.afterWp = idx;
      refuelData.profile = missionData.value.route[idx].profile
      refuelData.distanceIntoLeg = getDistanceFromFuel(fuelCounter, refuelData.profile, props.aircraft.drag, props.aircraft.cft)
      refuelData.distanceFromTgt = missionData.value.route.slice(idx + 1, missionData.value.TgtWp - 1).reduce((distance, wp) => { return distance + wp.distance }, (missionData.value.route[idx].distance - refuelData.distanceIntoLeg))
      refuelData.distanceFromHome = missionData.value.route.slice(0, idx).reduce((distance, wp) => { return distance + wp.distance }, refuelData.distanceIntoLeg)
      let fuelToTake = missionFuel + FuelConst.AAR - props.aircraft.TotalFuel
      let giveTmp = Math.ceil(Math.max(4000, Math.min(8000, fuelToTake)) / 1000) * 1000
      let refuelTimeTemp = ((giveTmp / FuelConst.refuelRate) * missionData.value.flightSize) / 60
      let refuelFuelTemp = FuelConst.AAR + getFuelConsumption(0, refuelData.profile, props.aircraft.drag, props.aircraft.cft, refuelTimeTemp)
      refuelData.tankerGive = Math.ceil(Math.max(4000, Math.min(8000, fuelToTake + refuelFuelTemp)) / 1000) * 1000
      refuelData.refuelTimeHours = ((refuelData.tankerGive / FuelConst.refuelRate) * missionData.value.flightSize) / 60

      break;
    } else {
      fuelCounter -= missionData.value.route[idx].fuel;
    }
  }
  refuelData.fuelUsage = FuelConst.AAR + getFuelConsumption(0, refuelData.profile, props.aircraft.drag, props.aircraft.cft, refuelData.refuelTimeHours)
  if (refuelData.afterWp > missionData.value.TgtWp - 1 || refuelData.distanceFromTgt < 0) {
    log.console("There is not enogh fuel to get home from the target without hitting a tanker. this is too much for this poor calculator.")
  }

  return refuelData

}

// Route update function - moved from fuelCalculator.vue
const updateRoute = () => {
  const aircraft = props.aircraft;

  for (const [idx, wp] of missionData.value.route.entries()) {
    let WPdrag = aircraft.drag;
    if (missionData.value.type == "AG") {
      if (idx > missionData.value.TgtWp - 2) {
        WPdrag -= AGWeaponDrag.value;
      }
    }
    wp["drag"] = WPdrag;
    wp["time"] = getFlightTime(wp.distance, wp.profile);
  }
  // Trigger recalculation by accessing the computed values
  // This will cause the watcher to run and update external fuel as needed
  missionFuel.value.bingoFuel;
  missionFuel.value.requiredMissionFuel;
};

const setMissionType = (event) => {
  const isAG = event.target.checked && event.target.name === 'missionType' && missionData.value.type === 'AA';
  const isAA = event.target.checked && event.target.name === 'missionType' && missionData.value.type === 'AG';

  if (isAG) {
    missionData.value.type = "AG";
    setPayloadforMission(true);
  } else if (isAA) {
    missionData.value.type = "AA";
    setPayloadforMission(false);
  }
  updateRoute()
};

const setTarget = (idx) => {
  missionData.value.TgtWp = idx;
  updateRoute();
};

const deleteWaypoint = (idx) => {
  missionData.value.route.splice(idx, 1);
  if (missionData.value.TgtWp >= idx + 2) {
    missionData.value.TgtWp--;
  }
  updateRoute();
};

const addWaypoint = (idx) => {
  missionData.value.route.splice(idx + 1, 0, { distance: 50, profile: "high" });
  if (missionData.value.TgtWp >= idx + 2) {
    missionData.value.TgtWp++;
  }
  updateRoute();
};


</script>

<style scoped></style>

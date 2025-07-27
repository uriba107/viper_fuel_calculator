<template>
  <div class="max-w-7xl mx-auto p-4 space-y-6">
    <MissionSettings :aircraft="CurrentAircraft" :calcSettings="calcSettings" @setAircraft="updateAircraft" @setSim="setSim"/>

    <MissionMilSim :aircraft="CurrentAircraft" :calcSettings="calcSettings" @updateAircraft="updateAircraft"
      v-if="calcSettings.computeMode == 'MilSim'" />

    <MissionAirQuake @updateRoute="updateAircraft" v-if="calcSettings.computeMode == 'AirQuake'" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import {
  aircraftData,
  ExternalFuelData,
  getDrag,
  getExternalFuel,
} from "../../data.js";

import MissionSettings from "../calculator/missionSettings.vue";
import MissionMilSim from "./MilSim/missionMilSim.vue";
import MissionAirQuake from "./missionAirQuake.vue";

const emit = defineEmits(['setSim'])

const calcSettings = ref({
  computeMode: "MilSim",
  isDCS: false,
});

const CurrentAircraft = ref({
  type: "C",
  cft: false,
  loadout: {
    center: "",
    inboard: "",
    outboard: "AA",
  },
  drag: computed(() => {
    return (
      aircraftData[CurrentAircraft.value.type].drag +
      getDrag(Object.values(CurrentAircraft.value.loadout))
    );
  }),
  internalFuel: computed(() => {
    return (
      aircraftData[CurrentAircraft.value.type].fuel +
      (ExternalFuelData[CurrentAircraft.value.cft === true ? "CFT" : ""]
        ?.fuel || 0)
    );
  }),
  externalFuel: computed(() => {
    return getExternalFuel(Object.values(CurrentAircraft.value.loadout));
  }),
  TotalFuel: computed(() => {
    return (
      CurrentAircraft.value.internalFuel + CurrentAircraft.value.externalFuel
    )
  }),
  maxExternalFuel: computed(() => {
    let fuel = ExternalFuelData["CL300"].fuel;
    if (calcSettings.value.isDCS) {
      fuel += ExternalFuelData["W370"].fuel;
    } else {
      fuel += ExternalFuelData["W600"].fuel;
    }
    return fuel;
  }),
  MaxTotalFuel: computed(() => {
    return CurrentAircraft.value.internalFuel + CurrentAircraft.value.maxExternalFuel;
  })

});

const updateAircraft = () => {
  // Trigger reactivity for aircraft changes
  // The computed properties will automatically update
};
const setSim = (value) => {

  emit('setSim',value)
}

onMounted(() => {
  emit('setSim',calcSettings.value.isDCS?'DCS':'BMS')
})
</script>

<style scoped></style>

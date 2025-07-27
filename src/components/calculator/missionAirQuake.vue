<template>
    <div>
        <label for="distanceToAO" class="f16-form-label">distance to AO</label>
        <input type="range" min="50" max="250" value="50" id="distanceToAO" />
        <span class="text-sm font-medium text-gray-700 min-w-[50px]">50</span>

        <label for="missionType" class="f16-form-label">mission type</label>
        <input type="radio" v-model="missionData.type" name="missionType" value="AA" /> AA
        <input type="radio" v-model="missionData.type" name="missionType" value="AG" /> AG


        <div v-if="missionData.type == 'AA'">
            <label for="airquakeAG" class="f16-form-label">AG</label>
            <input type="checkbox" id="airquakeAG" v-model="missionData.popup"/>
        </div>

<div v-if="missionData.type == 'AG'">
    <label for="airquakeBVR" class="f16-form-label">BVR fuel profile</label>
    <input type="checkbox" id="airquakeBVR" v-model="missionData.extraThreat"/>
</div>

        AirQuake Mode not implemented yet
        <ul>
            <li> AA/AG</li>
            <li>BVR/popup</li>
            <li> distance to AO</li>

            <li> all configs assume 3 bags - assume wings first</li>
            <li> endurance BVR (50% MIL/50% AB @ 25,000ft) - jett tanks when empty</li>
            <li> endurance 480kt @ low alt (AG weapons, jett tanks when empty)</li>
        

        </ul>
    </div>
</template>
<script setup>
import { ref } from "vue";

const emit = defineEmits(["updateRoute"]);

// Local mission data for AirQuake mode
const missionData = ref({
  type: "AA",
  popup: false,
  extraThreat: false,
});

</script>
<style scoped></style>
<template>
    <div class="f16-waypoint-row transition-colors duration-300" :class="{ 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700': isTarget }">
        <div class="p-4 border border-f16-primary-border bg-f16-surface rounded-lg transition-colors duration-300">
            <!-- Main content container with responsive layout -->
            <div class="flex flex-col sm:flex-row">

                <!-- Left Container: Waypoint ID Only -->
                <div class="flex items-center flex-shrink-0 w-12 lg:mr-3">
                    <span class="font-medium text-f16-primary-text">{{ idx + 1 }}:</span>
                    <div v-if="idx === 0" title="Takeoff">
                        <svg class="w-6 h-6 text-f16-primary ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 22h20" />
                            <path
                                d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
                        </svg>
                    </div>
                </div>

                <!-- Center Container: Distance, Profile, Arrow, Next WP -->
                <div class="flex items-center space-x-3 flex-nowrap gap-2 lg:mr-3 flex-grow justify-start-safe">
                    <div class="flex flex-col">
                        <label class="text-xs text-f16-muted-text mb-1">Distance (NM)</label>
                        <input type="number" v-model="waypoint.distance" class="f16-input w-24 text-sm" min="10"
                            placeholder="NM" @change="updateRoute" />
                    </div>

                    <div class="flex flex-col">
                        <label class="text-xs text-f16-muted-text mb-1">Flight Profile</label>
                        <select v-model="waypoint.profile" class="f16-select text-sm" @change="updateRoute">
                            <option value="low_420">Low 420kt</option>
                            <option value="low_480">Low 480kt</option>
                            <option value="high">25,000ft M0.78</option>
                        </select>
                    </div>

                    <div class="flex items-center space-x-2">

                        <svg class="w-4 h-4 text-f16-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span class="font-medium text-f16-primary-text">{{ idx + 2 }}</span>
                        <div class="text-f16-secondary-text text-xs flex flex-col">
                            <span v-if="waypoint.time">{{ TimeOfFlight.h }}h {{ TimeOfFlight.m }}m {{ TimeOfFlight.s }}s</span>
                            <span v-if="waypoint.fuel">{{ Math.round(waypoint.fuel) }} lbs</span>
                            <span v-if="waypoint.drag">DI={{ waypoint.drag }}</span>

                        </div>
                        <div v-if="isLastWpt" title="Landing">
                            <svg class="w-6 h-6 text-f16-primary ml-1" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2 22h20" />
                                <path
                                    d="M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- <div class="flex items-center space-x-4 lg:ml-auto flex-1">balh</div> -->
                <!-- Right Container: Target Selector and Buttons -->
                <div class="flex items-center space-x-4 flex-shrink-0 lg:ml-auto justify-end-safe flex-nowrap">
                    <!-- Target Selection -->
                    <div class="flex items-center">
                        <label class="flex items-center" :class="{
                            'cursor-pointer': !isLastWpt,
                            'cursor-not-allowed opacity-50': isLastWpt
                        }" :title="isLastWpt ? 'Cannot set last waypoint as target' : 'Set as target waypoint'">
                            <input type="radio" name="tgtWpt" :value="idx + 2" :checked="isTarget" :disabled="isLastWpt"
                                @change="setTarget" class="f16-checkbox mr-2" :class="{ 'opacity-50': isLastWpt }" />
                            <!-- Target Icon -->
                            <svg class="w-5 h-5" :class="{
                                'text-green-700 dark:text-green-300': isTarget && !isLastWpt,
                                'text-f16-secondary-text': !isTarget && !isLastWpt,
                                'text-f16-muted-text': isLastWpt
                            }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke-width="2" />
                                <circle cx="12" cy="12" r="6" stroke-width="2" />
                                <circle cx="12" cy="12" r="2" stroke-width="2" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                            </svg>
                        </label>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center space-x-2">
                        <button class="f16-button-secondary text-xs lg:text-sm px-2 lg:px-3 py-1 flex items-center"
                            @click="addWaypoint" title="Add waypoint after this one">
                            <svg class="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span class="hidden lg:inline">Add</span>
                        </button>
                        <button class="f16-button-secondary text-xs lg:text-sm px-2 lg:px-3 py-1 flex items-center"
                            :class="{
                                'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20': !(idx === 0 || isLastWpt),
                                'text-f16-muted-text bg-f16-surface border-f16-secondary-border cursor-not-allowed opacity-50': idx === 0 || isLastWpt
                            }" @click="deleteWaypoint"
                            :title="idx === 0 ? 'Cannot delete first waypoint' : isLastWpt ? 'Cannot delete last waypoint' : 'Delete this waypoint'"
                            :disabled="idx === 0 || isLastWpt">
                            <svg class="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span class="hidden lg:inline">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Target indicator -->
        <div v-if="isTarget" class="mt-2 text-center">
            <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 transition-colors duration-300">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Target Waypoint
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
const emit = defineEmits(['setTarget', 'deleteWaypoint', 'addWaypoint', 'updateRoute'])

const props = defineProps({
    waypoint: {
        type: Object,
        required: true,
    },
    idx: {
        type: Number,
        required: true,
    },
    tgtWpt: {
        type: Number,
        required: true,
    },
    isLastWpt: {
        type: Boolean,
        required: true,
    },
})

const isTarget = computed(() => {
    return props.tgtWpt == props.idx + 2
})

const TimeOfFlight = computed(() => {
    let time = { h: 0, m: 0, s: 0 }
    if (props.waypoint.time > 0) {
        time.h = Math.trunc(props.waypoint.time)
        let minutesDec = (props.waypoint.time - time.h) * 60
        time.m = Math.trunc(minutesDec)
        time.s = Math.round((minutesDec - time.m) * 60)
    }
    return time
})
const setTarget = (event) => {
    emit('setTarget', Number(event.target.value))
}

const deleteWaypoint = () => {
    emit('deleteWaypoint', props.idx)
}

const addWaypoint = () => {
    emit('addWaypoint', props.idx)
}

const updateRoute = () => {
    emit('updateRoute', props.idx)
}
</script>

<style scoped>
.f16-waypoint-row {
    @apply transition-all duration-200;
}

.f16-waypoint-row:hover {
    @apply transform scale-[1.01];
}
</style>
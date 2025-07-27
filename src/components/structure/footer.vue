<template>
    <footer class="bg-f16-surface border-t border-f16-primary-border p-4 transition-colors duration-300">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-center justify-between">
                <!-- Copyright -->
                <div class="text-center text-f16-secondary-text text-sm flex-1">
                    <p class="mb-1">
                        Written by the 
                        <a href="https://www.108vfs.org/" target="_blank" class="text-f16-primary hover:text-f16-primary-dark transition-colors">
                            108th VFS
                        </a>
                    </p>
                    <p class="text-xs text-f16-muted-text">
                        For use with Falcon Family sims only
                    </p>
                </div>

                <!-- Theme Toggle Button -->
                <div class="flex items-center space-x-2">
                    <button
                        @click="toggleTheme"
                        class="f16-theme-toggle flex items-center space-x-2 text-xs"
                        :title="themeButtonTitle"
                    >
                        <!-- Sun Icon for Light Mode -->
                        <svg v-if="isDarkMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <!-- Moon Icon for Dark Mode -->
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span class="hidden sm:inline">{{ themeButtonText }}</span>
                    </button>
                    
                    <!-- Reset to Auto Button (only show when manual override is active) -->
                    <button
                        v-if="!isAuto"
                        @click="resetToAuto"
                        class="f16-theme-toggle text-xs"
                        title="Reset to system theme"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span class="hidden sm:inline ml-1">Auto</span>
                    </button>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDarkMode, toggleTheme, resetToAuto, isAuto, themeOverride } = useTheme()

const themeButtonText = computed(() => {
    if (isDarkMode.value) {
        return 'Light'
    } else {
        return 'Dark'
    }
})

const themeButtonTitle = computed(() => {
    const currentMode = isDarkMode.value ? 'dark' : 'light'
    const nextMode = isDarkMode.value ? 'light' : 'dark'
    const source = isAuto.value ? '(system)' : '(manual)'
    
    return `Currently ${currentMode} mode ${source}. Click to switch to ${nextMode} mode.`
})
</script>

<style scoped>
</style>
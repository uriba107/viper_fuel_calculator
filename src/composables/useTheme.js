import { ref, computed, watchEffect } from 'vue'

// Theme state
const isDarkMode = ref(false)
const themeOverride = ref(null) // null = auto, 'light' = force light, 'dark' = force dark

// Get system theme preference
const getSystemTheme = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Load saved theme preference
const loadThemePreference = () => {
  const saved = localStorage.getItem('f16-theme-override')
  if (saved && ['light', 'dark'].includes(saved)) {
    themeOverride.value = saved
  } else {
    themeOverride.value = null // auto/system
  }
}

// Save theme preference
const saveThemePreference = (override) => {
  if (override === null) {
    localStorage.removeItem('f16-theme-override')
  } else {
    localStorage.setItem('f16-theme-override', override)
  }
}

// Computed theme based on override or system preference
const currentTheme = computed(() => {
  if (themeOverride.value === 'dark') return 'dark'
  if (themeOverride.value === 'light') return 'light'
  return getSystemTheme() ? 'dark' : 'light'
})

// Initialize theme management
const initTheme = () => {
  loadThemePreference()
  
  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = () => {
    if (themeOverride.value === null) {
      isDarkMode.value = mediaQuery.matches
      updateThemeClass()
    }
  }
  
  mediaQuery.addEventListener('change', handleSystemThemeChange)
  
  // Update theme when computed theme changes
  watchEffect(() => {
    isDarkMode.value = currentTheme.value === 'dark'
    updateThemeClass()
  })
  
  // Initial theme setup
  isDarkMode.value = currentTheme.value === 'dark'
  updateThemeClass()
  
  return () => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
}

// Update HTML class for theme
const updateThemeClass = () => {
  const htmlElement = document.documentElement
  if (isDarkMode.value) {
    htmlElement.classList.add('dark')
    htmlElement.classList.remove('light')
  } else {
    htmlElement.classList.add('light')
    htmlElement.classList.remove('dark')
  }
}

// Theme control functions
const setTheme = (theme) => {
  themeOverride.value = theme
  saveThemePreference(theme)
}

const toggleTheme = () => {
  if (themeOverride.value === null) {
    // Currently auto, set to opposite of current system theme
    setTheme(getSystemTheme() ? 'light' : 'dark')
  } else if (themeOverride.value === 'light') {
    setTheme('dark')
  } else {
    setTheme('light')
  }
}

const resetToAuto = () => {
  setTheme(null)
}

// Theme status getters
const isAuto = computed(() => themeOverride.value === null)
const themeSource = computed(() => {
  if (themeOverride.value) return 'manual'
  return 'system'
})

export function useTheme() {
  return {
    // State
    isDarkMode: computed(() => isDarkMode.value),
    currentTheme,
    themeOverride: computed(() => themeOverride.value),
    isAuto,
    themeSource,
    
    // Actions
    initTheme,
    setTheme,
    toggleTheme,
    resetToAuto
  }
} 
import { defineStore } from 'pinia'
import { Dark } from 'quasar'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    themeOptions: [
      { value: 'light', label: 'Light Theme', icon: 'light_mode' },
      { value: 'dark', label: 'Dark Theme', icon: 'dark_mode' },
      { value: 'auto', label: 'Auto (System)', icon: 'brightness_auto' }
    ],
    currentTheme: 'light'
  }),

  getters: {
    currentThemeOption: (state) => {
      return state.themeOptions.find(option => option.value === state.currentTheme)
    },

    themeIcon: (state) => {
      const option = state.themeOptions.find(option => option.value === state.currentTheme)
      return option?.icon || 'brightness_auto'
    }
  },

  actions: {
    initTheme() {
      // Get saved theme from localStorage
      const savedTheme = localStorage.getItem('theme')

      if (savedTheme && this.themeOptions.some(option => option.value === savedTheme)) {
        this.currentTheme = savedTheme
      } else {
        // Check system preference
        this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }

      console.log('Theme initialized:', this.currentTheme)
      this.applyTheme()

      // Listen for system theme changes if auto mode
      if (this.currentTheme === 'auto') {
        this.setupSystemThemeListener()
      }
    },

    setTheme(theme) {
      console.log('Setting theme to:', theme)
      if (!this.themeOptions.some(option => option.value === theme)) {
        console.warn('Invalid theme:', theme)
        return
      }

      this.currentTheme = theme
      localStorage.setItem('theme', theme)
      this.applyTheme()

      if (theme === 'auto') {
        this.setupSystemThemeListener()
      } else {
        this.removeSystemThemeListener()
      }
    },

    applyTheme() {
      let shouldBeDark = false

      if (this.currentTheme === 'dark') {
        shouldBeDark = true
      } else if (this.currentTheme === 'auto') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }

      console.log('Applying theme:', this.currentTheme, 'shouldBeDark:', shouldBeDark)

      this.isDark = shouldBeDark
      Dark.set(shouldBeDark)

      // Apply CSS custom properties for additional theme variables
      document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light')

      // Update body class for additional styling
      if (shouldBeDark) {
        document.body.classList.add('dark-theme')
        document.body.classList.remove('light-theme')
      } else {
        document.body.classList.add('light-theme')
        document.body.classList.remove('dark-theme')
      }
    },

    toggleTheme() {
      const currentIndex = this.themeOptions.findIndex(option => option.value === this.currentTheme)
      const nextIndex = (currentIndex + 1) % this.themeOptions.length
      this.setTheme(this.themeOptions[nextIndex].value)
    },

    setupSystemThemeListener() {
      this.removeSystemThemeListener() // Remove existing listener

      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.systemThemeHandler = () => {
        if (this.currentTheme === 'auto') {
          this.applyTheme()
        }
      }

      this.mediaQuery.addEventListener('change', this.systemThemeHandler)
    },

    removeSystemThemeListener() {
      if (this.mediaQuery && this.systemThemeHandler) {
        this.mediaQuery.removeEventListener('change', this.systemThemeHandler)
      }
    }
  }
})

import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    currentLocale: 'id',
    locales: [
      {
        value: 'id',
        label: 'Bahasa Indonesia',
        flag: '🇮🇩',
        nativeName: 'Bahasa Indonesia'
      },
      {
        value: 'en',
        label: 'English',
        flag: '🇺🇸',
        nativeName: 'English'
      }
    ]
  }),

  getters: {
    currentLocaleOption: (state) => {
      return state.locales.find(locale => locale.value === state.currentLocale)
    },

    availableLocales: (state) => state.locales,

    isRTL: (state) => {
      // Add RTL locales here if needed in the future
      const rtlLocales = ['ar', 'he', 'fa']
      return rtlLocales.includes(state.currentLocale)
    }
  },

  actions: {
    initLocale() {
      // Get saved locale from localStorage
      const savedLocale = localStorage.getItem('locale')

      if (savedLocale && this.locales.find(l => l.value === savedLocale)) {
        this.currentLocale = savedLocale
      } else {
        // Try to detect browser language
        const browserLanguage = navigator.language || navigator.userLanguage
        const browserLang = browserLanguage.split('-')[0]

        const supportedLocale = this.locales.find(l => l.value === browserLang)
        if (supportedLocale) {
          this.currentLocale = browserLang
        } else {
          this.currentLocale = 'id' // Default fallback
        }
      }

      this.applyLocale()
    },

    setLocale(locale) {
      if (this.locales.find(l => l.value === locale)) {
        this.currentLocale = locale
        localStorage.setItem('locale', locale)
        this.applyLocale()

        // Emit event for other components to react
        window.dispatchEvent(new CustomEvent('localeChanged', {
          detail: { locale }
        }))
      }
    },

    applyLocale() {
      // Set document language
      document.documentElement.lang = this.currentLocale

      // Set document direction for RTL languages
      document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr'

      // Update body class for locale-specific styling
      document.body.className = document.body.className.replace(/locale-\w+/g, '')
      document.body.classList.add(`locale-${this.currentLocale}`)
    },

    toggleLocale() {
      const currentIndex = this.locales.findIndex(locale => locale.value === this.currentLocale)
      const nextIndex = (currentIndex + 1) % this.locales.length
      this.setLocale(this.locales[nextIndex].value)
    },

    getLocalizedText(key, fallback = '') {
      // Helper method for getting localized text
      // This would typically integrate with vue-i18n
      return fallback
    }
  }
})

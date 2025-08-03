import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLocale: LocalStorage.getItem('locale') || 'en-US',
    availableLocales: [
      {
        value: 'en-US',
        label: 'English (US)',
        flag: '🇺🇸',
        nativeName: 'English'
      },
      {
        value: 'id-ID',
        label: 'Bahasa Indonesia',
        flag: '🇮🇩',
        nativeName: 'Bahasa Indonesia'
      }
    ]
  }),

  getters: {
    currentLanguage: (state) => {
      return state.availableLocales.find(locale => locale.value === state.currentLocale)
    },

    currentFlag: (state) => {
      const locale = state.availableLocales.find(l => l.value === state.currentLocale)
      return locale?.flag || '🌐'
    },

    currentNativeName: (state) => {
      const locale = state.availableLocales.find(l => l.value === state.currentLocale)
      return locale?.nativeName || 'Unknown'
    }
  },

  actions: {
    setLocale(locale) {
      console.log('Setting locale to:', locale)

      // Only set if locale is available
      if (!this.availableLocales.some(l => l.value === locale)) {
        console.warn(`Locale ${locale} not available, falling back to en-US`)
        locale = 'en-US'
      }

      this.currentLocale = locale
      LocalStorage.set('locale', locale)

      // Update i18n instance if available
      if (window.$i18n) {
        console.log('Updating i18n locale to:', locale)
        window.$i18n.locale.value = locale
      } else {
        console.warn('i18n instance not available')
      }

      console.log('Language changed to:', locale)
    },

    initLanguage() {
      const savedLocale = LocalStorage.getItem('locale')
      const browserLocale = navigator.language || navigator.userLanguage || 'en-US'

      // Check if saved locale is available
      if (savedLocale && this.availableLocales.some(l => l.value === savedLocale)) {
        this.currentLocale = savedLocale
      }
      // Check if browser locale is available
      else if (this.availableLocales.some(l => l.value === browserLocale)) {
        this.currentLocale = browserLocale
        LocalStorage.set('locale', browserLocale)
      }
      // Default to English
      else {
        this.currentLocale = 'en-US'
        LocalStorage.set('locale', 'en-US')
      }
    },

    toggleLanguage() {
      const currentIndex = this.availableLocales.findIndex(locale => locale.value === this.currentLocale)
      const nextIndex = (currentIndex + 1) % this.availableLocales.length
      this.setLocale(this.availableLocales[nextIndex].value)
    }
  }
})

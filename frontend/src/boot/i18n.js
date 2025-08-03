import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { LocalStorage } from 'quasar'
import messages from 'src/i18n'

const savedLocale = LocalStorage.getItem('locale') || 'en-US'

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: savedLocale,
    fallbackLocale: 'en-US',
    globalInjection: true,
    legacy: false,
    messages,
  })

  // Set i18n instance on app
  app.use(i18n)

  // Make i18n available globally for stores
  app.config.globalProperties.$i18n = i18n.global
  window.$i18n = i18n.global
})

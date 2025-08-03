<template>
  <div>
    <h3>Debug Information</h3>
    <p>Theme Store Current Theme: {{ themeStore.currentTheme }}</p>
    <p>Theme Store Icon: {{ themeStore.themeIcon }}</p>
    <p>Available Themes: {{ themeStore.themeOptions.map(t => t.value).join(', ') }}</p>
    <p>Language Store Current Locale: {{ languageStore.currentLocale }}</p>
    <p>Available Locales: {{ languageStore.availableLocales.map(l => l.value).join(', ') }}</p>

    <h4>Test Theme Switch</h4>
    <q-btn
      v-for="theme in themeStore.themeOptions"
      :key="theme.value"
      :label="theme.value"
      @click="themeStore.setTheme(theme.value)"
      class="q-mr-sm q-mb-sm"
      :color="themeStore.currentTheme === theme.value ? 'primary' : 'grey'"
    />

    <h4>Test Language Switch</h4>
    <q-btn
      v-for="locale in languageStore.availableLocales"
      :key="locale.value"
      :label="locale.nativeName"
      @click="languageStore.setLocale(locale.value)"
      class="q-mr-sm q-mb-sm"
      :color="languageStore.currentLocale === locale.value ? 'primary' : 'grey'"
    />
  </div>
</template>

<script setup>
import { useThemeStore } from 'src/stores/theme'
import { useLanguageStore } from 'src/stores/language'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
</script>

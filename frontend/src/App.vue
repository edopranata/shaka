<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from 'src/stores/theme'
import { useLanguageStore } from 'src/stores/language'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()

onMounted(() => {
  // Initialize theme
  themeStore.initTheme()

  // Initialize language
  languageStore.initLanguage()
})
</script>

<template>
  <q-btn
    flat
    round
    dense
    class="language-toggle"
  >
    <span class="flag-icon">{{ languageStore.currentFlag }}</span>

    <q-tooltip :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-8 text-white'">
      {{ $t('language.switchLanguage') }}: {{ languageStore.currentNativeName }}
    </q-tooltip>

    <!-- Language Selection Menu -->
    <q-popup-proxy
      transition-show="scale"
      transition-hide="scale"
      anchor="bottom middle"
      self="top middle"
      :offset="[0, 8]"
    >
      <q-card
        :class="[$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-dark']"
        class="shadow-4"
        style="min-width: 220px"
      >
        <q-card-section class="q-pa-none">
          <q-list class="rounded-borders">
            <q-item-label
              header
              class="text-weight-medium q-px-md q-py-sm"
              :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'"
            >
              {{ $t('language.selectLanguage') }}
            </q-item-label>

            <q-separator :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-3'" />

            <q-item
              v-for="locale in languageStore.availableLocales"
              :key="locale.value"
              clickable
              v-close-popup
              @click="setLanguage(locale.value)"
              :class="{
                'bg-primary text-white': languageStore.currentLocale === locale.value,
                'hover-light': !$q.dark.isActive && languageStore.currentLocale !== locale.value,
                'hover-dark': $q.dark.isActive && languageStore.currentLocale !== locale.value
              }"
              class="q-pa-md language-item"
            >
              <q-item-section avatar>
                <span class="flag-icon text-h6">{{ locale.flag }}</span>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ locale.nativeName }}</q-item-label>
                <q-item-label
                  caption
                  :class="languageStore.currentLocale === locale.value ? 'text-grey-3' : ($q.dark.isActive ? 'text-grey-5' : 'text-grey-6')"
                >
                  {{ locale.label }}
                </q-item-label>
              </q-item-section>

              <q-item-section side v-if="languageStore.currentLocale === locale.value">
                <q-icon name="check" color="positive" size="sm" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </q-btn>
</template>

<script setup>
import { useLanguageStore } from 'src/stores/language'

const languageStore = useLanguageStore()

const setLanguage = (locale) => {
  languageStore.setLocale(locale)
}
</script>

<style scoped>
.language-toggle {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
}

.language-toggle:hover {
  background-color: var(--q-primary);
  opacity: 0.8;
  transform: scale(1.05);
}

/* Different hover colors for light and dark mode */
.body--light .language-toggle:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

.body--dark .language-toggle:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.flag-icon {
  font-size: 1.2em;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.language-toggle:hover .flag-icon {
  transform: rotate(15deg);
}

/* Popup styling */
:deep(.q-popup-proxy) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

:deep(.q-card) {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Light mode card styling */
:deep(.q-card.bg-white) {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* Dark mode card styling */
:deep(.q-card.bg-dark) {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.language-item {
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 2px 8px;
}

/* Light mode hover effects */
.hover-light:hover {
  background-color: rgba(25, 118, 210, 0.08) !important;
  transform: translateX(4px);
}

/* Dark mode hover effects */
.hover-dark:hover {
  background-color: rgba(25, 118, 210, 0.15) !important;
  transform: translateX(4px);
}

/* Active/selected item styling */
:deep(.q-item.bg-primary) {
  background: linear-gradient(135deg, #1976d2, #42a5f5) !important;
  border-radius: 8px;
}

/* Separator styling for different modes */
:deep(.q-separator.bg-grey-3) {
  opacity: 0.3;
}

:deep(.q-separator.bg-grey-7) {
  opacity: 0.5;
}
</style>

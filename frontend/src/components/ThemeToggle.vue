<template>
  <q-btn
    flat
    round
    dense
    :icon="themeStore.themeIcon"
    class="theme-toggle"
  >
    <q-tooltip :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-8 text-white'">
      {{ $t('theme.switchTheme') }}: {{ currentThemeLabel }}
    </q-tooltip>

    <!-- Theme Selection Menu -->
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
        style="min-width: 200px"
      >
        <q-card-section class="q-pa-none">
          <q-list class="rounded-borders">
            <q-item-label
              header
              class="text-weight-medium q-px-md q-py-sm"
              :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'"
            >
              {{ $t('theme.selectTheme') }}
            </q-item-label>

            <q-separator :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-3'" />

            <q-item
              v-for="theme in themeStore.themeOptions"
              :key="theme.value"
              clickable
              v-close-popup
              @click="setTheme(theme.value)"
              :class="{
                'bg-primary text-white': themeStore.currentTheme === theme.value,
                'hover-light': !$q.dark.isActive && themeStore.currentTheme !== theme.value,
                'hover-dark': $q.dark.isActive && themeStore.currentTheme !== theme.value
              }"
              class="q-pa-md theme-item"
            >
              <q-item-section avatar>
                <q-icon :name="theme.icon" size="sm" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t(`theme.${theme.value}`) }}</q-item-label>
                <q-item-label
                  caption
                  :class="themeStore.currentTheme === theme.value ? 'text-grey-3' : ($q.dark.isActive ? 'text-grey-5' : 'text-grey-6')"
                >
                  {{ $t(`theme.${theme.value}Description`) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side v-if="themeStore.currentTheme === theme.value">
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
import { computed } from 'vue'
import { useThemeStore } from 'src/stores/theme'
import { useI18n } from 'vue-i18n'

const themeStore = useThemeStore()
const { t } = useI18n()

const currentThemeLabel = computed(() => {
  return t(`theme.${themeStore.currentTheme}`)
})

const setTheme = (theme) => {
  themeStore.setTheme(theme)
}
</script>

<style scoped>
.theme-toggle {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
}

.theme-toggle:hover {
  background-color: var(--q-primary);
  opacity: 0.8;
  transform: scale(1.05);
}

/* Different hover colors for light and dark mode */
.body--light .theme-toggle:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

.body--dark .theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.theme-toggle .q-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle:active .q-icon {
  transform: rotate(180deg);
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

.theme-item {
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

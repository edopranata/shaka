<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <MenuToggle
          :is-open="leftDrawerOpen"
          @toggle="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-icon name="storefront" size="sm" class="q-mr-sm" />
          Shaka POS
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- Theme Switcher -->
          <ThemeToggle />

          <!-- Language Switcher -->
          <LanguageToggle />

          <!-- User Menu -->
          <q-btn flat round dense icon="account_circle">
            <q-tooltip>{{ authStore.userName }} ({{ authStore.userRole }})</q-tooltip>
            <q-menu>
              <q-list style="min-width: 200px">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ authStore.userName }}</q-item-label>
                    <q-item-label caption>{{ authStore.userRole }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>{{ $t('auth.logout') }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-weight-bold">
          {{ $t('navigation.mainMenu') }}
        </q-item-label>

        <q-item clickable to="/" exact>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.dashboard') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="point_of_sale" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.pos') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.products') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.customers') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.transactions') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header class="text-weight-bold">
          {{ $t('navigation.reports') }}
        </q-item-label>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.analytics') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="assessment" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.sales') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header class="text-weight-bold">
          {{ $t('navigation.settings') }}
        </q-item-label>

        <q-item clickable v-if="authStore.hasPermission('users.view')">
          <q-item-section avatar>
            <q-icon name="manage_accounts" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.users') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-if="authStore.hasPermission('settings.view')">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('navigation.system') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useNotify } from 'src/composables/useQuasar'
import ThemeToggle from 'src/components/ThemeToggle.vue'
import LanguageToggle from 'src/components/LanguageToggle.vue'
import MenuToggle from 'src/components/MenuToggle.vue'

const router = useRouter()
const authStore = useAuthStore()
const notify = useNotify()

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = async () => {
  try {
    await authStore.logout()

    notify.success('Logout berhasil')

    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)

    notify.error('Terjadi kesalahan saat logout')
  }
}
</script>

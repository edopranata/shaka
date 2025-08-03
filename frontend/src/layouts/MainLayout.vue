<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-icon name="storefront" size="sm" class="q-mr-sm" />
          Shaka POS
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
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
                  <q-item-section>Logout</q-item-section>
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
          Menu Utama
        </q-item-label>

        <q-item clickable to="/" exact>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="point_of_sale" />
          </q-item-section>
          <q-item-section>
            <q-item-label>POS</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Produk</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pelanggan</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Transaksi</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header class="text-weight-bold">
          Laporan
        </q-item-label>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="assessment" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Penjualan</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header class="text-weight-bold">
          Pengaturan
        </q-item-label>

        <q-item clickable v-if="authStore.hasPermission('users.view')">
          <q-item-section avatar>
            <q-icon name="manage_accounts" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pengguna</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-if="authStore.hasPermission('settings.view')">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sistem</q-item-label>
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

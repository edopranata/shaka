<template>
  <q-page padding>
    <div class="row q-gutter-md">
      <div class="col-12">
        <div class="text-h4 q-mb-md">
          <q-icon name="dashboard" class="q-mr-sm" />
          Dashboard
        </div>
        <div class="text-subtitle1 text-grey-7 q-mb-lg">
          Selamat datang di Shaka POS, {{ authStore.userName }}!
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Penjualan Hari Ini</div>
                <div class="text-h4">Rp 0</div>
              </div>
              <div class="col-auto">
                <q-icon name="attach_money" size="40px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Transaksi</div>
                <div class="text-h4">0</div>
              </div>
              <div class="col-auto">
                <q-icon name="receipt" size="40px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="bg-info text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Produk</div>
                <div class="text-h4">0</div>
              </div>
              <div class="col-auto">
                <q-icon name="inventory_2" size="40px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="bg-warning text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Pelanggan</div>
                <div class="text-h4">0</div>
              </div>
              <div class="col-auto">
                <q-icon name="people" size="40px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="flash_on" class="q-mr-sm" />
              Aksi Cepat
            </div>
            <div class="row q-gutter-sm">
              <q-btn
                color="primary"
                icon="point_of_sale"
                label="Mulai Transaksi"
                class="col"
                @click="startTransaction"
              />
              <q-btn
                color="positive"
                icon="add"
                label="Tambah Produk"
                class="col"
                @click="addProduct"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="trending_up" class="q-mr-sm" />
              Status Sistem
            </div>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="check_circle" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Backend API</q-item-label>
                  <q-item-label caption>Terhubung</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="check_circle" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Database</q-item-label>
                  <q-item-label caption>Online</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="account_circle" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Pengguna Aktif</q-item-label>
                  <q-item-label caption>{{ authStore.userName }} ({{ authStore.userRole }})</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import { useNotify } from 'src/composables/useQuasar'

const authStore = useAuthStore()
const notify = useNotify()

const startTransaction = () => {
  notify.info('Fitur POS akan segera tersedia')
}

const addProduct = () => {
  notify.info('Fitur manajemen produk akan segera tersedia')
}
</script>

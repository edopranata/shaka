<template>
  <q-page padding>
    <!-- Header Section -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12">
        <div class="text-h4 q-mb-md text-weight-light">
          <q-icon name="dashboard" class="q-mr-sm text-primary" />
          {{ $t('dashboard.title') }}
        </div>
        <div class="text-subtitle1 text-grey-6 q-mb-md">
          {{ $t('dashboard.welcome') }}, <span class="text-weight-medium text-primary">{{ authStore.userName }}</span>!
        </div>
        <q-separator class="q-my-lg" />
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="gradient-card gradient-primary shadow-3 overflow-hidden" style="min-height: 140px">
          <q-card-section class="text-white">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-weight-medium opacity-80">{{ $t('dashboard.todaySales') }}</div>
                <div class="text-h4 text-weight-bold q-mt-xs">Rp {{ formatCurrency(stats.todaySales) }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_up" size="16px" class="q-mr-xs" />
                  +12% {{ $t('dashboard.fromYesterday') }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="payments" size="48px" class="opacity-30" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="gradient-card gradient-positive shadow-3 overflow-hidden" style="min-height: 140px">
          <q-card-section class="text-white">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-weight-medium opacity-80">{{ $t('dashboard.todayTransactions') }}</div>
                <div class="text-h4 text-weight-bold q-mt-xs">{{ stats.todayTransactions }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_up" size="16px" class="q-mr-xs" />
                  +8% {{ $t('dashboard.fromYesterday') }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="receipt_long" size="48px" class="opacity-30" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="gradient-card gradient-info shadow-3 overflow-hidden" style="min-height: 140px">
          <q-card-section class="text-white">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-weight-medium opacity-80">{{ $t('dashboard.totalProducts') }}</div>
                <div class="text-h4 text-weight-bold q-mt-xs">{{ stats.totalProducts }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="inventory_2" size="16px" class="q-mr-xs" />
                  {{ stats.lowStockItems }} {{ $t('dashboard.lowStock') }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="inventory" size="48px" class="opacity-30" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="gradient-card gradient-warning shadow-3 overflow-hidden" style="min-height: 140px">
          <q-card-section class="text-white">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-weight-medium opacity-80">{{ $t('dashboard.monthlyRevenue') }}</div>
                <div class="text-h4 text-weight-bold q-mt-xs">Rp {{ formatCurrency(stats.monthlyRevenue) }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_up" size="16px" class="q-mr-xs" />
                  +15% {{ $t('dashboard.fromLastMonth') }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="account_balance_wallet" size="48px" class="opacity-30" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts and Quick Actions -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <!-- Sales Chart -->
      <div class="col-12 col-md-8">
        <q-card class="shadow-2" style="min-height: 400px">
          <q-card-section>
            <div class="text-h6 text-weight-medium q-mb-md">
              <q-icon name="trending_up" class="q-mr-sm" />
              {{ $t('dashboard.salesChart') }}
            </div>
            <div class="chart-placeholder bg-grey-1 rounded-borders q-pa-xl text-center">
              <q-icon name="bar_chart" size="64px" class="text-grey-5" />
              <div class="text-subtitle1 text-grey-5 q-mt-md">{{ $t('dashboard.chartPlaceholder') }}</div>
              <div class="text-caption text-grey-4">{{ $t('dashboard.chartDescription') }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2" style="min-height: 400px">
          <q-card-section>
            <div class="text-h6 text-weight-medium q-mb-md">
              <q-icon name="flash_on" class="q-mr-sm" />
              {{ $t('dashboard.quickActions') }}
            </div>

            <div class="column q-gutter-md">
              <q-btn
                unelevated
                color="primary"
                icon="point_of_sale"
                :label="$t('dashboard.newTransaction')"
                class="full-width q-py-md"
                @click="$router.push('/pos')"
              />

              <q-btn
                unelevated
                color="positive"
                icon="add_box"
                :label="$t('dashboard.addProduct')"
                class="full-width q-py-md"
                @click="$router.push('/products/create')"
              />

              <q-btn
                unelevated
                color="info"
                icon="person_add"
                :label="$t('dashboard.addCustomer')"
                class="full-width q-py-md"
                @click="$router.push('/customers/create')"
              />

              <q-btn
                unelevated
                color="orange"
                icon="assessment"
                :label="$t('dashboard.viewReports')"
                class="full-width q-py-md"
                @click="$router.push('/reports')"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-card class="shadow-2">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-weight-medium">
                <q-icon name="history" class="q-mr-sm" />
                {{ $t('dashboard.recentTransactions') }}
              </div>
              <q-btn
                flat
                color="primary"
                :label="$t('dashboard.viewAll')"
                @click="$router.push('/transactions')"
              />
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="q-pa-md">
              <SkeletonLoader type="table" :rows-per-page="5" />
            </div>

            <!-- Empty State -->
            <div v-else-if="recentTransactions.length === 0" class="text-center q-pa-xl">
              <q-icon name="receipt" size="64px" class="text-grey-4" />
              <div class="text-subtitle1 text-grey-5 q-mt-md">{{ $t('dashboard.noTransactions') }}</div>
              <div class="text-caption text-grey-4">{{ $t('dashboard.startSellingMessage') }}</div>
            </div>

            <!-- Transactions Table -->
            <q-table
              v-else
              :rows="recentTransactions"
              :columns="transactionColumns"
              row-key="id"
              flat
              hide-pagination
              :rows-per-page-options="[0]"
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="getStatusColor(props.value)"
                    text-color="white"
                    :label="props.value"
                    dense
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-total="props">
                <q-td :props="props">
                  <div class="text-weight-medium">
                    Rp {{ formatCurrency(props.value) }}
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useI18n } from 'vue-i18n'
import SkeletonLoader from 'src/components/SkeletonLoader.vue'

const { t } = useI18n()
const authStore = useAuthStore()

// Reactive data
const loading = ref(false)
const stats = reactive({
  todaySales: 0,
  todayTransactions: 0,
  totalProducts: 0,
  lowStockItems: 0,
  monthlyRevenue: 0
})

const recentTransactions = ref([])

// Table columns for recent transactions
const transactionColumns = [
  {
    name: 'invoice_number',
    label: t('dashboard.invoiceNumber'),
    field: 'invoice_number',
    align: 'left',
    sortable: true
  },
  {
    name: 'customer',
    label: t('dashboard.customer'),
    field: 'customer_name',
    align: 'left'
  },
  {
    name: 'total',
    label: t('dashboard.total'),
    field: 'total',
    align: 'right',
    sortable: true
  },
  {
    name: 'status',
    label: t('dashboard.status'),
    field: 'status',
    align: 'center'
  },
  {
    name: 'created_at',
    label: t('dashboard.date'),
    field: 'created_at',
    align: 'center',
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString()
  }
]

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID').format(amount || 0)
}

const getStatusColor = (status) => {
  const colors = {
    'completed': 'positive',
    'pending': 'warning',
    'cancelled': 'negative'
  }
  return colors[status] || 'grey'
}

const loadDashboardData = async () => {
  loading.value = true
  try {
    // TODO: Load actual data from API
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data
    stats.todaySales = 2500000
    stats.todayTransactions = 45
    stats.totalProducts = 150
    stats.lowStockItems = 5
    stats.monthlyRevenue = 75000000

    recentTransactions.value = [
      {
        id: 1,
        invoice_number: 'INV-001',
        customer_name: 'John Doe',
        total: 125000,
        status: 'completed',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        invoice_number: 'INV-002',
        customer_name: 'Jane Smith',
        total: 75000,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.gradient-card {
  position: relative;
  overflow: hidden;
}

.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-positive {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.gradient-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.chart-placeholder {
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.opacity-30 {
  opacity: 0.3;
}

.opacity-70 {
  opacity: 0.7;
}

.opacity-80 {
  opacity: 0.8;
}
</style>

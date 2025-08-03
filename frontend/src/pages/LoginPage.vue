<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Theme and Language Toggle Controls -->
    <div class="fixed-top-right q-pa-md" style="z-index: 9999;">
      <div class="row q-gutter-sm">
        <div class="col-auto">
          <LanguageToggle />
        </div>
        <div class="col-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>

    <q-page-container>
      <q-page class="flex flex-center login-background">
        <div class="q-pa-md" style="max-width: 400px; width: 100%">
          <q-card class="q-pa-lg">
            <q-card-section class="text-center">
              <div class="text-h4 text-primary q-mb-md">
                <q-icon name="storefront" size="md" class="q-mr-sm" />
                Shaka POS
              </div>
              <div class="text-subtitle2 text-grey-7">
                Point of Sales System
              </div>
            </q-card-section>

            <q-card-section>
              <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input
                  v-model="form.email"
                  type="email"
                  :label="$t('auth.email') + ' ' + $t('common.or') + ' ' + $t('auth.username')"
                  filled
                  :error="!!error"
                  :loading="loading"
                  autofocus
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>

                <q-input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  :label="$t('auth.password')"
                  filled
                  :error="!!error"
                  :loading="loading"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <div v-if="error" class="text-negative text-center">
                  {{ error }}
                </div>

                <q-btn
                  type="submit"
                  color="primary"
                  :label="$t('auth.loginButton')"
                  class="full-width"
                  :loading="loading"
                  :disable="!form.email || !form.password"
                />
              </q-form>
            </q-card-section>

            <q-card-section class="text-center text-caption text-grey-6">
              {{ $t('common.demoAccounts') }}:<br>
              admin@shakapos.com / password<br>
              manager@shakapos.com / password<br>
              cashier@shakapos.com / password
            </q-card-section>
          </q-card>
        </div>
      </q-page>
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

const router = useRouter()
const authStore = useAuthStore()
const notify = useNotify()

const form = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const onSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(form.value)

    notify.success(`Selamat datang, ${authStore.userName}!`)

    // Redirect to dashboard
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal'
    notify.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Dynamic background based on theme */
.login-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
}

/* Dark mode background */
.body--dark .login-background {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

/* Light mode background */
.body--light .login-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Fixed positioning for controls */
.fixed-top-right {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
}

/* Card styling enhancements */
:deep(.q-card) {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Dark mode card styling */
.body--dark :deep(.q-card) {
  background-color: rgba(30, 30, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Light mode card styling */
.body--light :deep(.q-card) {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Logo and title enhancements */
.text-h4 {
  font-weight: 600;
  letter-spacing: -0.5px;
}

/* Form input enhancements */
:deep(.q-field--filled .q-field__control) {
  border-radius: 12px;
}

:deep(.q-btn) {
  border-radius: 12px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* Animation for the card */
:deep(.q-card) {
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 600px) {
  .fixed-top-right {
    top: 10px;
    right: 10px;
  }

  .fixed-top-right .row {
    gap: 8px;
  }
}
</style>

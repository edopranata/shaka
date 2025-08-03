<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-primary">
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
                  label="Email atau Username"
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
                  label="Password"
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
                  label="Login"
                  class="full-width"
                  :loading="loading"
                  :disable="!form.email || !form.password"
                />
              </q-form>
            </q-card-section>

            <q-card-section class="text-center text-caption text-grey-6">
              Demo Accounts:<br>
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
.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

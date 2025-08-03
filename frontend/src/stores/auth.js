import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: LocalStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    hasRole: (state) => (role) => {
      return state.user?.roles?.some(r => r.name === role) || false
    },
    hasPermission: (state) => (permission) => {
      if (!state.user?.roles) return false
      return state.user.roles.some(role =>
        role.permissions?.some(p => p.name === permission)
      )
    },
    userName: (state) => state.user?.name || '',
    userRole: (state) => state.user?.roles?.[0]?.name || ''
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/login', credentials)
        const { user, token } = response.data

        this.user = user
        this.token = token
        this.isAuthenticated = true

        // Store in LocalStorage
        LocalStorage.set('token', token)
        LocalStorage.set('user', user)

        return { success: true, user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        this.isAuthenticated = false
        this.user = null
        this.token = null

        // Clean up storage
        LocalStorage.remove('token')
        LocalStorage.remove('user')

        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true

      try {
        // Call logout endpoint if token exists
        if (this.token) {
          await api.post('/logout')
        }
      } catch (error) {
        // Even if logout API fails, still clear local state
        console.warn('Logout API call failed:', error)
      } finally {
        // Always clear state
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.error = null
        this.loading = false

        // Clear storage
        LocalStorage.remove('token')
        LocalStorage.remove('user')
      }
    },

    async fetchUser() {
      if (!this.token) {
        throw new Error('No authentication token')
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.get('/me')
        this.user = response.data.user
        this.isAuthenticated = true

        // Update storage
        LocalStorage.set('user', this.user)

        return this.user
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user'
        this.isAuthenticated = false
        this.user = null
        this.token = null

        // Clean up storage
        LocalStorage.remove('token')
        LocalStorage.remove('user')

        throw error
      } finally {
        this.loading = false
      }
    },

    async refreshToken() {
      if (!this.token) {
        throw new Error('No authentication token to refresh')
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.post('/refresh')
        const { user, token } = response.data

        this.user = user
        this.token = token
        this.isAuthenticated = true

        // Update storage
        LocalStorage.set('token', token)
        LocalStorage.set('user', user)

        return { user, token }
      } catch (error) {
        this.error = error.response?.data?.message || 'Token refresh failed'
        this.isAuthenticated = false
        this.user = null
        this.token = null

        // Clean up storage
        LocalStorage.remove('token')
        LocalStorage.remove('user')

        throw error
      } finally {
        this.loading = false
      }
    },

    initAuth() {
      const token = LocalStorage.getItem('token')
      const user = LocalStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = user
        this.isAuthenticated = true
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null
      this.loading = false

      LocalStorage.remove('token')
      LocalStorage.remove('user')
    }
  }
})

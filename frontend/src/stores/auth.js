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
        
        return { success: true, user, token }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/logout')
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        LocalStorage.remove('token')
        LocalStorage.remove('user')
      }
    },

    async getMe() {
      if (!this.token) return false
      
      try {
        const response = await api.get('/me')
        this.user = response.data.user
        this.isAuthenticated = true
        LocalStorage.set('user', this.user)
        return true
      } catch (error) {
        console.error('Token verification error:', error)
        this.logout()
        return false
      }
    },

    async refreshToken() {
      if (!this.token) return false
      
      try {
        const response = await api.post('/refresh')
        const { user, token } = response.data
        
        this.user = user
        this.token = token
        
        LocalStorage.set('token', token)
        LocalStorage.set('user', user)
        return true
      } catch (error) {
        console.error('Token refresh error:', error)
        this.logout()
        return false
      }
    },

    // Initialize auth from LocalStorage
    initAuth() {
      const token = LocalStorage.getItem('token')
      const user = LocalStorage.getItem('user')
      
      if (token && user) {
        this.token = token
        this.user = user
        this.isAuthenticated = true
        
        // Verify token is still valid
        this.getMe()
      }
    }
  }
})

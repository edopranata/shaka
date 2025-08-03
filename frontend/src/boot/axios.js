import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'

// Create API instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 second timeout
})

// Request interceptor to add auth token and loading
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.metadata = { startTime: new Date() }

    const token = LocalStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = Math.random().toString(36).substring(2)

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors and logging
api.interceptors.response.use(
  (response) => {
    // Log response time for performance monitoring
    if (response.config.metadata) {
      const endTime = new Date()
      const duration = endTime - response.config.metadata.startTime
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
    }
    return response
  },
  async (error) => {
    const { response, config } = error

    // Log error details
    console.error('API Error:', {
      url: config?.url,
      method: config?.method,
      status: response?.status,
      message: response?.data?.message || error.message
    })

    if (response?.status === 401) {
      // Handle unauthorized access
      LocalStorage.remove('token')
      LocalStorage.remove('user')

      // Avoid infinite redirect loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    } else if (response?.status === 403) {
      // Handle forbidden access
      console.warn('Access forbidden:', response.data?.message)
    } else if (response?.status >= 500) {
      // Handle server errors
      console.error('Server error:', response.data?.message || 'Internal server error')
    } else if (!response) {
      // Handle network errors
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }

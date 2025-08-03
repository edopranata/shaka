import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from 'src/stores/auth'

export default defineBoot(({ app }) => {
  // Initialize auth store
  const authStore = useAuthStore()

  // Auto-initialize authentication from LocalStorage
  authStore.initAuth()

  // Global error handler
  app.config.errorHandler = (error, instance, info) => {
    console.error('Global error:', error, info)
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason)
    event.preventDefault()
  })
})

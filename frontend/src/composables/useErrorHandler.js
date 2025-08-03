import { useQuasar } from 'quasar'

export function useErrorHandler() {
  const $q = useQuasar()

  const handleError = (error, context = '') => {
    console.error(`Error ${context}:`, error)

    let message = 'An unexpected error occurred'
    let type = 'negative'

    if (error.response) {
      // API error response
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          message = data.message || 'Bad request'
          break
        case 401:
          message = 'You are not authorized. Please login again.'
          // Redirect to login or trigger logout
          break
        case 403:
          message = 'You do not have permission to perform this action'
          break
        case 404:
          message = 'The requested resource was not found'
          break
        case 422:
          // Validation errors
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat()
            message = errorMessages.join(', ')
          } else {
            message = data.message || 'Validation failed'
          }
          break
        case 429:
          message = 'Too many requests. Please try again later.'
          break
        case 500:
          message = 'Server error. Please try again later.'
          break
        default:
          message = data.message || `Error ${status}: ${error.response.statusText}`
      }
    } else if (error.request) {
      // Network error
      message = 'Network error. Please check your connection.'
    } else if (error.message) {
      // Other error
      message = error.message
    }

    // Show notification
    $q.notify({
      type,
      message,
      position: 'top',
      timeout: 5000,
      actions: [
        {
          label: 'Dismiss',
          color: 'white',
          handler: () => {
            // Dismiss notification
          }
        }
      ]
    })

    return {
      message,
      type,
      status: error.response?.status,
      data: error.response?.data
    }
  }

  const handleSuccess = (message, timeout = 3000) => {
    $q.notify({
      type: 'positive',
      message,
      position: 'top',
      timeout,
      actions: [
        {
          label: 'Dismiss',
          color: 'white',
          handler: () => {
            // Dismiss notification
          }
        }
      ]
    })
  }

  const handleWarning = (message, timeout = 4000) => {
    $q.notify({
      type: 'warning',
      message,
      position: 'top',
      timeout,
      actions: [
        {
          label: 'Dismiss',
          color: 'white',
          handler: () => {
            // Dismiss notification
          }
        }
      ]
    })
  }

  const handleInfo = (message, timeout = 3000) => {
    $q.notify({
      type: 'info',
      message,
      position: 'top',
      timeout,
      actions: [
        {
          label: 'Dismiss',
          color: 'white',
          handler: () => {
            // Dismiss notification
          }
        }
      ]
    })
  }

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo
  }
}

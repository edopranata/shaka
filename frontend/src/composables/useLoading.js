import { ref } from 'vue'
import { useQuasar } from 'quasar'

export function useLoading() {
  const $q = useQuasar()
  const isLoading = ref(false)

  const startLoading = (message = 'Loading...') => {
    isLoading.value = true
    $q.loading.show({
      message,
      backgroundColor: 'grey-9',
      messageColor: 'white',
      spinner: 'dots',
      spinnerColor: 'primary',
      spinnerSize: 40
    })
  }

  const stopLoading = () => {
    isLoading.value = false
    $q.loading.hide()
  }

  const withLoading = async (asyncFunction, loadingMessage = 'Loading...') => {
    try {
      startLoading(loadingMessage)
      const result = await asyncFunction()
      return result
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading
  }
}

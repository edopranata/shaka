import { Notify, Dialog, Loading } from 'quasar'

export const useNotify = () => {
  const success = (message, options = {}) => {
    Notify.create({
      type: 'positive',
      message,
      icon: 'check_circle',
      position: 'top-right',
      timeout: 3000,
      ...options
    })
  }

  const error = (message, options = {}) => {
    Notify.create({
      type: 'negative',
      message,
      icon: 'error',
      position: 'top-right',
      timeout: 5000,
      ...options
    })
  }

  const warning = (message, options = {}) => {
    Notify.create({
      type: 'warning',
      message,
      icon: 'warning',
      position: 'top-right',
      timeout: 4000,
      ...options
    })
  }

  const info = (message, options = {}) => {
    Notify.create({
      type: 'info',
      message,
      icon: 'info',
      position: 'top-right',
      timeout: 3000,
      ...options
    })
  }

  return {
    success,
    error,
    warning,
    info
  }
}

export const useDialog = () => {
  const confirm = (options) => {
    return Dialog.create({
      title: 'Konfirmasi',
      message: 'Apakah Anda yakin?',
      cancel: true,
      persistent: true,
      ...options
    })
  }

  const alert = (options) => {
    return Dialog.create({
      title: 'Informasi',
      message: 'Pesan informasi',
      ...options
    })
  }

  return {
    confirm,
    alert
  }
}

export const useLoading = () => {
  const show = (options = {}) => {
    Loading.show({
      message: 'Memproses...',
      spinnerColor: 'primary',
      ...options
    })
  }

  const hide = () => {
    Loading.hide()
  }

  return {
    show,
    hide
  }
}

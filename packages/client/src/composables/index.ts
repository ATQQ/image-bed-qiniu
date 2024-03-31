import { computed, ref } from 'vue'
import { useIntervalFn, useLocalStorage, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/store'
export function useIsMobile() {
  // 使用正则表达式检查userAgent字符串是否匹配移动设备
  const mobileRegex
    = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  // 检查设备是否支持触摸操作
  const isTouchDevice
    = navigator.maxTouchPoints > 0

  const { width, height } = useWindowSize()

  return computed(() => {
    if (width.value && height.value) {
      // deps
    }
    const userAgent
    = navigator.userAgent

    return mobileRegex.test(userAgent)
      || isTouchDevice
  })
}

const defaultUploadConfig = { autoCopy: true, copyType: 'markdown', pageSize: 20, compressImage: true, compressPreview: true }
export function useUploadConfig() {
  const cacheConfig = useLocalStorage('uploadConfig', defaultUploadConfig)
  return cacheConfig
}

export function useIsExpired() {
  const store = useConfigStore()
  const { config } = storeToRefs(store)
  const isExpired = ref(config.value.date <= Date.now())

  useIntervalFn(() => {
    isExpired.value = config.value.date <= Date.now()
    if (isExpired.value) {
      // 过期了，尝试自动取默认的token
      localStorage.removeItem('upload-token')
      store.parseToken()
    }
  }, 500)
  return isExpired
}

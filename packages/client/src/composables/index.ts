import { computed } from 'vue'
import { useLocalStorage, useWindowSize } from '@vueuse/core'
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

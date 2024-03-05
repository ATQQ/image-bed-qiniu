import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'

export interface QiNiuConfig {
  token: string
  scope: string
  prefix: string
  domain: string
  compressImage?: any
  date: number
  config: {
    useCdnDomain: boolean
  }
}

const configStore = defineStore('configStore', {
  state: () => ({
    qiniu: {
      prefix: 'image',
      scope: 'default',
      token: '',
      date: 0,
      domain: '',
      // 自定义扩展
      config: {
        useCdnDomain: true,
      },
    } as QiNiuConfig,
    warningTimer: null as any,
  }),
  actions: {
    parseQiniuToken(token?: string) {
      try {
        // 兜底都取默认的token
        const config = JSON.parse(atob(token || import.meta.env.VITE_APP_QINIU_TOKEN))
        Object.assign(this.qiniu, config)
        if (token) {
          localStorage.setItem('qiniu-token', token)
        }
      }
      catch (err: any) {
        if (this.warningTimer) {
          return
        }
        this.warningTimer = setTimeout(() => {
          this.warningTimer = null
        }, 3000)
        ElMessage.error('token 不正确，请点击右上角 🔑 重新设置')
      }
    },
  },
})

export default configStore

import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'

interface BaseConfig {
  token: string
  scope: string
  prefix: string
  domain: string
  date: number
  compressImage?: any
  config?: Record<string, any>
}
export interface QiNiuConfig extends BaseConfig {
  config: {
    useCdnDomain: boolean
  }
}

export interface UPYunConfig extends BaseConfig {
  bucket: string
  uriPrefix: string
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
    upyun: {
      bucket: 'serviceName',
      prefix: 'image',
      scope: 'default',
      token: '',
      date: 0,
      domain: '',
      uriPrefix: '',
    } as UPYunConfig,
    parsedToken: {} as any,
    warningTimer: null as any,
  }),
  actions: {
    parseToken(token?: string) {
      try {
        // 兜底都取默认的token
        const config = JSON.parse(atob(token || import.meta.env.VITE_APP_UPLOAD_TOKEN))
        if (config?.type === 'upyun') {
          Object.assign(this.upyun, config)
          this.parsedToken = this.upyun
        }
        else {
          Object.assign(this.qiniu, config)
          this.parsedToken = this.qiniu
        }
        if (token) {
          localStorage.setItem('upload-token', token)
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
  getters: {
    config(state) {
      return state.parsedToken
    },
  },
})

export default configStore

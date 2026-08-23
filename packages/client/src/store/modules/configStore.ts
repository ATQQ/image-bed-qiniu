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

type Platform = 'qiniu' | 'upyun'

const PLATFORM_TOKENS_KEY = 'platform-tokens'
const ACTIVE_PLATFORM_KEY = 'active-platform'

function readPlatformTokens(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(PLATFORM_TOKENS_KEY) || '{}')
  }
  catch {
    return {}
  }
}

function writePlatformTokens(map: Record<string, string>) {
  localStorage.setItem(PLATFORM_TOKENS_KEY, JSON.stringify(map))
}

const configStore = defineStore('configStore', {
  state: () => ({
    activePlatform: (localStorage.getItem(ACTIVE_PLATFORM_KEY) as Platform) || 'qiniu',
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
    savePlatformToken(platform: Platform, token: string) {
      const map = readPlatformTokens()
      if (token) {
        map[platform] = token
      }
      else {
        delete map[platform]
      }
      writePlatformTokens(map)
    },
    getPlatformToken(platform: Platform) {
      return readPlatformTokens()[platform] || ''
    },
    hydrate(platform: Platform, token: string) {
      try {
        const config = JSON.parse(atob(token))
        Object.assign(this[platform], config)
      }
      catch {
        // ignore invalid token on hydrate
      }
    },
    parseToken(token?: string) {
      try {
        // 兜底都取默认的token
        const config = JSON.parse(atob(token || import.meta.env.VITE_APP_UPLOAD_TOKEN))
        const platform: Platform = config?.type === 'upyun' ? 'upyun' : 'qiniu'
        Object.assign(this[platform], config)
        this.parsedToken = this[platform]
        if (token) {
          this.savePlatformToken(platform, token)
          localStorage.setItem('upload-token', token)
          this.activePlatform = platform
          localStorage.setItem(ACTIVE_PLATFORM_KEY, platform)
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
    switchPlatform(platform: Platform) {
      this.activePlatform = platform
      localStorage.setItem(ACTIVE_PLATFORM_KEY, platform)
      this.parsedToken = this[platform]
      const token = this.getPlatformToken(platform)
      if (token) {
        localStorage.setItem('upload-token', token)
      }
      else {
        localStorage.removeItem('upload-token')
      }
    },
    init() {
      // 迁移旧的单个 upload-token -> platform-tokens（仅当尚未有平台级 token 时）
      if (Object.keys(readPlatformTokens()).length === 0) {
        const legacyToken = localStorage.getItem('upload-token')
        if (legacyToken) {
          try {
            const config = JSON.parse(atob(legacyToken))
            const platform: Platform = config?.type === 'upyun' ? 'upyun' : 'qiniu'
            this.savePlatformToken(platform, legacyToken)
            // 旧版本没有 active-platform 概念，按 token 的 type 推断
            if (!localStorage.getItem(ACTIVE_PLATFORM_KEY)) {
              localStorage.setItem(ACTIVE_PLATFORM_KEY, platform)
              this.activePlatform = platform
            }
          }
          catch {
            // 旧 token 损坏：忽略，后续走 env 兜底
          }
        }
      }
      const qiniuToken = this.getPlatformToken('qiniu')
      const upyunToken = this.getPlatformToken('upyun')
      if (!qiniuToken && !upyunToken) {
        // 首次使用、未配置过：走 env 兜底（保留 demo 体验）
        this.parseToken()
        return
      }
      if (qiniuToken) {
        this.hydrate('qiniu', qiniuToken)
      }
      if (upyunToken) {
        this.hydrate('upyun', upyunToken)
      }
      const active = (this.activePlatform === 'upyun' ? 'upyun' : 'qiniu') as Platform
      this.activePlatform = active
      this.parsedToken = this[active]
      const token = this.getPlatformToken(active)
      if (token) {
        localStorage.setItem('upload-token', token)
      }
      else {
        localStorage.removeItem('upload-token')
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

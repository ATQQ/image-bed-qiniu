import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'

export interface QiNiuConfig {
  token: string
  scope: string
  prefix: string
  domain: string
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
      // TODO：自定义扩展
      config: {
        useCdnDomain: true,
      },
    } as QiNiuConfig,
  }),
  actions: {
    parseQiniuToken(token?: string) {
      try {
        const config = JSON.parse(atob(token || import.meta.env.VITE_APP_QINIU_TOKEN))
        Object.assign(this.qiniu, config)
      }
      catch (err: any) {
        ElMessage.error(err)
      }
    },
  },
})

export default configStore
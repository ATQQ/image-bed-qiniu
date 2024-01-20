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
        const config = JSON.parse(atob(token ?? import.meta.env.VITE_APP_QINIU_TOKEN))
        Object.assign(this.qiniu, config)
        if (token) {
          localStorage.setItem('qiniu-token', token)
        }
      }
      catch (err: any) {
        console.error(err)
        ElMessage.error('token 有误，解析失败')
      }
    },
  },
})

export default configStore

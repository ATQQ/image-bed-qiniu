import * as qiniu from 'qiniu-js'
import { getFileMd5Hash } from './stringUtil'
import type { QiNiuConfig } from '@/store/modules/configStore'

async function uploadFile(file: File, qiniuOps: QiNiuConfig, options?: {
  process?: (percent: number) => void
}) {
  const { config, domain, token, scope, prefix } = qiniuOps
  const key = await generateNewFileKey(file, prefix, scope)
  return new Promise<string>((resolve, reject) => {
    const putExtra = {
      fname: key,
      customVars: {},
    }
    // TODO：限制上传文件大小，超过自动压缩等
    // 测试逻辑
    if (import.meta.env.VITE_APP_FAKE_UPLOAD) {
      let i = 0
      const timer = setInterval(() => {
        if (i <= 100) {
          options?.process?.(i)
          i += 10
          return
        }
        clearInterval(timer)
        resolve(`${domain}/${putExtra.fname}`)
      }, 100)
      return
    }
    const observable = qiniu.upload(file, putExtra.fname, token, putExtra, config)
    observable.subscribe({
      next(res) {
        // 上传进度
        const { percent } = res.total
        options?.process?.(percent)
      },
      error(err) {
        reject(err)
      },
      complete() {
        resolve(`${domain}/${putExtra.fname}`)
      },
    })
  })
}

async function generateNewFileKey(file: File, prefix = 'mdImg', scope = 'sugar') {
  const md5 = await getFileMd5Hash(file)
  return `${prefix}/${scope}/${md5}`
}
export {
  uploadFile,
  generateNewFileKey,
}

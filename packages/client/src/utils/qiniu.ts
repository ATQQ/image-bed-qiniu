import * as qiniu from 'qiniu-js'
import { getFileMd5Hash } from './stringUtil'
import { base64ToUrlSafe, computedHMAC_SHA1, urlsafeBase64Encode } from './crypto'
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

async function generateUploadToken(ops: {
  accessKey: string
  secretKey: string
  bucket: string
  expires: number
  domain: string
  prefix: string
  scope: string
}) {
  const { accessKey, secretKey, bucket, expires, domain, prefix, scope } = ops
  const token = await generateQiniuToken(accessKey, secretKey, bucket, Math.round(expires / 1000))
  return btoa(JSON.stringify({
    token,
    date: expires,
    domain,
    prefix,
    scope,
    type: 'qiniu',
  }))
}

/**
 *
 * @param accessKey
 * @param secretKey
 * @param bucket
 * @param expires
 * @returns 上传凭证
 * @doc https://developer.qiniu.com/kodo/1208/upload-token
 * @doc https://developer.qiniu.com/kodo/1231/appendix#urlsafe-base64
 */
async function generateQiniuToken(accessKey: string, secretKey: string, bucket: string, expires: number) {
  const flags = {
    scope: bucket,
    deadline: expires,
  }
  const encodedFlags = urlsafeBase64Encode(JSON.stringify(flags))
  const encoded = await computedHMAC_SHA1(secretKey, encodedFlags)
  const encodedSign = base64ToUrlSafe(encoded)
  const uploadToken = `${accessKey}:${encodedSign}:${encodedFlags}`
  return uploadToken
}

export {
  uploadFile,
  generateNewFileKey,
  generateUploadToken,
}

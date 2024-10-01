import upyun from 'upyun'
import { generateNewFileKey } from './qiniu'
import { computedHMAC_SHA1, computedMD5 } from './crypto'
import type { UPYunConfig } from '@/store/modules/configStore'

export async function uploadFile(file: any, ops: UPYunConfig) {
  const { bucket, prefix, scope, token, date, uriPrefix, domain } = ops

  const service = new upyun.Service(bucket)
  // @ts-expect-error
  const client = new upyun.Client(service, () => getHeaderSign(token, uriPrefix, Math.round(date / 1000)))
  const key = await generateNewFileKey(file, prefix, scope)
  // 测试逻辑
  if (import.meta.env.VITE_APP_FAKE_UPLOAD) {
    return Promise.resolve(`${domain}/${key}`)
  }
  const isSuccess = await client.putFile(key, file)
  return isSuccess ? Promise.resolve(`${domain}/${key}`) : Promise.reject(new Error('上传失败'))
}

/**
 * 生成 upyun 上传token
 * @param operator 账号
 * @param password 密码
 * @param uriPrefix 资源公共前缀
 * @param expire 过期时间，UNIX UTC 时间戳，单位秒
 * @param method 方法（PUT）
 * @returns 上传凭证
 * @doc https://docs.upyun.com/api/authorization/#token_1
 */
export async function generateUpyunToken(operator: string, password: string, uriPrefix: string, expire: number, method = 'PUT') {
  // 密码的md5值，秘钥
  const secret = computedMD5(password)
  const value = `${method}&${uriPrefix}&${expire}`
  const token = await computedHMAC_SHA1(secret, value)
  return `UPYUN ${operator}:${token}`
}

/**
 * 获取上传文件时需要的header签名
 * @param token 鉴权token
 * @param uriPrefix 资源公共前缀
 * @param expire 过期时间，UNIX UTC 时间戳，单位秒
 */
export async function getHeaderSign(token: string, uriPrefix: string, expire: number) {
  return {
    'Authorization': token,
    'X-Date': new Date().toUTCString(),
    'X-Upyun-Uri-Prefix': uriPrefix,
    'X-Upyun-Expire': expire,
  }
}

export async function generateUploadToken(ops: {
  operator: string
  password: string
  expires: number
  domain: string
  prefix: string
  scope: string
  service: string
  method?: string
}) {
  const { operator, password, expires, domain, prefix, scope, service, method = 'PUT' } = ops
  const uriPrefix = `/${service}/${prefix}/${scope}`
  const token = await generateUpyunToken(operator, password, uriPrefix, Math.round(expires / 1000), method)
  return btoa(JSON.stringify({
    token,
    date: expires,
    domain,
    prefix,
    scope,
    bucket: service,
    type: 'upyun',
    uriPrefix,
  }))
}

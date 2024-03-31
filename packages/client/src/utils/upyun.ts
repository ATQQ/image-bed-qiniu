// @ts-expect-error
import upyun from 'upyun'
import { generateNewFileKey } from './qiniu'
import type { UPYunConfig } from '@/store/modules/configStore'

export async function uploadFile(file: File, ops: UPYunConfig) {
  const { bucket, prefix, scope, token, date, uriPrefix, domain } = ops
  const service = new upyun.Service(bucket)
  const client = new upyun.Client(service, () => ({
    'Authorization': token,
    'X-Date': new Date().toUTCString(),
    'X-Upyun-Uri-Prefix': uriPrefix,
    'X-Upyun-Expire': date,
  }))
  const key = await generateNewFileKey(file, prefix, scope)
  const isSuccess = await client.putFile(key, file)
  return isSuccess ? Promise.resolve(`${domain}/${key}`) : Promise.reject(new Error('上传失败'))
}

// 生成 token 并复制到剪贴板
import process from 'process'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import qiniu from 'qiniu'
import dotenv from 'dotenv'
import ncp from 'copy-paste'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env.local') })
dotenv.config({ path: path.join(__dirname, '.env') })
// 七牛账号下的一对有效的Access Key和Secret Key
// 对象存储空间名称 bucket
const accessKey = process.env.QINIU_ACCESS_KEY
const secretKey = process.env.QINIU_SECRET_KEY
const bucket = process.env.QINIU_BUCKET
const domain = process.env.QINIU_DOMAIN
const prefix = process.env.QINIU_PREFIX
const scope = process.env.QINIU_SCOPE
const expires = process.env.QINIU_EXPIRES
// 鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const options = {
  scope: bucket,
  expires: +expires || 60 * 60 * 24 * 30, // 过期时间(s)
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

console.log('expire', new Date(Date.now() + options.expires * 1000).toLocaleString())

const envToken = btoa(JSON.stringify({
  token: uploadToken,
  date: Date.now() + options.expires * 1000,
  domain,
  prefix,
  scope,
  bucket,
  //  自定义qiniu 上传补充配置
  //  config: {

  // },
}))
if (!process.env.CI) {
  // 复制到剪贴板
  ncp.copy(envToken, () => {
    console.log('【token】已写入剪贴板')
    console.log(envToken)
  })
}
if (!process.env.copy) {
  fs.writeFileSync(path.join(__dirname, '../client/.env.local'), `VITE_APP_UPLOAD_TOKEN=${envToken}`)
}

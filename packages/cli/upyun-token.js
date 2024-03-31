import process from 'process'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import dotenv from 'dotenv'
import ncp from 'copy-paste'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env.local') })
dotenv.config({ path: path.join(__dirname, '.env') })

// function generateUpyunToken(operator, password, method, uriPrefix, expire) {
//   const hmac = crypto.createHmac('sha1', Buffer.from(password, 'hex'))
//   const data = `${method}&${uriPrefix}&${expire}`
//   hmac.update(data)
//   const digest = hmac.digest()
//   const base64Encoded = digest.toString('base64')
//   return `UPYUN ${operator}:${base64Encoded}`
// }
function MD5(value) {
  return crypto.createHash('md5').update(value).digest('hex')
}

function tokenSign(operator, secret, method, uriPrefix, expire) {
  const value = [method, uriPrefix, expire].filter(v => !!v).join('&')
  const auth = hmacsha1(secret, value)
  return `UPYUN ${operator}:${auth}`
}

function hmacsha1(secret, value) {
  return crypto.createHmac('sha1', secret).update(value, 'utf8').digest().toString('base64')
}

// 示例参数
const operator = process.env.UPYUN_OPERATOR
const password = process.env.UPYUN_PASSWORD
const bucket = process.env.UPYUN_BUCKET
const prefix = process.env.UPYUN_PREFIX
const scope = process.env.UPYUN_SCOPE
const method = 'PUT'
const uriPrefix = `/${bucket}/${prefix}/${scope}`
const expire = new Date().getTime() + 1000 * 60 * 60 * 24 * 90 // 90天的过期时间
const domain = process.env.UPYUN_DOMAIN

const envToken = btoa(JSON.stringify({
  token: tokenSign(operator, MD5(password), method, uriPrefix, expire),
  date: expire,
  domain,
  prefix,
  scope,
  bucket,
  type: 'upyun',
  uriPrefix,
  //  TODO: 自定义 upyun 上传补充配置
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

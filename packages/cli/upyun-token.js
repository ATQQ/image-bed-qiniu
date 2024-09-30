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

/**
 * 生成 upyun 上传token
 * @param {*} operator 账号
 * @param {*} password 密码
 * @param {*} method 方法（PUT）
 * @param {*} uriPrefix 资源公共前缀
 * @param {*} expire 过期时间（s）
 * @returns 上传凭证
 */
function generateUpyunToken(operator, password, method, uriPrefix, expire) {
  // 密码的md5值，秘钥
  const secret = crypto.createHash('md5').update(password).digest('hex')

  // 构造用于计算校验值的字符串
  const value = `${method}&${uriPrefix}&${expire}`

  // 使用 hmac-sha1 算法生成token
  const token = crypto.createHmac('sha1', secret) // 使用密码的MD5值作为秘钥
    .update(value) // 设置用于计算校验值的字符串
    .digest() // 计算校验值
    .toString('base64') // 转换为base64 格式

  // 组合成要求的格式
  return `UPYUN ${operator}:${token}`
}
// function MD5(value) {
//   return crypto.createHash('md5').update(value).digest('hex')
// }

// function tokenSign(operator, secret, method, uriPrefix, expire) {
//   const value = [method, uriPrefix, expire].filter(v => !!v).join('&')
//   const auth = hmacsha1(secret, value)
//   return `UPYUN ${operator}:${auth}`
// }

// function hmacsha1(secret, value) {
//   return crypto.createHmac('sha1', secret).update(value, 'utf8').digest().toString('base64')
// }

// 示例参数
const operator = process.env.UPYUN_OPERATOR
const password = process.env.UPYUN_PASSWORD
const bucket = process.env.UPYUN_BUCKET
const prefix = process.env.UPYUN_PREFIX
const scope = process.env.UPYUN_SCOPE
const method = 'PUT'
const uriPrefix = `/${bucket}/${prefix}/${scope}`
const expire = new Date().getTime() + ((+process.env.UPYUN_EXPIRES * 1000) || 1000 * 60 * 60 * 24 * 90) // 90天的过期时间
console.log('expire', new Date(expire).toLocaleString())
const domain = process.env.UPYUN_DOMAIN

const envToken = btoa(JSON.stringify({
  // token: tokenSign(operator, MD5(password), method, uriPrefix, expire),
  token: generateUpyunToken(operator, password, method, uriPrefix, Math.round(expire / 1000)),
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

const { loadEnv } = require('./loadEnv')
const qiniu = require('qiniu')
const fs = require('fs');

// 读取.env.*中的环境变量
loadEnv()

// 七牛账号下的一对有效的Access Key和Secret Key
// 对象存储空间名称 bucket
const accessKey = process.env.QINIU_ACCESS_KEY,
    secretKey = process.env.QINIU_SECRET_KEY,
    bucket = process.env.QINIU_BUCKET;
const domain = process.env.QINIU_DOMAIN
//鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const options = {
    scope: bucket,
    expires: 60 * 60 * 24 * 30 //过期时间(s)
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

// 将凭证写入到配置文件
fs.writeFileSync("./src/config/qiniu.config.js", `
import * as qiniu from "qiniu-js";
let config = {
    useCdnDomain: true,
    region: qiniu.region.z0
}
let token = '${uploadToken}'
let date = ${Date.now() + options.expires * 1000}
let domain = '${domain}'
export {
    config,
    token,
    domain,
    date
}`);
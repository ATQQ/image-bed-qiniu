import * as qiniu from "qiniu-js";
// TODO: 优化
// @ts-ignore
import { config, token, domain } from './../config/qiniu.config';
import { getFileMd5Hash } from "./stringUtil";

async function uploadFile(file: File, filename: string, options?: {
    process?: (percent: number) => void
}) {
    const bucketPrefix = 'mdImg'
    const userScope ='sugar'
    const md5 = await getFileMd5Hash(file)
    const key = `${bucketPrefix}/${userScope}/${md5}`
    return new Promise<string>((resolve, reject) => {
        const putExtra = {
            fname: key,
            params: {},
        };

        let i = 0
        let timer = setInterval(()=>{
            if(i<=100){
                options?.process?.(i)
                i+=10
                return
            }
            clearInterval(timer)
            resolve(`${domain}/${putExtra.fname}`)
        },100)
        // const observable = qiniu.upload(file, putExtra.fname, token, putExtra, config)

        // observable.subscribe({
        //     next(res) {
        //         //上传进度
        //         let { percent } = res.total;
        //         options?.process?.(percent)
        //     },
        //     error(err) {
        //         reject(err)
        //     },
        //     complete(res) {
        //         resolve(`${domain}/${res.key}`)
        //     }
        // })
    })
}

async function generateNewFileKey(file: File,prefix='mdv2',scope='scope'){
    const md5 = 'md5'
    const filename = 'filename'
    // TODO:可配置
    const key = `${prefix}/${md5}/${filename}`
    return key
}
export {
    uploadFile,
    generateNewFileKey
}
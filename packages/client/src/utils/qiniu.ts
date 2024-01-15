import * as qiniu from "qiniu-js";
// TODO: 优化
// @ts-ignore
import { config, token, domain } from './../config/qiniu.config';

function uploadFile(file: File, filename: string, options?: {
    process?: (percent: number) => void
}) {
    
    return new Promise((resolve, reject) => {
        let putExtra = {
            fname: filename,
            params: {},
        };
        // 测试代码
        let i = 0
        let timer = setInterval(()=>{
            if(i<=100){
                options?.process?.(i)
                i+=10
                return
            }
            clearInterval(timer)
            resolve(`${domain}/${filename}`)
        },100)
        // let observable = qiniu.upload(file, filename, token, putExtra, config)

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
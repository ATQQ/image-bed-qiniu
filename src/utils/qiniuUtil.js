import * as qiniu from "qiniu-js";
import { config, token, domain } from './../config/qiniu.config.js';
import { addLink } from './viewUtil'
import { toast } from "./../components/Toast/index"
let observer = {
    next(res) {
        console.log(res);
        //上传进度
        let { percent } = res.total;
        toast.info(`上传:${percent}`)
    },
    error(err) {
        console.log(err);
        toast.error(err.message)
    },
    complete(res) {
        let { key } = res;
        let completeUrl = `${domain}/${key}`;
        // 将图片链接显示在右侧
        addLink(completeUrl);
    }
}

function uploadFile(file, filename) {
    let putExtra = {
        fname: filename,
        params: {},
        mimeType: null
    };
    let observable = qiniu.upload(file, filename, token, putExtra, config)

    observable.subscribe(observer)
}

export {
    uploadFile
}
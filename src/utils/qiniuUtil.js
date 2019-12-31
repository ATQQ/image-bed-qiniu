import * as qiniu from "qiniu-js";
import { config, token, Domain } from './../config/qiniu.config.js';
import { addLink, updateUploadProcess } from './viewUtil'

let observer = {
    next(res) {
        console.log(res);
        //上传进度
        let { percent } = res.total;
        console.log(`上传:${percent}`);
        updateUploadProcess(percent);
    },
    error(err) {
        console.log(err);
    },
    complete(res) {
        let { key } = res;
        let completeUrl = `${Domain}/${key}`;
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
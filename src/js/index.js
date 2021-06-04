import "../css/index.less"
import { uploadFile } from "./../utils/qiniuUtil.js";
import { copyRes } from "./../utils/tool"
import { toast } from "./../components/Toast/index"
import { date } from './../config/qiniu.config'

console.log("init success")

// 粘贴板
let pastePanel = document.getElementById('pastePanel');

// 结果面板
let resultPanel = document.getElementById('result-area');

// 选择文件上传按钮
let uploadBtn = document.getElementById('file-picker')

/**
 * 监听粘贴事件
 */
pastePanel.addEventListener('paste', function (e) {
    console.log('paste');
    // 阻止触发默认的粘贴事件
    e.preventDefault();

    let { items } = e.clipboardData;
    for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image")) {
            //上传的文件对象
            let file = item.getAsFile();
            //文件名(加一个前缀相当于目录)
            let fileName = 'mdImg/' + btoa(Date.now()) + Date.now().toString().substring(1);
            //开始上传
            uploadFile(file, fileName);
            return;
        } else if (item.type === 'text/plain') {
            item.getAsString(str => {
                e.target.value += str;
            });
        }
    }
    toast.error("剪贴板中没有图片")
})

// 禁用默认的拖拽触发的内容
document.addEventListener('drop', function (e) {
    e.preventDefault()
}, true)
document.addEventListener('dragover', function (e) {
    e.preventDefault()
}, true)



/**
 * 监听文件拖拽上传事件
 */
let drag = false;

pastePanel.addEventListener('dragenter', function (e) {
    drag = true;
})

pastePanel.addEventListener('dragover', function (e) {
    drag = true;
});

pastePanel.addEventListener('dragleave', function (e) {
    drag = false;
})

pastePanel.addEventListener('drop', function (e) {
    if (drag) {
        let { files } = e.dataTransfer;
        for (const file of files) {
            if (file.type.startsWith("image")) {
                //文件名(加一个前缀相当于目录)
                let fileName = 'mdImg/' + btoa(Date.now()) + Date.now().toString().substring(1);
                //开始上传
                uploadFile(file, fileName);
                return;
            }
        }
        toast.error("没有图片文件")
    }
})

/**
 * 监听结果面板中的点击事件
 */
resultPanel.addEventListener('click', function (e) {
    let { target } = e;
    let $a = target.parentElement.previousElementSibling;
    let { className } = target;
    let options = ['link', 'md', 'delete'];
    let flag = options.indexOf(className);
    if (flag >= 0) {
        let $a = target.parentElement.previousElementSibling;
        let $li = $a.parentElement;
        let { href } = $a;
        switch (flag) {
            case 0: //链接
                copyRes(href);
                $a.text = href
                break;
            case 1: // markdown链接
                copyRes(`![图片](${href})`)
                $a.text = `![图片](${href})`
                break;
            case 2: // 删除
                if (confirm("确认从图床中删除此图片?")) {
                    toast.info("开发构思中")
                }
                break;
            default:
                break;
        }
    }
})

/**
 * 当改变文件选择时触发
 */
uploadBtn.addEventListener('change', function () {
    let files = this.files
    if (files.length === 0) {
        return;
    }
    let file = files[0]

    //文件名(加一个前缀相当于目录)
    let fileName = 'mdImg/' + btoa(Date.now()) + file.name;
    //开始上传
    uploadFile(file, fileName);
})

function refreshDDL() {
    document.getElementById('ddl').textContent = new Date(date).Format('yyyy-MM-dd hh:mm:ss')

    const refreshWait = () => {
        let wait = ((date - Date.now()) / 1000) >> 0
        const day = (wait / (24 * 60 * 60)) >> 0
        wait -= day * 24 * 60 * 60
        const hour = (wait / (60 * 60)) >> 0
        wait -= hour * 60 * 60
        document.getElementById('wait').textContent = `${day}天 ${hour}时 ${wait} 秒`
        requestAnimationFrame(refreshWait)
    }
    refreshWait()
}

//对Date进行扩展
Date.prototype.Format = function (fmt) { //author: meizz
    const o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        'S': this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (const k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return fmt
}

refreshDDL()
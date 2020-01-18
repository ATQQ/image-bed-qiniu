import "../less/index.less"
import { uploadFile } from "./../utils/qiniuUtil.js";
import { copyRes } from "./../utils/tool"
import { toast } from "./../components/Toast/index"
console.log("init success")

// 粘贴板
let pastePanel = document.getElementById('pastePanel');

// 结果面板
let resultPanel = document.getElementById('result-area');

/**
 * 监听粘贴事件
 */
pastePanel.addEventListener('paste', function(e) {
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
document.addEventListener('drop', function(e) {
    e.preventDefault()
}, true)
document.addEventListener('dragover', function(e) {
    e.preventDefault()
}, true)



/**
 * 监听文件拖拽上传事件
 */
let drag = false;

pastePanel.addEventListener('dragenter', function(e) {
    drag = true;
})

pastePanel.addEventListener('dragover', function(e) {
    drag = true;
});

pastePanel.addEventListener('dragleave', function(e) {
    drag = false;
})

pastePanel.addEventListener('drop', function(e) {
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
resultPanel.addEventListener('click', function(e) {
    let { target } = e;
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
                break;
            case 1: // markdown链接
                copyRes(`![图片](${href})`)
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
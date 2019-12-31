import "../less/index.less"
import { uploadFile } from "./../utils/qiniuUtil.js";
console.log("init success")

let pastePanel = document.getElementById('pastePanel');

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
    alert("剪贴板中没有图片")
})

// 禁用默认的拖拽触发的内容
document.addEventListener('drop', function(e) {
    e.preventDefault()
}, true)
document.addEventListener('dragover', function(e) {
    e.preventDefault()
}, true)



//监听文件拖拽上传

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
        alert("没有图片文件")
    }
})
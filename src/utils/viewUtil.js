import { copyRes } from "./tool"

/**
 * 获取超链接的a标签
 * @param {String} url 
 */
function getLinkDom(url) {
    let a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = url
    copyRes(`![图片](${url})`);
    return a;
}

/**
 * 将图片链接回显到屏幕上
 * @param {Element} href 
 */
function appendLink(href) {
    let html = `
    <li>
        <a href="${href}" target="_blank">${href}</a>
        <span>
            <button class="link" title="复制地址">地址</button>
            <button class="md" title="复制markdown格式">md</button>  
             <button class="delete" title="删除">X</button>
        </span>
    </li>
    `
    let temp = document.createElement('div');
    temp.innerHTML = html
    let resultArea = document.getElementById('result-area');
    let li = temp.children[0]
    let ol = resultArea.querySelector('ol');
    ol.appendChild(li);
    copyRes(`![图片](${href})`);
}

/**
 * 回显上传的相关图片地址
 * @param {String} url 
 */
function addLink(url) {
    appendLink(url)
}

/**
 * 更新上传进度
 * @param {Number} value 
 */
function updateUploadProcess(value) {
    let uploadProcess = document.getElementById('upload-process');
    uploadProcess.textContent = `上传进度:${value.toFixed(2)}`;
}


export {
    addLink,
    updateUploadProcess
}
/**
 * 获取超链接的a标签
 * @param {String} url 
 */
function getLinkDom(url) {
    let a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = `![图片](${url})`
    copyRes(`![图片](${url})`);
    return a;
}

/**
 * 将图片链接回显到屏幕上
 * @param {Element} a 
 */
function appendLink(a) {
    let rightArea = document.getElementById('right-area');
    let li = document.createElement('li');
    let ol = rightArea.querySelector('ol');
    li.appendChild(a);
    ol.appendChild(li);
}

/**
 * 回显上传的图片
 * @param {String} url 
 */
function addLink(url) {
    appendLink(getLinkDom(url))
}

/**
 * 更新上传进度
 * @param {Number} value 
 */
function updateUploadProcess(value) {
    let uploadProcess = document.getElementById('upload-process');
    uploadProcess.textContent = `上传进度:${value.toFixed(2)}`;
}

/**
 * 将结果写入的剪贴板
 * @param {String} text 
 */
function copyRes(text) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', text);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
    alert("结果已成功复制到剪贴板")
}

export {
    addLink,
    updateUploadProcess
}
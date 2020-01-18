import { toast } from "../components/Toast/index"

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
    toast.success("结果已成功复制到剪贴板")
}

export {
    copyRes
}
import "./index.less"

class Toast {
    constructor() {
        let div = document.createElement('div');
        let span = document.createElement('span');
        this.toast = div;
        this.span = span;
        div.appendChild(span);
    }
    success(text, time) {
        this.toast.className = "toast toast-success"
        this.span.textContent = text
        this.show(time)
    }
    error(text, time) {
        this.toast.className = "toast toast-error"
        this.span.textContent = text
        this.show(time)
    }
    warn(text, time) {
        this.toast.className = "toast toast-warn"
        this.span.textContent = text
        this.show(time)
    }
    info(text, time) {
        this.toast.className = "toast toast-info"
        this.span.textContent = text
        this.show(time)
    }
    show(time = 2000) {
        document.body.appendChild(this.toast);
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            document.body.removeChild(this.toast)
        }, time)
    }
    static getInstance() {
        if (this.toast) {
            return this.toast
        }
        return new Toast();
    }
}
let toast = Toast.getInstance();
export {
    toast
}
import * as qiniu from "qiniu-js";
let config = {
    useCdnDomain: true,
    region: qiniu.region.z0
}
let token = "17iBaqCDcWUjh-6fUN4KWy3hm7HydYm5Fc1ruakj:oNpiijb8eKV71jDP_tdoxwcaTfo=:eyJzY29wZSI6Im1kc291cmNlIiwiZGVhZGxpbmUiOjE2MDA2NTc0MzB9"
let Domain = 'http://img.cdn.sugarat.top'
export {
    config,
    token,
    Domain
}
import * as qiniu from "qiniu-js";
let config = {
    useCdnDomain: true,
    region: qiniu.region.z0
}
let token = "17iBaqCDcWUjh-6fUN4KWy3hm7HydYm5Fc1ruakj:iPaREitB2YmTYjXb--bAYgcBrVE=:eyJzY29wZSI6Im1kc291cmNlIiwiZGVhZGxpbmUiOjE1ODQ3MDc3Mjd9"
let Domain = 'http://img.cdn.sugarat.top'
export {
    config,
    token,
    Domain
}
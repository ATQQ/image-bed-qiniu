import * as qiniu from "qiniu-js";
let config = {
    useCdnDomain: true,
    region: qiniu.region.z0
}
let token = "17iBaqCDcWUjh-6fUN4KWy3hm7HydYm5Fc1ruakj:7O9PF05PvT6EVdFbVtQoDOMEt9M=:eyJzY29wZSI6Im1kc291cmNlIiwiZGVhZGxpbmUiOjE1ODE5NDMxNzl9"
let Domain = 'http://img.cdn.sugarat.top'
export {
    config,
    token,
    Domain
}
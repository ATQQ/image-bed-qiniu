import * as qiniu from "qiniu-js";
let config = {
    useCdnDomain: true,
    region: qiniu.region.z0
}
let token = '17iBaqCDcWUjh-6fUN4KWy3hm7HydYm5Fc1ruakj:Q5CF0H2u7HSrwVOrqRYZMGmd4K4=:eyJzY29wZSI6Im1kc291cmNlIiwiZGVhZGxpbmUiOjE1NzgzNzQ1ODJ9';
let Domain = 'http://img.cdn.sugarat.top'
export {
    config,
    token,
    Domain
}

import * as qiniu from "qiniu-js";
let config = {
    useCdnDomain: true,
    region: qiniu.region.z0
}
let token = 'Ut9OESzWf_Xxr6KKPRj2cG3PDOW_WPcMBC1rVaF-:HYh9xrXMrb8-pHf2gHhaZ5FWvvc=:eyJzY29wZSI6Im1kc291cmNlIiwiZGVhZGxpbmUiOjE2MDM3MDMzMDJ9'
let date = 1603703302767
let Domain = 'http://img.cdn.sugarat.top'
export {
    config,
    token,
    Domain,
    date
}
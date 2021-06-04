
import * as qiniu from "qiniu-js";
let config = {
    useCdnDomain: true,
    region: qiniu.region.z0
}
let token = 'Ut9OESzWf_Xxr6KKPRj2cG3PDOW_WPcMBC1rVaF-:n9OTCexogWXVvfzssFysiCMbcC8=:eyJzY29wZSI6Im1kc291cmNlIiwiZGVhZGxpbmUiOjE2MjUzOTEwMDd9'
let date = 1625391007695
let domain = 'https://img.cdn.sugarat.top'
export {
    config,
    token,
    domain,
    date
}
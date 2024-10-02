<script lang="ts" setup>
import { useIsExpired } from '@/composables';
import { useConfigStore } from '@/store';
import { formatDate } from '@/utils/stringUtil';
import { generateUploadToken as generateUpyunToken } from '@/utils/upyun';
import { generateUploadToken as generateQiniuToken } from '@/utils/qiniu';
import { Key, Refresh, Setting } from '@element-plus/icons-vue';
import { useWindowSize, useLocalStorage } from '@vueuse/core';
import { ElMessage, ElMessageBox, ElButton, ElForm, ElFormItem, ElInput, ElCheckbox, ElDatePicker } from 'element-plus';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref } from 'vue';

const store = useConfigStore()
const { config } = storeToRefs(store)
const dialogVisible = ref(false)
const expiredTime = ref('')
const countDown = ref('')
const isExpired = useIsExpired()

const handleGetToken = () => {
    window.open('https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#%E7%94%9F%E6%88%90token')
}
onMounted(() => {
    refreshDDL()
})
function refreshDDL() {
    const refreshWait = () => {
        expiredTime.value = formatDate(config.value.date, 'yyyy-MM-dd')
        let wait = ((config.value.date - Date.now()) / 1000) >> 0
        const day = (wait / (24 * 60 * 60)) >> 0
        wait -= day * 24 * 60 * 60
        const hour = (wait / (60 * 60)) >> 0
        wait -= hour * 60 * 60
        countDown.value = `${day}天 ${hour}时 ${wait} 秒`
        requestAnimationFrame(refreshWait)
    }
    refreshWait()
}

const handleCheckConfig = () => {
    dialogVisible.value = true
}

const cfgStr = computed(() => {
    return `${JSON.stringify(config.value, (key, value) => {
        if (key === 'token') {
            return
        }
        if (key === 'date') {
            return formatDate(value, 'yyyy-MM-dd hh:mm:ss')
        }
        return value
    }, 2)}`
})
const handleUpdateToken = () => {
    ElMessageBox.prompt('请粘贴新的token', '设置Token').then(v => {
        if (!v.value?.trim()) {
            return
        }
        store.parseToken(v.value)
    }).catch(() => {
        ElMessage.info('取消')
    })
}
const { width } = useWindowSize()
const isFullScreen = computed(() => width.value < 768)

const settingPanel = ref(false)

const form = reactive({
    type: 'upyun',
    account: '',
    password: '',
    bucket: '',
    domain: 'https://abc.example.com',
    prefix: 'image',
    scope: 'default',
    expires: 0,
    localSave: false
})

const cacheConfig = useLocalStorage('oss-config', {
    type: 'upyun',
    account: '',
    password: '',
    bucket: '',
    domain: 'https://abc.example.com',
    prefix: 'image',
    scope: 'default',
    expires: 0,
    localSave: false
})

async function handleGenerateToken() {
    // 校验表单不能为空
    for (const key of Object.keys(form)) {
        if (key === 'localSave') {
            continue
        }
        const value = form[key as keyof typeof form]
        if (typeof value === 'string' && !value.trim()) {
            ElMessage.error('请填写所有内容')
            return
        }
        if (!value) {
            ElMessage.error('请填写所有内容')
            return
        }
    }

    // 生成token 并应用
    let token = ''
    if (form.type === 'upyun') {
        token = await generateUpyunToken({
            operator: form.account,
            password: form.password,
            service: form.bucket,
            domain: form.domain,
            prefix: form.prefix,
            scope: form.scope,
            expires: +form.expires,
        })
    }
    if(form.type === 'qiniu'){
        token = await generateQiniuToken({
            accessKey: form.account,
            secretKey: form.password,
            bucket: form.bucket,
            domain: form.domain,
            prefix: form.prefix,
            scope: form.scope,
            expires: +form.expires,
        })
    }

    if (!token) {
        return
    }
    store.parseToken(token)

    ElMessage.success('生成并应用成功！')

    if (form.account === cacheConfig.value.account && form.password === cacheConfig.value.password) {
        return
    }
    // 调用存储到浏览器
    try {
        // @ts-expect-error
        const credential = new PasswordCredential({
            id: form.account,
            password: form.password,
        });

        // 保存凭据到浏览器的密码管理器
        await navigator.credentials.store(credential);
    } catch {

    }

    // 是否同步存储到本地中
    if (form.localSave) {
        cacheConfig.value = form
    } else {
        cacheConfig.value.localSave = false
    }
}


onMounted(() => {
    // 迁移配置
    cacheConfig.value.type = config.value.type || 'qiniu'
    cacheConfig.value.bucket = config.value.bucket
    cacheConfig.value.domain = config.value.domain
    cacheConfig.value.prefix = config.value.prefix
    cacheConfig.value.scope = config.value.scope
    cacheConfig.value.expires = config.value.date

    // 同步到视图上
    Object.assign(form, cacheConfig.value)
})
</script>

<template>
    <el-icon @click="handleCheckConfig" :color="isExpired ? 'red' : 'inherit'">
        <Key />
    </el-icon>
    <el-dialog v-model="dialogVisible" title="token信息" :fullscreen="isFullScreen">
        <p v-if="isExpired">
            token 已经过期 <el-button type="primary" link @click="handleGetToken"> 获取方式？</el-button>
        </p>
        <p v-else>
            <span>有效期至：{{ expiredTime }}，剩余时间</span><span>{{ countDown }}</span>
        </p>
        <p>
            <el-button v-if="isExpired" type="danger" text :icon="Refresh" @click="handleUpdateToken">点我更新</el-button>
            <el-button v-else type="primary" text :icon="Refresh" @click="handleUpdateToken">更新 token</el-button>
            <el-button type="primary" text :icon="Setting" @click="settingPanel = !settingPanel">生成 token</el-button>
        </p>
        <div v-show="settingPanel" class="setting-panel">
            <el-form :model="form" label-width="auto" style="max-width: 600px">
                <el-form-item label="存储服务">
                    <el-radio-group v-model="form.type">
                        <el-radio value="qiniu">七牛云</el-radio>
                        <el-radio value="upyun">又拍云</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="form.type === 'qiniu' ? 'Access Key' : 'Operator'">
                    <el-input autocomplete="username" name="username" v-model="form.account" clearable
                        :placeholder="form.type === 'qiniu' ? '请输入七牛云 Access Key' : '请输入又拍云 操作员账号'" />
                </el-form-item>
                <el-form-item :label="form.type === 'qiniu' ? 'Secret Key' : 'Password'">
                    <el-input show-password type="password" autocomplete="password" name="password"
                        v-model="form.password" clearable
                        :placeholder="form.type === 'qiniu' ? '请输入七牛云 Secret Key' : '请输入又拍云 操作员密码'" />
                </el-form-item>
                <el-form-item :label="form.type === 'qiniu' ? 'Bucket' : 'Service'">
                    <el-input v-model="form.bucket" clearable
                        :placeholder="form.type === 'qiniu' ? '七牛云 kodo 存储空间名称' : '又拍云 USS 服务名称'" />
                </el-form-item>
                <el-form-item label="域名">
                    <el-input clearable v-model="form.domain" placeholder="访问域名：https://example.com" />
                </el-form-item>
                <el-form-item label="资源前缀">
                    <el-input clearable v-model="form.prefix" placeholder="请输入资源前缀" />
                </el-form-item>
                <el-form-item label="资源Scope">
                    <el-input clearable v-model="form.scope" placeholder="请输入资源scope" />
                </el-form-item>
                <el-form-item label="资源链接">
                    <p style="color: red;">{{ form.domain + '/' + form.prefix + '/' + form.scope + '/${name}' }}</p>
                </el-form-item>
                <el-form-item label="过期时间">
                    <el-date-picker clearable v-model="form.expires" type="datetime" placeholder="选择 token 过期时间" />
                </el-form-item>
                <div class="center">
                    <el-checkbox label="本地保存账号" v-model="form.localSave" />
                </div>
                <div class="center">
                    <el-button type="primary" @click="handleGenerateToken">生成并应用</el-button>
                    <el-button @click="settingPanel = false">取消</el-button>
                </div>
            </el-form>
        </div>
        <details>
            <summary>查看生效配置</summary>
            <pre>{{ cfgStr }}</pre>
        </details>
        <template #footer>
            <p>
                <el-button type="success" @click="dialogVisible = false">关闭</el-button>
            </p>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
i {
    cursor: pointer;
}

p {
    margin-top: 0;
    text-align: center;
}

.setting-panel form {
    margin: 0 auto;
}

.center {
    text-align: center;
}
</style>
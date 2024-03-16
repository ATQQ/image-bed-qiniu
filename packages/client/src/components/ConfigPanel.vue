<script lang="ts" setup>
import { useIsExpired } from '@/composables';
import { useConfigStore } from '@/store';
import { formatDate } from '@/utils/stringUtil';
import { Key, Refresh } from '@element-plus/icons-vue';
import { useWindowSize } from '@vueuse/core';
import { ElMessage, ElMessageBox, ElButton } from 'element-plus';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
const store = useConfigStore()
const { qiniu } = storeToRefs(store)
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
    expiredTime.value = formatDate(qiniu.value.date, 'yyyy-MM-dd')
    const refreshWait = () => {
        let wait = ((qiniu.value.date - Date.now()) / 1000) >> 0
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
    return `${JSON.stringify(qiniu.value, (key, value) => {
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
        store.parseQiniuToken(v.value)
    }).catch(() => {
        ElMessage.info('取消')
    })
}
const { width } = useWindowSize()
const isFullScreen = computed(() => width.value < 768)
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
            有效期至：{{ expiredTime }}，剩余时间 {{ countDown }}
        </p>
        <p>
            <el-button v-if="isExpired" type="danger" text :icon="Refresh" @click="handleUpdateToken">点我更新</el-button>
            <el-button v-else type="primary" text :icon="Refresh" @click="handleUpdateToken">更新</el-button>
        </p>

        <details>
            <summary>查看最终配置</summary>
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
    margin-right: 10px;
    cursor: pointer;
}

p {
    margin-top: 0;
    text-align: center;
}
</style>
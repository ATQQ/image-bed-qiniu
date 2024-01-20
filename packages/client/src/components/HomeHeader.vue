<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { formatDate } from '../utils/stringUtil';
import { useConfigStore } from '@/store';
import { storeToRefs } from 'pinia';
import ConfigPanel from './ConfigPanel.vue';
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
const store = useConfigStore()
const { qiniu } = storeToRefs(store)
const expiredTime = ref('')
const countDown = ref('')

const handleUpdateToken = () => {
    ElMessageBox.prompt('请粘贴新的token', '设置Token').then(v => {
        store.parseQiniuToken(v.value)
    }).catch(()=>{
        ElMessage.info('取消')
    })
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
</script>
<template>
    <header>
        <details>
            <summary><span>token:过期时间：{{ expiredTime }}</span></summary>
            剩余时间 ：{{ countDown }} <el-button text :icon="Refresh" @click="handleUpdateToken"> 更新</el-button>
        </details>
        <span class="right">
            <ConfigPanel />
            <a href="https://github.com/ATQQ/image-bed-qiniu" target="_blank" noreferrer noopener>
                GitHub
            </a>
        </span>
    </header>
</template>
<style scoped lang="scss">
header {
    display: flex;
    justify-content: space-between;
    padding: 18px;
}

.right {
    display: flex;
    align-items: center;

    a {
        margin-left: 10px;
    }
}
</style>
<script lang="ts" setup>
import { useIsExpired } from '@/composables';
import ConfigPanel from './ConfigPanel.vue';
const isExpired = useIsExpired()
import { ElAlert } from 'element-plus';
</script>
<template>
    <header>
        <div class="left">
            <img src="../assets/logo.gif">
            <span>七牛云 OSS 图床</span>           
        </div>
        <span class="right">
            <ConfigPanel />
            <a href="https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client#-%E4%B8%83%E7%89%9B%E4%BA%91oss%E5%9B%BE%E5%BA%8A-" target="_blank" noreferrer noopener>
                GitHub
            </a>
        </span>
    </header>
    <el-alert class="expired" center v-if="isExpired" title="token 已经过期，请点击右上角 🔑 更新" type="error" show-icon />
</template>
<style scoped lang="scss">
header {
    display: flex;
    justify-content: space-between;
    padding: 18px;
}
.left {
    display: flex;
    align-items: center;
    font-size: 14px;
    img{
        height: 40px;
        margin-right: 10px;
    }
}
.right {
    display: flex;
    align-items: center;

    a {
        color: var(--el-text-color-regular);
        text-decoration: none;
    }
}

.expired{
    max-width: 400px;
    margin: 0 auto;
}
</style>
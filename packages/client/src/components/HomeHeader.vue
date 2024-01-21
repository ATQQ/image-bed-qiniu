<script lang="ts" setup>
import ConfigPanel from './ConfigPanel.vue';
</script>
<template>
    <header>
        <div class="left">
            <img src="../assets/logo.gif">
            <span>七牛云 OSS 图床</span>           
        </div>
        <span class="right">
            <ConfigPanel />
            <a href="https://github.com/ATQQ/image-bed-qiniu/tree/master/packages/client" target="_blank" noreferrer noopener>
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
</style>
<script lang="ts" setup>
import { watch } from 'vue'
import { useUploadConfig } from '@/composables'
import { useImageStore } from '@/store'
import { storeToRefs } from 'pinia'
import { copyRes } from '@/utils/stringUtil';
const cacheConfig = useUploadConfig()
const store = useImageStore()
const { success } = storeToRefs(store)
watch(() => success.value.length, (length) => {
    const uploadItem = success.value[length - 1]
    const { autoCopy, copyType } = cacheConfig.value
    if (autoCopy) {
        copyRes(copyType === 'url' ? uploadItem.url : `![](${uploadItem.url})`)
    }
})
</script>
<template>
    <div class="tool-wrapper">
        <span class="autoCopy">
            <el-switch v-model="cacheConfig.autoCopy" inline-prompt active-text="自动复制" inactive-text="关闭自动复制" />
            <el-select style="width: 100px;" v-if="cacheConfig.autoCopy" v-model="cacheConfig.copyType" placeholder="选择复制类型"
                size="small">
                <el-option label="链接" value="url" />
                <el-option label="Markdown" value="markdown" />
                <template #empty></template>
            </el-select>
        </span>
    </div>
</template>


<style lang="scss" scoped>
.tool-wrapper {
    text-align: center;
    padding: 0 10px;
    display: flex;
    justify-content: center;
}

.autoCopy {
    display: flex;
    align-items: center;

    .el-select {
        margin-left: 10px;
    }
}
</style>
<script setup lang="ts">
import { watch } from 'vue'
import { useUploadConfig } from '@/composables'
import { useImageStore } from '@/store'
import { storeToRefs } from 'pinia'
import { copyRes } from '@/utils/stringUtil';
const cacheConfig = useUploadConfig()
const store = useImageStore()
const { success } = storeToRefs(store)
watch(() => success.value.length, () => {
    const uploadItem = success.value[0]
    const { autoCopy, copyType } = cacheConfig.value
    if (autoCopy) {
        copyRes(copyType === 'url' ? uploadItem.url : `![](${uploadItem.url})`)
    }
})
</script>

<template>
    <div class="tool-wrapper">
        <span class="autoCopy">
            <el-switch v-model="cacheConfig.autoCopy" inline-prompt active-text="自动复制" inactive-text="自动复制" />
            <el-select style="width: 100px;" v-if="cacheConfig.autoCopy" v-model="cacheConfig.copyType"
                placeholder="选择复制类型" size="small">
                <el-option label="链接" value="url" />
                <el-option label="Markdown" value="markdown" />
                <template #empty></template>

                <template #prefix></template>
            </el-select>
        </span>
        <span class="compress">
            <el-switch v-model="cacheConfig.compressImage" inline-prompt active-text="压缩" inactive-text="压缩" />
            <!-- <el-switch v-if="cacheConfig.compressImage" class="preview-switch" v-model="cacheConfig.compressPreview" inline-prompt active-text="预览" inactive-text="关闭预览" /> -->
        </span>
    </div>
</template>


<style lang="scss" scoped>
.tool-wrapper {
    text-align: center;
    padding: 0 10px;
    display: flex;
    justify-content: center;
    >span{
        margin: 2px 6px;
    }
    .el-switch{
        --el-switch-off-color: #ff4949;
    }
}

.autoCopy {
    display: flex;
    align-items: center;

    .el-select {
        margin-left: 10px;
    }
}

</style>
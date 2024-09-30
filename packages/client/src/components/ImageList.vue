<script setup lang="ts">
import { copyRes, formatDate } from '../utils/stringUtil';
import { Picture } from '@element-plus/icons-vue'
import { useImageStore } from '@/store'
import { computed } from 'vue';
import { ElMessageBox } from 'element-plus'
import { IImage } from '@/store/modules/imageStore'
import { ref } from 'vue'
import { useUploadConfig } from '@/composables';
import { calculateCompressionPercentage, formatSize } from '@/utils';
const imageStore = useImageStore()
const copyAddress = (url: string) => {
  copyRes(url)
}

const copyMdAddress = (url: string) => {
  copyAddress(`![](${url})`)
}
const successImages = computed(() => imageStore.success)

const checkInfo = (image: IImage) => {
  ElMessageBox({
    title: '图片信息',
    dangerouslyUseHTMLString: true,
    message: `<div class="preview-info">
      <ul>
        <li>图片名：${image.name}</li>  
        <li>链接：<a target="_blank" href=${image.url}>${image.url}</a></li>  
        <li>上传时间：${image.date && formatDate(image.date)}</li>
        <li>大小：${image.size ? formatSize(image.size) : '未知'}</li>  
        ${image.originSize ? `<li>压缩前大小：${formatSize(image.originSize)}</li>` : ''}
        ${image.originSize ? `<li>压缩率：${calculateCompressionPercentage(image.originSize, image.size)}%</li>` : ''}
      </ul>
      </div>`
  })
}
const uploadConfig = useUploadConfig()
const currentPage = ref(1)

const showImage = computed(() => {
  const pageSize = uploadConfig.value.pageSize
  const current = currentPage.value
  return successImages.value.slice((current - 1) * pageSize, current * pageSize)
})
</script>
<template>
  <!-- 链接列表 -->
  <p class="title">历史上传记录 ↓（本地存储）</p>
  <ul class="el-upload-list el-upload-list--text">
    <li class="el-upload-list__item" v-for="(image, idx) in showImage" :key="idx">
      <div class="el-upload-list__item-info">
        <div class="el-upload-list__item-name list-item-link-wrapper">
          <span class="ellipsis left">
            <el-icon :size="16">
              <Picture />
            </el-icon>
            <a :href="image.url" target="_blank" class="ellipsis el-upload-list__item-file-name" title="视野修炼 2024.jpeg">
              {{ image.name }}
            </a>
          </span>
          <span style="width: 160px;" class="right">
            <el-button v-if="image.size" :type="image.originSize ? 'success' : 'warning'" link>
              {{ formatSize(image.size) }}
            </el-button>
            <el-button type="primary" link @click="checkInfo(image)" title="查看图片信息">🔍</el-button>
            <el-button type="primary" link @click="copyAddress(image.url)" title="复制图片地址">url</el-button>
            <el-button type="success" link @click="copyMdAddress(image.url)" title="复制markdown格式图片地址">md</el-button>
          </span>
        </div>
      </div>
    </li>
  </ul>
  <div class="pagination">
    <el-pagination small background v-model:current-page="currentPage" v-model:page-size="uploadConfig.pageSize"
      :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next" :total="successImages.length" />
  </div>
</template>
<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 12px;
}

ul.el-upload-list {
  max-width: 666px;
  margin: 20px auto;
}

.list-item-link-wrapper {
  display: flex;
  justify-content: space-between;

  .left {
    flex: 1;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  span {
    display: flex;
    align-items: center;
  }
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination {
  display: flex;
  justify-content: center;

  .el-pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    :deep(.el-pager) {
      margin: 10px;
    }
  }
}
</style>
<style lang="scss">
.preview-info {
  li {
    word-break: break-all;
  }
}
</style>
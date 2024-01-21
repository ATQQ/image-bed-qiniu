<script setup lang="ts">
import { copyRes, formatDate } from '../utils/stringUtil';
import { Picture } from '@element-plus/icons-vue'
import { useImageStore } from '@/store'
import { computed } from 'vue';
import { ElMessageBox } from 'element-plus'
import { IImage } from '@/store/modules/imageStore'

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
      </ul>
      </div>`
  })
}
</script>
<template>
  <!-- 链接列表 -->
  <p class="title">历史上传记录 ↓</p>
  <ul class="el-upload-list el-upload-list--text">
    <li class="el-upload-list__item" v-for="(image, idx) in successImages" :key="idx">
      <div class="el-upload-list__item-info">
        <div class="el-upload-list__item-name list-item-link-wrapper">
          <span>
            <el-icon :size="16">
              <Picture />
            </el-icon>
            <a :href="image.url" target="_blank" class="ellipsis el-upload-list__item-file-name" title="视野修炼 2024.jpeg">
              {{ image.name }}
            </a>
          </span>
          <span style="min-width: 160px;">
            <el-button type="primary" link @click="checkInfo(image)">🔍</el-button>
            <el-button type="primary" link @click="copyAddress(image.url)">url</el-button>
            <el-button type="success" link @click="copyMdAddress(image.url)">markdown</el-button>
          </span>
        </div>
      </div>
    </li>
  </ul>
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

  a {
    color: inherit;
    text-decoration: none;
    max-width: 200px;
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
</style>
<style lang="scss">
.preview-info {
  li {
    word-break: break-all;
  }
}
</style>
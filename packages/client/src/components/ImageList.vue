<script setup lang="ts">
import { copyRes } from '../utils/stringUtil';
import { Picture } from '@element-plus/icons-vue'
import { useImageStore } from '@/store'
import { computed } from 'vue';

const imageStore = useImageStore()
const copyAddress = (url: string) => {
  copyRes(url)
}

const copyMdAddress = (url: string) => {
  copyAddress(`![](${url})`)
}
const successImages = computed(() => imageStore.success)

</script>
<template>
<!-- 链接列表 -->
<ul class="el-upload-list el-upload-list--text">
    <li class="el-upload-list__item" v-for="(image, idx) in successImages" :key="idx">
      <div class="el-upload-list__item-info">
        <div class="el-upload-list__item-name list-item-link-wrapper">
          <span>
            <el-icon :size="16">
              <Picture />
            </el-icon>
            <a :href="image.url" target="_blank" class="el-upload-list__item-file-name" title="视野修炼 2024.jpeg">
              {{ image.name }}
            </a>
          </span>
          <span>
            <el-button type="primary" link @click="copyAddress(image.url)">url</el-button>
            <el-button type="success" link @click="copyMdAddress(image.url)">markdown</el-button>
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
ul.el-upload-list{
  max-width: 666px;
  margin: 20px auto;
}

.list-item-link-wrapper {
  display: flex;
  justify-content: space-between;

  a {
    color: inherit;
    text-decoration: none;
  }

  span {
    display: flex;
    align-items: center;
  }
}
</style>
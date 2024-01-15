<script setup lang="ts">
import { computed } from 'vue';
import ImageUpload from './components/ImageUpload.vue'

const expiredTime = computed(() => '2024-01-16 13:52:33 剩余时间：')
</script>

<template>
  <header>
    <span>token：到期时间：{{ expiredTime }}</span>
    <a href="https://github.com/ATQQ/image-bed-qiniu" target="_blank" noreferrer noopener>
      GitHub
    </a>
  </header>
  <!-- 上传图片区域 -->
  <ImageUpload />
  <!-- 控制区域 -->
  <!-- 图片链接区域 -->
  <!-- <RouterView /> -->
</template>

<style scoped>
header{
  display: flex;
  justify-content: space-between;
  padding: 18px;
}
</style>

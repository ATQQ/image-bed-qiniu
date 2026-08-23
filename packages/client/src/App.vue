<script setup lang="ts">
import HomeHeader from './components/HomeHeader.vue';
import ImageList from './components/ImageList.vue';
import ImageUpload from './components/ImageUpload.vue'
import UploadTool from './components/UploadTool.vue'
import { useConfigStore } from './store';
const store = useConfigStore()
// 初始化：恢复各平台配置与激活平台
store.init()
</script>

<template>
  <!-- 头部控制区域 -->
  <HomeHeader />
  <!-- TODO:控制区域 -->
  <!-- 上传图片区域 -->
  <ImageUpload />
  <!-- 操作区域 -->
  <UploadTool />
  <!-- 图片链接区域 -->
  <ImageList />
  <!-- <RouterView /> -->
</template>

<style>
body{
  margin: 0;
  padding: 0;
}
</style>

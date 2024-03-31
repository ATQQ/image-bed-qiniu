<script setup lang="ts">
import { watch } from 'vue';
import HomeHeader from './components/HomeHeader.vue';
import ImageList from './components/ImageList.vue';
import ImageUpload from './components/ImageUpload.vue'
import UploadTool from './components/UploadTool.vue'
import { useConfigStore } from './store';
import { useLocalStorage } from '@vueuse/core';
const store = useConfigStore()
// 默认取用户设置的token
const uploadToken = useLocalStorage('upload-token', undefined)

watch(uploadToken, (newValue) => {
  store.parseToken(newValue)
}, {
  immediate: true
})
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

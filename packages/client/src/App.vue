<script setup lang="ts">
import { watch } from 'vue';
import HomeHeader from './components/HomeHeader.vue';
import ImageList from './components/ImageList.vue';
import ImageUpload from './components/ImageUpload.vue'
import { useConfigStore } from './store';
import { useLocalStorage } from '@vueuse/core';
const store = useConfigStore()
const qiniuToken = useLocalStorage('qiniu-token', import.meta.env.VITE_APP_QINIU_TOKEN)

watch(qiniuToken, (newValue) => {
  store.parseQiniuToken(newValue)
}, {
  immediate: true
})
</script>

<template>
  <HomeHeader />
  <!-- 控制区域 -->
  <!-- 上传图片区域 -->
  <ImageUpload />
  <!-- 图片链接区域 -->
  <ImageList />
  <!-- <RouterView /> -->
</template>

<style scoped></style>

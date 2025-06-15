/// <reference types="vitest" />

import path from 'path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { configDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // Element Plus 的UI按需引入配置
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({
      defaultLocale: 'zh-cn',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 相关库打包在一起
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // 将 Element Plus 相关依赖打包在一起
          'element-plus-vendor': ['element-plus'],
          // 将其他第三方库打包在一起
          'utils-vendor': ['axios', 'lodash-es'],
        },
      },
    },
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api/': {
        target:
          'https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, ''),
      },
      '/api-prod/': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api-prod/, ''),
      },
      '/api-test/': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api-test/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})

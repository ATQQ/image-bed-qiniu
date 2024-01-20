<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue';
import { ElMessage, type UploadInstance, type UploadProps, type UploadUserFile } from 'element-plus'
import { uploadFile } from '../utils/qiniu'
import { copyRes } from '../utils/stringUtil';
import { Picture } from '@element-plus/icons-vue'
import { useFocus } from '@vueuse/core';

const uploadRef = ref<UploadInstance>()
const files = ref<UploadUserFile[]>([])
const handleChange: UploadProps['onChange'] = (_, uploadFiles) => {
  files.value = uploadFiles.filter(v => {
    const ok = v.raw?.type.includes('image')
    if (!ok) {
      ElMessage.error('只能上传图片')
    }
    return ok
  })
}
const successImages = ref<{ url: string, name: string }[]>([])

watch(files, () => {
  for (const file of files.value) {
    // 上传
    if (file.status === 'ready') {
      file.status = 'uploading'
      uploadFile(file.raw!, file.name, {
        process(percent) {
          file.percentage = percent
          if (percent === 100) {
            file.status = 'success'
          }
        },
      }).then(v => {
        file.status = 'success'
        // 列表里移除已经删除的
        files.value.splice(files.value.findIndex(f => f === file), 1)
        successImages.value.push({
          url: v,
          name: file.name || 'image'
        })
      })
    }
  }
})

function generateNumericUID() {
  let now = Date.now();
  let random = Math.floor(Math.random() * 100000); // 生成一个五位数的随机数
  return parseInt(`${now}${random}`);
}

const $pasteArea = ref<HTMLElement>()

const registerPasteEvent = () => {
  const pastePanelEl = $pasteArea.value

  if (!pastePanelEl) {
    return
  }
  /**
  * 监听粘贴事件
  */
  pastePanelEl.addEventListener('paste', function (e) {
    console.log('paste');
    // 阻止触发默认的粘贴事件
    e.preventDefault();
    let { items } = e.clipboardData || {};
    if (!items) {
      return
    }
    let empty = true
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image")) {
        const file = item.getAsFile()
        if (!file) {
          continue
        }
        files.value = files.value.concat({
          name: file.name,
          // 生成一个唯一的数字id
          raw: Object.assign(file, { uid: generateNumericUID(), }),
          status: 'ready',
          percentage: 0
        })
        empty = false
      }
    }
    empty && ElMessage.error("剪贴板中没有图片")
  })

  // 禁用默认的拖拽触发的内容
  document.addEventListener('drop', function (e) {
    e.preventDefault()
  }, true)
  document.addEventListener('dragover', function (e) {
    e.preventDefault()
  }, true)
}
watch($pasteArea, () => {
  registerPasteEvent()
})

const copyAddress = (url: string) => {
  copyRes(url)
}

const copyMdAddress = (url: string) => {
  copyAddress(`![](${url})`)
}
const { focused } = useFocus($pasteArea)
const pasteText = computed(() => focused.value ? '现在你可以粘贴了' : '你也可以点击此处，然后粘贴你要上传的图片')
</script>
<template>
  <div class="upload-wrapper">
    <el-upload accept="image/*" v-model:file-list="files" ref="uploadRef" :on-change="handleChange" drag multiple
      :auto-upload="false">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖动文件到这里或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="cv-tip">
          <textarea ref="$pasteArea"></textarea>
          <p>{{ pasteText }}</p>
        </div>
      </template>
    </el-upload>
  </div>
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
.upload-wrapper {
  position: relative;
}

.cv-tip {
  text-align: center;
  position: absolute;
  width: 100%;
  top: 0;
  background-color: transparent;

  textarea {
    border: none;
    outline: 0;
    width: 100%;
    height: 100%;
    resize: none;
    background: transparent;
    color: white;
    /* 或者是背景颜色，以隐藏文本 */
    caret-color: transparent;

    /* 隐藏光标 */
    &:focus+p {
      color: var(--el-color-success);
    }
  }

  p {
    position: absolute;
    pointer-events: none;
    left: 50%;
    top: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 14px;
  }
}

ul.el-upload-list,
:deep(ul.el-upload-list) {
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
}</style>
<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue';
import { ElMessage, type UploadInstance, type UploadProps, type UploadUserFile } from 'element-plus'
import { uploadFile as qiniuUploadFile } from '../utils/qiniu'
import { uploadFile as upyunUploadFile } from '@/utils/upyun';
import { useFocus } from '@vueuse/core';
import { useConfigStore, useImageStore } from '@/store'
import { storeToRefs } from 'pinia';
import { useUploadConfig } from '@/composables';
import { compressImage } from '@/utils/file';

const imageStore = useImageStore()
const configStore = useConfigStore()
const { qiniu, upyun, config } = storeToRefs(configStore)

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
const cacheConfig = useUploadConfig()

watch(files, async () => {
  for (const file of files.value) {
    // 上传
    if (file.status === 'ready') {
      file.status = 'uploading'

      if (!file.raw) {
        continue
      }
      let fileRaw = file.raw
      if (cacheConfig.value.compressImage) {
        // TODO: 未来开放自定义调整
        // 采取自动压缩策略
        fileRaw = await compressImage(file.raw) as any
      }

      const p = config.value?.type === 'upyun' ?
        upyunUploadFile(fileRaw, upyun.value) :
        qiniuUploadFile(fileRaw, qiniu.value, {
          process(percent) {
            file.percentage = percent
            if (percent === 100) {
              file.status = 'success'
            }
          },
        })
      p.then(v => {
        file.status = 'success'
        // 列表里移除已经删除的
        files.value.splice(files.value.findIndex(f => f === file), 1)

        // 生成链接
        imageStore.addImage({
          url: v,
          name: file.name || 'image',
          file: fileRaw,
          size: fileRaw?.size || 0,
          originSize: fileRaw === file.raw ? 0 : file.raw?.size,
        })
      }).catch(err => {
        ElMessage.error(err)
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

:deep(ul.el-upload-list) {
  max-width: 666px;
  margin: 20px auto;
}
</style>
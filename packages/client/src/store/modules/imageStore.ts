import { defineStore } from 'pinia'

export interface IImage {
  url: string
  name: string
  file?: File
  date?: number
  size: number
  originSize?: number
}

const imgStore = defineStore('imgStore', {
  state: () => ({
    success: (JSON.parse(localStorage.getItem('upload-image') || '[]') || []) as IImage[],
  }),
  getters: {

  },
  actions: {
    addImage(img: IImage) {
      img.date = Date.now()
      this.success.unshift(img)
      // TODO: 使用其它的持久化存储，避免被清理或超出限制
      localStorage.setItem('upload-image', JSON.stringify(this.success, (key, value) => {
        if (key === 'file') {
          return
        }
        return value
      }))
    },
  },
})

export default imgStore

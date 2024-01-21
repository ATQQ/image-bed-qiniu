import { defineStore } from 'pinia'

export interface IImage { url: string, name: string, file?: File, date?: number }

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

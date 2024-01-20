import { defineStore } from 'pinia'

interface IImage { url: string, name: string, file?: File }
const imgStore = defineStore('imgStore', {
  state: () => ({
    success: [] as IImage[],
  }),
  getters: {

  },
  actions: {
    addImage(img: IImage) {
      this.success.push(img)
    },
  },
})

export default imgStore

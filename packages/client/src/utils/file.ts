// @ts-expect-error
import UPNG from 'upng-js'
interface CompressOptions {
  /**
   * 压缩质量（0-100）
   * @default 80
   */
  quality?: number
  /**
   * 压缩后更大是否使用原图
   * @default true
   */
  noCompressIfLarger?: boolean
  /**
   * 压缩后的新宽度
   * @default 原尺寸
   */
  width?: number
  /**
   * 压缩后新高度
   * @default 原尺寸
   */
  height?: number
}
async function compressImage(file: File, ops: CompressOptions = {}) {
  const { width, height, quality = 80, noCompressIfLarger = true } = ops
  const isPng = await isPNG(file)
  let newFile: File | null = null
  if (isPng) {
    const arrayBuffer = await getBlobArrayBuffer(file)
    const decoded = UPNG.decode(arrayBuffer)
    const rgba8 = UPNG.toRGBA8(decoded)
    const compressed = UPNG.encode(rgba8, width || decoded.width, height || decoded.height, convertQualityToBit(quality))
    newFile = new File([compressed], file.name, { type: 'image/png' })
  }

  if (!newFile) {
    return file
  }

  if (!noCompressIfLarger) {
    return newFile
  }

  return file.size > newFile.size ? newFile : file
}

/**
 * 计算压缩比例
 */
function calculateCompressionPercentage(originalSize: number, compressedSize: number) {
  if (originalSize === 0) {
    return 0
  }
  const percentageDecreased = ((originalSize - compressedSize) / originalSize) * 100
  return percentageDecreased.toFixed(2) // Returns the percentage with 2 decimal places
}

function getBlobArrayBuffer(file: Blob): Promise<ArrayBuffer> {
  return file.arrayBuffer()
}

async function isPNG(file: File) {
  const arraybuffer = await getBlobArrayBuffer(file.slice(0, 8))
  return signatureEqual(arraybuffer, [137, 80, 78, 71, 13, 10, 26, 10])
}

function signatureEqual(source: ArrayBuffer, signature: number[]) {
  const array = new Uint8Array(source)
  for (let i = 0; i < signature.length; i++) {
    if (array[i] !== signature[i]) {
      return false
    }
  }
  return true
}

function getImageDimensions(file: File): Promise<{ width: number, height: number }> {
  return new Promise ((resolve) => {
    const img = new Image()
    img.onload = function () {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = function () {
      resolve({ width: 0, height: 0 })
    }
    img.src = URL.createObjectURL(file)
  })
}

function convertQualityToBit(quality: number): number {
  let bit = 0
  if (quality > 100 || quality < 0) {
    bit = 0
  }
  else {
    bit = !quality ? 0 : quality * 256 * 0.01
  }
  return bit
}

export {
  compressImage,
  getImageDimensions,
  calculateCompressionPercentage,
}

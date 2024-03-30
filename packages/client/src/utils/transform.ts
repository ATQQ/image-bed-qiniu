export function dataURItoFile(dataURI: string, fileName: string) {
  const [dataDescription, base64Data] = dataURI.split(',')
  // 文件类型
  const mimetype = dataDescription.match(/:(.*?);/)?.[1]

  // 解码 base64 数据
  const decodedData = atob(base64Data)
  let n = decodedData.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = decodedData.charCodeAt(n)
  }

  return new File([u8arr], fileName, { type: mimetype })
}

export function formatSize(
  size: number,
  pointLength?: number,
  units?: string[],
) {
  let unit: any
  units = units || ['B', 'K', 'M', 'G', 'TB']
  // eslint-disable-next-line no-cond-assign
  while ((unit = units.shift()) && size > 1024) {
    size /= 1024
  }
  return (
    (unit === 'B'
      ? size
      : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
  )
}

export function createObjectURL(file: Blob) {
  return URL.createObjectURL(file)
}

/**
 * 计算压缩比例
 */
export function calculateCompressionPercentage(originalSize: number, compressedSize: number) {
  if (originalSize === 0) {
    return 0
  }
  const percentageDecreased = ((originalSize - compressedSize) / originalSize) * 100
  return percentageDecreased.toFixed(2) // Returns the percentage with 2 decimal places
}

export interface CompressOptions {
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

// 判断是否支持webp格式的图片
const isSupportWebp = false
//
// const image = new Image()
// image.onload = image.onerror = () => { isSupportWebp = image.width === 1 }
// image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='

/**
 * 封装对阿里云图片的操作(默认会压缩质量到80以及使用webp格式)
 *
 * 直接使用
 * XIU.getImgFormat('https://xiu-obs.obs.cn-south-1.myhuaweicloud.com/1553675971514.jpg')
 *
 * 假如想用点参数
 * XIU.getImgFormat('https://xiu-obs.obs.cn-south-1.myhuaweicloud.com/1553675971514.jpg?x-image-process=image/resize,w_750', '/quality,q_80/format,webp')
 *
 * 更多params参数请参考百度云官方文档
 * https://support.huaweicloud.com/fg-obs/obs_01_0224.html
 */
export default function (url, params = '') {
  if (!url) return ''
  if (!/quality/.test(params)) {
    // 没有设置质量, 那么默认给80, 但gif图片不设置, 不然就不动了
    params += '/quality,q_80'
  }
  if (!/format/i.test(params) && isSupportWebp) {
    // 如果没有设置格式,同时支持webp格式, 那么用webp
    params += '/format,webp'
  }
  if (!/interlace/.test(params)) {
    params += '/interlace,1'
  }
  params = 'x-image-process=image' + params
  return url.replace(/^http(s?)/i, 'https') + '?' + params
}

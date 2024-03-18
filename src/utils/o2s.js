/**
 * style对象转style字符串
 * 比如
 *  {
 *      fontSize: '30rpx',
 *      color   : '#ccc'
 *  }
 *
 * 转成
 * "font-size:30rpx;color:#ccc;"
 */

export default style =>
  _.transform(style, function (result, value, key) {
    result.push(_.kebabCase(key) + ':' + value + ';')
  }, [])
    .join('')

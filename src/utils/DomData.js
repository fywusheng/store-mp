 
/**
 *
 *
 * @param {*} number  第几位
 * @param {*} src 名片头像
 * @param {*} name 名片名字
 * @param {*} qrCodeUrl 小程序codeURL图片
 */
/**
下边的内容可以自己定义，这样就可以定制属于自己的海报了 
*/
// const wxml = (name, pic, c1, c2) =>`
// <view class="container">
// 	<image src="`+pic+`"  class="pic"/>
// 	<text class="name">`+ name +`</text>
// 	<text class="content">`+ c1 +`</text>
// 	<text class="content">`+ c2 +`</text>
// 	<view class="bottom">
// 		<image src="`+pic+`"  class="qr"/>
// 		<text class="msg">扫码一起加入学习吧</text>
// 	</view>
// </view>
// `

const wxml = (name, age, code, c2) =>`

<view class="container">
  <image
  class="pic"
  src="https://ggllstatic.hpgjzlinfo.com/static/home/member-card-bg.png"
  mode="scaleToFill"
  />
  <text class="info">持卡人：`+ name +`     年龄：`+ age +`</text>
  <text class="footer">NO.`+ code +`  </text>
</view>
`
 
/**
 *
 *
 * @param {*} screenWidth 屏幕宽度
 * @param {*} canvasWidth  画布宽度
 * @param {*} canvasHeight  画布高度
 * @param {*} numberWidth  数字宽度，动态设置
 * @return {*} 
 */
const style = (screenWidth, canvasWidth, canvasHeight) => {
  return {
    "container": {
      width: canvasWidth,
      height: canvasHeight,
      position: 'relative',
      overflow: 'hidden',
			// backgroundColor: '#ffffff',
    },
    "info":{
      fontSize: 14,
      color: '#62291b',
      marginTop: canvasHeight * 0.55,
			textAlign: 'center',
    },
    "footer": {
			fontSize: 14,
			color: '#A63117',
      textAlign: 'right',
      paddingRight: canvasWidth * 0.08,
			marginLeft: canvasWidth * 0.18,
      marginTop: canvasHeight * 0.25,
    },
    "pic": {
      width: canvasWidth,
      height: canvasHeight,
      position: 'absolute',
      top: 0,
      left: '0',
			overflow: 'hidden',
    },
    "bottom":{
      width: canvasWidth,
      height: screenWidth * 0.2,
      flexDirection: 'row',
      justifyContent: 'self-start',
      alignItems: 'center',
			backgroundColor: '#fafafa',
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
		"qr": {
		  width: canvasWidth * 0.14,
		  height: screenWidth * 0.14,
		  marginLeft: canvasWidth * 0.04,
			marginRight: canvasWidth * 0.04,
		},
    "msg": {
      fontSize: 14,
      color: '#a1a1a1',
      width: canvasWidth * 0.74,
			height: 14,
			textAlign: 'left'
    },
  }
}
 
module.exports = {
  wxml,
  style
}
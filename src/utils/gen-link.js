import Bridge from './bridge'

export default async function (link) {
  let result
  switch (link.type) {
    case 'item':
      Bridge.goItem(link.id)
      break
    case 'couponCenter':
      Bridge.goCouponCenter()
      break
    case 'coupon':
      wx.showLoading({
        title: '正在领取...'
      })
      result = await Axios.post('/coupon/receive', {
        couponId: link.codes
      })
      wx.hideLoading()
      console.info(result)
      if (result.code == 200) {
        wx.showToast({
          icon: 'none',
          title: result.msg
        })
      } else {
        wx.showToast(result.msg)
      }
      break
    case 'brand':
      Bridge.goBrand(link.id)
      break
    case 'topic':
      Bridge.goTopic(link.id)
      break
    case 'group':
      Bridge.goGroup(link.id)
      break
    case 'home':
      Bridge.goHome()
      break
    case 'category':
      Bridge.goCategory(link.id)
      break
    case 'cart':
      Bridge.goCart()
      break
    case 'userCenter':
      Bridge.goUserCenter()
      break
    case 'url':
      Bridge.goURL(link.url)
      break
  }
}

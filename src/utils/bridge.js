const Bridge = {
  // 跳转url
  goURL(url) {
    wx.navigateTo({
      url: '/sub-pages/index/webview/main?link=' + encodeURIComponent(url)
    })
  },
  goTopic(id) {
    wx.navigateTo({
      url: '/sub-pages/index/topic/main?id=' + id
    })
  },
  goItem(id) {
    wx.navigateTo({
      url: '/sub-pages/index/item/main?id=' + id
    })
  },
  goCouponCenter(id) {
    wx.navigateTo({
      url: '/sub-pages/index/coupon-center/main'
    })
  },
  goCategory(id) {
    wx.navigateTo({
      url: '/sub-pages/index/item-list/main?dispId=' + id
    })
  },
  goBrand(id) {
    wx.navigateTo({
      url: '/sub-pages/index/brand/main?id=' + id
    })
  },
  goGroup(id) {
    wx.navigateTo({
      url: '/sub-pages/index/item-list/main?planId=' + id
    })
  },
  goCart() {
    wx.navigateTo({
      url: '/sub-pages/index/index/main?index=3'
    })
  },
  goUserCenter() {
    wx.navigateTo({
      url: '/sub-pages/index/index/main?index=4'
    })
  },
  goHome() {
    wx.navigateTo({
      url: '/sub-pages/index/index/main'
    })
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/user-center/login'
    })
  }
}
export default Bridge

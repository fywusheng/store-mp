export default {
  onShareAppMessage(res) {
    return {
      title: '优待权益一站办、智能适老跨鸿沟，积分惠老享服务！',
      path: '/pages/index/index',
      imageUrl: 'http://192.168.1.187:10088/static/common/icon-share.png',
      success(res) {
        uni.showToast({
          title: '分享成功'
        })
      },
      fail(res) {
        uni.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '优待权益一站办、智能适老跨鸿沟，积分惠老享服务！',
      path: '/pages/index/index',
      imageUrl: 'http://192.168.1.187:10088/static/common/icon-share.png',
      success(res) {
        uni.showToast({
          title: '分享成功'
        })
      },
      fail(res) {
        uni.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    }
  }

}

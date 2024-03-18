import Vue from 'vue'

const uniapp = {
  /**
   * 封装 uni.showToast
   * @param {String|Object} toast toast 信息
   */
  showToast(toast) {
    const object =
      typeof toast === 'string'
        ? { title: toast }
        : typeof toast === 'object'
          ? toast
          : {}
    if (!object.title) return
    uni.showToast({
      title: object.title,
      icon: object.icon || 'none',
      image: object.image,
      mask: object.mask || true,
      duration: object.duration || 1500
    })
  },
  /**
   * 封装 uni.hideToast
   */
  hideToast() {
    uni.hideToast()
  },
  /**
   * 封装 uni.showLoading
   * @param {String|Object} loading loading 信息
   */
  showLoading(loading) {
    const object =
      typeof loading === 'string'
        ? { title: loading }
        : typeof loading === 'object'
          ? loading
          : { title: '' }
    uni.showLoading({
      title: object.title,
      mask: object.mask || true
    })
  },
  /**
   * 封装 uni.hideLoading
   */
  hideLoading() {
    uni.hideLoading()
  },
  /**
   * 封装 uni.showModal 实现 alert 弹窗
   * @param {String|Object}} alert alert 信息
   */
  showAlert(alert) {
    const object =
      typeof alert === 'string'
        ? { content: alert }
        : typeof alert === 'object'
          ? alert
          : {}
    if (!object.content) return
    uni.showModal({
      title: object.title || '提示',
      content: object.content,
      showCancel: false,
      confirmText: object.confirmText || '确定',
      confirmColor: object.confirmColor || '#ff5000',
      success: (res) => {
        if (res.confirm) { typeof object.confirm === 'function' && object.confirm() }
      }
    })
  },
  /**
   * 封装 uni.showModal 实现 confirm 弹窗
   * @param {Object} confirm confirm 信息
   */
  showConfirm(confirm) {
    if (typeof confirm !== 'object' || !confirm.content) return
    const object = confirm
    uni.showModal({
      title: object.title || '提示',
      content: object.content,
      showCancel: true,
      cancelText: object.cancelText || '取消',
      cancelColor: object.cancelColor || '#333333',
      confirmText: object.confirmText || '确定',
      confirmColor: object.confirmColor || '#ff5000',
      success: (res) => {
        if (res.confirm) {
          typeof object.confirm === 'function' && object.confirm()
        } else {
          typeof object.cancel === 'function' && object.cancel()
        }
      }
    })
  },
  /**
   * 封装 uni.showActionSheet
   * @param {Object} action action sheet 信息
   */
  showActions(actions) {
    if (typeof actions !== 'object') return
    const object = actions
    uni.showActionSheet({
      itemList: object.items,
      itemColor: object.color || '#000000',
      success: (res) => {
        typeof object.confirm === 'function' && object.confirm(res.tapIndex)
      }
    })
  },
  /**
   * 封装 uni.setNavigationBarTitle
   * @param {String} title 导航栏标题
   */
  setTitle(title) {
    if (!title || typeof title !== 'string') return
    uni.setNavigationBarTitle({
      title: title
    })
  },
  /**
   * px 单位转 rpx 单位
   * @param {Number} px 待转换的 px 单位
   * @returns 转换后的 rpx 单位
   */
  pxToRpx(px) {
    const screenWidth = uni.getSystemInfoSync().screenWidth
    return (px * 750) / screenWidth
  },
  /**
   * rpx 单位转 px 单位
   * @param {Number} rpx 待转换的 rpx 单位
   * @returns 转换后的 rpx 单位
   */
  rpxToPx(rpx) {
    const screenWidth = uni.getSystemInfoSync().screenWidth
    return (rpx * screenWidth) / 750
  },
  /**
   *  封装检查更新
   */
  checkUpdate() {
    const manager = uni.getUpdateManager()
    manager.onCheckForUpdate((res) => {
      if (!res.hasUpdate) return
      this.showToast('检测到新版本，正在更新')
    })
    manager.onUpdateReady((res) => {
      this.showAlert({
        content: '新版本已更新完成，即将重启小程序',
        confirm: () => {
          manager.applyUpdate()
        }
      })
    })
    manager.onUpdateFailed((res) => {
      console.log('新版本下载失败')
    })
  },
  /**
   * 微信小程序 token
   */
  getCode() {
    uni.getProvider({
      service: 'oauth',
      success: (res) => {
        uni.login({
          provider: res.provider,
          success: (res) => {
            console.log(res.code)
          }
        })
      }
    })
  }
}

Vue.prototype.$uni = uniapp

module.exports = uniapp


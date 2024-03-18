/*
* wx
*/
function isFunction(value) {
  return Object.prototype.toString.call(value) === '[object Function]'
}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

const wxSdk = {
  init: function () {
    const request = wx.request
    Object.keys(wx).forEach(key => {
      const tempFunc = wx[key]
      this[key] = tempFunc
      if (isFunction(tempFunc) && !/Sync$/.test(key) && !/create/.test(key)) {
        Object.defineProperty(this, key, {
          value(config) {
            if (isFunction(config)) {
              tempFunc(config)
              return false
            }
            config = config || {}
            return new Promise(resolve => {
              const success = config.success; const fail = config.fail
              config.success = function (result) {
                console.log(result)
                resolve(result)
                success && success(result)
              }
              config.fail = function (result) {
                console.log(result)
                resolve(result)
                fail && fail(result)
              }
              tempFunc(config)
            })
          },
          writable: true
        })
      }
    })
    Object.defineProperty(this, 'request', {
      value(config) {
        config = config || {}
        return new Promise(resolve => {
          console.info(config.data)
          const success = config.success; const fail = config.fail
          config.success = function (result) {
            success && success(result)
            resolve(result)
          }
          config.fail = function (result) {
            fail && fail(result)
            resolve(result)
          }
          request(config)
        })
      },
      writable: true
    })
    const showLoading = wx.showLoading
    Object.defineProperty(this, 'showLoading', {
      value(config) {
        if (isObject(config)) {
          showLoading(config)
        } else {
          showLoading({
            title: config || '加载中...'
          })
        }
      }
    })
    const showToast = wx.showToast
    Object.defineProperty(this, 'showToast', {
      value(config) {
        if (isObject(config)) {
          config.duration = config.duration || 3000
          showToast(config)
        } else {
          showToast({
            title: config,
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
    const showModal = wx.showModal
    Object.defineProperty(this, 'showModal', {
      value(config) {
        config.confirmColor = '#111111'
        config.cancelColor = '#777777'
        return new Promise(resolve => {
          const success = config.success; const fail = config.fail
          config.success = function (result) {
            success && success(result)
            resolve(result)
          }
          config.fail = function (result) {
            fail && fail(result)
            resolve(result)
          }
          showModal(config)
        })
      }
    })
  }
}
export default wxSdk

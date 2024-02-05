// 封装请求
export function request({
  url,
  method = 'post',
  header = {},
  data = {},
  showsLoading = false,
  contentType = true,
  common = false // 第三方请求标志
}) {
  const headers = {
    'channel': uni.getSystemInfoSync().app,
    'Accept': 'application/json',
    'accessToken': uni.getStorageSync('token'),
    'tsf-metadata': ''
  }

  const body = {
    appId: '19E179E5DC29C05E65B90CDE57A1C7E5',
    version: '1.0.0',
    encType: 'plain',
    transType: 'get.authcode.data',
    encData: 'sd',
    signType: 'plain',
    signData: 'sdfasfdasf',
    timestamp: 201802231423897,
    extra: {},
    data
  }

  const baseURL = ENV.BASE_API

  const request = {
    url: url.indexOf('http') === -1 ? baseURL + url : url,
    method: method,
    header: { ...headers, ...header },
    data: method === 'get' ? data : body
  }

  return new Promise((resolve, reject) => {
    // 显示 loading
    if (showsLoading) {
      uni.showLoading({ title: '加载中' })
    }

    uni.request({
      ...request,
      success: (response) => {
        // 处理请求结果
        if ([600001, 600002, 600003, 600016].includes(response.data.code)) {
          Store.dispatch('logout')
          uni.navigateTo({
            url: '/pages/user-center/login'
          })
          return
        }
        if (response.statusCode === 200) {
          if (common) {
            // 这里通过第三方接口是没有data层的数据需要返回上一层的数据
            const result = response.data
            resolve(result)
          } else {
            const result = response.data
            if (result.code === 0) {
              resolve(result.data)
            } else {
                // 统一提示
                console.log('result: ', result)
                uni.showToast({
                  title: result.message

                })
                reject(result)
            }
          }
        } else {
           // 统一提示
           uni.showToast({
            title: '服务繁忙，请稍后再试'
          })
          reject(response)
        }
      },
      fail: (error) => {
        uni.showToast({
          title: error.data.message || '网络故障，请稍后重试',
          icon: 'none'
        })
        resolve(error)
      },
      complete: () => {
        // 隐藏加载
        uni.hideLoading()
        resolve()
      }
    })
  })
}

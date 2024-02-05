Axios.defaults.baseURL = ENV.API

Axios.interceptors.request.use(request => {
  const headers = {
    'content-type': 'application/json',
    'accessToken': uni.getStorageSync('token'),
    'channel': uni.getSystemInfoSync().app
  }
  request.headers = Object.assign(headers, request.headers)
  return request
})

// 请求响应拦截器
Axios.interceptors.response.use(
  response => {
    // 处理请求结果
    if (response.data.code === '1001') {
      Store.dispatch('logout')
      uni.navigateTo({
        url: '/pages/user-center/login'
      })
      return
    }

    return response.data
  },
  error => {
    // Do something with response error
    return Promise.reject(error)
  }
)

// 用Axios的适配器把通讯转换为底层的微信request api
Axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: config.baseURL + config.url,
      data: Object.assign({
        deviceNumber: uni.getStorageSync('deviceNumber'),
        sessionId: uni.getStorageSync('sessionId')
      }, (config.data ? JSON.parse(config.data) : config.params)),
      header: config.headers,
      method: config.method,
      success(res) {
        resolve({
          config,
          headers: res.header,
          status: res.statusCode,
          data: res.data,
          cookies: res.cookies
        })
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

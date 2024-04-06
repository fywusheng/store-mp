import { showLoading, hideLoading, showToast } from '@/utils/uni'
export function request({
  port, //开发版本域名区分
  url,
  method = 'post',
  header = {},
  data = {},
  showsLoading = false,
  success,
  fail,
  complete,
  contentType = true,
  common = false
}) {
  if (!url) return
  // 显示 loading
  if (showsLoading) showLoading('加载中')

  const headers = {
    'Accept': 'application/json',
    'accessToken': uni.getStorageSync('token'),
    'tsf-metadata': ''
  }
  // headers["referer"] = 'origin';
  // content-type 不设置或设置为空时, 会自动设置为 application/json, 但是接口对请求做了校验, content-type 不能设置为 application/json, 否则会报错
  // 原因:有的是要求必须 json, 有的要求要为空, 有的要求不为空但是也不能是 json
  // headers["content-type"] = "woyebuzhidaoweishenmejiekouyaozhemezuo";
  if (contentType) {
    // headers["content-type"] = "woyebuzhidaoweishenmejiekouyaozhemezuo";
  }

  let body = {
    ...data
  }
  
  let baseURL =  ENV.BASE_API
  if(port==1){
	 baseURL =  ENV.BASE_1
  }else if(port==2){
	  baseURL =  ENV.BASE_2
  }else if(port == 3){
	   baseURL =  ENV.BASE_3
      body = {
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
  }
  // const baseURL = ENV.BASE_API
  
 
  const request = {
    url: url.indexOf('http') === -1 ? baseURL + url : url,
    method: method,
    header: { ...headers, ...header },
    data: method === 'get' ? data : body
  }

  uni.request({
    ...request,
    success: (response) => {
      //  隐藏 loading
      if (showsLoading) hideLoading()
      // 处理请求结果
      if (response.data.code === 600001 || response.data.code === 600002 || response.data.code === 600003 || response.data.code === 600016) {
        // showToast("登录过期");
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
          success(result)
        } else {
          const result = response.data
          if (result.code == 0 || result.code == 200) {
            success(result.data)
          } else {
            // 如果传入了 fail 回调则调用 fail 回调, 否则统一提示
            if (fail) {
              // 调用 fail 回调
              fail(result)
            } else {
              // 统一提示
              showToast(result.message ? result.message: result.msg )
            }
          }
        }
      } else {
        // 如果传入了 fail 回调则调用 fail 回调, 否则统一提示
        if (fail) {
          // 调用 fail 回调
          fail({ message: response.statusCode })
        } else {
          // 统一提示
          showToast('服务繁忙，请稍后再试')
        }
      }
    },
    fail: (error) => {
      //  隐藏 loading
      if (showsLoading) hideLoading()
      // 如果传入了 fail 回调则调用 fail 回调, 否则统一提示
      if (fail) {
        // 调用 fail 回调
        fail(error)
      } else {
        // 统一提示
        showToast('服务繁忙，请稍后再试')
      }
    },
    complete: () => {
      // 调用 complete 回调
      if (complete) complete()
    }
  })
}

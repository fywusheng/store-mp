// 光华平台政务拆解tag枚举
// 政务，一网通办tag
export const CM_BIZ_TYPE_YWTB = 'h5SE'

// ***  更多行业拆解、办结标签 请 查询支付宝开放平台, 并按照业务场景在代码中定义代码常量    ****
// ***   https://opendocs.alipay.com/open/02v9ap ****

export async function _cmHookFunc(type, query) {
  // 设置为 LocalStorage模式
  // return _cmHookFuncTokenFromLocalStorage(type, query);

  // 设置为 js内存模式
  // return _cmHookFuncTokenFromMemory(type, query);

  // 设置为 无需传参的业务hook
  return defaultReport(type, query)
}
/**
 * 行业回流hook样例函数A
 */

// HOOK 1: 以下为使用LocalStorage方式演示，仅供参考，请根据您的业务情况具体适配
const DEMO_TOKE_KEY = 'x-my-token'
async function _cmHookFuncTokenFromLocalStorage(type, query) {
  return new Promise((resolve, reject) => {
    my.getStorage({
      key: DEMO_TOKE_KEY,
      success: ({ data, message }) => {
        console.log('>>>>>>> my.getStorage RESULT, ', data, message)

        let token = data
        if (data == null) {
          // TODO, 需要业务自行处理登录

          // demo我们使用立刻生成随机token做演示
          token = 'rnd-token-' + Math.abs(Math.ceil(Math.random() * 1000000))

          my.setStorage({
            key: DEMO_TOKE_KEY,
            data: token
          })
        }
        // 其他行业，请使用自定义的行业tag常量
        resolve({ tag: CM_BIZ_TYPE_YWTB, extQueryString: { token: token, demoKey1: 'v1', demoKey2: 'v2' }})
      },
      fail: (e) => {
        console.log('>>>>>  my.getStorage fail, ', e)
        reject(e)
      }
    })
  })
}

// HOOK 2: 以下为使用js memory方式演示，仅供参考，请根据您的业务情况具体适配
let userToken
async function _cmHookFuncTokenFromMemory(type, query) {
  return new Promise((resolve, reject) => {
    if (userToken == null) {
      // TODO, 需要业务自行处理登录
      // TODO, login

      // demo我们使用立刻生成随机token做演示
      userToken = '2-token-' + Math.abs(Math.ceil(Math.random() * 1000000))
    }
    // 其他行业，请使用自定义的行业tag常量
    resolve({ tag: CM_BIZ_TYPE_YWTB, extQueryString: { token: userToken, dk1: '001', dk2: '002' }})
  })
}

// HOOK 3: 无需传参的业务hook, 仅供参考，请根据您的业务情况具体适配
async function defaultReport(type, query) {
  // 其他行业，请使用自定义的行业tag常量
  return { tag: CM_BIZ_TYPE_YWTB, extQueryString: {}}
}

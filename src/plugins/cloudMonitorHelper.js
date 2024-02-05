
export const CM_TYPE_H5 = 'h5'
export const CM_TYPE_NATIVE = 'native'

import  monitor  from './alipayLogger'
import queryString from 'querystring'

let myAppId = null

const defaultTag = 'h5SE'

/** 云监控hook回调函数原型 _cmHookFunc
 * 请求参数：
 *   type:             CM_TYPE_H5/CM_TYPE_NATIVE 上报的入口
 *   query:            请求的query参数
 *
 * 返回值:
 *   tag:              行业回流标记 参考 cm_constant.js 中预定义的标签（会随着业务扩充）
 *   extQueryString:   object 扩展拼接到H5 url访问地址的token等扩展参数
*/
let _cmHookFunc = async (type, query) => {
  return { tag: defaultTag, extQueryString: {}}
}

export function setCMHookFunc(f) {
  _cmHookFunc = f
}

export async function hookCloudMonitor(type, query) {
  return _cmHookFunc(type, query)
}

// 获取当前小程序appId
export function getMyMiniAppId() {
  if (myAppId == null) {
    myAppId = my.getAppIdSync().appId
  }

  return myAppId
}

// 小程序原生页面pv上报云监控
export async function reportCmPV(params) {
  const { tag } = await hookCloudMonitor(CM_TYPE_NATIVE, params)

  return _reportCmPV(params, tag)
}

export async function _reportCmPV({ title, query }, tag, h5Url) {
  const currentPage = getCurrentPages()[getCurrentPages().length - 1].route
  if (!title) {
    title = currentPage
  }

  const myAppId = getMyMiniAppId()

  let encodedUrl

  if (query && Object.keys(query).length > 0) {
    encodedUrl = encodeURIComponent(`${currentPage}?${queryString.stringify(query)}`)
  } else {
    encodedUrl = encodeURIComponent(`${currentPage}`)
  }

  const myUrl = `alipays://platformapi/startapp?appId=${myAppId}&page=${encodedUrl}`

  if (tag == null) {
    tag = defaultTag
  }

  const url = h5Url || currentPage

  monitor._lgPV({ page: title, url, c1: tag, c2: myUrl })
}

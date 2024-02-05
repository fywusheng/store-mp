import { request } from '@/apis/request'

export default {
  // 获取所有机构服务场所类型
  getOfficeTypes: function (args = {}) {
    request({
      url: '/eac/orgOffice/getOfficeTypes',
      method: 'post',
      contentType: false,
      ...args
    })
  },

  // 根据服务场所类型获取附近的服务场所
  getEcOrgOfficeInfoByPoint: function (args = {}) {
    request({
      url: '/nun/api/userCollect/getEcOrgOfficeInfoByPoint',
      method: 'post',
      // contentType: false,
      ...args
    })
  },

  // 根据服务场所id获取对应的服务场所
  getEcOrgOfficeInfoById: function (args = {}) {
    request({
      url: '/nun/api/userCollect/getEcOrgOfficeInfoById',
      method: 'post',
      // contentType: false,
      ...args
    })
  },
  // 首页 服务详情
  getOfficeInfoById: function (args = {}) {
    request({
      url: '/eac/orgOffice/getOfficeInfoById',
      method: 'post',
      ...args
    })
  },
  // 位置信息收藏
  saveCollect: function (args = {}) {
    request({
      url: '/nun/api/userCollect/saveCollect',
      method: 'post',
      ...args
    })
  },

  // 位置信息收藏更新
  updateCollect: function (args = {}) {
    request({
      url: '/nun/api/userCollect/updateCollect',
      method: 'post',
      ...args
    })
  },

  // 位置信息收藏展示列表
  findListByParmas: function (args = {}) {
    request({
      url: '/nun/api/userCollect/findListByParmas',
      method: 'post',
      ...args
    })
  },

  // 地图检索功能key值是高德注册的密匙北京编码110000 //逆地理编码
  // 文档地址https://lbs.amap.com/api/webservice/guide/api/newpoisearch
  regeoMap: function (data = {}, args = {}) {
    request({
      url: `https://restapi.amap.com/v3/geocode/regeo?key=ce15f988d6859314ea4748d9cc867e43&location=${data.location}`,
      method: 'get',
      common: true,
      ...args
    })
  },

  // 地图检索功能key值是高德注册的密匙北京编码110000 //关键字搜索
  // 文档地址https://lbs.amap.com/api/webservice/guide/api/newpoisearch
  searchMap: function (data = {}, args = {}) {
    const url = encodeURI(`https://restapi.amap.com/v3/place/text?key=ce15f988d6859314ea4748d9cc867e43&location=${data.location}&keywords=${data.keywords}&offset=${data.offset}&city=${data.city}&extensions=all&sortrule=weight&types=${data.types}&radius=${data.radius}`)
    request({
      url: url,
      method: 'get',
      common: true,
      ...args
    })
  },

  // 地图检索功能key值是高德注册的密匙北京编码110000 //周边搜索
  // https://lbs.amap.com/api/webservice/guide/api/search#around
  aroundMap: function (data = {}, args = {}) {
    const url = `https://restapi.amap.com/v3/place/around?key=ce15f988d6859314ea4748d9cc867e43&location=${data.location}&keywords=${data.keywords}&offset=${data.offset}&city=${data.city}&extensions=all&sortrule=distance&types=${encodeURIComponent(data.types)}&radius=${data.radius}&page=${data.page ? data.page : 1}`
    console.log('接口data：', data)
    request({
      url: encodeURI(url),
      method: 'get',
      common: true,
      ...args
    })
  },

  // 地图检索功能key值是高德注册的密匙北京编码110000 //多边形搜索
  // https://lbs.amap.com/api/webservice/guide/api/search#around
  polygonMap: function (data = {}, args = {}) {
    const url = `https://restapi.amap.com/v3/place/polygon?key=ce15f988d6859314ea4748d9cc867e43&polygon=${data.polygon}&keywords=${data.keywords}&types=${data.types}`
    console.log('接口data：', data)
    request({
      url: encodeURI(url),
      method: 'get',
      common: true,
      ...args
    })
  }
}

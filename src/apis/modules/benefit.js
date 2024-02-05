import { request } from '@/apis/request'

export default {
  // 养老机构列表
  getBedeHouseList: function (args = {}) {
    request({
      url: '/offlineshopping/etirementHome/pageList',
      ...args
    })
  },
   // 养老机构详情
  getBedeHouseInfo: function (args = {}) {
    request({
      url: '/offlineshopping/etirementHome/selectById',
      ...args
    })
  },
  // 旅游产品列表
  getTriplist: function (args = {}) {
    request({
      url: '/offlineshopping/tourism/selectPage',
      ...args
    })
  },
  // 旅游产品详情
  getTripInfo: function (args = {}) {
    request({
      url: '/offlineshopping/tourism/selectOne',
      ...args
    })
  }
}

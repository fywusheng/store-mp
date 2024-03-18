import { request } from '@/apis/request'

export default {
  // 惠老服务一级分类
  getFirstClass: function (args = {}) {
    request({
      url: '/eac/olderService/getFirstClass',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 惠老服务二级分类
  getSecondClass: function (args = {}) {
    request({
      url: '/eac/olderService/getSecondClass',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 惠老服务列表
  getOfficeByTypeWithPage: function (args = {}) {
    request({
      url: '/eac/orgOffice/getOfficeByTypeWithPage',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 惠老服务热门服务
  findHotService: function (args = {}) {
    request({
      url: '/eac/orgOffice/findHotService',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 老年人权益保障法
  selectSeniorRights: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/selectSeniorRights',
      method: 'get',
      ...args
    })
  },
  // 维权服务数量
  findCountForRights: function (args = {}) {
    request({
      url: '/cms/upholdRights/findCount',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 维权服务电话
  getPhoneNumByType: function (args = {}) {
    request({
      url: '/cms/upholdRights/getPhoneByType',
      header: { 'content-type': 'application/json' },
      ...args
    })
  }

}


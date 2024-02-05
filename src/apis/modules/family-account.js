import { request } from '@/apis/request'

export default {
  // 获取亲情账号列表
  findFamilyMemberList: function(args = {}) {
    request({
      url: '/nun/api/family/findFamilyMemberList',
      method: 'post',
     // contentType: false,
      ...args
    })
  },

  // 查询绑定亲情账户的赡养抚养人列表
  findFamilyUser: function(args = {}) {
    request({
      url: '/nun/api/support/findFamilyUser',
      method: 'post',
     // contentType: false,
      ...args
    })
  },

  // 通过有手机添加亲情关系
  addFamilyInfoByTel: function(args = {}) {
    request({
      url: '/nun/api/family/addFamilyInfoByTel',
      method: 'post',
     // contentType: false,
      ...args
    })
  },
  // 无手机添加亲情关系
  addIdCardFamily: function(args = {}) {
    request({
      url: '/nun/api/family/addIdCardFamily',
      method: 'post',
      // header: { "content-type": "application/json" },
     contentType: false,
      ...args
    })
  },

  // 解除绑定关系
  removeFamily: function(args = {}) {
    request({
      url: '/nun/api/family/removeFamilyFromApplet',
      method: 'post',
     // contentType: false,
      ...args
    })
  },

  // 情亲 发送短信
  retryFamilyInfo: function(args = {}) {
    request({
      url: '/nun/api/family/retryFamilyInfo',
      method: 'post',
     // contentType: false,
      ...args
    })
  }

}

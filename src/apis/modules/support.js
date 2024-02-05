import { request } from '@/apis/request'

export default {
  // 赡养抚养列表
  findUserSupport: function(args = {}) {
    request({
      url: '/nun/api/support/findUserSupport',
      method: 'post',
     // contentType: false,
      ...args
    })
  },
  // 根据条件获取所有亲情关系（关系类型 (01-我赡养的 02-赡养我的 11-我抚养的 12-抚养我的),
  relationListByParam: function(args = {}) {
    request({
      url: '/nun/api/family/relationListByParam',
      method: 'post',
      ...args
    })
  },
  // 新增编辑抚养关系
  addUserSupport: function(args = {}) {
    request({
      url: '/nun/api/support/addOrEditUserSupport',
      method: 'post',
      ...args
    })
  },
  // 查询是否已添加过赡养
  findUserIsAddSup: function(args = {}) {
    request({
      url: '/nun/api/support/findUserIsAddSup',
      method: 'post',
      ...args
    })
  }

}

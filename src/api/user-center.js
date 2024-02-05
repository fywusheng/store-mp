import { request } from '@/utils/request'

export default {
  // 查询遗嘱证信息
  getWillInfoByPhone: function(args = {}) {
    return request({
      url: '/nun/api/testament/selectByPhone',
      ...args
    })
  }
}

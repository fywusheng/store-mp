import { request } from '@/apis/request'

export default {
  // 获取城市列表
  getCities: function (args = {}) {
    request({
      url: '/common/cusc/api/usersearch/getRegnNamebyLV?level=1',
      method: 'get',
      ...args
    })
  },
  // 身份证识别
  getIdentification: function (args = {}) {
    request({
      url: '/common/auc/imgbase64',
      method: 'post',
      ...args
    })
  }
}

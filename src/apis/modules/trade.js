import { request } from '@/apis/request'

export default {
  // 获取行业列表
  getTradeList: function (args = {}) {
    request({
      url: '/common/api/recruitment/getCategoryTree',
      ...args
    })
  },
  // 获取岗位列表
  getJobList: function (args = {}) {
    request({
      url: '/common/api/postRegistration/getPostList',
      ...args
    })
  },
  // 岗位详情
  jobDetail: function (args = {}) {
    request({
      url: '/common/api/postRegistration/getPostDetailById',
      ...args
    })
  }
}

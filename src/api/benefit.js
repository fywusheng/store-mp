import { request } from '@/utils/request'

export default {
  // 根据父级分类编码查询子集
  getListByParentCode: function(args = {}) {
    return request({
      url: '/category/getListByParentCode',
      ...args
    })
  }
}

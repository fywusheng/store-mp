import { request } from '@/apis/request'

export default {
  // 校验购物车是否有已下架或已售罄商品
  checkOrderSettlementFromCart: function (args = {}) {
    request({
      url: '/offlineshopping/order/checkOrderSettlementFromCart',
      ...args
    })
  }

}

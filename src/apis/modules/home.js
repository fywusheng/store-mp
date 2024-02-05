import { request } from '@/apis/request'

export default {

  // 获取首页通知公告
  getBulletins: function (args = {}) {
    request({
      url: '/ngcmn/wbst/msg/selectHomeSysAnno',
      data: { pageNum: 1, pageSize: 3 },
      ...args
    })
  },
  // 获取首页轮播图
  getBanners: function (args = {}) {
    request({
      url: '/cms/api/open/app/qryBannerForApp',
      data: { status: 1 },
      ...args
    })
  },
  // 获取首页便捷服务数据
  getConvenientServices: function (args = {}) {
    request({
      url: '/cms/cmc/queryServerList',
      ...args
    })
  },
  // 获取首页惠老推荐数据
  getRecommandedArticles: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/queryRecommList',
      ...args
    })
  },
  // 获取服务页服务数据
  getServices: function (args = {}) {
    request({
      url: '/cms/cmc/queryServerListByType',
      // 这个接口一定要传这个, 不然会接收不到参数(我也不知道为什么, 反正后端就是这么会玩)
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取发现页文章数据
  getArticles: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/selectCmsContPageByColId',
      // 这个接口一定要传这个, 不然会接收不到参数(我也不知道为什么, 反正后端就是这么会玩)
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取文章详情
  getArticleDetail: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/queryRecommByDTO',
      // 这个接口一定要传这个, 不然会接收不到参数(我也不知道为什么, 反正后端就是这么会玩)
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 辟谣列表接口
  getRumorDetail: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/selectRumorByDTO',
      ...args
    })
  },
  // 收藏文章列表
  findArticleCollectList: function (args = {}) {
    request({
      url: '/nun/api/userCollect/findArticleCollectList',
      method: 'post',
      ...args
    })
  },
  // 取消收藏
  updateCollect: function (args = {}) {
    request({
      url: '/nun/api/userCollect/updateCollect',
      method: 'post',
      ...args
    })
  },
  // 商户收藏
  findBusinessCollectList: function (args = {}) {
    request({
      url: '/nun/api/userCollect/findBusinessCollectList',
      method: 'post',
      ...args
    })
  },
  // 品牌商家列表
  getSupermarketList: function (args = {}) {
    request({
      url: '/offlineshopping/supermarket/querySupermarket',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取app设置参数
  getAppParams: function (args = {}) {
    request({
      url: '/cms/iep/web/cms/cmscont/getRealNameAuth',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 金刚区
  selectWarriors: function (args = {}) {
    request({
      url: '/offlineshopping/warriors/selectWarriors',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 猜你喜欢
  getProductList: function (args = {}) {
    request({
      url: '/offlineshopping/mt/getProductList',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 医院详情
  getInfos: function (args = {}) {
    request({
      url: '/offlineshopping/hospital/getInfos',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 订单tab
  getOrderDictList: function (args = {}) {
    request({
      url: '/offlineshopping/orderDict/getOrderDictList',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 酒店列表
  gethotelList: function (args = {}) {
    request({
      url: '/offlineshopping/hotelDiscount/list',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 酒店详情数据字典
  getHotelDic: function (args = {}) {
    request({
      url: '/offlineshopping/hotel/getHotelDic',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 酒店信息动态查询服务
  dynamicQuery: function (args = {}) {
    request({
      url: '/offlineshopping/hotel/dynamicQuery',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 酒店详情查询
  queryByDiscountId: function (args = {}) {
    request({
      url: '/offlineshopping/hotelDiscount/queryByDiscountId',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 保险
  insuranceList: function (args = {}) {
    request({
      url: '/offlineshopping/insurance/getInfos',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 酒店home
  queryHotels: function (args = {}) {
    request({
      url: '/offlineshopping/hotel/queryHotels',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 酒店homeDetail
  queryHotelsinsert: function (args = {}) {
    request({
      url: '/offlineshopping/hotelDiscount/queryDiscountByHotel',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 看病详情
  getDetailInfos: function (args = {}) {
    request({
      url: '/offlineshopping/hospital/getDetailInfos',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 微医跳转url
  getInquiryReturnUrl: function (args = {}) {
    request({
      url: '/offlineshopping/inquiry/getInquiryReturnUrl',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 客服电话
  getWyCustomerService: function (args = {}) {
    request({
      url: '/offlineshopping/inquiry/getWyCustomerService',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 米粒商城商品列表
  getMiliProductList: function (args = {}) {
    request({
      url: '/offlineshopping/mili/findRandomProduct',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 根据token获取用户信息及收货地址zhy
  getUserAndAddress: function (args = {}) {
    request({
      url: '/nun/api/userPerson/getUserAndAddress',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 保险订单列表
  getInsuranceOrderList: function (args = {}) {
    request({
      url: '/offlineshopping/insurance/getInsuranceListByUId',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 判断用户是否已加积分
  checkIntegral: function (args = {}) {
    request({
      url: '/nun/api/acct/checkIntegral',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 怡生养老自动注册
  syncUserInfoToYsh: function (args = {}) {
    request({
      url: '/nun/api/acct/syncUserInfoToYsh',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  }
}

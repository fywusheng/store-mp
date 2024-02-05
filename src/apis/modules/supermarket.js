import { request } from '@/apis/request'

export default {
  // 获取 banner
  bannerForPay: function (args = {}) {
    request({
      url: '/cms/api/open/app/qryBannerForPay',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取品牌商家列表（有排序）
  getSupermarket: function (args = {}) {
    request({
      url: '/offlineshopping/supermarket/queryAllSupermarket',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 商超详情中的使用说明
  getUseInfo: function (args = {}) {
    request({
      url: '/offlineshopping/supermarket/queryUseInfo',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 商超详情中的注意事项
  getAttention: function (args = {}) {
    request({
      url: '/offlineshopping/supermarket/queryAttention',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },

  // 获取附近门店列表
  getNearStoreList: function (args = {}) {
    request({
      url: '/offlineshopping/supermarket/querySupermarket',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },

  // 获取商超数据（其它门店）
  getOtherMarket: function (args = {}) {
    request({
      url: '/offlineshopping/supermarketStore/pageQuerySupermarketStore',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 订单列表
  getOrderList: function (args = {}) {
    request({
      url: '/offlineshopping/order/findPage',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 订单详情
  getOrderInfo: function (args = {}) {
    request({
      url: '/offlineshopping/order/findDetail',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 提交开票申请
  submitInvoice: function (args = {}) {
    request({
      url: '/offlineshopping/invoice/submitInvoice',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 发送邮箱
  sendMailbox: function (args = {}) {
    request({
      url: '/offlineshopping/invoice/sendMailbox',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 查询发票数量（全部，开票中，已开票）
  getInvoiceNum: function (args = {}) {
    request({
      url: '/offlineshopping/invoice/getInvoiceNum',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 查询发票列表（全部，开票中，已开票）
  getInvoiceList: function (args = {}) {
    request({
      url: '/offlineshopping/invoice/selectInvoiceListByUserId',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 根据发票Id获取发票详情信息
  getInvoiceInfo: function (args = {}) {
    request({
      url: '/offlineshopping/invoice/selectInvoiceById',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 查询发票抬头列表
  getCompanyList: function (args = {}) {
    request({
      url: '/offlineshopping/invoiceHeader/selectInvoiceHeader',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 新增（修改）发票抬头
  handleUpdateOrAddHeader: function (args = {}) {
    request({
      url: '/offlineshopping/invoiceHeader/insertOrUpdateInvoiceHeader',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 删除发票抬头
  deleteInvoiceHeader: function (args = {}) {
    request({
      url: '/offlineshopping/invoiceHeader/deleteInvoiceHeader',
      header: { 'content-type': 'application/json' },
      ...args
    })
  }
}


import { request } from '@/apis/request'

export default {
  // CMS 视频统计
  updateClikCont(args) {
    request({
      url: '/cms/iep/web/cms/cmscont/updateClikCont',
      ...args
    })
  },
  // 米粒确认收货
  recvconfirm(args) {
    request({
      url: '/offlineshopping/mili/recvconfirm',
      ...args
    })
  },
  // 米粒取消订单
  orderCancelML(args) {
    request({
      url: '/offlineshopping/mili/orderCancel',
      ...args
    })
  },
  // 米粒详情
  detailData: function (args = {}) {
    request({
      url: '/offlineshopping/mili/selectByOrderNo',
      ...args
    })
  },
  // 新增酒店订单
  putHotelOrder: function (args = {}) {
    request({
      url: '/offlineshopping/order/saveOrUpdate',
      ...args
    })
  },
  // 米粒继续付款
  continuePayOrder: function (args = {}) {
    request({
      url: '/offlineshopping/order/findOrderByThirdOrderNo',
      ...args
    })
  },
  // 申请退款
  submitRefund: function (args = {}) {
    request({
      url: '/offlineshopping/orderRefundRecord/submitRefund',
      ...args
    })
  },
  // 酒店详情
  getInfoByHotelId: function (args = {}) {
    request({
      url: '/offlineshopping/hotel/queryInfoByHotelId',
      ...args
    })
  },
  // 新版开票（兼容所有类型）
  submitInvoiceByType: function (args = {}) {
    request({
      url: '/offlineshopping/invoice/submitInvoiceByType',
      ...args
    })
  },
  // 科室列表
  getInquiryDepartList: function (args = {}) {
    request({
      url: '/offlineshopping/inquiry/getInquiryDepartList',
      ...args
    })
  },
  // 医生列表
  getIDoctorList: function (args = {}) {
    request({
      url: '/offlineshopping/inquiry/getInquiryDoctorList',
      ...args
    })
  },
  // 保险
  insuranceNewList: function (args = {}) {
    request({
      url: '/offlineshopping/insurance/getInfosV2',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 保单详情
  getInsuranceInfo: function (args = {}) {
    request({
      url: '/offlineshopping/insurance/getInsuranceDetail',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 取消订单-出行旅游
  cancelByOrderId: function (args = {}) {
    request({
      url: '/offlineshopping/order/cancelByOrderId',
      method: 'post',
      header: { 'content-type': 'application/json' },
      ...args
    })
  }
}

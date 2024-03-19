import { request } from '@/apis/request'

export default {
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
  }
}

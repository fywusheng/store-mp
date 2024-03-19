import { request } from '@/apis/request'

export default {
  // 创建支付码页面
  getPayCodePage: function (args = {}) {
    request({
      url: '/offlineshopping/upCard/createAuthCode',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },

  // 惠老钱包银行卡列表
  getBankList: function (args = {}) {
    request({
      url: '/offlineshopping/bankCardUseRecord/selectCardList',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },

  // 支付页面请求验证码
  sendSmsOnPay: function (args = {}) {
    request({
      url: '/offlineshopping/kltQuickPayment/sendSms',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },

  // 支付页面提交验证码
  confirmPay: function (args = {}) {
    request({
      url: '/offlineshopping/kltQuickPayment/confirmPay',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },

  // 更新银行卡顺序
  updateBankCardNo: function (args = {}) {
    request({
      url: '/offlineshopping/bankCardUseRecord/updateBankCard',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 根据银行卡号返回银行及账号信息
  getBankByCardByNo: function (args = {}) {
    request({
      url: '/offlineshopping/bindingBankCard/getBankByCard',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 根据银行卡号返回银行及账号信息
  getBankCardInfoByImage: function (args = {}) {
    request({
      url: '/common/auc/getBankCardInfoByImage',
      // header: { "content-type": "application/json" },
      ...args
    })
  },
  // 绑卡四要素认证，请求验证码
  getValidCodeForBindCard: function (args = {}) {
    request({
      url: '/offlineshopping/bindingBankCard/fourElementAuth',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 开通在现在付-提交验证码
  openOnlinePay: function (args = {}) {
    request({
      url: '/offlineshopping/bindingBankCard/signAgreement',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 银行卡详情
  getBankCardDetail: function (args = {}) {
    request({
      url: '/offlineshopping/bankCardUseRecord/selectBankCardInfo',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 银行卡解绑
  deleteBankCard: function (args = {}) {
    request({
      url: '/offlineshopping/bankCardUseRecord/deleteBankCard',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 微信支付宝预下单
  toPayment: function (args = {}) {
    request({
      url: '/offlineshopping/payment/toPayment',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取userid微信
  getOpenIdByCode: function (args = {}) {
    request({
      url: '/offlineshopping/payment/getOpenIdByCode',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 获取userid 支付宝
  getALIUserIdByCode: function (args = {}) {
    request({
      url: '/offlineshopping/payment/getALIUserIdByCode',
      header: { 'content-type': 'application/json' },
      ...args
    })
  },
  // 查询状态
  paymentStatusQuery: function (args = {}) {
    request({
      url: '/offlineshopping/payment/paymentStatusQuery',
      header: { 'content-type': 'application/json' },
      ...args
    })
  }
}


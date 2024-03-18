/**
 * 结算模块-积分
 */

const initState = {
  type: 1,
  addressId: null,
  invoice: null,
  couponId: null,
  coupon: null,
  remarkList: [],
  couponData: null,
  settlement: null,
  num: 0,
  skuId: null,
  useBalanceState: false
}

// function invoiceType(type) {
//   switch (type) {
//     case 0:
//       return '电子普通发票'
//     case 1:
//       return '增值专用发票'
//   }
// }

function invoiceTitle(type) {
  switch (type) {
    case 0:
      return '个人'
    case 1:
      return '单位'
  }
}

function invoiceContent(type) {
  switch (type) {
    case 1:
      return '服装、鞋帽'
    case 2:
      return '箱包'
    case 3:
      return '礼品、办公用品'
    case 4:
      return '订单商品明细'
  }
}

export default {
  namespaced: true,
  state: _.cloneDeep(initState),
  getters: {},
  mutations: {
    [VUEX.CHECKOUT_POINT.SET_SETTLEMENT](state, settlement) {
      state.settlement = settlement
    },
    [VUEX.CHECKOUT_POINT.SET_DIRECT_DATA](state, { num, skuId }) {
      state.num = num
      state.skuId = skuId
    },
    [VUEX.CHECKOUT_POINT.SET_ADDRESS](state, addressId) {
      if (addressId != state.addressId) {
        state.addressId = addressId
        // Store.dispatch('getCheckoutData')
      }
    },
    [VUEX.CHECKOUT_POINT.SET_TYPE](state, type) {
      state.type = type
    },
    [VUEX.CHECKOUT_POINT.SET_INVOICE](state, invoice) {
      invoice.showContent = invoiceTitle(invoice.applicantType) + '-' + invoiceContent(invoice.invoiceContent)
      state.invoice = invoice
    },
    [VUEX.CHECKOUT_POINT.SET_COUPON](state, coupon) {
      if (!state.coupon || coupon.id != state.coupon.id) {
        state.coupon = coupon
        state.couponId = coupon.id
        // Store.dispatch('getCheckoutData')
      }
    },
    [VUEX.CHECKOUT_POINT.SET_COUPON_DATA](state, couponData) {
      state.couponData = couponData
    },
    [VUEX.CHECKOUT_POINT.SET_REMARK](state, remarkList) {
      state.remarkList = remarkList
    },
    [VUEX.CHECKOUT_POINT.CHANGE_REMARK](state, { index, remark }) {
      state.remarkList[index].remark = remark
    },
    [VUEX.CHECKOUT_POINT.SET_BALANCE](state, useBalanceState) {
      state.useBalanceState = useBalanceState
      // Store.dispatch('getCheckoutData')
    },
    [VUEX.CHECKOUT_POINT.RESET_STATE](state) {
      state = _.cloneDeep(initState)
    }
  },
  actions: {
    // 去支付
    async toPay({ state }) {
      console.error('去支付调用可')
      if (!state.addressId) {
        wx.showToast('请选择收货地址...')
        return false
      }
      const params = {
        appId: 0,
        isUseBalanceState: state.useBalanceState,
        addressId: state.addressId
      }
      console.info(params)
      if (state.coupon && state.coupon.id) {
        params.couponId = state.couponId
      }
      const storeItem = []
      state.settlement.settleStoreList.forEach((store, index) => {
        storeItem.push({
          storeId: store.storeId,
          receiveRemark: state.remarkList[index].remark,
          couponId: store.couponId || 'null'
        })
      })
      params.storeItem = storeItem
      // params.usePoint = this.usePoint;
      if (state.invoice) {
        params.invoice = state.invoice
      }
      if (state.type === 2) {
        params.num = state.num
        params.skuId = state.skuId
      }
      wx.showLoading('订单正在提交...')
      const result = await Axios.post(state.type === 1 ? '/order/create' : '/order/create.direct', params)
      if (result.code === '200') {
        const payResult = await Axios.post('/payment/sign', {
          orderId: result.data.orderId,
          paymentMethodCode: 'nepsp_pay',
          code: new Date().getTime()
          // code: State.login.openid
        })
        wx.hideLoading()
        if (payResult.code === '200') {
          // 去收银台支付
          uni.reLaunch({
            url: '/pages/common/webpage?url=' + encodeURIComponent(result.data.payUrl)
          })
        }
      } else {
        wx.hideLoading()
        wx.showToast(result.msg || '创建订单失败')
      }
    },
    // 获取所有优惠券
    async getGlobalCoupon({ state, commit }) {
      const couponSettlementItemList = []
      state.settlement.settleStoreList.forEach(store => {
        store.settlementItems.forEach(cart => {
          const item = {}
          item.productId = cart.productId
          item.skuId = cart.skuId
          item.quantity = cart.quantity
          couponSettlementItemList.push(item)
        })
      })
      const params = { settlementItems: couponSettlementItemList }
      const couponResult = await Axios.post('/coupon/settlement/list', params)
      if (couponResult.code == 200 && couponResult.data) {
        commit(VUEX.CHECKOUT_POINT.SET_COUPON_DATA, couponResult.data)
      }
    },
    // 获取结算信息
    async getCheckoutData({ state, dispatch, commit }) {
      const params = {}
      if (state.addressId) {
        params.addressId = state.addressId
      }
      // console.info('useBalanceState:', state.useBalanceState)
      if (state.couponId) {
        params.couponId = state.couponId
      }
      if (state.type === 2) {
        params.num = state.num
        params.skuId = state.skuId
      }
      // params.useBalanceState = state.useBalanceState
      uni.showLoading()
      const result = await Axios.post(state.type === 1 ? '/order/settlement' : '/order/settlement.direct', params)
      uni.hideLoading()
      if (result.code == 200) {
        const remarkList = []
        result.data.settleStoreList && result.data.settleStoreList.forEach(store => {
          remarkList.push({
            storeId: store.storeId,
            remark: ''
          })
        })
        commit(VUEX.CHECKOUT_POINT.SET_REMARK, remarkList)
        commit(VUEX.CHECKOUT_POINT.SET_ADDRESS, result.data.addressId)
        commit(VUEX.CHECKOUT_POINT.SET_SETTLEMENT, result.data)
      } else {
        wx.showToast(result.result.message)
      }
      dispatch('getGlobalCoupon')
    }
  }
}

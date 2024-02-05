/**
 * 结算模块-适老用品
 */
import cloneDeep from 'lodash/cloneDeep'
import {  showToast } from '@/utils/uni'

const initState = {
  sceneType: '', // 场景
  checkScoreSkuIds: [], // 需用来抵扣积分的商品sku id集
  type: 1,
  addressId: null, // 地址 id
  isDefault: false, // 是否默认地址
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

export default {
  state: cloneDeep(initState),
  getters: {},
  mutations: {
    CHECKOUT_SET_IS_DEFAULT(state, isDefault) {
      state.isDefault = isDefault
    },
    CHECKOUT_CHANGE_SCORESKUIDS(state, { index, checked }) {
      state.checkScoreSkuIds[index].checked = checked
    },
    CHECKOUT_SET_SCORESKUIDS(state, checkScoreSkuIds) {
      state.checkScoreSkuIds = checkScoreSkuIds
    },
    CHECKOUT_SET_USEPOINT(state, { usePoint, index, subIndex }) {
      state.settlement.settleStoreList[index].settlementItems[subIndex].usePoint = usePoint
    },
    [VUEX.CHECKOUT.SET_SCENETYPE](state, sceneType) {
      state.sceneType = sceneType
    },
    [VUEX.CHECKOUT.SET_SETTLEMENT](state, settlement) {
      state.settlement = settlement
    },
    [VUEX.CHECKOUT.SET_DIRECT_DATA](state, { num, skuId }) {
      state.num = num
      state.skuId = skuId
    },
    [VUEX.CHECKOUT.SET_ADDRESS](state, addressId) {
      // if (addressId != state.addressId) {
      state.addressId = addressId
      // Store.dispatch('getCheckoutData')
      // }
    },
    [VUEX.CHECKOUT.SET_TYPE](state, type) {
      state.type = type
    },
    [VUEX.CHECKOUT.SET_INVOICE](state, invoice) {
      // invoice.showContent = invoiceTitle(invoice.applicantType) + '-' + invoiceContent(invoice.invoiceContent)
      invoice.showContent = invoice.typeName + '-' + invoice.invoiceHeaderName
      state.invoice = invoice
    },
    [VUEX.CHECKOUT.SET_COUPON](state, coupon) {
      if (!state.coupon || coupon.id != state.coupon.id) {
        state.coupon = coupon
        state.couponId = coupon.id
        // Store.dispatch('getCheckoutData')
      }
    },
    [VUEX.CHECKOUT.SET_COUPON_DATA](state, couponData) {
      state.couponData = couponData
    },
    CHECKOUT_RESET_COUPON(state) {
      state.coupon = null
      state.couponId = null
      state.couponData = null
    },
    [VUEX.CHECKOUT.SET_REMARK](state, remarkList) {
      state.remarkList = remarkList
    },
    [VUEX.CHECKOUT.CHANGE_REMARK](state, { index, remarks }) {
      state.remarkList[index] = remarks
    },
    [VUEX.CHECKOUT.SET_BALANCE](state, useBalanceState) {
      state.useBalanceState = useBalanceState
      // Store.dispatch('getCheckoutData')
    },
    [VUEX.CHECKOUT.RESET_STATE](state) {
      Object.keys(initState).map(key => {
        state[key] = initState[key]
      })
    }
  },
  actions: {
    async toPay({ state, dispatch }) {
      if (!state.addressId) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'error'
        })
        return false
      }
      const params = {
        appId: 0,
        isUseBalanceState: state.useBalanceState,
        addressId: state.addressId,
        sceneType: state.sceneType,
        checkScoreSkuIds: state.checkScoreSkuIds,
        usePoint: state.checkScoreSkuIds.length > 0

      }

      if (state.coupon && state.coupon.id) {
        params.couponId = state.couponId
      }
      const storeItem = []
      state.settlement.settleStoreList.forEach((store, index) => {
        storeItem.push({
          storeId: store.storeId,
          receiveRemark: state.remarkList[index],
          couponId: store.couponId || 'null'
        })
      })
      params.storeItem = storeItem
      params.orderRemarksList = state.remarkList
      // params.usePoint = this.usePoint;
      if (state.invoice) {
        params.invoiceId = state.invoice.invoiceHeaderId
      }
      if (state.type === 2) {
        params.num = state.num
        params.skuId = state.skuId
      }
      console.info(params)
      uni.showLoading({ title: '订单正在提交...' })
      const result = await Axios.post(state.type === 1 ? '/order/create' : '/order/create.direct', params)
      if (result.code === '200') {
        const payResult = await Axios.post('/payment/sign', {
          orderId: result.data.orderId,
          paymentMethodCode: 'nepsp_pay',
          code: new Date().getTime()
        })
        uni.hideLoading()
        if (payResult.code === '200') {
          // 去收银台支付
          uni.reLaunch({
            url: '/pages/common/webpage?url=' + encodeURIComponent(result.data.payUrl)
          })
        }
      } else {
        uni.hideLoading()
        uni.showToast({ title: result.msg || '创建订单失败', icon: 'none' })
        setTimeout(() => {
          dispatch('getCheckoutData', true)
        }, 1500)
      }
    },
    async getGlobalCoupon({ state, commit }) {
      const couponSettlementItemList = []
      state.settlement.settleStoreList && state.settlement.settleStoreList.forEach(store => {
        store.settlementItems.forEach(cart => {
          const item = {}
          item.productId = cart.productId
          item.skuId = cart.skuId
          item.quantity = cart.quantity
          item.discountAmount = cart.usePoint ? cart.discountScore * cart.quantity : 0
          couponSettlementItemList.push(item)
        })
      })
      if (!couponSettlementItemList.length) {
        commit('CHECKOUT_RESET_COUPON')
        return
      }
      const params = { settlementItems: couponSettlementItemList }
      const couponResult = await Axios.post('/coupon/settlement/list', params)
      if (couponResult.code == 200 && couponResult.data) {
        commit(VUEX.CHECKOUT.SET_COUPON_DATA, couponResult.data)
      }
    },
    async getCheckoutData({ state, dispatch, commit }, isFirst) {
      const params = {
        isFirst: !!isFirst,
        checkScoreSkuIds: state.checkScoreSkuIds,
        usePoint: state.checkScoreSkuIds.length > 0
      }
      if (state.addressId) {
        params.addressId = state.addressId
      }
      if (state.couponId) {
        params.couponId = state.couponId
      }
      if (state.sceneType) {
        params.sceneType = state.sceneType
      }
      if (state.type === 2) {
        params.num = state.num
        params.skuId = state.skuId
      }
      uni.showLoading({
        title: '加载中'
      })
      console.log(params, '参数---')

      const result = await Axios.post(state.type === 1 ? '/order/settlement' : '/order/settlement.direct', params)
      uni.hideLoading()
      if (result.code == 200) {
        const remarkList = []
        const checkScoreSkuIds = []
        result.data.settleStoreList && result.data.settleStoreList.forEach(store => {
          remarkList.push({
            storeId: store.storeId,
            remarks: ''
          })

          store.settlementItems && store.settlementItems.forEach(product => {
            // if (params.isFirst && product.usePoint) {
            if (product.usePoint) {
              checkScoreSkuIds.push(product.skuId)
            }
          })
        })
        commit(VUEX.CHECKOUT.SET_REMARK, remarkList)
        commit(VUEX.CHECKOUT.SET_ADDRESS, result.data.addressId)
        commit(VUEX.CHECKOUT.SET_SETTLEMENT, result.data)
        commit('CHECKOUT_SET_SCORESKUIDS', checkScoreSkuIds)

        // 获取地址列表
        let addressList = []
        const res = await Axios.get('/address/list')
        if (res.code == 200 && res.data) {
          addressList = res.data || []
          const selectAddressList = addressList.filter(el => el.isDefault === 1)
          if (selectAddressList[0].id === result.data.addressId) {
            commit('CHECKOUT_SET_IS_DEFAULT', true)
          } else {
            commit('CHECKOUT_SET_IS_DEFAULT', false)
          }
        } else {
          commit('CHECKOUT_SET_IS_DEFAULT', false)
        }
      } else {
        showToast(result.msg)
      }
      dispatch('getGlobalCoupon')
      return result
    }
  }
}

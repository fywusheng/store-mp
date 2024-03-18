<style lang="scss">
@import '~@/styles/base';

body {
  background-color: $gray;
}
.page-checkout {
  &.isIphoneHair {
    padding-bottom: rpx(182);
    .checkout-footer {
      padding-bottom: rpx(64);
      box-sizing: content-box !important;
    }
  }
  .empty {
    height: 300rpx;
  }
}
.userInfo {
  width: 500rpx;
}
.checkout-address {
  position: relative;
  padding: rpx(32);
  background-color: #fff;
  height: rpx(200);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36rpx;

  .add-tip {
    @include middle-center-x();
    font-size: rpx(36);
    text-align: center;
    color: #ff5500;
    left: 32rpx;
    transform: translateX(0);

    img {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: rpx(10);
      width: rpx(48);
      height: rpx(48);
      margin-right: 20rpx;
      margin-left: auto;
    }
  }

  .icon-you {
    @include middle-center-y();
    right: rpx(50);
    width: rpx(36);
    height: rpx(36);
    z-index: 100;
  }

  .user-info {
    display: flex;
    align-items: center;
    color: $black;
    line-height: rpx(40);

    .name {
      margin-right: rpx(32);
      max-width: rpx(300);
      font-weight: bold;
      font-size: 40rpx;
      // @include ellipsis();
      white-space: nowrap;
    }

    .phone {
      color: #666666;
      @include ellipsis();
    }
    .default-black {
      width: 96rpx;
      height: 48rpx;
      line-height: 48rpx;
      text-align: center;
      color: #ffffff;
      background: #ff2600;
      border-radius: 24rpx;
      font-size: 32rpx;
      margin-left: 32rpx;
    }
  }

  .address-info {
    position: relative;
    margin-top: rpx(30);
    line-height: rpx(34);
    color: #666666;
    @include ellipsis();
  }

  .icon-address {
    position: absolute;
    top: rpx(46);
    left: rpx(32);
    width: rpx(80);
    height: rpx(80);
  }

  .line {
    @include middle-center-x();
    bottom: 0;
    width: rpx(764);
    height: rpx(10);
  }
}

.item-list-wrap {
  margin-top: rpx(20);
  padding-bottom: rpx(10);
  background-color: #fff;
  &.unSelect {
    .item-list .item {
      .item-logo {
        filter: grayscale(50%);
      }
      .item-name,
      .item-price {
        color: #999999;
      }
    }
    .un-sale {
      color: #ff5000;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 44rpx;
      text-align: right;
    }
  }

  .store-name {
    padding: rpx(20) rpx(30);
    font-size: rpx(40);
    color: $black;
    border-bottom: rpx(1) solid $border;
    font-weight: 500;
  }

  .item-list {
    padding: rpx(30);

    .item {
      position: relative;
      margin-bottom: rpx(30);
      margin-top: 30rpx;
      padding-left: rpx(180);
      padding-right: rpx(20);
      height: rpx(160);

      &:last-child {
        margin-bottom: 0;
      }

      .item-logo {
        @include middle-center-y();
        left: 0;
        width: rpx(160);
        height: rpx(160);
        @include background-image();
        border: 1px solid #f1f1f1;
        background-size: 100% 100%;
      }
      .has-sale {
        @include middle-center-y();
        left: 0;
        width: rpx(160);
        height: rpx(160);
        line-height: 160rpx;
        text-align: center;
        font-size: 36rpx;
        font-weight: bold;
        color: #333333;
      }

      .item-name {
        font-size: rpx(36);
        line-height: rpx(50);
        color: #333333;
        @include ellipsis();
      }

      .sku-name {
        padding-top: rpx(20);
        font-size: rpx(32);
        color: #999999;
        @include text-line(1);
      }

      .number {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: rpx(32);
        color: #999999;
      }

      .item-price {
        font-size: rpx(40);
        color: #ff5500;
        font-weight: bold;
        span {
          margin-right: rpx(5);
          font-size: rpx(24);
        }
      }
    }
  }

  .point-wrap {
    height: 176rpx;
    border-top: 2rpx solid #eeeeee;
    border-bottom: 2rpx solid #eeeeee;
    .right {
      width: auto;
      float: right;
      margin-left: auto;
    }
  }

  .remark-wrap {
    display: flex;
    align-items: center;
    position: relative;
    font-size: rpx(36);
    margin-left: rpx(30);
    margin-right: rpx(30);
    height: 88rpx;
    border-bottom: 2rpx solid #eeeeee;
    &:last-child {
      border-bottom: none;
    }

    span {
      width: rpx(85);
      color: $black;
    }
    .right {
      width: auto;
      float: left;
      margin-left: auto;
    }

    input {
      display: block;
      width: rpx(635);
      height: rpx(88);
      line-height: rpx(88);
      color: $extra-light-black;
      padding-left: 48rpx;
      &::-webkit-input-placeholder {
        color: #999999;
      }
    }
  }
  .use-point {
    height: 88rpx;
    line-height: 88rpx;
    color: #999999;
    font-size: 36rpx;
    font-weight: 400;
    .point {
      color: #ff5500;
    }
  }
}

.info-list {
  margin-top: rpx(20);
  padding-left: rpx(30);
  background-color: #fff;
  font-size: 36rpx;

  .info {
    position: relative;
    display: flex;
    align-items: center;
    padding-right: rpx(30);
    height: rpx(100);
    border-bottom: rpx(1) solid #f1f1f1;

    .content {
      @include middle-center-y();
      right: rpx(80);
      color: $extra-light-black;
      max-width: rpx(400);
      @include ellipsis();
      font-family: Akrobat ExtraBold;
      &.red {
        color: #ff2600;
      }
    }

    .name {
      min-width: rpx(70);
      margin-right: rpx(50);
      color: $black;
      // font-weight: 500;

      &.point {
        font-size: rpx(28);
      }
    }

    .icon-you {
      @include middle-center-y();
      right: rpx(30);
      width: rpx(36);
      height: rpx(36);
    }
  }
}

.price-list {
  margin-top: rpx(20);
  padding: rpx(35) rpx(30);
  background-color: #fff;
  font-size: 36rpx;

  .price {
    position: relative;
    margin-bottom: rpx(35);

    &:last-child {
      margin-bottom: 0;
    }

    .title {
      color: $black;
    }

    .price-value {
      @include middle-center-y();
      right: 0;
      color: $extra-light-black;

      &.red {
        color: #ff2600;
      }
    }
  }
}
.pay-type-list {
  margin-top: 20rpx;
  padding-left: 30rpx;
  background-color: #fff;
  .pay-type {
    position: relative;
    display: flex;
    align-items: center;
    height: 100rpx;
    font-size: 26rpx;
    border-bottom: 1rpx solid #ddd;
    &:last-child {
      border-bottom: none;
    }
    .icon {
      width: 36rpx;
      height: 36rpx;
      margin-right: 15rpx;
    }
    .check-icon {
      @include middle-center-y();
      right: 30rpx;
      width: 40rpx;
      height: 40rpx;
      &.disabled {
        opacity: 0.4;
        background-color: #ddd;
      }
    }
    .switch-icon {
      @include middle-center-y();
      right: 20rpx;
    }
  }
}
.checkout-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0rpx -2rpx 0rpx 0rpx rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 24rpx 32rpx;
  box-sizing: border-box;
  .left {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .money {
      color: #ff5000;
    }
  }

  .total {
    font-size: rpx(40);
    color: $extra-light-black;
    .unit {
      margin-right: 5rpx;
      margin-left: rpx(20);
      font-family: Akrobat ExtraBold;
      color: #ff8800;
    }
    .total-price {
      font-size: rpx(38);
      color: #ff8800;
      font-weight: bold;
      font-family: Akrobat ExtraBold;
    }
  }

  .btn-account {
    // @include btn();
    width: 276rpx;
    height: 94rpx;
    background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
    border-radius: 47rpx;
    // margin-right: 32rpx;
    font-size: 40rpx;
    font-weight: 500;
    color: #ffffff;
    &.disabled {
      opacity: 0.6;
    }
  }
}
.address-footer {
  position: absolute;
  left: 0;
  top: -90rpx;
  width: 100%;
  height: 90rpx;
  font-size: 36rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #958356;
  line-height: 90rpx;
  padding: 0 36rpx;
  background: #fdf0d7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<template>

  <div v-if="!loading" class="page-checkout" :class="{isIphoneHair}">
    <div class="checkout-address" @click="selectAddress">
      <img class="icon-address" v-if="settlement.addressId"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/icon-address.png">
      <img class="icon-you"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/right.png">
      <view class="userInfo" v-if="settlement.addressId">
        <div class="user-info">
          <div class="name">{{settlement.receiveName}}</div>
          <div class="phone">{{settlement.receivePhone}}</div>
          <div v-if="isDefault" class="default-black">默认</div>
        </div>
        <div class="address-info">
          收货地址：{{(settlement.receiveProvinceName || '') + (settlement.receiveCityName || '') +
          (settlement.receiveAreaName || '') + (settlement.receiveDistrictName || '') + settlement.receiveAddress }}
        </div>
      </view>
      <template v-else>
        <div class="add-tip" @click.stop="selectAddress">
          <img src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/icon-plus.png">
          请选择收货地址
        </div>
      </template>
    </div>
    <div class="item-list-wrap" v-for="(store,index) in storeList" :key="index">
      <div class="store-name border-b">{{store.storeName}}</div>
      <ul class="item-list">
        <template v-for="(item,subIndex) in store.settlementItems">
          <li class="item" :key="subIndex">
            <div class="item-logo"
              :style="{backgroundImage: 'url('+(item.skuImgUrl?item.skuImgUrl:item.mainImgUrl)+')'}">
            </div>
            <div class="item-name">{{item.productName}}</div>
            <div class="sku-name">{{item.productAttributeStr}}</div>
            <div class="item-price"><span class="unit">¥</span>{{item.sellingPrice|formateNum}}
            </div>
            <div class="number">x{{item.quantity}}</div>
          </li>
          <div class="point-wrap" :key="subIndex">
            <view class="use-point">
              <span>积分</span>
              <switch class="right" color="#FF5500" :checked="item.usePoint"
                @change="switchChange($event, index, subIndex)" style="transform:scale(0.8)" />
              <div class="use-point">可用积分共<text class="point">{{settlement.availableScore}}</text>
                分，可抵<text class="point">¥{{item.discountScore*item.quantity}}</text>
              </div>
            </view>

          </div>
        </template>
      </ul>
      <div class="remark-wrap">
        <span>配送</span>
        <span class="right">快递¥{{store.freightAmount|formateNum}}</span>
      </div>
      <div class="remark-wrap">
        <span>备注</span>
        <input type="text" maxlength="32" placeholder="选填，请与商家协商并确认"
          @change="changeRemark($event, index, store)">
      </div>
    </div>
    <!-- 无法选购商品 -->
    <div v-if="showUnBuyProductList" class="item-list-wrap unSelect">
      <div class="store-name border-b">以下商品无法选购</div>
      <ul class="item-list">
        <!-- 已下架商品集合 -->
        <template v-for="(item,subIndex) in unSaleProductListForLowerShelf">
          <li class="item" :key="subIndex">
            <div class="item-logo" :style="{backgroundImage: 'url('+item.skuImgUrl+')'}"></div>
            <div class="item-name">{{item.productName}}</div>
            <div class="sku-name">{{item.productAttributeStr}}</div>
            <div class="item-price"><span class="unit">¥</span>{{item.sellingPrice|formateNum}}
            </div>
            <!-- <div class="number">x{{item.quantity}}</div> -->
          </li>
          <div class="un-sale" :key="subIndex">该商品已下架</div>
        </template>
        <!-- 不在该地区售卖商品集合 -->
        <template v-for="(item,subIndex) in unSaleProductListForArea">
          <li class="item" :key="subIndex">
            <div class="item-logo" :style="{backgroundImage: 'url('+item.skuImgUrl+')'}"></div>
            <div class="item-name">{{item.productName}}</div>
            <div class="sku-name">{{item.productAttributeStr}}</div>
            <div class="item-price"><span class="unit">¥</span>{{item.sellingPrice|formateNum}}
            </div>
            <!-- <div class="number">x{{item.quantity}}</div> -->
          </li>
          <div class="un-sale" :key="subIndex">该商品不在该地区售卖，请更换地址</div>
        </template>
        <!-- 售罄抢光商品集合 -->
        <template v-for="(item,subIndex) in unSaleProductListForStock">
          <li class="item" :key="subIndex">
            <div class="item-logo" :style="{backgroundImage: 'url('+item.skuImgUrl+')'}"></div>
            <div class="has-sale">已抢光</div>
            <div class="item-name">{{item.productName}}</div>
            <div class="sku-name">{{item.productAttributeStr}}</div>
            <div class="item-price"><span class="unit">¥</span>{{item.sellingPrice|formateNum}}
            </div>
            <!-- <div class="number">x{{item.quantity}}</div> -->
          </li>
        </template>
        <!-- 限购商品集合 -->
        <template v-for="(item,subIndex) in unSaleProductListForNum">
          <li class="item" :key="subIndex">
            <div class="item-logo" :style="{backgroundImage: 'url('+item.skuImgUrl+')'}"></div>
            <!-- <div class="has-sale">已抢光</div> -->
            <div class="item-name">{{item.productName}}</div>
            <div class="sku-name">{{item.productAttributeStr}}</div>
            <div class="item-price"><span class="unit">¥</span>{{item.sellingPrice|formateNum}}
            </div>
            <!-- <div class="number">x{{item.quantity}}</div> -->
          </li>
          <div class="un-sale" :key="subIndex">您已购买该商品，该商品每人限购1件</div>
        </template>

      </ul>
    </div>

    <ul class="info-list">
      <li class="info border-b" @click="toCoupon">
        <span class="name">卡券:</span>

        <template v-if="canuseList.length>0">
          <span class="content red" v-if="coupon">
            <span v-if="coupon.type==0">-¥{{coupon.denominationStr}}</span>
            <span v-else-if="coupon.type==1">{{coupon.denominationStr}}折</span>
          </span>
          <span class="content" v-else>{{canuseList.length}}张可用</span>
        </template>
        <template v-else>
          <span class="content">无可用</span>
        </template>
        <img class="icon-you"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/right-gray.png">

      </li>

      <li class="info border-b" @click="toInvoice">
        <span class="name">发票:</span>
        <span class="content">
          <template v-if="invoice">
            {{invoice.showContent}}
          </template>
          <template v-else>不开发票</template>
        </span>
        <img class="icon-you"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/right-gray.png">
      </li>
    </ul>
    <ul class="price-list">
      <li class="price">
        <div class="title">商品总价</div>
        <div class="price-value">¥{{settlement.totalAmountPrice|formateNum}}</div>
      </li>
      <li class="price">
        <div class="title">运费</div>
        <div class="price-value red">+¥{{settlement.totalFreightAmount|formateNum}}</div>
      </li>
      <li class="price">
        <div class="title">积分抵扣</div>
        <div class="price-value red">-¥{{settlement.discountCreditPoints |formateNum}}</div>
      </li>
      <li class="price" v-if="settlement.totalDiscountAmount > 0">
        <div class="title">优惠金额</div>
        <div class="price-value red">-¥{{settlement.totalDiscountAmount|formateNum}}</div>
      </li>
    </ul>
    <view class="empty"></view>

    <div class="checkout-footer">
      <div class="address-footer" v-if="settlement.receiveProvinceName">
        {{(settlement.receiveProvinceName || '') + (settlement.receiveCityName || '') +
          (settlement.receiveAreaName || '') + (settlement.receiveDistrictName || '') + settlement.receiveAddress }}
      </div>
      <view class="left">
        <div class="total">实付:<span class="unit">¥</span><span
            class="total-price">{{settlement.totalPayablePrice|formateNum}}</span></div>
      </view>
      <button type="button" class="btn-account" :class="{disabled: !storeList.length}"
        @click="account" :disabled="!storeList.length">确认订单</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CHECKOUT',
  data() {
    return {
      isIphoneHair: App.isIphoneHair,
      sceneType: '', // 场景
      loading: true,
      isInvoice: false,
      userPoint: false,
      userInfo: null,
      // canuseList: [],
      // notuseList: [],
      usePoint: false
    }
  },

  computed: {
    notuseList() {
      if (Store.state.checkout.couponData) {
        return Store.state.checkout.couponData.cannotUsedList || []
      }
      return []
    },
    canuseList() {
      if (Store.state.checkout.couponData) {
        return Store.state.checkout.couponData.canUsedList || []
      }
      return []
    },
    isDefault() {
      return Store.state.checkout.isDefault
    },
    showUnBuyProductList() {
      const settlement = Store.state.checkout.settlement
      if (!settlement) return false
      const unSaleProductListForStock = settlement.unSaleProductListForStock
      const unSaleProductListForArea = settlement.unSaleProductListForArea
      const unSaleProductListForNum = settlement.unSaleProductListForNum
      const unSaleProductListForLowerShelf = settlement.unSaleProductListForLowerShelf
      if (unSaleProductListForStock.length > 0 ||
        unSaleProductListForArea.length > 0 ||
        unSaleProductListForNum.length > 0 ||
        unSaleProductListForLowerShelf.length > 0) {
        return true
      } else {
        return false
      }
    },
    unSaleProductListForArea() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.unSaleProductListForArea
      }
      return []
    },
    unSaleProductListForStock() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.unSaleProductListForStock
      }
      return []
    },
    unSaleProductListForNum() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.unSaleProductListForNum
      }
      return []
    },
    unSaleProductListForLowerShelf() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.unSaleProductListForLowerShelf
      }
      return []
    },
    coupon() {
      return Store.state.checkout.coupon
    },
    type() {
      return Store.state.checkout.type
    },
    invoice() {
      return Store.state.checkout.invoice
    },
    settlement() {
      return Store.state.checkout.settlement || {}
    },
    storeList() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.settleStoreList
      }
      return []
    }
  },
  components: {},
  filters: {
    formateNum(num) {
      return num ? num.toFixed(2) : '0.00'
    }
  },
  methods: {
    // 使用积分
    async switchChange(e, index, subIndex) {
      // 设置是否使用积分
      Store.commit('CHECKOUT_SET_USEPOINT', {
        usePoint: e.detail.value,
        index,
        subIndex
      })
      // 设置sku集合列表
      const checkScoreSkuIds = []
      this.storeList.forEach(element => {
        element.settlementItems.forEach(item => {
          if (item.usePoint) {
            checkScoreSkuIds.push(item.skuId)
          }
        })
      })
      Store.commit('CHECKOUT_SET_SCORESKUIDS', checkScoreSkuIds)
      Store.commit('CHECKOUT_RESET_COUPON')
      // 重新结算
      const result = await Store.dispatch('getCheckoutData', false)
      console.log(result)
      if (result.code !== '200') {
        this.$uni.showToast(result.data)
        // 设置是否使用积分
        Store.commit('CHECKOUT_SET_USEPOINT', {
          usePoint: !e.detail.value,
          index,
          subIndex
        })
        // 设置sku集合列表
        const checkScoreSkuIds = []
        this.storeList.forEach(element => {
          element.settlementItems.forEach(item => {
            if (item.usePoint) {
              checkScoreSkuIds.push(item.skuId)
            }
          })
        })
        Store.commit('CHECKOUT_SET_SCORESKUIDS', checkScoreSkuIds)
      }
    },
    // async useBalanceSettlement(e) {
    //   this.isUseBalanceState = e.target.value
    //   Store.commit(VUEX.CHECKOUT.SET_BALANCE, e.target.value)
    // },
    setCoupon(data) {
      Store.commit(VUEX.CHECKOUT.SET_COUPON, data)
    },
    // changeBalance(){
    //   if(!this.useBalance && this.balance > 0){
    //     this.useBalance = true;
    //   }else{
    //     this.useBalance = false;
    //   }
    // },
    toCoupon() {
      wx.navigateTo({
        url: '/sub-pages/index/checkout-coupon/main'
      })
    },
    toInvoice() {
      uni.navigateTo({ url: '/pages/supermarket/company-list' })
    },
    toAddAddress() {
      wx.navigateTo({
        url: '/sub-pages/me/address-add/main?type=1'
      })
    },
    selectAddress() {
      wx.navigateTo({
        url: '/sub-pages/me/address-list/main?type=1'
      })
    },
    changeRemark(e, index, store) {
      Store.commit(VUEX.CHECKOUT.CHANGE_REMARK,
        {
          index,
          remarks: {
            remarks: e.mp.detail.value,
            storeId: store.storeId
          }
        })
    },
    account() {
      Store.dispatch('toPay')
    }
  },
  onUnload() {
    Store.commit(VUEX.CHECKOUT.RESET_STATE)
  },
  async onShow() {
    setTimeout(async () => {
      if (this.hasInit) return
      this.loading = true
      await Store.dispatch('getCheckoutData', true)
      this.loading = false
    }, 500)
  },
  async mounted() {
    this.hasInit = true
    if (!Store.getters.isLogin) {
      Store.dispatch('logout')
      uni.navigateTo({ url: '/pages/user-center/login' })
      // await Store.dispatch('login')
    }
    const type = this.$root.$mp.query.type
    this.sceneType = this.$root.$mp.query.sceneType
    Store.commit(VUEX.CHECKOUT.SET_TYPE, type - 0)
    Store.commit(VUEX.CHECKOUT.SET_SCENETYPE, this.sceneType)
    if (Store.state.checkout.type === 2) {
      Store.commit(VUEX.CHECKOUT.SET_DIRECT_DATA, {
        num: this.$root.$mp.query.num,
        skuId: this.$root.$mp.query.skuId
      })
    }
    if (Store.state.checkout.coupon) {
      Store.state.checkout.coupon = {}
    }
    this.loading = true
    await Store.dispatch('getCheckoutData', true)
    this.loading = false
    if (!Store.state.checkout.addressId) {
      uni.showModal({
        content: '您没有设置收货地址，请选择...',
        success: res => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/sub-pages/me/address-list/main?type=1'
            })
            // wx.navigateTo({
            //   url: '/sub-pages/me/address-add/main?type=1'
            // })
          }
        }
      })
    }
  }
}
</script>

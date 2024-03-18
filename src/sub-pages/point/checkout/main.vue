<style lang="scss">
@import '~@/styles/base';

body {
  background-color: $gray;
}
.page-checkout {
  padding-bottom: rpx(255);
  &.isIphoneHair {
    padding-bottom: rpx(182);
    .checkout-footer {
      padding-bottom: rpx(64);
      box-sizing: content-box !important;
    }
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
      @include ellipsis();
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
  }

  .store-name {
    padding: rpx(20) rpx(30);
    font-size: rpx(40);
    color: $black;
    border-bottom: rpx(1) solid $border;
    font-weight: 500;
  }

  .item-list {
    padding: rpx(38) rpx(30);

    .item {
      position: relative;
      margin-bottom: rpx(30);
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
    margin-left: rpx(30);
    margin-right: rpx(30);
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
  font-size: 32rpx;

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
    }

    .name {
      min-width: rpx(70);
      margin-right: rpx(50);
      color: $black;
      font-weight: 500;

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
  font-size: 32rpx;

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  @include middle-center-x(fixed);
  bottom: 0;
  width: 750rpx;
  height: 142rpx;
  background: #ffffff;
  box-shadow: 0rpx -2rpx 0rpx 0rpx rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding-left: 32rpx;
  .left {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .total {
    font-size: rpx(40);
    line-height: rpx(33);
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
    @include btn();
    width: 276rpx;
    height: 94rpx;
    background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
    border-radius: 47rpx;
    margin-right: 32rpx;
    font-size: 40rpx;
    font-weight: 500;
    color: #ffffff;
  }
}
.address-footer {
  position: fixed;
  left: 0;
  bottom: 142rpx;
  width: 750rpx;
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
  <div class="page-checkout" :class="{isIphoneHair}">
    <div class="checkout-address" @click="selectAddress">
      <img class="icon-address" v-if="settlement.addressId"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/icon-address.png">
      <img class="icon-you"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/right.png">
      <view class="userInfo" v-if="settlement.addressId">
        <div class="user-info">
          <div class="name">{{settlement.receiveName}}</div>
          <div class="phone">{{settlement.receivePhone}}</div>
          <div class="default-black">默认</div>
        </div>
        <div class="address-info">
          收货地址：{{(settlement.receiveProvinceName || '') + (settlement.receiveCityName || '') +
          (settlement.receiveAreaName || '') + (settlement.receiveDistrictName || '') + settlement.receiveAddress }}
        </div>
      </view>
      <template v-else>
        <div class="add-tip" @click.stop="toAddAddress">
          <img src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/icon-plus.png">
          请添加收货地址
        </div>
      </template>
    </div>
    <div class="item-list-wrap" v-for="(store,index) in storeList" :key="index">
      <div class="store-name border-b">{{store.storeName}}</div>
      <ul class="item-list">
        <li class="item" v-for="(item,subIndex) in store.settlementItems" :key="subIndex">
          <div class="item-logo" :style="{backgroundImage: 'url('+item.skuImgUrl+')'}"></div>
          <div class="item-name">{{item.productName}}</div>
          <div class="sku-name">{{item.productAttributeStr}}</div>
          <div class="item-price"><span class="unit">¥</span>{{item.sellingPrice|formateNum}}</div>
          <div class="number">x{{item.quantity}}</div>
        </li>
      </ul>
      <div class="remark-wrap">
        <span>配送</span>
        <span class="right">快递¥12.00</span>
      </div>
      <div class="remark-wrap">
        <span>备注</span>
        <input type="text" maxlength="32" placeholder="选填，请与商家协商并确认"
          @change="changeRemark($event, index)">
      </div>
      <div class="remark-wrap">
        <span>积分 </span>
        <switch class="right" color="#FF5500" :checked="usePoint" @change="switchChange"
          style="transform:scale(0.8)" />
        <!-- <span
          class="name point">可使用{{settlement.userPoint}}积分抵扣¥{{settlement.userPointPrice}}</span> -->
        <!-- <van-switch v-model="usePoint"></van-switch> -->
      </div>
      <div class="use-point">可用积分共<text class="point">994</text> 分，可抵<text class="point">¥8</text>
      </div>
    </div>
    <!-- 无法选购商品 -->
    <div class="item-list-wrap unSelect" v-for="(store,index) in storeList" :key="index">
      <div class="store-name border-b">以下商品无法选购</div>
      <ul class="item-list">
        <li class="item" v-for="(item,subIndex) in store.settlementItems" :key="subIndex">
          <div class="item-logo" :style="{backgroundImage: 'url('+item.skuImgUrl+')'}"></div>
          <div class="item-name">{{item.productName}}</div>
          <div class="sku-name">{{item.productAttributeStr}}</div>
          <div class="item-price"><span class="unit">¥</span>{{item.sellingPrice|formateNum}}</div>
          <div class="number">x{{item.quantity}}</div>
        </li>
      </ul>
    </div>

    <ul class="info-list">
      <li class="info border-b" @click="toCoupon">
        <span class="name">卡券:</span>
        <span class="content" v-if="coupon">{{coupon.name}}</span>
        <img class="icon-you"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/right-gray.png">
        <coupon-list @setCoupon="setCoupon" :canuseList="canuseList" :notuseList="notuseList"
          ref="coupon"></coupon-list>
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
      <li class="price" v-if="settlement.totalDiscountAmount > 0">
        <div class="title">优惠金额</div>
        <div class="price-value red">-¥{{settlement.totalDiscountAmount|formateNum}}</div>
      </li>
    </ul>
    <div class="address-footer">
      {{(settlement.receiveProvinceName || '') + (settlement.receiveCityName || '') +
          (settlement.receiveAreaName || '') + (settlement.receiveDistrictName || '') + settlement.receiveAddress }}
    </div>
    <div class="checkout-footer">
      <view class="left">
        <div class="total">实付:<span class="unit">¥</span><span
            class="total-price">{{settlement.pendingPaymentAmount|formateNum}}</span></div>
        <!-- <view class="youhui">预估返养老金--</view> -->
      </view>
      <button type="button" class="btn-account" @click="account">确认订单</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CHECKOUT',
  data() {
    return {
      isIphoneHair: App.isIphoneHair,
      loading: true,
      isInvoice: false,
      userPoint: false,
      // isUseBalanceState: false,
      userInfo: null,
      canuseList: [],
      notuseList: [],
      usePoint: false
      // balance: 0
    }
  },

  computed: {
    coupon() {
      return Store.state.checkoutPoint.coupon
    },
    type() {
      return Store.state.checkoutPoint.type
    },
    invoice() {
      return Store.state.checkoutPoint.invoice
    },
    settlement() {
      return Store.state.checkoutPoint.settlement || {}
    },
    storeList() {
      if (Store.state.checkoutPoint.settlement) {
        return Store.state.checkoutPoint.settlement.settleStoreList
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
    switchChange() {
      uni.showModal({
        title: '提示',
        content: '您的可用积分不足，请重新选择积分抵扣商品',
        cancelText: '否',
        confirmText: '是',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    },
    // async useBalanceSettlement(e) {
    //   this.isUseBalanceState = e.target.value
    //   Store.commit( 'checkoutPoint' + VUEX.CHECKOUT_POINT.SET_BALANCE, e.target.value)
    // },
    setCoupon(data) {
      Store.commit('checkoutPoint/' + VUEX.CHECKOUT_POINT.SET_COUPON, data)
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
      wx.navigateTo({
        url: '/sub-pages/index/checkout-invoice/main'
      })
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
    changeRemark(e, index) {
      Store.commit('checkoutPoint/' + VUEX.CHECKOUT_POINT.CHANGE_REMARK, { index, remark: e.mp.detail.value })
    },
    account() {
      Store.dispatch('checkoutPoint/toPay')
    }
  },
  onUnload() {
    Store.commit('checkoutPoint/' + VUEX.CHECKOUT_POINT.RESET_STATE)
  },
  async mounted() {
    if (!Store.getters.isLogin) {
      await Store.dispatch('login')
    }
    const type = this.$root.$mp.query.type
    Store.commit('checkoutPoint/' + VUEX.CHECKOUT_POINT.SET_TYPE, type - 0)
    if (Store.state.checkoutPoint.type === 2) {
      Store.commit('checkoutPoint/' + VUEX.CHECKOUT_POINT.SET_DIRECT_DATA, {
        num: this.$root.$mp.query.num,
        skuId: this.$root.$mp.query.skuId
      })
    }
    if (Store.state.checkoutPoint.coupon) {
      Store.state.checkoutPoint.coupon = {}
    }
    // this.isUseBalanceState = false
    // await Store.commit( 'checkoutPoint' + VUEX.CHECKOUT_POINT.SET_BALANCE, false)
    await Store.dispatch('checkoutPoint/getCheckoutData')
    // const walletAccount = await Axios.post('/member/wallet/getTotalBalance')
    // if (walletAccount.code == 200) {
    //   this.balance = walletAccount.data.balance
    // }
    if (!Store.state.checkoutPoint.addressId) {
      wx.showModal({
        content: '您没有设置收货地址，请选择...',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/sub-pages/me/address-add/main?type=1'
            })
          }
        }
      })
    }
  }
}
</script>

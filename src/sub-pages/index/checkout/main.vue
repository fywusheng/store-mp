<template>
  <div v-if="!loading" class="page-checkout">
    <div class="checkout-address" @click="selectAddress">
      <template v-if="settlement.addressId">
        <img
          class="icon-address"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/address-icon.png"
        />
        <view class="userInfo">
          <div class="user-info">
            <div class="name">{{ addressInfo }}</div>
          </div>
          <div class="address-info">
            {{ settlement.receiveName }} {{ settlement.receivePhone }}
          </div>
        </view>
      </template>
      <template v-else>
        <div class="add-tip" @click.stop="selectAddress">
          <image
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/checkout/icon-plus.png"
          />
          请选择收货地址
        </div>
      </template>
      <div v-if="isDefault" class="default-black">默认</div>
      <img
        class="icon-you"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/common/right.png"
      />
    </div>
    <div
      class="item-list-wrap"
      v-for="(store, index) in storeList"
      :key="index"
    >
      <div class="store-name border-b">{{ store.storeName }}</div>
      <ul class="item-list">
        <view v-for="(item, subIndex) in store.settlementItems" :key="subIndex">
          <li class="item">
            <div
              class="item-logo"
              :style="{
                backgroundImage:
                  'url(' +
                  (item.skuImgUrl ? item.skuImgUrl : item.mainImgUrl) +
                  ')',
              }"
            ></div>
            <div class="item-name">{{ item.productName }}</div>
            <div class="sku-name">{{ item.productAttributeStr }}</div>
            <div class="item-price">
              <span class="unit span">¥</span
              >{{ formateNum(item.sellingPrice) }}
            </div>
            <div class="number">x{{ item.quantity }}</div>
          </li>
          <div class="point-wrap">
            <view class="use-point">
              <span class="_span">是否积分抵扣</span>
              <switch
                class="right"
                color="#FF5500"
                :checked="item.usePoint"
                @change="switchChange($event, index, subIndex)"
                style="transform: scale(0.8)"
              />
              <div class="use-point">
                可用积分共<text class="point">{{
                  settlement.availableScore
                }}</text>
                分，可抵<text class="point"
                  >¥{{ item.discountScore * item.quantity }}</text
                >
              </div>
            </view>
          </div>
        </view>
      </ul>
      <div class="remark-wrap">
        <span class="span">配送</span>
        <!-- <span class="right">快递¥{{ store.freightAmount | formateNum }}</span> -->
        <span class="right">快递¥{{ store.freightAmount }}</span>
      </div>
      <div class="remark-wrap">
        <span class="span">备注</span>
        <input
          type="text"
          maxlength="32"
          placeholder="选填，请与商家协商并确认"
          @input="changeRemark($event, index, store)"
        />
      </div>
    </div>
    <!-- 无法选购商品 -->
    <div v-if="showUnBuyProductList" class="item-list-wrap unSelect">
      <div class="store-name border-b">以下商品无法选购</div>
      <ul class="item-list">
        <!-- 已下架商品集合 -->
        <view
          v-for="(item, subIndex) in unSaleProductListForLowerShelf"
          :key="subIndex"
        >
          <li class="item">
            <div
              class="item-logo"
              :style="{ backgroundImage: 'url(' + item.skuImgUrl + ')' }"
            ></div>
            <div class="item-name">{{ item.productName }}</div>
            <div class="sku-name">{{ item.productAttributeStr }}</div>
            <div class="item-price">
              <!-- <span class="unit">¥</span>{{ item.sellingPrice | formateNum }} -->
              <span class="unit span">¥</span>{{ item.sellingPrice }}
            </div>
            <!-- <div class="number">x{{item.quantity}}</div> -->
          </li>
          <div class="un-sale" :key="subIndex">该商品已下架</div>
        </view>
        <!-- 不在该地区售卖商品集合 -->
        <view
          v-for="(item, subIndex) in unSaleProductListForArea"
          :key="subIndex"
        >
          <li class="item">
            <div
              class="item-logo"
              :style="{ backgroundImage: 'url(' + item.skuImgUrl + ')' }"
            ></div>
            <div class="item-name">{{ item.productName }}</div>
            <div class="sku-name">{{ item.productAttributeStr }}</div>
            <div class="item-price">
              <span class="unit span">¥</span
              >{{ formateNum(item.sellingPrice) }}
            </div>
            <!-- <div class="number">x{{item.quantity}}</div> -->
          </li>
          <div class="un-sale">该商品不在该地区售卖，请更换地址</div>
        </view>
        <!-- 售罄抢光商品集合 -->
        <!-- unSaleProductListForStock -->
        <template
          v-for="(item, subIndex) in unSaleProductListForStock"
          :key="subIndex"
        >
          <li class="item">
            <div
              class="item-logo"
              :style="{ backgroundImage: 'url(' + item.skuImgUrl + ')' }"
            ></div>
            <div class="has-sale"></div>
            <div class="item-name">{{ item.productName }}</div>
            <div class="sku-name">{{ item.productAttributeStr }}</div>
            <div class="item-price">
              <!-- <span class="unit">¥</span>{{ item.sellingPrice | formateNum }} -->
              <span class="unit span">¥</span>{{ item.sellingPrice }}
            </div>
            <!-- <div class="number">x{{item.quantity}}</div> -->
          </li>
        </template>
        <!-- 限购商品集合 -->
        <view
          v-for="(item, subIndex) in unSaleProductListForNum"
          :key="subIndex"
        >
          <li class="item">
            <div
              class="item-logo"
              :style="{ backgroundImage: 'url(' + item.skuImgUrl + ')' }"
            ></div>
            <!-- <div class="has-sale">已抢光</div> -->
            <div class="item-name">{{ item.productName }}</div>
            <div class="sku-name">{{ item.productAttributeStr }}</div>
            <div class="item-price">
              <span class="unit span">¥</span
              >{{ formateNum(item.sellingPrice) }}
            </div>
            <!-- <div class="number">x{{item.quantity}}</div> -->
          </li>
          <div class="un-sale" :key="subIndex">
            您已购买该商品，该商品每人限购1件
          </div>
        </view>
      </ul>
    </div>

    <ul class="price-list">
      <view class="header">价格明细</view>
      <view class="line"></view>
      <li class="price" @click="toCoupon">
        <div class="title">优惠券</div>
        <div class="price-value">
          <template v-if="canuseList.length > 0">
            <span class="content red" v-if="coupon">
              <span v-if="coupon.type == 0"
                >-¥{{ coupon.denominationStr }}</span
              >
              <span v-else-if="coupon.type == 1"
                >{{ coupon.denominationStr }}折</span
              >
            </span>
            <span class="content" v-else>{{ canuseList.length }}张可用</span>
          </template>
          <template v-else>
            <span class="content">无可用</span>
          </template>
          <img
            class="icon-you"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/right-gray.png"
          />
        </div>
      </li>
      <li class="price" @click="toInvoice">
        <div class="title">发票</div>
        <div class="price-value">
          <template v-if="invoice">
            {{ invoice.showContent }}
          </template>
          <template v-else>不开发票</template>
          <img
            class="icon-you"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/right-gray.png"
          />
        </div>
      </li>
      <li class="price">
        <div class="title">商品总价</div>
        <div class="price-value">
          ¥{{ formateNum(settlement.totalAmountPrice) }}
        </div>
      </li>
      <li class="price">
        <div class="title">运费</div>
        <div class="price-value red">
          +¥{{ formateNum(settlement.totalFreightAmount) }}
        </div>
      </li>
      <li class="price">
        <div class="title">积分抵扣</div>
        <div class="price-value red">
          -¥{{ formateNum(settlement.discountCreditPoints) }}
        </div>
      </li>
      <li class="price" v-if="settlement.totalDiscountAmount > 0">
        <div class="title">优惠金额</div>
        <div class="price-value red">
          -¥{{ formateNum(settlement.totalDiscountAmount) }}
        </div>
      </li>
    </ul>
    <view class="empty"></view>

    <div class="checkout-footer">
      <div class="address-footer" v-if="settlement.receiveProvinceName">
        {{
          (settlement.receiveProvinceName || "") +
          (settlement.receiveCityName || "") +
          (settlement.receiveAreaName || "") +
          (settlement.receiveDistrictName || "") +
          settlement.receiveAddress
        }}
      </div>
      <view class="left">
        <div class="total">
          实付:<span class="unit">¥</span
          ><span class="total-price">{{
            formateNum(settlement.totalPayablePrice)
          }}</span>
        </div>
      </view>
      <button
        type="button"
        class="btn-account"
        :class="{ disabled: !storeList.length }"
        @click="account"
        :disabled="!storeList.length"
      >
        提交订单
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CHECKOUT",
  data() {
    return {
      isIphoneHair: App.isIphoneHair,
      sceneType: "", // 场景
      loading: true,
      isInvoice: false,
      userPoint: false,
      userInfo: null,
      // canuseList: [],
      // notuseList: [],
      usePoint: false,
      type: null,
    };
  },

  computed: {
    addressInfo() {
      const settlement = this.settlement;
      return (
        (settlement.receiveProvinceName || "") +
        (settlement.receiveCityName || "") +
        (settlement.receiveAreaName || "") +
        (settlement.receiveDistrictName || "") +
        settlement.receiveAddress
      );
    },
    notuseList() {
      if (Store.state.checkout.couponData) {
        return Store.state.checkout.couponData.cannotUsedList || [];
      }
      return [];
    },
    canuseList() {
      if (Store.state.checkout.couponData) {
        return Store.state.checkout.couponData.canUsedList || [];
      }
      return [];
    },
    isDefault() {
      return Store.state.checkout.isDefault;
    },
    showUnBuyProductList() {
      const settlement = Store.state.checkout.settlement;
      if (!settlement) return false;
      const unSaleProductListForStock = settlement.unSaleProductListForStock;
      const unSaleProductListForArea = settlement.unSaleProductListForArea;
      const unSaleProductListForNum = settlement.unSaleProductListForNum;
      const unSaleProductListForLowerShelf =
        settlement.unSaleProductListForLowerShelf;
      if (
        unSaleProductListForStock.length > 0 ||
        unSaleProductListForArea.length > 0 ||
        unSaleProductListForNum.length > 0 ||
        unSaleProductListForLowerShelf.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    unSaleProductListForArea() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.unSaleProductListForArea;
      }
      return [];
    },
    unSaleProductListForStock() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.unSaleProductListForStock;
      }
      return [];
    },
    unSaleProductListForNum() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.unSaleProductListForNum;
      }
      return [];
    },
    unSaleProductListForLowerShelf() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.unSaleProductListForLowerShelf;
      }
      return [];
    },
    coupon() {
      return Store.state.checkout.coupon;
    },
    type() {
      return Store.state.checkout.type;
    },
    invoice() {
      return Store.state.checkout.invoice;
    },
    settlement() {
      return Store.state.checkout.settlement || {};
    },
    storeList() {
      if (Store.state.checkout.settlement) {
        return Store.state.checkout.settlement.settleStoreList;
      }
      return [];
    },
  },
  components: {},
  methods: {
    formateNum(num) {
      return num ? num.toFixed(2) : "0.00";
    },
    // 使用积分
    async switchChange(e, index, subIndex) {
      // 设置是否使用积分
      Store.commit("CHECKOUT_SET_USEPOINT", {
        usePoint: e.detail.value,
        index,
        subIndex,
      });
      // 设置sku集合列表
      const checkScoreSkuIds = [];
      this.storeList.forEach((element) => {
        element.settlementItems.forEach((item) => {
          if (item.usePoint) {
            checkScoreSkuIds.push(item.skuId);
          }
        });
      });
      Store.commit("CHECKOUT_SET_SCORESKUIDS", checkScoreSkuIds);
      Store.commit("CHECKOUT_RESET_COUPON");
      // 重新结算
      const result = await Store.dispatch("getCheckoutData", false);
      console.log(result);
      if (result.code !== "200") {
        this.$uni.showToast(result.data);
        // 设置是否使用积分
        Store.commit("CHECKOUT_SET_USEPOINT", {
          usePoint: !e.detail.value,
          index,
          subIndex,
        });
        // 设置sku集合列表
        const checkScoreSkuIds = [];
        this.storeList.forEach((element) => {
          element.settlementItems.forEach((item) => {
            if (item.usePoint) {
              checkScoreSkuIds.push(item.skuId);
            }
          });
        });
        Store.commit("CHECKOUT_SET_SCORESKUIDS", checkScoreSkuIds);
      }
    },
    // async useBalanceSettlement(e) {
    //   this.isUseBalanceState = e.target.value
    //   Store.commit(VUEX.CHECKOUT.SET_BALANCE, e.target.value)
    // },
    setCoupon(data) {
      Store.commit(VUEX.CHECKOUT.SET_COUPON, data);
    },
    // changeBalance(){
    //   if(!this.useBalance && this.balance > 0){
    //     this.useBalance = true;
    //   }else{
    //     this.useBalance = false;
    //   }
    // },
    toCoupon() {
      if (this.canuseList.length === 0) return;
      uni.navigateTo({
        url: "/sub-pages/index/checkout-coupon/main",
      });
    },
    toInvoice() {
      uni.navigateTo({ url: "/pages/supermarket/company-list" });
    },
    toAddAddress() {
      uni.navigateTo({
        url: "/sub-pages/me/address-add/main?type=1",
      });
    },
    selectAddress() {
      uni.navigateTo({
        url: "/sub-pages/me/address-list/main?type=1",
      });
    },
    changeRemark(e, index, store) {
      Store.commit(VUEX.CHECKOUT.CHANGE_REMARK, {
        index,
        remarks: {
          remarks: e.mp.detail.value,
          storeId: store.storeId,
        },
      });
    },
    account() {
      Store.dispatch("toPay");
    },
  },
  onUnload() {
    Store.commit(VUEX.CHECKOUT.RESET_STATE);
  },
  async onShow() {
    setTimeout(async () => {
      if (this.hasInit) return;
      this.loading = true;
      await Store.dispatch("getCheckoutData", true);
      this.loading = false;
    }, 500);
  },
  async mounted() {
    this.hasInit = true;
    if (!Store.getters.isLogin) {
      Store.dispatch("logout");
      uni.navigateTo({ url: "/pages/user-center/login" });
      // await Store.dispatch('login')
    }
    const type = this.$scope.options.type;
    this.sceneType = this.$scope.options.sceneType;
    Store.commit(VUEX.CHECKOUT.SET_TYPE, type - 0);
    Store.commit(VUEX.CHECKOUT.SET_SCENETYPE, this.sceneType);
    if (Store.state.checkout.type === 2) {
      Store.commit(VUEX.CHECKOUT.SET_DIRECT_DATA, {
        num: this.$scope.options.num,
        skuId: this.$scope.options.skuId,
      });
    }
    if (Store.state.checkout.coupon) {
      Store.state.checkout.coupon = {};
    }
    this.loading = true;
    await Store.dispatch("getCheckoutData", true);
    this.loading = false;
    if (!Store.state.checkout.addressId) {
      uni.showModal({
        content: "您没有设置收货地址，请选择...",
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: "/sub-pages/me/address-list/main?type=1",
            });
          }
        },
      });
    }
  },
};
</script>

<style lang="scss">
body {
  background-color: #f7f7f7;
}
.page-checkout {
  background: #f2f2f2;
  padding-top: 32rpx;
  &.isIphoneHair {
    padding-bottom: rpx(182);
    .checkout-footer {
      padding-bottom: rpx(64);
      box-sizing: content-box !important;
    }
  }
  .empty {
    height: 262rpx;
  }
}
.userInfo {
  width: 376rpx;
}
.checkout-address {
  position: relative;
  padding: rpx(32) rpx(20);
  margin: 0 32rpx;
  margin-bottom: 32rpx;
  background-color: #fff;
  height: rpx(200);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 36rpx;
  border-radius: 16rpx;

  .add-tip {
    font-size: rpx(36);
    text-align: center;
    color: #ff5500;
    transform: translateX(0);

    .img {
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
    width: rpx(36);
    height: rpx(36);
    z-index: 100;
  }

  .default-black {
    z-index: 100;
    width: 96rpx;
    height: 48rpx;
    line-height: 48rpx;
    text-align: center;
    color: #ffffff;
    background: #ff2600;
    border-radius: 24rpx;
    font-size: 32rpx;
  }

  .user-info {
    display: flex;
    align-items: center;
    color: $color-black;
    line-height: rpx(40);

    .name {
      font-weight: bold;
      font-size: 40rpx;
      @include ellipsis();
      white-space: nowrap;
    }

    .phone {
      color: #666666;
      @include ellipsis();
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
    // @include middle-center-y();
    // left: rpx(20);
    width: rpx(80);
    height: rpx(80);
    margin-right: 24rpx;
    flex-shrink: 0;
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
  margin: 0 32rpx;
  border-radius: 16rpx;
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
    color: $color-black;
    border-bottom: rpx(1) solid #eeeeee;
    font-weight: 500;
  }

  .item-list {
    padding: 0 rpx(30);

    .item {
      position: relative;
      margin-bottom: rpx(30);
      margin-top: 30rpx;
      padding-left: rpx(180);
      padding-right: rpx(20);
      height: rpx(160);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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
        background: url("https://ggllstatic.hpgjzlinfo.com/static/images/cart/bug-none.png");
        background-size: 100% 100%;
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
        .span {
          margin-right: rpx(5);
          font-size: rpx(24);
        }
      }
    }
  }

  .point-wrap {
    height: 176rpx;
    // border-top: 2rpx solid #eeeeee;
    border-bottom: 2rpx solid #eeeeee;
    &:last-child {
      border-bottom: none;
    }
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

    .span {
      width: rpx(85);
      color: $color-black;
      flex-shrink: 0;
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
      color: $color-black;
      padding-left: 48rpx;
      font-size: 36rpx;
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
    position: relative;
    .right {
      @include middle-center-y();
      right: 0;
    }
    ._span {
      color: #333333;
    }
    .point {
      color: #ff5500;
    }
  }
}

.price-list {
  margin: 0 32rpx;
  margin-top: 32rpx;
  padding: rpx(35) rpx(30);
  background-color: #fff;
  font-size: 36rpx;
  border-radius: 16rpx;
  .header {
    height: 56rpx;
    font-size: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 56rpx;
  }
  .line {
    width: 690rpx;
    height: 2rpx;
    background: #eeeeee;
    margin: 16rpx 0;
    margin-left: -30rpx;
  }

  .price {
    position: relative;
    margin-bottom: rpx(35);

    &:last-child {
      margin-bottom: 0;
    }

    .title {
      color: $color-black;
    }

    .price-value {
      @include middle-center-y();
      right: 0;
      color: $color-black;
      display: flex;
      align-items: center;

      .content {
        color: $color-black;
        max-width: rpx(400);
        @include ellipsis();
        font-family: PingFangSC-Medium, PingFang SC;
        &.red {
          color: #ff2600;
        }
      }

      &.red {
        color: #ff2600;
      }
      .icon-you {
        width: rpx(36);
        height: rpx(36);
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
  height: 142rpx;
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
    color: $color-black;
    .unit {
      margin-right: 5rpx;
      margin-left: rpx(20);
      font-family: PingFangSC-Medium, PingFang SC;
      color: #ff5000;
    }
    .total-price {
      font-size: rpx(40);
      color: #ff5000;
      font-weight: bold;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }

  .btn-account {
    width: 276rpx;
    height: 94rpx;
    background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
    border-radius: 47rpx;
    font-size: 40rpx;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
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

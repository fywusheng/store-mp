<style lang="scss">
.app {
  background: #f5f5f5;
  padding-top: 32rpx;
  min-height: 100vh;
}
.cart-footer-block {
  height: 100rpx;
}

.cart-footer {
  position: fixed;
  bottom: 150rpx;
  left: 0;
  width: 750rpx;
  background-color: #ffffff;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 24rpx 0;

  .checkbox {
    display: flex;
    align-items: center;
    left: 30rpx;
    font-size: 26rpx;
    color: #666666;
    font-size: 36rpx;

    .icon-img {
      margin-right: 15rpx;
      width: 40rpx;
      height: 40rpx;
    }
  }

  .total {
    left: 170rpx;

    .total-txt {
      color: #333333;
    }
    .bold {
      font-weight: bold;
    }

    .total-price {
      font-size: 40rpx;
      line-height: 54rpx;
      color: #ff711a;
      font-weight: bold;
    }

    .coupon-price {
      font-size: 32rpx;
      color: #ff711a;
    }
  }

  .btn-account {
    @include btn();
    width: rpx(250);
    height: 94rpx;
    background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
    border-radius: 47px;
    font-size: 40rpx;
  }

  .btn-collect,
  .btn-delete {
    @include middle-center-y();
    right: 0;
    @include btn-block();
    width: rpx(250);

    &.disabled {
      background-color: #dadada;
    }
  }

  .btn-collect {
    right: rpx(250);
    background-color: $color-primary;

    &.disabled {
      border-right: 1px solid #fff;
    }
  }
}

.empty-wrap {
  @include middle-center();

  .l_empt {
    width: 444rpx;
    height: 228rpx;
    margin: 0 auto;
  }

  .icon-img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: rpx(150);
    height: rpx(220);
  }

  .desc {
    line-height: rpx(90);
    font-size: rpx(36);
    color: $color-grey;
    text-align: center;
  }

  .btn-home {
    @include btn-round();
    width: rpx(350);
    margin: 0 auto;
  }
}

.panel {
  margin: 32rpx;
  background: #ffffff;
  border-radius: 16rpx;
  &:first-child {
    margin-top: 0;
  }
  .panel-header {
    display: flex;
    align-items: center;
    padding: 28rpx 16rpx;
    border: 2rpx solid #f5f5f5;
    .icon-radio {
      width: 36rpx;
      height: 36rpx;
    }
    .icon-right {
      width: 38rpx;
      height: 38rpx;
    }
    .header-title {
      margin: 0 16rpx;
      font-size: 36rpx;
    }
  }
  .panel-body {
    padding: 28rpx 16rpx;
    .product-list {
      display: flex;
      align-items: center;
      margin-bottom: 42rpx;
      position: relative;
      &:last-child {
        margin-bottom: 0;
      }
      &.disabled {
        .product-item-right {
          .product-name,
          .product-price .price {
            color: #999999;
          }
        }
      }
      .radio-disabled {
        width: 36rpx;
        height: 36rpx;
        border-radius: 18rpx;
        background: #f2f2f2;
      }
      .btn-delete {
        position: absolute;
        top: 0;
        right: 0;
        width: 30rpx;
        height: 30rpx;
      }
      .icon-radio-no {
        width: 36rpx;
        height: 36rpx;
      }
      .product-img {
        width: 184rpx;
        height: 184rpx;
        margin: 0 16rpx;
        border-radius: 12rpx;
      }
      .product-item-right {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 180rpx;
        flex: 1;
        .product-name {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          width: 359rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .product-standards {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          width: 359rpx;
          @include text-line(1);
        }
        .product-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price {
            font-size: 40rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ff5500;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="app">
    <template v-if="isLogin">
      <template v-if="loading || itemList.length">
        <view class="panel" v-for="(el, index) in itemList" :key="index">
          <view class="panel-header">
            <image
              v-if="el.checked"
              @click="selectAllStore(el)"
              class="icon-radio"
              src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png"
              mode="scaleToFill"
            >
            </image>
            <image
              v-else
              @click="selectAllStore(el)"
              class="icon-radio"
              src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-default.png"
              mode="scaleToFill"
            >
            </image>
            <view class="header-title" @click="goStoreDetail(el)">{{
              el.storeName
            }}</view>
            <image
              class="icon-right"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/cart/icon-right.png"
              mode="scaleToFill"
            >
            </image>
          </view>
          <view class="panel-body">
            <view
              class="product-list"
              :class="{ disabled: el.soldOut }"
              v-for="(product, subIndex) in el.carts"
              :key="product.id"
            >
              <view v-if="product.soldOut">
                <image
                  v-if="product.checked"
                  class="icon-radio-no"
                  @click="changeCheck(product)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png"
                  mode="scaleToFill"
                >
                </image>
                <image
                  v-else
                  class="icon-radio-no"
                  @click="changeCheck(product)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-default.png"
                  mode="scaleToFill"
                >
                </image>
              </view>
              <view v-else class="radio-disabled"></view>

              <image
                v-if="!product.soldOut"
                class="product-img"
                src="https://ggllstatic.hpgjzlinfo.com/static/images/common/sale-out.png"
                mode="scaleToFill"
                @click="tolDetail(product)"
              ></image>
              <image
                v-else
                class="product-img"
                :src="product.imgUrl"
                mode="scaleToFill"
                @click="tolDetail(product)"
              ></image>

              <view class="product-item-right">
                <view class="product-name" @click="tolDetail(product)"
                  >{{ product.productName }}
                </view>
                <view class="product-standards" @click="tolDetail(product)"
                  >{{ product.skuName }}
                </view>
                <view class="product-price">
                  <view class="price">¥{{ formatNumber(product.price) }}</view>
                  <view class="step">
                    <uni-number-box
                      :value="product.num"
                      min="1"
                      :disabled="!product.soldOut"
                      @onChange="changeCarNum($event, product, index, subIndex)"
                    />
                  </view>
                </view>
              </view>
              <img
                class="btn-delete"
                mode="scaleToFill"
                src="https://ggllstatic.hpgjzlinfo.com/static/images/cart/delete.png"
                @click="deleteItem(product)"
              />
            </view>
          </view>
        </view>
        <div class="cart-footer-block"></div>
        <div v-if="itemList.length" class="cart-footer">
          <div class="checkbox" @click="changeSelectAll">
            <img
              class="icon-img"
              v-if="selectAll"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png"
            />
            <img
              class="icon-img"
              v-else
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-default.png"
            />
            全选
          </div>
          <div class="total">
            <span class="total-price"
              ><text class="total-txt bold">合计：</text> ¥{{
                formatNumber(totalPayablePrice)
              }}</span
            >
            <div class="coupon-price" v-if="discountAmount > 0">
              <text class="total-txt">优惠金额：</text> ¥{{
                formatNumber(discountAmount)
              }}
            </div>
            <div class="coupon-price" v-if="discountCreditPoints > 0">
              <text class="total-txt">积分可抵扣：</text> ¥{{
                formatNumber(discountCreditPoints)
              }}
            </div>
          </div>
          <button type="button" class="btn-account" @click="checkout">
            结算({{ totalNum }})
          </button>
        </div>
      </template>
      <div v-if="loading && isLogin && !itemList.length" class="empty-wrap">
        <img
          class="icon-img"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/cart/empty.png"
          mode="scaleToFill"
        />
        <div class="desc">您还没有选购商品</div>
        <button type="button" @click="toHome" class="btn-home">去挑选</button>
      </div>
    </template>
    <div v-if="loading && !isLogin" class="empty-wrap">
      <image
        class="l_empt"
        src="https://ggllstatic.hpgjzlinfo.com/static/life/emp.png"
        mode="scaleToFill"
      />
      <div class="desc">您还没有登录</div>
      <button type="button" @click="toLogin" class="btn-home">去登录</button>
    </div>
  </div>
</template>

<script>
import UniNumberBox from "./components/uni-number-box.vue";
import apis from "@/apis/index.js";
export default {
  name: "CART",
  components: { UniNumberBox },
  data() {
    return {
      num: 1,
      selectAll: false,
      sceneType: "积分兑换",
      itemList: [],
      loading: false,
      totalAmountPrice: 0,
      isEdit: false,
      totalNum: 0,
      discountAmount: 0,
      discountCreditPoints: 0,
      totalPayablePrice: 0,
    };
  },
  computed: {
    // 选中商品集合
    selectList() {
      const result = [];
      if (this.itemList.length) {
        this.itemList.forEach((item) => {
          item.carts.forEach((el) => {
            if (el.checked) {
              result.push(el);
            }
          });
        });
        return result;
      }

      return [];
    },
    // 是否登录
    isLogin() {
      return Store.getters.isLogin;
    },
  },
  // components: {},
  filters: {},
  methods: {
    formatNumber(num) {
      if (Number.isNaN(parseInt(num))) {
        return "0.00";
      }
      return num.toFixed(2);
    },
    goStoreDetail(store) {
      uni.navigateTo({
        url: "/sub-pages/index/store/main?supplierId=" + store.storeId,
      });
    },
    // 商品数量改变
    async changeCarNum(childParams, product, index, subIndex) {
      // 原始num
      const type = childParams.type;
      let num = childParams.value;
      this.itemList[index].carts[subIndex].num = num;

      uni.showLoading();
      const result = await Axios.post("/cart/updateNum", {
        skuId: product.skuId,
        num: num,
        sceneType: this.sceneType,
      });
      uni.hideLoading();
      if (result.code == 200) {
        this.loadData();
        // this.itemList[index].carts[subIndex].num = num
      } else {
        if (type === "plus") {
          num--;
        } else {
          num++;
        }
        this.itemList[index].carts[subIndex].num = num;
        this.$uni.showToast(result.msg || result.data);
      }

      // const params = Object.assign({}, product, { num })
      // return
      // this.changeNumber(params)
    },
    toHome() {
      uni.navigateTo({ url: "/sub-pages/point/index/index" });
    },
    toLogin() {
      uni.navigateTo({
        url: "/pages/user-center/login",
      });
    },
    clickRight() {
      this.isEdit = !this.isEdit;
    },
    async changeCheck(item) {
      const result = await Axios.post("/cart/check", {
        checked: item.checked ? 0 : 1,
        skuIds: [item.skuId],
        sceneType: this.sceneType,
      });
      if (result.code == 200) {
        item.checked = !item.checked;
        this.recountCheck();
      }
      this.loadData();
    },
    addNum(item) {
      console.log("选中", item);
      item.num++;
      this.changeNumber(item);
    },
    reduceNum(item) {
      if (item.num > 1) {
        item.num--;
        this.changeNumber(item);
      }
    },
    async changeNumber(item) {
      uni.showLoading("正在提交...");
      const result = await Axios.post("/cart/updateNum", {
        skuId: item.skuId,
        num: item.num,
        sceneType: this.sceneType,
      });
      uni.hideLoading();
      if (result.code == 200) {
        this.loadData();
      } else {
        item.num--;
        this.loadData();
        this.$uni.showToast(result.msg || result.data);
      }
    },
    async loadData() {
      this.loading = false;
      this.itemList = [];
      uni.showLoading();
      const result = await Axios.post("/cart/list", {
        sceneType: this.sceneType,
      });
      uni.hideLoading();

      if (result.code == 200) {
        if (!result.data.carts) {
          this.itemList = [];
        } else {
          this.itemList = result.data.carts;
        }
        this.totalAmountPrice = result.data.totalAmountPrice;
        this.discountAmount = result.data.discountAmount;
        this.discountCreditPoints = result.data.discountCreditPoints;
        this.totalPayablePrice = result.data.totalPayablePrice;
        this.totalNum = result.data.totalNum;
        this.recountCheck();
      } else {
        this.$uni.showToast(result.msg || "获取购物车信息失败");
      }
      this.loading = true;
    },
    // 店铺全选
    async selectAllStore(item) {
      const skuIds = [];
      item.carts.forEach((el) => {
        if (el.soldOut) {
          skuIds.push(el.skuId);
        }
      });
      const params = {
        checked: item.checked ? 0 : 1,
        skuIds: skuIds,
        sceneType: this.sceneType,
      };

      const result = await Axios.post("/cart/check", JSON.stringify(params));
      if (result.code != 200) {
        this.$uni.showToast(result.msg || result.data);
      }
      this.loadData();
    },
    // 所有全选
    async changeSelectAll() {
      const skuIds = [];
      this.itemList.forEach((item) => {
        item.carts.forEach((el) => {
          if (el.soldOut) {
            skuIds.push(el.skuId);
          }
        });
      });
      const params = {
        checked: this.selectAll ? 0 : 1,
        skuIds: skuIds,
        sceneType: this.sceneType,
      };

      const result = await Axios.post("/cart/check", JSON.stringify(params));
      if (result.code != 200) {
        this.$uni.showToast(result.msg || result.data);
      }
      this.loadData();
    },
    recountCheck() {
      this.selectAll =
        this.itemList.length > 0 &&
        this.itemList.every((item) => {
          return item.checked;
        });
    },
    tolDetail(product) {
      uni.navigateTo({
        url:
          "/sub-pages/index/item/main?id=" +
          product.productId +
          "&sceneType=" +
          this.sceneType,
      });
    },
    deleteItem(product) {
      uni.showModal({
        content: "确定删除?",
        success: async (res) => {
          if (res.confirm) {
            const result = await Axios.post("/cart/delete", {
              skuId: product.skuId,
              sceneType: this.sceneType,
            });
            if (result.code == 200) {
              this.$uni.showToast("删除成功");
              this.loadData();
            } else {
              this.$uni.showToast(result.msg || "删除失败");
            }
          }
        },
      });
    },
    // 结算
    async checkout() {
      if (!this.selectList.length) {
        this.$uni.showToast("请选择商品！");
        return;
      }

      const skuIds = [];
      this.itemList.forEach((item) => {
        item.carts.forEach((el) => {
          if (el.soldOut) {
            skuIds.push(el.skuId);
          }
        });
      });

      apis.checkOrderSettlementFromCart({
        data: {
          phone: uni.getStorageSync("userInfo").tel,
          checkSkuIds: skuIds,
          sceneType: this.sceneType,
        },
        showsLoading: true,
        success: (res) => {
          if (res) {
            uni.navigateTo({
              url: `/sub-pages/index/checkout/main?type=1&sceneType=${this.sceneType}`,
            });
          } else {
            this.$uni.showToast("当前购物车中商品状态有变化");
            this.loadData();
          }
        },
      });
    },
  },
  async onShow() {
    if (!Store.getters.isLogin) {
      Store.dispatch("logout");
      // await Store.dispatch('login')
    }
    const curPages = getCurrentPages()[0];
    if (typeof curPages.getTabBar === "function" && curPages.getTabBar()) {
      curPages.getTabBar().setData({
        tabIndex: 3, // 表示当前菜单的索引，该值在不同的页面表示不同
      });
    }
    // this.sceneType = this.$scope.options.sceneType || "积分兑换";
    // console.log("sceneType: ", sceneType);
    this.loadData();
  },
};
</script>

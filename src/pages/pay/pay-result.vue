<!-- eslint-disable vue/no-dupe-keys -->
<template>
  <view class="error-tip">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <!-- <view class="back-icon"></view>
          <image class="icon-desc"
          @click="handleHomeBack"
                 src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-index.png"
                 mode="scaleToFill" /> -->
          <!-- <text class="icon-desc" @click="handleComplete">完成</text> -->

          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            resultType === 0 ? "支付成功" : "支付失败"
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <!-- <image class="back-icon"
          @click="handleNavBack"
                 src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-arrow-left.png"
                 mode="scaleToFill" /> -->
          <!-- <text class="icon-desc" @click="handleComplete">完成</text> -->
          <!-- <image class="icon-desc"
          @click="handleHomeBack"
                 src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-index.png"
                 mode="scaleToFill" /> -->

          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            resultType === 0 ? "支付成功" : "支付失败"
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <image v-if="resultType === 0" class="icon-error" :src="icon.success" />
      <image v-else class="icon-error" :src="icon.fail" />
      <view class="error-txt">{{
        resultType === 0 ? "支付成功" : "支付失败"
      }}</view>
      <view class="pay-account">¥{{ formaterMoney(payAmount) }}</view>
    </view>
    <view class="page-content">
      <view class="item">
        <view class="label">订单编号</view>
        <view class="cont">{{ orderId }}</view>
      </view>
      <view class="item">
        <view class="label">付款方式</view>
        <!-- {{formData.payment == '1'? '惠老钱包':''}} -->
        <view class="cont">{{
          payWay[formData.payment] ? payWay[formData.payment] : "无"
        }}</view>
      </view>
    </view>

    <view class="page-footer">
      <button class="btn btn-default" @click="handleHomeBack">返回首页</button>
      <button
        v-if="resultType === 1"
        class="btn btn-warning"
        @click="handleRePay"
      >
        重新支付
      </button>
      <button v-else class="btn btn-warning" @click="handleOrderDetail">
        订单详情
      </button>
    </view>
    <!-- 订单关闭 -->
    <modal
      ref="payInfor"
      title="支付超时"
      confirmText="确定"
      cancelText=" "
      @confirm="handleConfirm"
    >
      <template v-slot:text>
        <view class="confirm-main">
          <view class="content">订单已关闭,请重新下单</view>
        </view>
      </template>
    </modal>
    <!-- 积分领取 -->
    <point-pop ref="pointPop" />
  </view>
</template>

<script>
import Modal from "@/components/common/modal.vue";
import PointPop from "./components/get-point-pop.vue";
import NavigationBar from "@/components/common/navigation-bar.vue";
import api from "@/apis/index.js";
export default {
  components: { NavigationBar, Modal, PointPop },
  data() {
    return {
      payWay: { 1: "惠老钱包", 2: "支付宝支付", 3: "微信支付" },
      // 结果类型 0-成功 1-失败
      resultType: 0,
      orderId: "",
      payAmount: "",
      formData: {},
      // iconPath
      icon: {
        success:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-success.png",
        fail: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-fail.png",
      },
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 状态栏高度
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
    };
  },
  onLoad(e) {
    this.formData = JSON.parse(decodeURIComponent(e.payInfo));
    this.resultType = this.formData.type;
    this.orderId = this.formData.orderId;
    this.payAmount = this.formData.payAmount;
    this.checkNeedPopUp();
    console.log(this.formData, "form信息=======");
  },
  onShow() {},
  methods: {
    formaterMoney(v) {
      return (v / 100).toFixed(2);
    },
    // 返回上一页
    handleNavBack() {
      this.$refs.tipModal.open();
    },
    // 返回首页
    handleHomeBack() {
      uni.reLaunch({
        url: "/pages/index/index?index=0",
      });
    },
    // 订单详情
    handleOrderDetail() {
      console.log(this.formData, "订单详情信息=======");
      /**
       * orderSource
       * 0-附近优惠
       * 1-买菜
       * 2-看病
       * 3-保险
       * 4-酒店
       * 5-消费养老
       * 6-出行旅游
       * 9-商城
       */
      // const mili_url = `${ENV.MILI_URL}/#/order-info/index?order_no=${this.formData.transactionSerialNo}`
      switch (this.formData.orderSource) {
        case 4:
          uni.reLaunch({
            url: "/pages/life/orderInfo?orderId=" + this.orderId,
          });
          break;
        case 5:
          uni.reLaunch({
            url: `/pages/order/consum-order-info?orderId=${this.formData.transactionSerialNo}&activeIndex=3`,
          });
          break;
        case 6:
          uni.reLaunch({
            url: `/pages/benefit/order-info?id=${this.orderId}`,
          });
          break;
        case 9:
          uni.reLaunch({
            url:
              "/sub-pages/me/order-detail/main?id=" +
              this.formData.transactionSerialNo +
              "&popUpType=2",
          });
          break;
        default:
          uni.reLaunch({
            url: "/pages/supermarket/order-info?orderId=" + this.orderId,
          });
          break;
      }
    },
    // 米粒订单详情
    goMiliOrderDetial() {
      const url = `${ENV.MILI_URL}/#/pages/order-detail/index?order_no=${this.formData.transactionSerialNo}`;
      uni.reLaunch({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    // 绑定完成
    // handleComplete() {
    //   if(this.formData.payment == 1){
    //        const source = uni.getStorageSync('bind-card-source')
    //       // 0 :收银台 1 :我的银行卡
    //       if(source === '0'){
    //         if(this.formData.orderSource === 0){
    //            uni.navigateTo({
    //               url: '/pages/supermarket/index'
    //             });
    //         }else{
    //           if(!this.formData.orderSource) return
    //           //orderSource 0-附近优惠、1-买菜、2-看病、3-保险，4酒店
    //           const backUrl = {1:'/pages/life/bugshopping',2:'/pages/life/seeDoctor',3:'/pages/life/insurance',4:'/pages/life/hotelDetail?hotelDiscountId='+hotelDiscountId+'&change=1'+'&hotelName='+hotelName+'&hotelId='+hotelId}
    //           uni.reLaunch({url:backUrl[this.formData.orderSource]})
    //         }
    //       }else{
    //         uni.navigateTo({
    //         url: '/pages/pay/my-bank-card'
    //       });
    //     }
    //   }else{
    //      uni.reLaunch({
    //        url: '/pages/index/index'
    //     });
    //   }
    // },
    handleConfirm() {
      uni.reLaunch({
        url: "/pages/life/orderInfo?orderId=" + this.formData.orderId,
      });
    },
    // 重新支付
    handleRePay() {
      const n = new Date().getTime();
      const g_q = new Date(this.formData.expirationTime).getTime();
      const mine = Math.floor((g_q - n) / 60000);
      console.log("====待付款订单是否超过30分钟---", mine);
      if (this.formData.orderSource === 0) {
        api.getPayCodePage({
          data: { supermarketId: this.formData.supermarketId },
          success: (data) => {
            uni.navigateTo({
              url:
                "/pages/pay/show-pay-code?url=" +
                encodeURIComponent(data.result),
            });
          },
        });
      } else {
        if (mine > 30) {
          // 弹框 关单
          this.$refs.payInfor.open();
        } else if (mine <= 30 && mine > 0) {
          const url = `${ENV.H5}/#/checkstand?cashId=${this.formData.cashId}`;
          uni.redirectTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
          });
        }
      }
    },
    // 领积分弹窗
    async checkNeedPopUp() {
      const params = {
        orderId: this.orderId,
        popUpType: "0",
      };
      const { code, data } = await Axios.post("/order/checkNeedPopUp", params);
      if (code === "200") {
        if (data.needPopUp === 1) {
          this.$refs.pointPop.open(data);
        }
      } else {
        console.log("失败");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
//modal弹框
.confirm-main {
  width: 552rpx;
  margin: 0 auto;
  height: 180rpx;
  text-align: center;
  font-size: 40rpx;
  line-height: 180rpx;
  .wen {
    color: #ff5500;
  }
}
.error-tip {
  // 头部
  .navigation-bar {
    box-sizing: border-box;
    padding-left: 24rpx;
    width: 100vw;
    height: 100%;
    .back-icon {
      flex-shrink: 0;
      width: 44rpx;
      height: 44rpx;
      margin-right: 48rpx;
      position: relative;
      z-index: 10;
    }
    .icon-desc {
      flex-shrink: 0;
      // width: 40rpx;
      // height: 40rpx;
      margin-left: 54rpx;
      position: relative;
      z-index: 10;
    }
    .desc {
      color: #666666;
    }
    .navigation-bar__title {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
    }
    .navigation-bar__complete {
      position: absolute;
      right: 36rpx;
    }
  }
  .page-header {
    width: 100vw;
    position: relative;
    padding: 0 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon-error {
      margin: 62rpx 0;
      width: 144rpx;
      height: 142rpx;
    }
    .error-txt {
      color: #333333;
      font-size: 40rpx;
      text-align: center;
      margin-bottom: 24rpx;
    }
    .pay-account {
      font-size: 48rpx;
      color: #333333;
      margin-bottom: 76rpx;
    }
  }
  .page-content {
    border-bottom: 2rpx solid #eeeeee;
    border-top: 2rpx solid #eeeeee;
    padding: 32rpx;
    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32rpx;
      font-weight: 32rpx;
      color: #333333;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .page-footer {
    margin-top: 94rpx;
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 328rpx;
      height: 108rpx;
      line-height: 108rpx;
      border: 2rpx solid #dcdee0;
      border-radius: 54rpx;
      font-size: 44rpx;
      font-weight: 500;
      &-default {
        border: 2rpx solid #dcdee0;
        color: #333333;
      }
      &-warning {
        background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
        // border: 2rpx solid #EB3030;
        color: #ffffff;
      }
    }
  }
}
</style>

<template>
  <view class="submit-result">
    <view class="flex-v flex-c-s">
      <image
        class="result-icon mt-80"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-success.png"
      />

      <text class="fs-50 mt-32 fw-bold">发票申请提交成功</text>
      <view class="btn-group mt-80 flex-h flex-c-c">
        <view class="btn mr-64 fs-44" @click="handleOrderDetail">查看订单</view>
        <view class="btn fs-44" @click="handleInvoiceDetail">查看发票</view>
      </view>
    </view>
  </view>
</template>

<script>
import NavigationBar from "../../components/common/navigation-bar.vue";
import api from "@/apis/index.js";
export default {
  components: { NavigationBar },
  data() {
    return {
      orderId: "",
      invoiceId: "",
      info: null,
    };
  },
  onLoad(e) {
    this.orderId = e.orderId;
    this.invoiceId = e.invoiceId;
    this.getOrderInfo();
  },
  methods: {
    //  订单详情
    getOrderInfo() {
      api.getOrderInfo({
        data: {
          orderId: this.orderId,
        },
        success: (data) => {
          this.info = data;
        },
      });
    },
    // 查看订单
    handleOrderDetail() {
      // orderSource 0-附近优惠、1-买菜、2-看病、3-保险，4酒店
      if (this.info.orderSource == 4) {
        uni.navigateTo({
          url: "/pages/life/orderInfo?orderId=" + this.orderId,
        });
      } else {
        uni.navigateTo({
          url: "/pages/supermarket/order-info?orderId=" + this.orderId,
        });
      }
    },
    // 查看发票
    handleInvoiceDetail() {
      uni.navigateTo({
        url: "/pages/supermarket/myInvoice",
      });
    },
    /**
     * 返回首页点击事件
     */
    handleBackToHomeClick() {
      uni.reLaunch({
        url: "/pages/index/index?index=0",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-result {
  .result-icon {
    @include size(220, 176);
  }
  .btn-group {
    .btn {
      flex-shrink: 0;
      width: 264rpx;
      height: 108rpx;
      background: #ffffff;
      border-radius: 54rpx;
      border: 2rpx solid #ff5500;
      text-align: center;
      line-height: 104rpx;
      color: #ff5500;
    }
  }
}
</style>

<template>
  <view class="consum-order-item" @click="toDetail(item)">
    <view class="header">
      <view class="left">
        <image class="icon" :src="icon" mode="scaleToFill" />
        <text>消费养老</text>
      </view>
      <view
        class="right"
        :class="{ active: ['1', '2', '3', '10'].includes(item.orderStatus) }"
      >
        {{ statusText[item.orderStatus] }}</view
      >
    </view>
    <view class="content">
      <!-- 一个商品展示情况 -->
      <template v-if="item.picUrl.length && item.picUrl.length == 1">
        <view class="_topLine">
          <view class="left_part">
            <image class="logo-img" :src="item.picUrl[0]" mode="scaleToFill" />
            <view class="cont">
              <view class="name l-2">{{ item.spuTitle }}</view>
              <view class="label l-1">{{ item.skuTitle }}</view>
            </view>
            <view class="cont right">
              <view class="name">¥{{ formaterMoney(item.payAmount) }}</view>
              <view class="label">x{{ item.qty }}</view>
            </view>
          </view>
        </view>
      </template>
      <!-- 大于2个商品 -->
      <template v-if="item.picUrl.length && item.picUrl.length >= 2">
        <ul class="item-img-list">
          <view v-for="(v, k) in item.picUrl" :key="k">
            <li class="img-item" v-if="k < 10">
              <img
                class="item-logo"
                mode="scaleToFill"
                :lazy-load="true"
                :src="v"
              />
            </li>
          </view>
          <li class="img-item" v-if="item.picUrl.length > 10">
            <img
              class="item-logo"
              mode="scaleToFill"
              :lazy-load="true"
              src="https://ggllstatic.hpgjzlinfo.com/static/life/watch_all.png"
            />
          </li>
        </ul>
      </template>
      <view class="total"
        >共计{{ item.payNumber }}个 合计:
        <text class="salePrice">¥{{ formaterMoney(item.payAmount) }}</text>
      </view>
      <div
        class="footer-btn"
        v-if="['1', '2', '3', '10'].includes(item.orderStatus)"
        @click.stop=""
      >
        <!-- 待付款 -->
        <template v-if="item.orderStatus == '1'">
          <view class="btn-active" @click="toPay(item)">立即支付</view>
          <view class="btn-link" @click="cancel(item)">取消订单</view>
        </template>
        <!-- 待发货 -->
        <template v-if="item.orderStatus == '2'">
          <view class="btn-link" @click="applyRefund(item)">申请退款</view>
        </template>
        <!-- 待收货 -->
        <template v-if="item.orderStatus == '10'">
          <view class="btn-active" @click="confirmGoods(item)">确认收货</view>
          <view class="btn-link" @click="applyRefund(item)">申请退款</view>
        </template>
        <!-- 已完成-->
        <view
          class="btn-link"
          v-if="item.orderStatus == '3' && isRefund(item)"
          @click="applyRefund(item)"
          >申请退款</view
        >
      </div>
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
export default {
  name: "consum-order-item",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    activeIndex: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      // 订单状态  已取消还没有
      statusText: {
        1: "待付款",
        2: "待发货",
        10: "待收货",
        3: "已完成",
        9: "已取消",
        4: "已关闭",
        5: "部分退款",
        6: "已退款",
        7: "退款中",
      },
      icon: "https://ggllstatic.hpgjzlinfo.com/static/life/consum-logo.png",
    };
  },
  methods: {
    formaterMoney(v) {
      return Number(v).toFixed(2);
    },
    isRefund(item) {
      var refundFlag = false;
      const currentTime = new Date().getTime();
      if (item.refundDeadlineTime) {
        const refundTime = new Date(item.refundDeadlineTime).getTime();
        if (currentTime < refundTime) {
          refundFlag = true;
        }
        return refundFlag;
      }
    },
    isClose(item) {
      var closeFlag = false;
      const currentTime = new Date().getTime();
      if (item.expirationTime) {
        const refundTime = new Date(item.expirationTime).getTime();
        if (currentTime > refundTime) {
          closeFlag = true;
        }
        return closeFlag;
      }
    },
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/order/consum-order-info?orderId=${item.transactionSerialNo}&activeIndex=${this.activeIndex}`,
      });
    },
    async confirmGoods(order) {
      const result = await uni.showModal({
        title: "确认收到货了吗",
        content: "为保障售后权益,请检查后再确认收货",
      });
      if (result[1].confirm) {
        api.recvconfirm({
          data: { childOrderNo: order.transactionSerialNo || "" },
          success: (res) => {
            if (res) {
              this.$uni.showToast("确认成功");
              uni.$emit("reloadOrderList", this.activeIndex);
            }
          },
        });
      }
    },
    applyRefund(item) {
      if (item.orderStatus == "3") {
        const currentTime = new Date().getTime();
        const refundTime = new Date(this.refundDeadlineTime).getTime();
        if (currentTime > refundTime) {
          this.$uni.showToast("已超过退款时间,无法退款!");
          return;
        }
      }
      const childOrderId = item.transactionSerialNo || "";
      const mainOrderId = item.transactionSerialNoParent;
      const url = `https://laoling.milixf.com/#/pages/order-apply-refund/index?order_no=${childOrderId}&master_order_no=${mainOrderId}`;
      console.log("--子主---", childOrderId, mainOrderId);
      // #ifdef MP-ALIPAY
      uni.navigateTo({
        url: `/pages/common/webpage?ecodeUrl=${encodeURIComponent(url)}`,
      });
      // #endif

      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
      // #endif
    },
    toPay(item) {
      if (this.isClose(item)) {
        this.$uni.showToast("订单已超时");
        uni.$emit("reloadOrderList", this.activeIndex);
        return;
      }
      const url = `${ENV.H5}/#/checkstand?cashId=${this.item.orderId}`;
      // #ifdef MP-ALIPAY
      uni.reLaunch({
        url: `/pages/common/webpage?url=${url}`,
      });
      // #endif

      // #ifdef MP-WEIXIN
      uni.reLaunch({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
      // #endif
    },
    async cancel(item) {
      if (this.isClose(item)) {
        this.$uni.showToast("订单已超时");
        uni.$emit("reloadOrderList", this.activeIndex);
        return;
      }
      const result = await uni.showModal({
        title: "",
        content: "确认取消此订单吗?",
      });
      if (result[1].confirm) {
        api.orderCancelML({
          data: { orderNo: item.transactionSerialNo || "" },
          success: (res) => {
            if (res) {
              this.$uni.showToast("取消成功");
              uni.$emit("reloadOrderList", this.activeIndex);
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.consum-order-item {
  width: 686rpx;
  height: auto;
  background: #ffffff;
  border-radius: 16rpx;
  .header {
    height: 94rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #333333;
    border-bottom: 2rpx solid #f5f5f5;
    .left {
      display: flex;
      align-items: center;
      font-weight: 500;
      .icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 8rpx;
      }
    }
    .right {
      font-weight: 400;
      color: #999999;
      &.active {
        color: #ff5500;
      }
    }
  }
  .content {
    //margin: 18rpx;
    margin: 18rpx 18rpx 0rpx 18rpx;
    border-bottom: 2rpx solid #f5f5f5;
    ._topLine {
      display: flex;
      flex-direction: column;
      margin-bottom: 16rpx;
      // justify-content:space-between;
      .left_part {
        display: flex;
        // justify-content: center;
        .logo-img {
          width: 160rpx;
          height: 160rpx;
          flex-shrink: 0;
        }
        .cont {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 16rpx;
          .label {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            &.l-1 {
              height: 40rpx;
              line-height: 43rpx;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              width: fit-content;
              background: unset;
              border-radius: 21rpx;
              padding: 4rpx 16rpx;
            }
          }
          .label2 {
            margin-top: 30rpx;
          }
          &.right {
            flex: 1;
            justify-content: unset;
            text-align: right;
            .label {
              color: #999999;
              font-size: 36rpx;
            }
            .name {
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #999999;
            }
          }
        }
        .name {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          &.l-2 {
            height: 87rpx;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
      .r_pay {
        display: flex;
        margin-top: 20rpx;
        .pay {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          margin-left: auto;
        }
        .money {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
    }
    .item-img-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      overflow-x: auto;
      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
      }
      // &::before {
      //   display: block;
      //   content: '';
      //   height: 100%;
      //   width: 66rpx;
      //   position: absolute;
      //   right: 0;
      //   top: 0;
      //   background: linear-gradient(
      //     90deg,
      //     rgba(255, 255, 255, 0) 0%,
      //     rgba(255, 255, 255, 0.76) 61%,
      //     #ffffff 100%
      //   );
      // }
      .img-item {
        // background: #ff5500;
        .item-logo {
          width: 152rpx;
          height: 152rpx;
          border-radius: 8rpx;
          margin-right: 24rpx;
        }
      }
    }
    .total {
      height: 80rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: #999999;
      line-height: 80rpx;
      text-align: right;
      padding-bottom: 10rpx;
      .salePrice {
        font-size: 40rpx;
        font-weight: 500;
        color: #333333;
        margin-left: 10rpx;
      }
    }
    .footer-btn {
      display: flex;
      flex-direction: row-reverse;
      padding: 16rpx;
      border-top: 2rpx solid #f5f5f5;
      padding-right: 0;
      .btn-link,
      .btn-active {
        display: inline-block;
        margin-left: 20rpx;
        height: 68rpx;
        line-height: 68rpx;
        border-radius: 128rpx;
        text-align: center;
        width: 180rpx;
        font-size: 32rpx;
        color: #333333;
        border: 2rpx solid #333333;
      }

      .btn-active {
        color: #ff711a;
        background: #ffffff;
        border: 2rpx solid #ff711a;
        font-weight: 500;
      }
    }
  }
}
</style>

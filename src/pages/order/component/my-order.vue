<template>
  <view class="pages">
    <view class="nearby-list" v-if="list.length > 0">
      <view
        class="item"
        v-for="(item, index) in list"
        @click="handleOrderInfo(item.orderId)"
        :key="index"
      >
        <view class="header_line">
          <view class="left">
            <image class="t_icon" :src="item.logoPath" />
            <view class="type">{{ item.orderSourceName }}</view>
          </view>
          <view class="right">已完成</view>
        </view>
        <view class="_topLine">
          <view class="left_part">
            <image
              class="logo-img"
              :src="item.supermarketThumbnail"
              mode="scaleToFill"
            />
            <view class="name">{{ item.supermarketName }}</view>
          </view>
          <view class="r_pay">
            <view class="pay">实付</view>
            <view class="money">￥{{ formaterMoney(item.paymentAmount) }}</view>
          </view>
        </view>
        <view class="address">{{ dateFilter(item.orderTime) }}</view>
      </view>
    </view>
    <view class="status-box flex-v flex-c-s" v-if="list.length === 0">
      <image
        class="icon-img"
        src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/no-order.png"
        mode="scaleToFill"
      />
      <view>您还没有相关订单</view>
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
export default {
  components: {},
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  created() {},
  onLoad(e) {},
  // 下拉刷新
  onPullDownRefresh() {},
  // 上拉加载
  onReachBottom() {},
  methods: {
    // 点击订单
    handleOrderInfo(orderId) {
      console.log("点击订单", orderId);
      uni.navigateTo({
        url: "/pages/supermarket/order-info?orderId=" + orderId,
      });
    },
  },
  filters: {
    setDistance(item) {
      const s = Number(item) / 1000;
      if (s.toFixed(3) < 1) {
        return parseInt(s * 1000) + "m";
      } else {
        return s.toFixed(1) + "km";
      }
    },
    formaterMoney(v) {
      return (v / 100).toFixed(2);
    },
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  background-color: #f2f2f2;
  .nearby-list {
    overflow: hidden;
    .item {
      width: 686rpx;
      background-color: #fff;
      margin: 24rpx 32rpx;
      padding: 0rpx 24rpx;
      box-sizing: border-box;
      color: #333;
      border-radius: 16rpx;
      .header_line {
        height: 50rpx;
        display: flex;
        justify-content: space-between;
        padding-top: 24rpx;
        margin-bottom: 30rpx;
        .left {
          display: flex;
          height: 50rpx;
          line-height: 50rpx;
          .t_icon {
            width: 40rpx;
            height: 40rpx;
            margin-top: 6rpx;
            margin-right: 10rpx;
          }
          .type {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 50rpx;
          }
        }
        .right {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 50rpx;
        }
      }
      ._topLine {
        display: flex;
        justify-content: space-between;
        .left_part {
          display: flex;
          justify-content: center;
          .logo-img {
            width: 160rpx;
            height: 160rpx;
          }
          .name {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }
        .r_pay {
          display: flex;
          justify-content: center;
          .pay {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
          }
          .money {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }
      }
      .address {
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 40rpx;
        padding-bottom: 0.24rem;
        text-align: right;
      }
    }
  }
  .status-box {
    padding-top: 300rpx;
    .icon-img {
      width: 440rpx;
      height: 270rpx;
      margin-bottom: 24rpx;
    }
    .status-text {
      height: 50rpx;
      color: $color-grey;
    }
  }
}
</style>

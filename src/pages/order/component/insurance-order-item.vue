<template>
  <view class="insurance-order-item" @click="toDetail(item)">
    <view class="header">
      <view class="left">
        <image class="icon" :src="icon" mode="scaleToFill" />
        <text>保险</text>
      </view>
      <view class="right" :class="{ active: item.insuStatus === 5 }">
        {{ item.insuStatus === 5 ? "保障中" : "已失效" }}</view
      >
    </view>
    <view class="cont">
      <view class="name">{{ item.prdName }}</view>
      <view class="time"
        >保障期限：{{ dateFilter(item.ordStartDate) }}至{{
          dateFilter(item.ordEndDate)
        }}
      </view>
      <view class="time">被保人：{{ desensitizeName(item.insureName) }}</view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import { desensitizeName } from "@/utils/desensitization.js";
export default {
  name: "insurance-order-item",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      icon: "https://ggllstatic.hpgjzlinfo.com/static/life/insurance-logo.png",
    };
  },
  methods: {
    toDetail(data) {
      uni.navigateTo({
        url: `/pages/order/insurance-order-info?insuCode=${data.insuCode}`,
      });
    },
    dateFilter(value) {
      return dayjs(value).format("YYYY-MM-DD");
    },
    desensitizeName(name) {
      return desensitizeName(name);
    },
  },
};
</script>

<style lang="scss" scoped>
.insurance-order-item {
  width: 686rpx;
  height: 338rpx;
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
  .cont {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    height: 242rpx;
    padding: 24rpx 20rpx;
    box-sizing: border-box;
    .name {
      height: 50rpx;
      font-size: 36rpx;
      color: #333333;
      line-height: 50rpx;
    }
    .time {
      height: 44rpx;
      font-size: 32rpx;
      color: #999999;
      line-height: 44rpx;
      margin-top: 24rpx;
    }
  }
}
</style>

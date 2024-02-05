<template>
  <view class="pages">
    <view class="status">
      <view
        v-for="(i, index) in statusList"
        :key="i.id"
        :class="{ active: activeIndex === index, 'status-label': true }"
        @click="handleItemClick(index, i)"
        >{{ i.label }}</view
      >
    </view>
    <view class="top-tip">
      <view class="left"> i </view>
      <view class="right">
        新的订单将会在第二天查询并展示，如有疑问请
        <text class="call-phone" @click="callPhone">联系客服</text>
      </view>
    </view>

    <view class="insurance-list" v-if="list.length > 0">
      <view v-for="item in list" class="item" :key="item.id">
        <insurance-order-item :item="item"></insurance-order-item>
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
import dayjs from "dayjs";
import InsuranceOrderItem from "./insurance-order-item.vue";
export default {
  name: "insurance-order",
  components: { InsuranceOrderItem },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeIndex: 0,
      dialogContent: "",
      icon: "https://ggllstatic.hpgjzlinfo.com/static/life/warning-circle.png",
      statusList: [
        { id: null, label: "全部" },
        { id: 5, label: "保障中" },
        { id: 7, label: "已失效" },
      ],
    };
  },
  methods: {
    formaterMoney(v) {
      return Number(v).toFixed(2);
    },
    dateFilter(value) {
      return dayjs(value).format("YYYY-MM-DD HH:mm");
    },
    // 客服电话
    callPhone() {
      uni.makePhoneCall({
        phoneNumber: "4009686660",
      });
    },
    toDetail(data) {
      uni.navigateTo({
        url: `/sub-pages/me/order-detail/main?id=${data.orderId}&popUpType=1`,
      });
    },
    handleItemClick(index, i) {
      this.activeIndex = index;
      this.$emit("resetOptions", i.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  background-color: #f2f2f2;
  position: relative;
  // padding-bottom: 96rpx;
  .status {
    position: sticky;
    top: 0;
    height: 128rpx;
    width: 100%;
    z-index: 1;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .status-label {
      width: 140rpx;
      height: 80rpx;
      color: #333333;
      background: #eeeeee;
      font-size: 32rpx;
      border-radius: 40rpx;
      text-align: center;
      line-height: 80rpx;
      &.active {
        color: #ff5500;
        background: rgba(255, 73, 0, 0.11);
      }
    }
  }
  .top-tip {
    position: sticky;
    top: 128rpx;
    height: 128rpx;
    width: 100%;
    background: #e8effa;
    display: flex;
    // justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
    .left {
      width: 40rpx;
      height: 40rpx;
      border-radius: 20rpx;
      color: #155bd4;
      border: 2rpx solid #155bd4;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 28rpx 32rpx;
    }
    .right {
      width: 618rpx;
      line-height: 44rpx;
      .call-phone {
        font-weight: 500;
        color: #1890ff;
        text-decoration: underline;
      }
    }
  }
  .insurance-list {
    // overflow: hidden;
    // padding: 0 32rpx;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24rpx;
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

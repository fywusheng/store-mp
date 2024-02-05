<template>
  <view class="consum-pages">
    <view class="status">
      <scroll-view :scroll-x="true" class="top_scroll">
        <view
          v-for="(v, index) in statusList"
          :key="v.id"
          :class="{ active: activeIndex === index, 'status-label': true }"
          @click="handleItemClick(index, v)"
          >{{ v.label }}</view
        >
      </scroll-view>
    </view>
    <view class="consum-list" v-for="(v, key) in list" :key="key">
      <consum-order-item
        :item="v"
        :activeIndex="childIndex"
      ></consum-order-item>
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
// import dayjs from 'dayjs'
import ConsumOrderItem from "./consum-order-item";

export default {
  name: "consum-order",
  components: { ConsumOrderItem },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tabList: [],
      childIndex: -1,
      activeIndex: 0,
      dialogContent: "",
      icon: "https://ggllstatic.hpgjzlinfo.com/static/life/warning-circle.png",
      statusList: [
        { id: null, label: "全部" },
        { id: 1, label: "待付款" },
        { id: 2, label: "待发货" },
        { id: 10, label: "待收货" },
        { id: 3, label: "已完成" },
      ],
    };
  },
  onLoad(e) {
    this.tabList = this.list;
  },
  methods: {
    handleItemClick(index, v) {
      this.activeIndex = index;
      this.childIndex = v.id;
      console.log("===点击下标--", v.id);
      this.$emit("resetOptions", v.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.consum-pages {
  // background-color: #f5f5f5;
  padding-bottom: 100rpx;
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
    .top_scroll {
      padding-left: 32rpx;
      padding-right: 8rpx;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
      }
    }
    .status-label {
      flex-shrink: 0;
      width: 200rpx;
      height: 80rpx;
      color: #333333;
      background: #eeeeee;
      font-size: 32rpx;
      border-radius: 40rpx;
      text-align: center;
      line-height: 80rpx;
      margin-right: 24rpx;
      &.active {
        color: #ff5500;
        background: rgba(255, 73, 0, 0.11);
      }
    }
  }
  .consum-list {
    // overflow: hidden;
    //padding: 32rpx;
    padding: 32rpx 32rpx 0 32rpx;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24rpx;
    }
  }
  .status-box {
    padding-top: 200rpx;
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

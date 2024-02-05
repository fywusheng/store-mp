<template>
  <view class="small-video">
    <view
      class="item"
      v-for="(item, index) in datalist"
      :key="index"
      @click="clickItem(item)"
    >
      <image mode="scaleToFill" :src="item.imgs[0]" class="top_img" />
      <view class="text">{{ item.ttl }}</view>
      <view class="bottom" v-if="showBottom">
        <image mode="scaleToFill" class="left_icon" :src="item.logoUrl" />
        <view class="des">{{ item.categoryName }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    datalist: {
      type: Array,
      default: () => [],
    },
    showBottom: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  onLoad() {},
  methods: {
    clickItem(item) {
      this.$emit("return_data", item);
    },
  },
};
</script>

<style lang="scss">
.small-video {
  background: #f5f5f5;
  // height:100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    width: 334rpx;
    background: #ffffff;
    border-radius: 16rpx;
    border: 4rpx solid #e5d6b6;
    margin-bottom: 15rpx;
    // margin-top: 24rpx;
    // margin-left: 21rpx;
    .top_img {
      width: 336rpx;
      height: 336rpx;
      border-radius: 16rpx;
    }
    .text {
      height: 100rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 50rpx;
      width: 296rpx;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-wrap: break-word;
      white-space: normal !important;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 18rpx;
    }
    .bottom {
      height: 88rpx;
      line-height: 88rpx;
      display: flex;
      justify-content: flex-start;
      .left_icon {
        width: 48rpx;
        height: 48rpx;
        margin-right: 12rpx;
        padding-top: 15rpx;
        padding-left: 15rpx;
      }
      .des {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
</style>

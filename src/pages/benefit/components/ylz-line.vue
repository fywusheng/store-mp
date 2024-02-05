<template>
  <view class="ylz-line">
    <view class="left-icon"></view>
    <view class="title">{{ title }}</view>
    <view class="right-icon"></view>
  </view>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ylz-line {
    display: flex;
    align-items: center;
    .left-icon {
      flex: 1;
      height: 4rpx;
      border: 2rpx solid;
      border-image: linear-gradient(245deg, rgba(151, 151, 151, 1), rgba(200, 200, 200, 0)) 2 2;
    }
    .right-icon {
      flex: 1;
      height: 4rpx;
      border: 2rpx solid;
      border-image: linear-gradient(245deg, rgba(151, 151, 151, 1), rgba(200, 200, 200, 0)) 2 2;
      transform: rotate(180deg);
    }
    .title {
      height: 44rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 44rpx;
      padding: 0 30rpx;
    }
  }
</style>

<template>
  <view class="panel-card" :style="{ background }">
    <view v-if="showHeader" class="panel-header" @click="handleHeaderClick">
      <view class="panel-header-title">{{ title }}</view>
      <image v-if="showMore" class="right-icon" :src="rightIcon" mode="scaleToFill" />
    </view>
    <view class="panel-body">
      <slot></slot>
    </view>
  </view>
</template>
<script>
  export default {
    props: {
      // 右侧icon连接
      rightIcon: {
        type: String,
        default: 'https://ggllstatic.hpgjzlinfo.com/static/images/common/right-gray.png'
      },
      // 是否显示header
      showHeader: {
        type: Boolean,
        default: true
      },
      // 是否显示header
      showMore: {
        type: Boolean,
        default: true
      },
      // header 标题
      title: {
        type: String,
        default: ''
      },
      // 背景色
      background: {
        type: String,
        default: '#ffffff'
      }
    },
    data() {
      return {}
    },
    methods: {
      handleHeaderClick() {
        console.log('111', this.showMore)
        this.$emit('header-click')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .panel-card {
    width: 100%;
    border-radius: 16rpx;
    padding: 32rpx 24rpx;
    box-sizing: border-box;
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      &::before {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        display: block;
        content: '';
        width: 8rpx;
        height: 38rpx;
        background: #ff5500;
        border-radius: 4rpx;
      }
      .panel-header-title {
        height: 56rpx;
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 56rpx;
        margin-left: 24rpx;
      }
      .right-icon {
        width: 38rpx;
        height: 38rpx;
      }
    }
  }
</style>

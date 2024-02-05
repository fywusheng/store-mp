<template>
  <view class="section-header  p-0-32">
    <text class="fs-44 c-black flex-1 _width">{{ title }}</text>
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="scss" scoped>
.section-header {
  height: 88rpx;
  line-height: 88rpx;
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  ._width {
    width: 50%;
  }
}
</style>

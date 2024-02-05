<template>
  <view class="step-progress-bar flex-h flex-c-c">
    <view class="line line--left" :class="{ 'line--highlight': step > 1 }" />
    <view class="line line--right" :class="{ 'line--highlight': step > 2 }" />
    <view
      class="step flex-v flex-c-c flex-1"
      :class="{ 'step--highlight': step === 1 }"
    >
      <image
        class="icon"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-step-finished.png"
        v-if="step > 1"
      />
      <text class="number fs-44 fw-500 c-white" v-else>1</text>
      <text class="title fs-36 mt-24">完善基本信息</text>
    </view>
    <view
      class="step flex-v flex-c-c flex-1"
      :class="{ 'step--highlight': step === 2 }"
    >
      <image
        class="icon"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-step-finished.png"
        v-if="step > 2"
      />
      <text class="number fs-44 fw-500 c-white" v-else>2</text>
      <text class="title fs-36 mt-24">添加紧急联系人</text>
    </view>
    <view
      class="step flex-v flex-c-c flex-1"
      :class="{ 'step--highlight': step === 3 }"
    >
      <image
        class="icon"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-step-finished.png"
        v-if="step > 3"
      />
      <text class="number fs-44 fw-500 c-white" v-else>3</text>
      <text class="title fs-36 mt-24">提交审核</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1,
      validator: (value) => [1, 2, 3].indexOf(value) !== -1,
    },
  },
};
</script>

<style lang="scss" scoped>
.step-progress-bar {
  position: relative;
  height: 256rpx;
  .line {
    position: absolute;
    top: 68rpx;
    width: calc((1 / 3) * 100vw);
    height: 4rpx;
    background: #c8c9cc;
    &--highlight {
      background: #ffc769;
    }
    &--left {
      left: calc((1 / 6) * 100vw);
    }
    &--right {
      right: calc((1 / 6) * 100vw);
    }
  }
  .step {
    position: relative;
    .icon {
      @include square(76);
    }
    .number {
      @include square(76);
      line-height: 76rpx;
      border-radius: 38rpx;
      text-align: center;
      background: #c8c9cc;
    }
    .title {
      @include size(172, 100);
      text-align: center;
      color: $color-lightgrey;
      font-weight: 400;
    }
    &--highlight {
      .number {
        background: #ffc769;
      }
      .title {
        color: $color-black;
        font-weight: 500;
      }
    }
  }
}
</style>

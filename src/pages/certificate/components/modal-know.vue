<template>
  <view>
    <uni-popup type="center" ref="popupM">
      <view class="notice">
        <view class="_center"
          ><image
            class="_img"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/rights/modalTop.png"
        /></view>
        <view class="_t">当前所在地区功能开通中</view>
        <view class="_subt">您将进入示例页面</view>
        <view class="spaceLine"></view>
        <view class="know" @click="close">我知道了</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
export default {
  components: { uniPopup },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$refs.popupM.close();
      this.$emit("close", 1);
    },
    open() {
      this.$refs.popupM.open();
    },
  },
};
</script>
<style lang="scss" scoped>
.notice {
  width: 620rpx;
  height: 552rpx;
  background: #ffffff;
  border-radius: 16rpx;
  ._center {
    width: 100%;
    margin: 32rpx 118rpx 33rpx 118rpx;
  }
  ._img {
    width: 384rpx;
    height: 204rpx;
  }
  ._t {
    width: 100%;
    text-align: center;
    font-size: 48rpx;
    font-weight: 500;
    color: #333333;
    line-height: 54rpx;
  }
  ._subt {
    font-size: 40rpx;
    font-weight: 400;
    color: #333333;
    line-height: 54rpx;
    text-align: center;
    margin-top: 24rpx;
    margin-bottom: 60rpx;
  }
  .spaceLine {
    width: 100%;
    height: 1rpx;
    background-color: #e5e5e5;
  }
  .know {
    height: 50rpx;
    font-size: 44rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff5500;
    line-height: 111rpx;
    text-align: center;
  }
}
</style>

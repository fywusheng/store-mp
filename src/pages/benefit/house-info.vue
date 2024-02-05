<!-- 出行旅游 -->
<template>
  <view class="trip-info">
    <image
      class="icon-info"
      src="https://ggllstatic.hpgjzlinfo.com/static/benefit/house-info.jpg"
      mode="widthFix"
    />
    <!-- <view class="_block"></view>
    <view class="footer">
      <image
        class="sub-btn"
        src="https://ggllstatic.hpgjzlinfo.com/static/benefit/pre-sub-btn.png"
        mode="scaleToFill"
        @click="goConfirmOrder"
      />
    </view> -->
  </view>
</template>
<script setup>
// import { onLoad } from "@dcloudio/uni-app";
// import { ref } from "vue";

// let id = ref("");

// onLoad((options) => {
//   id = options.id || "1";
// });

// const goConfirmOrder = () => {
//   uni.navigateTo({ url: "/pages/benefit/confirm-order?id=" + id });
// };
</script>
<style lang="scss" scoped>
.trip-info {
  .icon-info {
    width: 100vw;
  }
  ._block {
    width: 100%;
    height: 198rpx;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 750rpx;
    height: 198rpx;
    background: #384e3d;
    display: flex;
    align-items: center;
    justify-content: center;
    .sub-btn {
      width: 686rpx;
      height: 108rpx;
    }
  }
}
</style>

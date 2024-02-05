<template>
  <view class="register-result flex-v flex-c-s">
    <image
      class="result-icon mt-80"
      mode="scaleToFill"
      src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-success.png"
    />
    <text class="fs-50 lh-72 fw-bold c-primary mt-60">恭喜您，注册成功</text>
    <text class="fs-40 lh-60 fw-bold c-grey mt-24"
      >立即领取电子证照老年人证</text
    >
    <text class="fs-40 lh-60 fw-bold c-grey">享受更多服务</text>
    <button
      class="button button-1 fs-44 fw-bold c-white mt-128"
      hover-class="none"
      @click="handleApplyClick"
    >
      立即领取
    </button>
    <button
      class="button button-2 fs-44 c-primary mt-32 bg-white"
      hover-class="none"
      @click="handleBackToHomeClick"
    >
      暂不领取
    </button>
    <!-- <pop-entry-method  ref="popup" :showImg="showImg" /> -->
    <scan-or-input-popup ref="popup" />
  </view>
</template>

<script>
// import PopEntryMethod from '@/components/pop-entry-method/pop-entry-method.vue'
import ScanOrInputPopup from "./common/scan-or-input-popup.vue";
import api from "@/apis/index.js";
export default {
  components: { ScanOrInputPopup },
  data() {
    return {
      // 录入方式是否有图片
      showImg: false,
    };
  },
  onLoad() {
    // 注册成功获取用户数据
    api.getUserInfo({
      data: {
        accessToken: uni.getStorageSync("token"),
      },
      success: (data) => {
        this.userInfo = data;
        uni.setStorageSync("userInfo", data);
      },
    });
  },
  methods: {
    /**
     * 申领点击事件
     */
    handleApplyClick() {
      this.$refs.popup.open();
      return;
      uni.navigateBack({
        delta: 9,
        complete: () => {
          uni.navigateTo({
            url: "/pages/certificate/applicant-info",
          });
        },
      });
    },
    /**
     * 暂不领取点击事件
     */
    handleBackToHomeClick() {
      uni.navigateBack({ delta: 9 });
    },
  },
  mounted() {
    //  this.$refs.popup.open()
  },
};
</script>

<style lang="scss" scoped>
.register-result {
  .result-icon {
    @include size(220, 176);
  }
  .button {
    @include size(600, 108);
    line-height: 108rpx;
    border-radius: 54rpx;
    &-1 {
      background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
      border-radius: 54rpx;
      margin-top: 128rpx;
    }
    &-2 {
      border: 2rpx solid #cecece;
      box-sizing: border-box;
      color: #999999;
    }
  }
}
</style>

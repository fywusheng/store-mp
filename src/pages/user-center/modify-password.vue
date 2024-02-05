<template>
  <view class="modify-phone-number">
    <view class="section flex-v">
      <view class="section-header flex-h flex-c-s">
        <text class="fs-32 c-grey ml-48">记得原来的密码</text>
      </view>
      <view
        class="row flex-h flex-c-b bg-white"
        @click="handleSMSValidationClicK"
      >
        <text class="fs-36 c-black ml-48">重置登录密码</text>
        <image
          class="icon mr-32"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
    </view>
    <view class="section flex-v">
      <view class="section-header flex-h flex-c-s">
        <text class="fs-32 c-grey ml-48">不记得原来的密码</text>
      </view>
      <view
        class="row flex-h flex-c-b bg-white"
        @click="handleRealPersonAuthenticationClick"
      >
        <text class="fs-36 c-black ml-48">重置登录密码</text>
        <image
          class="icon mr-32"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    /**
     * 不记得原来的密码
     */
    handleRealPersonAuthenticationClick() {
      uni.navigateTo({
        url: "/pages/user-center/modify-by-phone-number?type=4",
      });
    },
    /**
     * 记得原来的密码
     */
    handleSMSValidationClicK() {
      uni.navigateTo({
        url: "/pages/user-center/password-change-password",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.modify-phone-number {
  min-height: 100vh;
  background: #fbf9f7;
  .tips {
    .icon {
      @include square(160);
    }
    .text {
      max-width: 620rpx;
    }
  }
  .section {
    &-header {
      height: 88rpx;
    }
    .row {
      height: 124rpx;
      .icon {
        @include square(48);
      }
    }
  }
}
</style>

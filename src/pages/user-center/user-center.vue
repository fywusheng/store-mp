<template>
  <view class="user-center">
    <navigation-bar :shows-back-button="true"></navigation-bar>
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="background"></view>
    <view class="user-info flex-h flex-c-s m-0-32">
      <image
        class="avatar"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-default-avatar.png"
      />
      <view class="flex-v ml-32" v-if="userInfo.psnName">
        <text class="fs-60 c-black">{{ nameFilter(userInfo.psnName) }}</text>
        <text class="fs-36 c-black mt-16">
          {{ idCardNumberFilter(userInfo.idCard) }}
        </text>
      </view>
      <view class="flex-v ml-32" v-else>
        <text class="fs-60 c-black">
          {{ phoneNumberFilter(userInfo.tel) }}
        </text>
      </view>
    </view>
    <view class="list flex-v br-16">
      <view
        class="item flex-h flex-c-b pl-24 pr-12 bg-white"
        @click="handleRealNameAuthenticationClick"
      >
        <image
          class="item__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-realname-authentication.png"
        />
        <text class="fs-40 c-black flex-1 m-0-24">实名认证</text>
        <image
          class="item__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view
        class="item flex-h flex-c-b pl-24 pr-12 bg-white"
        @click="handleModifyPhoneNumberClick"
      >
        <image
          class="item__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-modify-phone-number.png"
        />
        <text class="fs-40 c-black flex-1 m-0-24">修改手机号</text>
        <image
          class="item__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view
        class="item flex-h flex-c-b pl-24 pr-12 bg-white"
        @click="handleModifyPasswordClick"
      >
        <image
          class="item__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-modify-password.png"
        />
        <text class="fs-40 c-black flex-1 m-0-24">修改密码</text>
        <image
          class="item__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view
        class="item flex-h flex-c-b pl-24 pr-12 bg-white"
        @click="handleMessageCenterClick"
      >
        <image
          class="item__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-message-center.png"
        />
        <text class="fs-40 c-black flex-1 m-0-24">消息中心</text>
        <image
          class="item__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view
        class="item flex-h flex-c-b pl-24 pr-12 bg-white"
        @click="handleFeedbackClick"
      >
        <image
          class="item__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-feedback.png"
        />
        <text class="fs-40 c-black flex-1 m-0-24">意见与反馈</text>
        <image
          class="item__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view
        class="item flex-h flex-c-b pl-24 pr-12 bg-white"
        @click="handleLogoutClick"
      >
        <image
          class="item__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-logout.png"
        />
        <text class="fs-40 c-black flex-1 m-0-24">退出登录</text>
        <image
          class="item__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
      <view class="item flex-h flex-c-b pl-24 pr-12 bg-white" @click="support">
        <image
          class="item__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-logout.png"
        />
        <text class="fs-40 c-black flex-1 m-0-24">赡养抚养</text>
        <image
          class="item__accessory"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png"
        />
      </view>
    </view>
  </view>
</template>

<script>
import NavigationBar from "../../components/common/navigation-bar.vue";
import api from "@/apis/index.js";
import { desensitizeName, desensitizeInfo } from "@/utils/desensitization.js";
export default {
  components: { NavigationBar },
  data() {
    return {
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      userInfo: uni.getStorageSync("userInfo"),
    };
  },
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo");
  },
  methods: {
    // 姓名过滤器, 用于姓名脱敏
    nameFilter(value) {
      return desensitizeName(value);
    },
    // 身份证号过滤器, 用于身份证号脱敏
    idCardNumberFilter(value) {
      return desensitizeInfo(value);
    },
    // 手机号过滤器, 用于手机号脱敏
    phoneNumberFilter(value) {
      return desensitizeInfo(value);
    },
    /**
     * 实名认证点击事件
     */
    handleRealNameAuthenticationClick() {
      if (this.userInfo.crtfStas !== 0) {
        this.$uni.showToast("您已完成实名认证，无需重复认证");
        return;
      }
      uni.navigateTo({
        url: "/pages/user-center/real-name-authentication",
      });
    },
    /**
     * 修改手机号点击事件
     */
    handleModifyPhoneNumberClick() {
      uni.navigateTo({
        url: "/pages/user-center/modify-phone-number",
      });
    },
    /**
     * 修改密码点击事件
     */
    handleModifyPasswordClick() {
      uni.navigateTo({
        url: "/pages/user-center/modify-password",
      });
    },
    /**
     * 消息中心点击事件
     */
    handleMessageCenterClick() {
      uni.navigateTo({
        url: "/pages/user-center/message-center",
      });
    },
    /**
     * 意见反馈点击事件
     */
    handleFeedbackClick() {
      uni.navigateTo({
        url: "/pages/user-center/feedback",
      });
    },
    /**
     * 退出登录点击事件
     */
    handleLogoutClick() {
      this.$uni.showConfirm({
        content: "是否退出登录",
        confirm: () => {
          api.logout({
            success: () => {
              ["token", "userInfo"].forEach((key) => {
                uni.removeStorageSync(key);
              });
              uni.$emit("didLogout");
              uni.navigateBack();
            },
          });
        },
      });
    },
    /**
     * 赡养抚养
     */
    support() {
      uni.navigateTo({
        url: "/pages/support/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-center {
  .background {
    z-index: -1;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 600rpx;
    background: linear-gradient(to bottom, rgba(255, 80, 0, 0.5), $color-white);
  }
  .user-info {
    .avatar {
      @include square(180);
    }
  }
  .list {
    margin: 64rpx 32rpx 0;
    box-shadow: 0px 4rpx 24rpx 0 rgba(0, 0, 0, 0.08);
    overflow: hidden;
    .item {
      height: 120rpx;
      border-bottom: 2rpx solid $color-line;
      &__icon {
        @include square(40);
      }
      &__accessory {
        @include square(48);
      }
    }
  }
}
</style>

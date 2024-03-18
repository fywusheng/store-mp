<template>
  <view class="modify-password">
    
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">新密码：</text>
      <input
        class="row__input fs-40 c-black flex-1"
        v-model="params.newPassword"
        type="text"
        :password="!showsNewPasswordText"
      />
      <image
        class="row__icon"
        :src="newPasswordIconURL" mode="scaleToFill"
        @click="showsNewPasswordText = !showsNewPasswordText"
      />
    </view>
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">确认密码：</text>
      <input
        class="row__input fs-40 c-black flex-1"
        v-model="params.confirmPassword"
        type="text"
        :password="!showsConfirmPasswordText"
      />
      <image
        class="row__icon"
        :src="confirmPasswordIconURL" mode="scaleToFill"
        @click="showsConfirmPasswordText = !showsConfirmPasswordText"
      />
    </view>
    <button class="modify-button fs-44 c-white" @click="handleModifyClick">
      完成
    </button>
  </view>
</template>

<script>
let Icon1  = "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-show-password.png";
let Icon2 = "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-hide-password.png";
import api from "@/apis/index.js";
import sha256 from "crypto-js/sha256";
export default {
  data() {
    return {
      // 是否明文显示新密码
      showsNewPasswordText: false,
      // 是否明文显示确认密码
      showsConfirmPasswordText: false,
      // 表单数据
      params: {
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
    // 新密码图标地址
    newPasswordIconURL() {
      return this.showsNewPasswordText ? Icon1 : Icon2;
    },
    // 确认密码图标地址
    confirmPasswordIconURL() {
      return this.showsConfirmPasswordText ? Icon1 : Icon2;
    },
  },
  methods: {
    /**
     * 修改点击事件
     */
    handleModifyClick() {
      if (this.params.newPassword.length === 0) {
        this.$uni.showToast("请输入新密码");
        return;
      }
      if (this.params.confirmPassword.length === 0) {
        this.$uni.showToast("请确认密码");
        return;
      }
      if (this.params.newPassword !== this.params.confirmPassword) {
        this.$uni.showToast("两次输入的密码不一致");
        return;
      }
      api.validateOldPassword({
        data: {
          oldPwd: sha256(this.params.oldPassword).toString(),
        },
        success: () => {
          api.modifyPassword({
            data: {
              oldPwd: sha256(this.params.oldPassword).toString(),
              newPwd: sha256(this.params.newPassword).toString(),
            },
            success: () => {
              this.$uni.showToast("修改成功");
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.modify-password {
  .row {
    height: 120rpx;
    &__input {
      height: 88rpx;
      line-height: 88rpx;
      border-bottom: 2rpx solid #dbdbdb;
    }
    &__icon {
      @include square(66);
      position: absolute;
      right: 60rpx;
      z-index: 9;
    }
  }
  .modify-button {
    margin: 72rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>

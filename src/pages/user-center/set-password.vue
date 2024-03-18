<template>
  <view class="set-password">
    <view class="title">
      <text class="fs-64 c-black">注册新用户</text>
    </view>
    <view class="row flex-h flex-c-s m-0-40">
      <text class="fs-40 c-black">设置密码：</text>
      <input class="row__input fs-40 c-black flex-1" v-model="params.password" type="text"
        maxlength="8" placeholder="请设置6-8位数字密码" placeholder-class="placeholder"
        :password="!showsPasswordText" />
      <image class="row__icon" :src="passwordIconURL" mode="scaleToFill"
        @click="showsPasswordText = !showsPasswordText" />
    </view>
    <view class="row flex-h flex-c-s m-0-40">
      <text class="fs-40 c-black">确认密码：</text>
      <input class="row__input fs-40 c-black flex-1" v-model="params.confirmPassword" type="text"
        maxlength="8" placeholder="请再次输入密码" placeholder-class="placeholder"
        :password="!showsConfirmPasswordText" />
      <image class="row__icon" :src="confirmPasswordIconURL" mode="scaleToFill"
        @click="showsConfirmPasswordText = !showsConfirmPasswordText" />
    </view>
    <button class="register-button fs-44 c-white" @click="handleRegisterClick">
      注册并登录
    </button>
  </view>
</template>

<script>
const Icon1 = 'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-show-password.png'
const Icon2 = 'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-hide-password.png'
import api from '@/apis/index.js'
import sha256 from 'crypto-js/sha256'
import { validatePassword } from '@/utils/validation.js'
export default {
  data() {
    return {
      // 是否明文显示密码
      showsPasswordText: false,
      // 是否明文显示确认密码
      showsConfirmPasswordText: false,
      // 表单数据
      params: {
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    // 密码图标地址
    passwordIconURL() {
      return this.showsPasswordText ? Icon1 : Icon2
    },
    // 确认密码图标地址
    confirmPasswordIconURL() {
      return this.showsConfirmPasswordText ? Icon1 : Icon2
    }
  },
  onLoad(e) {
    this.params.phoneNumber = e.phoneNumber
  },
  methods: {
    /**
     * 注册并登录点击事件
     */
    handleRegisterClick() {
      if (!this.params.password) {
        this.$uni.showToast('请输入密码')
        return
      }
      if (!validatePassword(this.params.password, /^[0-9]{6,8}$/)) {
        this.$uni.showToast('请输入 6-8 位由数字组成的密码')
        return
      }
      if (!this.params.confirmPassword) {
        this.$uni.showToast('请确认密码')
        return
      }
      if (this.params.password !== this.params.confirmPassword) {
        this.$uni.showToast('两次输入的密码不一致')
        return
      }

      let platform = ''
      // #ifdef MP-WEIXIN
      platform = 'wechat'
      // #endif
      // #ifdef MP-ALIPAY
      platform = 'alipay'
      // #endif
      // #ifdef MP-BAIDU
      platform = 'baidu'
      // #endif
      // #ifdef MP-TOUTIAO
      platform = 'toutiao'
      // #endif

      api.register({
        data: {
          mobile: this.params.phoneNumber,
          password: sha256(this.params.password).toString(),
          regChnl: platform
        },
        success: (data) => {
          uni.setStorageSync('token', data.accessToken)
          uni.$emit('didLogin')
          //  uni.navigateBack({ delta: 9 });//home
          uni.reLaunch({ url: '/pages/index/index', index: 0 })
          // uni.navigateTo({
          //   url: "/pages/user-center/register-result",
          // });
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.set-password {
  background-color: #fff;
  .title {
    padding: 60rpx;
  }
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
      z-index: 9;
      //#ifdef MP-ALIPAY
      right: 40rpx;
      width: 40rpx;
      height: 40rpx;
      //#endif
      //#ifdef MP-WEIXIN
      right: 60rpx;
      //#endif
    }
  }
  .register-button {
    margin: 72rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>

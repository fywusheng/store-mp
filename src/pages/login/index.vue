<!-- author by liushuag -->
<!-- date：2.14 -->
<template>
  <view class="dl_content">
    <!-- 登录 -->
    <view class="top">
      <image src="http://192.168.1.187:10088/static/store-mp/dlbg.png" class="bg-img" mode="widthFix"></image>
      <image src="http://192.168.1.187:10088/static/store-mp/logo.png" class="logo" mode="widthFix"></image>
    </view>
    <view class="bottom">
      <image src="http://192.168.1.187:10088/static/store-mp/dltitle.png" class="title-img" mode="widthFix"></image>
      <view class="dl_form">
        <view class="input_content phone_input">
          <image src=" http://192.168.1.187:10088/static/store-mp/phone-icon.png" class="form-icon" mode="widthFix"></image>
          <input
            class="uni-input"
            type="number"
            placeholder="请输入手机号"
            placeholder-class="placeholder"
            maxlength="11"
            v-model="params.phoneNumber"
          />
        </view>
        <view class="input_content yzm_input">
          <image src="http://192.168.1.187:10088/static/store-mp/aq-icon.png" class="form-icon" mode="widthFix"></image>
          <input
            class="uni-input"
            type="number"
            placeholder="输入手机验证码"
            placeholder-class="placeholder"
            maxlength="6"
            v-model="params.smsCode"
          />
          <text @click="getCode">{{ codeText }}</text>
        </view>
        <button class="dl_btn" @click="handleLoginClick">登录</button>
      </view>
    </view>
  </view>
</template>
<script>
  import api from '@/apis/index.js';
  import { validatePhoneNumber } from '@/utils/validation.js';
  export default {
    components: {},
    data() {
      return {
        codeText: '获取验证码',
        countdown: 60,
        timer: null,
        // 表单数据
        params: {
          phoneNumber: '13261890779',
          smsCode: '',
          // phoneNumber: "18311067100",
          // smsCode: "123953",
        },
      };
    },
    watch: {},
    mounted() {},
    onLoad() {},
    onShow() {},
    methods: {
      // 获取验证码倒计时逻辑
      getCode() {
        if (!this.params.phoneNumber) {
          this.$uni.showToast('请输入手机号');
          return;
        }
        if (!validatePhoneNumber(this.params.phoneNumber)) {
          this.$uni.showToast('手机号格式错误，请重新输入');
          return;
        }
        // 发送验证码的逻辑
        api.sendLoginSms({
          data: {
            mobile: this.params.phoneNumber,
            sceneFlag: 4,
          },
          success: (res) => {
            this.$uni.showToast('短信发送成功');
          },
        });
        // 开始倒计时
        this.startCountdown();
      },
      startCountdown() {
        if (this.timer) return;
        this.timer = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--;
            this.codeText = `${this.countdown}s`;
          } else {
            this.resetCountdown();
          }
        }, 1000);
      },
      resetCountdown() {
        clearInterval(this.timer);
        this.timer = null;
        this.countdown = 60;
        this.codeText = '获取验证码';
      },
      /**
       *登录
       */
      handleLoginClick() {
        if (!this.params.phoneNumber) {
          this.$uni.showToast('请输入手机号');
          return;
        }
        // if (!validatePhoneNumber(this.params.phoneNumber)) {
        //   this.$uni.showToast("手机号格式错误，请重新输入");
        //   return;
        // }
        // if (this.params.smsCode.length !== 6) {
        //   this.$uni.showToast("请输入正确的验证码");
        //   return;
        // }

        api.login({
          data: {
            phone: this.params.phoneNumber,
            code: this.params.smsCode,
          },
          success: (res) => {
            const dayjs = require('dayjs');
            let today = dayjs();
            if (res.shStoreDTO) {
              const endTime = dayjs(res.shStoreDTO.periodEndValidity);
              if (today.isBefore(endTime)) {
                res.shStoreDTO.storeSatus = 1; //1合作中
                uni.setStorageSync('storeSatus', 1);
              } else {
                res.shStoreDTO.storeSatus = 2; //2已过期
                uni.setStorageSync('storeSatus', 2);
              }
              uni.setStorageSync('storeId', res.shStoreDTO.id);
              // 如果登录手机号和店长联系电话相等 责证明这人是店长1 否则就是店员2
              if (res.accountPhone == res.shStoreDTO.contactPhone) {
                uni.setStorageSync('userRole', 1);
              } else {
                uni.setStorageSync('userRole', 2);
              }
            }
            uni.setStorageSync('token', res.token);
            uni.setStorageSync('userInfo', res);
            uni.setStorageSync('name', res.name);
            uni.setStorageSync('userLoginPhone', res.accountPhone);
            uni.setStorageSync('userId', res.id);
            uni.setStorageSync('storeNo', res.storeNo);

            Store.dispatch('login', res);
            uni.reLaunch({
              url: '/pages/index/index?storeNo=' + res.storeNo + '&userId=' + res.id,
            });
          },
        });
      },
    },
  };
</script>
<style>
  page {
    display: flex;
    flex-direction: column;
    height: 100%;
    /* #ifdef H5 */
    background-color: #fff;
    /* #endif */
  }
</style>
<style lang="scss">
  .dl_content {
    .top {
      position: relative;
      .bg-img {
        width: 100%;
        position: absolute;
        top: 0;
        z-index: 0;
      }
      .logo {
        width: 250rpx;
        position: absolute;
        top: 42rpx;
        left: 40rpx;
        z-index: 1;
      }
    }
    .bottom {
      position: relative;
      z-index: 1;
      padding: 0 64rpx;
      margin-top: 300rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title-img {
        width: 390rpx;
      }
      .dl_form {
        margin-top: 104rpx;
        .input_content {
          padding: 28rpx;
          display: flex;
          align-items: center;
          background: #f5f7fa;
          border-radius: 50rpx;
          margin-bottom: 40rpx;
          width: 622rpx;
          .uni-input {
            font-size: 28rpx;
            color: #333;
            margin-left: 24rpx;
          }
          .placeholder {
            color: #909399;
            font-size: 28rpx;
          }
          .form-icon {
            width: 40rpx;
          }
        }
        .phone_input {
          .uni-input {
            flex: 1;
            height: 40rpx;
          }
        }
        .yzm_input {
          .uni-input {
            flex: 1;
            height: 40rpx;
          }
          text {
            color: #ff5500;
            font-size: 28rpx;
          }
        }
        .dl_btn {
          width: 622rpx;
          height: 88rpx;
          line-height: 88rpx;
          text-align: center;
          background: linear-gradient(135deg, #ff8800 0%, #ff5500 100%);
          border-radius: 44rpx;
          font-size: 32rpx;
          color: #ffffff;
          margin: auto;
          margin-top: 46rpx;
        }
      }
    }
  }
</style>

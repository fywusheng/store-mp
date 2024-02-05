<template>
  <view class="login">
    <image
      class="image"
      mode="scaleToFill"
      src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-login-logo.png"
    />
    <view class="row flex-h flex-c-s m-0-60 b-b-line">
      <!-- <text class="row__label fs-40 c-black">账&nbsp;&nbsp;&nbsp;号：</text> -->
      <input
        :auto-blur="true"
        @focus="addFocus"
        :adjust-position="false"
        class="row__input fs-40 c-black flex-1"
        v-model="params.account"
        :type="loginType === 'smsCode' ? 'number' : 'idcard'"
        :maxlength="loginType === 'smsCode' ? 11 : 18"
        :placeholder="placeholder"
        placeholder-class="placeholder"
      />
    </view>
    <view
      class="row flex-h flex-c-s m-0-60 b-b-line"
      v-if="loginType === 'smsCode'"
    >
      <!-- <text class="row__label fs-40 c-black">验证码：</text> -->
      <input
        @focus="addFocus"
        @blur="reduceFocus"
        class="row__input fs-40 c-black flex-1"
        v-model="params.smsCode"
        type="number"
        :adjust-position="false"
        maxlength="6"
        placeholder="请输入验证码"
        placeholder-class="placeholder"
      />
      <button
        class="row__button fs-36 c-code"
        hover-class="none"
        :class="{ 'c-grey': seconds > 0 }"
        :disabled="seconds > 0"
        @click=""
      >
        {{ seconds > 0 ? "重新发送(" + seconds + "s)" : "发送验证码" }}
      </button>
    </view>
    <view
      class="row flex-h flex-c-s m-0-60 b-b-line"
      v-else-if="loginType === 'password'"
    >
      <!-- <text class="row__label fs-40 c-black">密&nbsp;&nbsp;&nbsp;码：</text> -->
      <input
        @focus="addFocus"
        @blur="reduceFocus"
        class="row__input fs-40 c-black flex-1"
        v-model="params.password"
        type="text"
        maxlength="8"
        :adjust-position="false"
        :password="!showsPasswordText"
        placeholder="请输入密码"
        placeholder-class="placeholder"
      />
      <image
        class="row__icon"
        mode="scaleToFill"
        :src="passwordIconURL"
        @click="showsPasswordText = !showsPasswordText"
      />
    </view>
    <button
      class="button button-1 fs-44 c-white m-32"
      hover-class="none"
      @click="handleLoginClick"
    >
      登录
    </button>
    <button
      class="button button-2 fs-44 c-primary m-32"
      hover-class="none"
      @click="handleRegisterClick"
    >
      注册
    </button>
    <view class="actions flex-h flex-c-b p-0-40">
      <button
        class="action fs-40 c-primary"
        hover-class="none"
        @click="handleSwitchTypeClick"
      >
        切换登录方式
      </button>
      <button
        class="action fs-40 c-black"
        hover-class="none"
        @click="handleForgetPasswordClick"
      >
        忘记密码
      </button>
    </view>

    <view class="footer" v-if="fouceTime === 0">
      <view class="radio">
        <image
          @click="handleCheckXieyi"
          :class="checked ? 'icon-check' : 'icon-noCheck'"
          :src="checked ? icon.checked : icon.noChecked"
        />
      </view>

      <view class="fs-36">
        我已阅读并同意
        <text class="c-code" @click="handleUserAgreementClick">
          《用户协议》 </text
        >和
        <text class="c-code" @click="handlePrivacyPolicyClick">
          《隐私协议》
        </text>
        <text v-if="loginType === 'password'"
          >, 未注册的手机号将自动创建国家老龄平台账号</text
        >
      </view>
    </view>
    <action-sheet
      ref="actionSheet"
      :items="actionSheetItems"
      @click="handleActionSheetItemClick"
    />
    <!--人脸识别未通过提示 -->
    <modal
      ref="tipModal"
      cancelText="不同意"
      confirmText="同意"
      @cancel="handleCancel"
      @confirm="handleLoginConfirm"
    >
      <template v-slot:text>
        <view class="confirm-main" style="height: auto; line-height: 1.5">
          <view class="content">
            请您认真阅读
            <text class="c-code" @click="handleUserAgreementClick"
              >《用户协议》</text
            >
            和<text class="c-code" @click="handlePrivacyPolicyClick"
              >《隐私协议》</text
            >的全部条款， 接受后可开始使用我们的服务
          </view>
        </view>
      </template>
    </modal>
  </view>
</template>

<script>
import { ActionSheet } from "@/components/common/action-sheet";
import Modal from "@/components/common/modal.vue";
import api from "@/apis/index.js";
import sha256 from "crypto-js/sha256";
import {
  validatePhoneNumber,
  validateIDCardNumber,
} from "@/utils/validation.js";
export default {
  components: { ActionSheet, Modal },
  data() {
    return {
      focus: false,
      // 登录方式
      loginType: "password",
      checked: false,
      icon: {
        checked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png",
        noChecked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-default.png",
      },
      // 登录方式选项
      loginTypes: [],
      // 是否明文显示密码
      showsPasswordText: false,
      // 发送验证码倒计时
      seconds: 0,
      // 表单数据
      params: {
        account: "",
        smsCode: "",
        password: "",
      },
      // 输入框是否聚焦(0不聚焦，大于0聚焦)
      fouceTime: 0,
      // 弹窗选项
      actionSheetItems: [],
      goUrl: "",
    };
  },
  computed: {
    // 账号输入框提示内容
    placeholder() {
      const placeholders = {
        smsCode: "请输入注册手机号",
        password: "请输入手机号",
      };
      return placeholders[this.loginType];
    },
    // 密码图标地址
    passwordIconURL() {
      return this.showsPasswordText
        ? "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-show-password.png"
        : "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-hide-password.png";
    },
  },
  onLoad(e) {
    if (e.goUrl) {
      this.goUrl = e.goUrl;
    }
  },
  events: {
    onKeyboardHeight(e) {
      // 键盘高度变化时触发
      console.log("键盘高度：", e.height);
    },
  },
  onKeyboardHeight(e) {
    // 键盘高度变化时触发
    console.log("键盘高度22222：", e.height);
  },
  methods: {
    handleCheckXieyi() {
      this.checked = !this.checked;
    },
    reduceFocus() {
      this.fouceTime = this.fouceTime - 1;
    },
    addFocus() {
      this.fouceTime = this.fouceTime + 1;
      this.reduceFocusHandle();
    },
    handleCancel() {
      this.$refs.tipModal.close();
    },
    reduceFocusHandle() {
      //  this.fouceTime = this.fouceTime - 1;

      if (this.params.account.length !== 11) return;
      api.registerVerify({
        showsLoading: false,
        data: {
          mobile: this.params.account,
        },
        success: (res) => {
          if (!res) {
            // 如果用户未注册则弹窗引导用户注册
            this.$uni.showConfirm({
              content: "该账号尚未注册，是否立即注册",
              confirmText: "立即注册",
              confirm: () => {
                uni.navigateTo({
                  url: `/pages/user-center/register?phoneNumber=${this.params.account}`,
                });
              },
            });
          }
        },
      });
    },
    /**
     * 发送验证码点击事件
     */
    handleSencSMSCodeClick() {
      if (this.params.account.length !== 11) {
        this.$uni.showToast("请输入正确的手机号");
        return;
      }
      api.sendSMSCode({
        data: {
          mobile: this.params.account,
          sceneFlag: "4",
          source: "source",
          tmplId: "340701587045712968",
        },
        success: (data) => {
          this.$uni.showToast("发送成功");
          this.seconds = 60;
          this.timer = setInterval(() => {
            this.seconds -= 1;
            if (this.seconds < 0) clearInterval(this.timer);
          }, 1000);
        },
      });
    },
    /**
     * 登录点击事件
     */
    handleLoginClick() {
      if (!this.checked) {
        this.$refs.tipModal.open();
        return false;
      }
      if (this.loginType === "smsCode") {
        this.loginByPhoneNumber();
      } else if (this.loginType === "password") {
        this.loginByAccount();
      }
    },
    handleLoginConfirm() {
      this.$refs.tipModal.close();
      if (this.loginType === "smsCode") {
        this.loginByPhoneNumber();
      } else if (this.loginType === "password") {
        this.loginByAccount();
      }
    },
    /**
     * 注册点击事件
     */
    handleRegisterClick() {
      uni.navigateTo({
        url: `/pages/user-center/register?phoneNumber=${this.params.account}`,
      });
    },
    /**
     * 切换登录方式点击事件
     */
    handleSwitchTypeClick() {
      this.loginTypes = [];
      if (this.loginType !== "smsCode") {
        this.loginTypes.push({ value: "smsCode", text: "验证码登录" });
      }
      if (this.loginType !== "password") {
        this.loginTypes.push({ value: "password", text: "密码登录" });
      }

      this.actionSheetItems = this.loginTypes.map((item) => item.text);
      this.$refs.actionSheet.open();
    },
    /**
     * action sheet 弹窗点击回调
     */
    handleActionSheetItemClick(index) {
      this.loginType = this.loginTypes[index].value;
      this.checked = false;
    },
    /**
     * 忘记密码点击事件
     */
    handleForgetPasswordClick() {
      uni.navigateTo({
        url: `/pages/user-center/reset-password-by-phone-number?phoneNumber=${this.params.account}`,
      });
    },
    /**
     * 用户协议点击事件
     */
    handleUserAgreementClick() {
      const url = "https://ggll.hpgjzlinfo.com/#/agreement?type=0";
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    /**
     * 隐私协议点击事件
     */
    handlePrivacyPolicyClick() {
      const url = "https://ggll.hpgjzlinfo.com/#/agreement?type=1";
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    /**
     * 通过手机号及验证码登录
     */
    loginByPhoneNumber() {
      if (!this.params.account) {
        this.$uni.showToast("请输入手机号");
        return;
      }
      if (!validatePhoneNumber(this.params.account)) {
        this.$uni.showToast("手机号格式错误，请重新输入");
        return;
      }
      if (this.params.smsCode.length !== 6) {
        this.$uni.showToast("请输入正确的验证码");
        return;
      }
      api.loginByPhoneNumber({
        data: {
          mobile: this.params.account,
          vcode: this.params.smsCode,
        },
        success: (data) => {
          uni.setStorageSync("token", data.accessToken);
          Store.dispatch("login");
          // 登陆成功获取用户数据
          api.getUserInfo({
            data: {
              accessToken: uni.getStorageSync("token"),
            },
            success: (data) => {
              this.userInfo = data;
              uni.setStorageSync("userInfo", data);
              uni.$emit("didLogin");
              if (this.goUrl != "") {
                uni.reLaunch({
                  url: this.goUrl,
                });
              } else {
                uni.navigateBack();
              }
            },
          });
        },
      });
    },
    /**
     * 通过手机号或身份证号及密码登录
     */
    loginByAccount() {
      const { account } = this.params;
      if (!validatePhoneNumber(account) && !validateIDCardNumber(account)) {
        this.$uni.showToast("请输入正确的手机号或身份证号");
        return;
      }
      if (!this.params.password) {
        this.$uni.showToast("请输入密码");
        return;
      }
      api.loginByAccount({
        data: {
          acct: this.params.account,
          password: sha256(this.params.password).toString(),
        },
        success: (data) => {
          uni.setStorageSync("token", data.accessToken);
          Store.dispatch("login");

          // 登陆成功获取用户数据
          api.getUserInfo({
            data: {
              accessToken: uni.getStorageSync("token"),
            },
            success: (data) => {
              this.userInfo = data;
              uni.setStorageSync("userInfo", data);
              uni.$emit("didLogin");
              if (this.goUrl != "") {
                uni.reLaunch({
                  url: this.goUrl,
                });
              } else {
                uni.navigateBack();
              }
            },
          });
          // uni.navigateBack();
        },
        fail: (error) => {
          if (error.code === 600020) {
            // 如果用户未注册则弹窗引导用户注册
            this.$uni.showConfirm({
              content: "该账号尚未注册，是否立即注册",
              confirmText: "立即注册",
              confirm: () => {
                uni.navigateTo({
                  url: `/pages/user-center/register?phoneNumber=${this.params.account}`,
                });
              },
            });
          } else {
            this.$uni.showToast(error.message);
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
//modal弹框
.confirm-main {
  width: 552rpx;
  margin: 0 auto;
  height: 180rpx;
  text-align: left;
  font-size: 40rpx;
  line-height: 180rpx;
  .wen {
    color: #ff5500;
  }
}
.icon-check,
.icon-noCheck {
  width: 35rpx;
  height: 35rpx;
  margin-right: 8rpx;
  margin-top: 6rpx;
}
.c-code {
  color: #1890ff;
}
.b-b-line {
  border-bottom: 2rpx solid #dbdbdb;
}
.login {
  background-color: #fff;
  height: 100vh;
  padding-top: 32rpx;
  box-sizing: border-box;
  .image {
    @include size(354, 262);
    margin: 32rpx auto;
    display: block;
    margin-bottom: 32rpx;
  }
  .row {
    height: 120rpx;
    &__label {
      // #ifdef MP-ALIPAY
      width: 180rpx;
      // #endif
      // #ifdef MP-WEIXIN
      width: 160rpx;
      // #endif
    }
    &__input {
      height: 88rpx;
      line-height: 88rpx;
      // border-bottom: 2rpx solid #dbdbdb;
    }
    &__button {
      // position: absolute;
      // right: 60rpx;
      z-index: 9;
      background: transparent;
      transition: all 0.3s;
    }
    &__icon {
      @include square(66);
      // position: absolute;
      right: 60rpx;
      z-index: 9;
    }
  }
  .button {
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    &-1 {
      background: linear-gradient(to right, $color-secondary, $color-primary);
    }
    &-2 {
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
    }
  }
  .actions {
    .action {
      height: 40rpx;
      line-height: 40rpx;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    background: #fff;
    display: flex;
    flex-direction: row;
    padding: 0 32rpx 68rpx 32rpx;
    box-sizing: border-box;
  }
}
</style>

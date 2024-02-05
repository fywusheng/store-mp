<template>
  <view class="open-online-pay">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            title
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <image
            class="back-icon"
            @click="handleNavBack"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-arrow-left.png"
            mode="scaleToFill"
          />
          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            title
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <view class="img-warpper">
        <image
          class="icon-circle"
          :src="icon.auth"
        />信息加密处理,仅用于银行验证,请验证您本人的银行卡,认证通过后身份信息不可更改
      </view>
      <view class="bank-card" :style="{ background: cardInfo.cardColor }">
        <image
          class="icon-bg"
          src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-bank-pattern.png"
          mode="scaleToFill"
        />
        <view class="bank-name">
          <view class="icon-wrapper">
            <image class="icon-bank" :src="cardInfo.bankIcon" />
          </view>

          <view class="bank-txt">{{ cardInfo.bankName }}</view>
        </view>
        <view class="bank-no">{{ formatBankNum(cardInfo.bankCardNum) }}</view>
      </view>
    </view>
    <view class="page-content">
      <view class="item">
        <view class="label">真实姓名</view>
        <view class="cont gre">{{ cardInfo.userName }}</view>
      </view>
      <view class="item">
        <view class="label">证件类型</view>
        <view class="cont gre">身份证</view>
      </view>
      <view class="item">
        <view class="label">证件号码</view>
        <view class="cont gre">{{ cardInfo.idCard }}</view>
      </view>
      <view class="item">
        <view class="label">手机号码</view>
        <view class="cont">
          <input
            v-model="cardInfo.phone"
            class="input-phone"
            maxlength="11"
            @focus="handleFocus"
            type="number"
          />
          <image
            v-if="cardInfo.phone.length > 0"
            class="icon-delete"
            :src="icon.delete"
            @click="clearTel"
          />
          <image
            class="icon-circle-gre"
            :src="icon.circleGre"
            @click="handlePopPhoneModal"
          />
        </view>
      </view>
    </view>

    <view class="xieyi">
      <image
        @click="handleCheckXieyi"
        :class="checked ? 'icon-check' : 'icon-noCheck'"
        :src="checked ? icon.checked : icon.noChecked"
      />

      <view class="text">
        我已阅读并同意
        <text class="blue" @click="handleUserAgreementClick"
          >《国家老龄服务平台实名认证协议》</text
        >
      </view>
    </view>

    <view class="page-footer">
      <button
        class="btn btn-warning"
        :style="{ opacity: enableNext ? 1 : 0.5 }"
        :disabled="!enableNext"
        @click="handleNext"
      >
        下一步
      </button>
    </view>

    <!-- 绑卡未完成提示 -->
    <modal
      ref="tipModal"
      cancelText="仍要返回"
      confirmText="继续绑卡"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    >
      <view slot="text">
        <view class="confirm-main" style="height: auto; line-height: 1.5">
          <view class="content"
            >绑卡尚未完成，将无法在国家老龄服务平台APP使用该卡，是否确认返回？</view
          >
        </view>
      </view>
    </modal>

    <!-- 预留手机号说明 -->
    <modal
      ref="phoneModal"
      cancelText=" "
      confirmText="知道了"
      @confirm="handleConfirmPhoneModal"
    >
      <template v-slot:text>
        <view class="confirm-main" style="height: auto; line-height: 1.5">
          <view class="content"
            >该银行预留手机号为网银签约手机号，可通过网银个人客户基本资料中预留手机号码或者联系银行客服更新处理。</view
          >
        </view>
      </template>
    </modal>
  </view>
</template>

<script>
import NavigationBar from "@/components/common/navigation-bar.vue";
import Modal from "@/components/common/modal.vue";
import { hidePhone } from "@/utils/desensitization.js";
import { validatePhoneNumber } from "@/utils/validation.js";
import { getBankBg } from "@/utils/utils.js";
export default {
  components: { NavigationBar, Modal },
  data() {
    return {
      title: "开通在线支付",
      // 用户信息
      userInfo: {},
      // 银行卡信息
      cardInfo: {},
      // iconPath
      checked: false,
      // 是否编辑过手机号
      editFlag: false,
      // 第一次手机号
      firstPhone: "",
      icon: {
        auth: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-warn-circle-blue.png",
        delete:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-input-delete.png",
        circleGre:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-warn-circle.png",
        checked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png",
        noChecked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-default.png",
      },
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 状态栏高度
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
    };
  },
  onLoad(e) {
    this.cardInfo = JSON.parse(decodeURIComponent(e.cardInfo));
    this.userInfo = uni.getStorageSync("userInfo");
    this.firstPhone = this.cardInfo.phone;
    this.cardInfo.phone = hidePhone(this.cardInfo.phone);
  },
  onShow() {},
  computed: {
    enableNext() {
      return this.cardInfo.phone !== "" && this.checked;
    },
  },
  methods: {
    formatBankNum(bankNum) {
      const val = bankNum;
      const front = 4;
      const back = 4;
      let placeholder = 8;
      const length = val.length;
      placeholder = placeholder || length - front - back;

      if (length > front + back) {
        const frontVal = val.slice(0, front);
        const backVal = back ? val.slice(-back) : "";
        return frontVal + " " + "*".repeat(placeholder) + " " + backVal;
      }

      return val;
    },
    // 获取银行卡背景
    getBankBg(name) {
      return getBankBg(name);
    },
    // 实名认证协议
    handleUserAgreementClick() {
      const url = "https://ggll.hpgjzlinfo.com/#/agreement?type=3";
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    // 手机输入框聚焦事件
    handleFocus() {
      this.cardInfo.phone = "";
      this.editFlag = true;
    },
    // 预留手机号提示窗
    handlePopPhoneModal() {
      this.$refs.phoneModal.open();
    },
    // 仍要返回
    handleCancel() {
      // uni.redirectTo({
      //    url: '/pages/pay/add-bank-card'
      // });
      uni.navigateBack();
    },
    // 继续绑卡
    handleConfirm() {
      this.$refs.tipModal.close();
    },
    // 知道了
    handleConfirmPhoneModal() {
      this.$refs.phoneModal.close();
    },
    // 清空手机号
    clearTel() {
      this.userInfo.tel = "";
    },
    // 返回上一页
    handleNavBack() {
      this.$refs.tipModal.open();
    },
    // 返回首页
    handleHomeBack() {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
    // 下一步
    handleNext() {
      if (!this.cardInfo.phone) {
        this.$uni.showToast("请输入手机号");
        return;
      }
      // if (!validatePhoneNumber(this.cardInfo.phone)) {
      //   this.$uni.showToast("手机号格式错误，请重新输入");
      //   return;
      // }
      if (this.cardInfo.phone.length !== 11) {
        this.$uni.showToast("手机号格式错误，请重新输入");
        return;
      }
      const params = { ...this.cardInfo };
      if (!this.editFlag) {
        params.phone = this.firstPhone;
      }
      uni.navigateTo({
        url: `/pages/pay/verificat-code?cardInfo=${encodeURIComponent(
          JSON.stringify(params)
        )}`,
      });
    },
    // 协议按钮
    handleCheckXieyi() {
      this.checked = !this.checked;
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
.open-online-pay {
  // 头部
  .navigation-bar {
    box-sizing: border-box;
    padding-left: 24rpx;
    width: 100vw;
    height: 100%;
    .back-icon {
      flex-shrink: 0;
      width: 44rpx;
      height: 44rpx;
      margin-right: 48rpx;
      position: relative;
      z-index: 10;
    }
    .icon-desc {
      flex-shrink: 0;
      // width: 40rpx;
      // height: 40rpx;
      margin-left: 24rpx;
      position: relative;
      z-index: 10;
    }
    .desc {
      color: #666666;
    }
    .navigation-bar__title {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
    }
    .navigation-bar__complete {
      position: absolute;
      right: 36rpx;
    }
  }
  .page-header {
    width: 100vw;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img-warpper {
      display: flex;
      justify-content: center;
      text-align: center;
      height: 132rpx;
      font-size: 32rpx;
      color: #323233;
      background: #e8effa;
      padding: 20rpx 32rpx;
      box-sizing: border-box;
      .icon-circle {
        margin-right: 16rpx;
        width: 66rpx;
        height: 36rpx;
      }
    }
    .bank-card {
      width: 686rpx;
      height: 200rpx;
      background: #ffffff;
      box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
      border-radius: 16rpx;
      margin: 32rpx auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      position: relative;
      .icon-bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .bank-name {
        display: flex;
        align-items: center;
        margin: 32rpx 0 32rpx 24rpx;
        font-size: 40rpx;
        color: #ffffff;
        font-weight: 500;
        .icon-wrapper {
          width: 60rpx;
          height: 60rpx;
          border-radius: 30rpx;
          margin-right: 12rpx;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-bank {
            width: 48rpx;
            height: 48rpx;
          }
        }
      }
      .bank-no {
        text-align: center;
        font-size: 40rpx;
        color: #ffffff;
      }
    }
  }
  .page-content {
    border-bottom: 2rpx solid #eeeeee;
    border-top: 2rpx solid #eeeeee;
    padding: 0 32rpx;
    .item {
      display: flex;
      justify-content: space-between;
      font-weight: 32rpx;
      color: #333333;
      height: 120rpx;
      border-bottom: 2rpx solid #eeeeee;
      display: flex;
      font-size: 40rpx;
      .label {
        line-height: 120rpx;
        width: 226rpx;
      }
      .cont {
        line-height: 120rpx;
        flex: 1;
        position: relative;
        &.gre {
          color: #999999;
        }
        .input-phone {
          height: 100%;
          background: transparent;
        }
        .icon-delete {
          width: 32rpx;
          height: 32rpx;
          position: absolute;
          top: 44rpx;
          right: 58rpx;
          z-index: 100;
        }
        .icon-circle-gre {
          width: 32rpx;
          height: 32rpx;
          position: absolute;
          top: 44rpx;
          right: 0;
          z-index: 100;
        }
      }
    }
  }
  .xieyi {
    font-size: 32rpx;
    color: #333333;
    padding: 48rpx 32rpx 0 32rpx;
    display: flex;
    .bold {
      font-weight: bold;
    }
    .blue {
      color: #1890ff;
    }
    .icon-check,
    .icon-noCheck {
      width: 35rpx;
      height: 35rpx;
      margin-right: 8rpx;
      margin-top: 6rpx;
    }
  }
  .page-footer {
    margin-top: 94rpx;
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 100%;
      height: 108rpx;
      line-height: 108rpx;
      border: 2rpx solid #dcdee0;
      border-radius: 54rpx;
      font-size: 44rpx;
      font-weight: 500;
      &-default {
        border: 2rpx solid #dcdee0;
        color: #333333;
      }
      &-warning {
        border: none;
        opacity: 0.5;
        color: #ffffff;
        background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
      }
    }
  }
}
</style>

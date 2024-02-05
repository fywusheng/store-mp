// 亮证,老年码 10月14日 现有领证
<template>
  <view class="electronic-card">
    <view class="tab-bar flex-h">
      <view class="background animated" :class="backgroundClass" />
      <button
        class="tab flex-1 fs-44 fw-500 animated"
        hover-class="none"
        :class="selectedIndex === 0 ? 'c-white' : 'c-black'"
        @click="handleTabClick(0)"
      >
        亮证
      </button>
      <button
        class="tab flex-1 fs-44 fw-500 animated"
        hover-class="none"
        :class="selectedIndex === 1 ? 'c-white' : 'c-black'"
        @click="handleTabClick(1)"
      >
        扫一扫
      </button>
      <button
        class="tab flex-1 fs-44 fw-500 animated"
        hover-class="none"
        :class="selectedIndex === 2 ? 'c-white' : 'c-black'"
        @click="handleTabClick(2)"
      >
        老年码
      </button>
    </view>
    <!--旧版本 <electronic-certificate ref="electronic" v-if="showsElectronicCertificate" />
    <qr-code v-if="showsQRCode" ref="qrcode" id="qr-code" :has-card="hasCard" /> -->
    <scan-or-input-popup ref="popup" :showImg="false" />
    <!--新版本正常要使用的 <certificates v-if="selectedIndex === 0" ref="certificates"  @getLicense="handleGetButtonClick"   @handlePopShow="handlePopShow" />
    <spreading-code v-if="selectedIndex === 2" ref="SpreadingCode"   @getLicense="handleGetButtonClick"  @handlePopShow="handlePopShow" /> -->
    <show-points ref="showPoints" @success_flag="success_flag"></show-points>
    <view v-if="selectedIndex === 0">
      <view class="demo_card_bg">
        <image
          mode="scaleToFill"
          class="illustration2"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/card_bg.png"
        />
        <image
          mode="scaleToFill"
          class="illustration"
          v-if="showImg"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/qcode_zm-new.png"
        />
        <image
          mode="scaleToFill"
          class="illustration"
          v-if="!showImg"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/card_bm3-new.png"
        />
        <image
          mode="scaleToFill"
          class="illustration3"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/trans_icon.png"
        />
        <text class="watch_button" @click="watchBg">{{
          showImg ? "查看背面" : "查看正面"
        }}</text>
      </view>
      <view class="item_block">
        <image
          @click="notice"
          class="illustration"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-yibao.png"
        />
      </view>
      <view class="item_block">
        <image
          @click="notice"
          class="illustration"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-shebao.png"
        />
      </view>
      <view class="item_block">
        <image
          @click="notice"
          class="illustration"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-healthy-card-new.png"
        />
      </view>
    </view>
    <spreading-code
      v-if="selectedIndex === 2"
      ref="SpreadingCode"
      @getLicense="handleGetButtonClick"
      @handlePopShow="handlePopShow"
    />
    <!-- <view v-if="selectedIndex === 2">亮码</view> -->
    <modal-know ref="noticeModal"></modal-know>
  </view>
</template>

<script>
// import ElectronicCertificate from "./electronic-certificate.vue";
// import QrCode from "./qr-code.vue";
import Certificates from "./components/certificates.vue"; // 暂时不用，先不做引入
import SpreadingCode from "./components/spreading-code.vue";
import ScanOrInputPopup from "@/components/pop-entry-method/pop-entry-method.vue";
import api from "@/apis/index.js";
import { showPoints } from "./components/showPoints.vue";
import ModalKnow from "@/pages/certificate/components/modal-know.vue";
export default {
  components: {
    Certificates,
    SpreadingCode,
    ScanOrInputPopup,
    showPoints,
    ModalKnow,
  },
  data() {
    return {
      showImg: true,
      // 卡状态1：已授权已激活 2：未授权已激活 3：未激活 4.审核中 5.审核失败 6.其它渠道已经领取，在老龄委使用，需要进行用户授权
      cardStatus: 0,
      // 实名状态 0:未认证 1:实名、实人认证 2：实名认证
      crtfStas: 0,
      // 选中的下标
      selectedIndex: 0,
      // 是否已领卡
      hasCard: false,
      // 用户信息
      userInfo: uni.getStorageSync("userInfo"),
    };
  },
  computed: {
    backgroundClass() {
      const classes = [
        "background--left",
        "background--mid",
        "background--right",
      ];
      return classes[this.selectedIndex];
    },
    showsElectronicCertificate() {
      // 用户已领卡，且选择第一项
      return this.selectedIndex === 0 && this.hasCard;
    },
    showsQRCode() {
      // 用户已领卡，且选择第三项
      return this.selectedIndex === 2 || !this.hasCard;
    },
  },
  onLoad(e) {
    this.selectedIndex = Number(e.index) || 0;
    this.initData();
    if (this.selectedIndex === 0) {
      this.$refs.noticeModal.open();
    }
  },
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
  },
  mounted() {
    if (this.selectedIndex === 0) {
      this.$refs.noticeModal.open();
    } else if (this.selectedIndex === 1) {
      // 解耦版本说明：登录-扫一扫
      if (!this.userInfo) {
        // 未登录, 跳转到登录页面
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ["qrCode"],
        success: (res) => {
          this.getScanResult(res.result);
        },
        fail: () => {
          this.selectedIndex = 0;
        },
      });
    }
  },
  methods: {
    watchBg() {
      this.showImg = !this.showImg;
    },
    notice() {
      this.$uni.showToast("当前所在地区功能开通中");
    },
    success_flag(successFlag) {
      // this.$emit("success_flag",successFlag)
    },
    // 切换tab
    handleTabClick(index) {
      if (index === 0) {
        // 亮证每次点击都显示一下
        this.$refs.noticeModal.open();
      }
      if (index === 1) {
        // 解耦版本说明：登录-扫一扫
        if (!this.userInfo) {
          // 未登录, 跳转到登录页面
          uni.navigateTo({
            url: "/pages/user-center/login",
          });
          return;
        }
        uni.scanCode({
          onlyFromCamera: true,
          scanType: ["qrCode"],
          success: (res) => {
            this.getScanResult(res.result);
          },
        });
        // if (this.hasCard) {
        //   uni.scanCode({
        //     onlyFromCamera: true,
        //     scanType: ["qrCode"],
        //     success: (res) => {
        //       this.getScanResult(res.result);
        //     },
        //   });
        // } else {
        //   this.handleGetButtonClick()
        // }
      } else {
        // if(this.$refs.qrcode.timer){
        //     console.log("执行onUnload")
        //     clearInterval(this.$refs.qrcode.timer)
        //     this.$refs.qrcode.timer = null;
        // }
        // this.$refs.qrcode.timer
        console.log("====老年码点击---");
        this.selectedIndex = index;
      }
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        api.getUserInfo({
          data: {
            accessToken: uni.getStorageSync("token"),
          },
          success: (data) => {
            resolve(data);
          },
          fail: (error) => {
            reject(error);
          },
        });
      });
    },
    // 初始化页面数据
    async initData() {
      const userinfor = await this.getUserInfo();
      uni.setStorageSync("userInfo", userinfor);
      this.userInfo = userinfor;
      // 检查用户是否实名
      if (this.userInfo.crtfStas !== "2") {
        // 未实名, 展示立即领取界面
        this.hasCard = false;
        return;
      }
      api.getCertificateState({
        data: {
          appId: "53928a083adb4a7dad2eecf05564873f",
          idType: "身份证",
          userName: this.userInfo.psnName,
          idNo: this.userInfo.idCard,
        },
        success: (data) => {
          const authState = data.authState;
          // 判断卡状态
          if (authState === "1") {
            // 卡状态为 1, 无需操作
            const aucode = data.authCode;
            const getuserinfor = uni.getStorageSync("userInfo");
            getuserinfor["authCode"] = aucode;
            uni.setStorageSync("userInfo", getuserinfor);
            this.hasCard = true;
          } else {
            this.hasCard = false;
          }
        },
      });
    },
    // 解析扫一扫结果
    getScanResult(result) {
      api.getECToken({
        data: {
          appId: "53928a083adb4a7dad2eecf05564873f",
          orgId: "91350200MA3470MR5D",
          ecQrCode: result,
          authCode: this.userInfo.authCode,
        },
        success: (data) => {
          api.checkECToken({
            data: {
              appId: "53928a083adb4a7dad2eecf05564873f",
              ecQrCode: result,
              authCode: this.userInfo.authCode,
              ecToken: data.ecToken,
            },
            success: (data) => {
              uni.navigateTo({
                url: `/pages/certificate/scan-result?info=${data}`,
              });
            },
          });
        },
      });
    },
    /**
     * 立即领取点击事件 2已经实名
     */
    handleGetButtonClick() {
      // TODO  去掉立即领取 亮证区域
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo.crtfStas !== "2") {
        this.$refs.popup.open("1");
        return;
      }
      this.$refs.popup.open(2);
    },
    // 弹出500积分，并且标记已弹出
    handlePopShow(msgId) {
      this.$refs.showPoints.showsCreditsPopup = true;
      api.markPopover({
        data: {
          msgId: msgId,
          channel: "miniprogram",
        },
        success: (res) => {
          console.log("300积分弹出成功");
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.electronic-card {
  .demo_card_bg {
    position: relative;
    height: 532rpx;
    margin-top: 32rpx;
    margin-bottom: 32rpx;
    .watch_button {
      position: absolute;
      z-index: 3;
      bottom: 20rpx;
      left: 360rpx;
    }
    .illustration {
      width: 99%;
      position: absolute;
      z-index: 3;
      left: 3px;
      height: 90%;
    }
    .illustration2 {
      position: absolute;
      top: 0;
      width: 693rpx;
      z-index: 2;
      height: 539rpx;
      left: 32rpx;
    }
    .illustration3 {
      position: absolute;
      z-index: 3;
      bottom: -3rpx;
      left: 275rpx;
      width: 82rpx;
      height: 84rpx;
    }
  }
  .item_block {
    width: 686rpx;
    height: 306rpx;
    margin: 32rpx;
    .illustration {
      width: 100%;
      height: 100%;
    }
  }
  .tab-bar {
    position: relative;
    width: 100vw;
    height: 96rpx;
    .tab {
      line-height: 96rpx;
      z-index: 1;
    }
    .background {
      @include size(204, 72);
      position: absolute;
      top: 12rpx;
      border-radius: 36rpx;
      background: linear-gradient(to right, $color-secondary, $color-primary);
      &--left {
        left: calc(100vw * 1 / 6 - 102rpx);
      }
      &--mid {
        left: calc(100vw * 3 / 6 - 102rpx);
      }
      &--right {
        left: calc(100vw * 5 / 6 - 102rpx);
      }
    }
  }
}
</style>

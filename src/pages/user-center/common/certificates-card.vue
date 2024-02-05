//电子老年人证
<template>
  <view class="show-card">
    <view v-if="loading" class="need-known bg-white">
      <image
        v-if="cardStatus == 3 || cardStatus == 2 || crtfStas !== '2'"
        class="need-img mb-8"
        src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-state-receive.png"
        mode="scaleToFill"
        @click="handleGetButtonClick"
      />
      <image
        v-if="cardStatus == 4"
        class="need-img mb-8"
        src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-state-examine.png"
        mode="scaleToFill"
      />
      <image
        v-if="cardStatus == 5"
        class="need-img mb-8"
        src="https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-state-re-examine.png"
        mode="scaleToFill"
        @click="handleGetButtonClick"
      />
    </view>

    <view class="electronic-certificate" v-if="cardStatus == 1">
      <view v-if="frontCard" class="front-side">
        <image
          class="national-emblem"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-national-emblem.png"
        />
        <text class="title fs-36">中华人民共和国老年人证</text>
        <text class="name-title fs-20">
          姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名
        </text>
        <text class="name-value fs-20 c-black">{{ info.name }}</text>
        <text class="birthday-title fs-20">出生日期</text>
        <text class="birthday-value fs-20 c-black">
          {{ dateFilter(info.birthday) }}
        </text>
        <text class="id-card-number-title fs-20">公民身份号码</text>
        <text class="id-card-number-value fs-20 c-black">{{ info.psnNo }}</text>
        <text class="address-title fs-20">居住地址</text>
        <text class="address-value fs-20 c-black">
          {{ info.residentialAddress }}
        </text>
        <text class="gender-title fs-20">性别</text>
        <text class="gender-value fs-20 c-black">{{ info.sex }}</text>
        <text class="blood-type-title fs-20">血型</text>
        <text class="blood-type-value fs-20 c-black">{{ info.blood }}</text>
        <text class="card-number-title fs-16">编号</text>
        <text class="card-number-value fs-16 c-black">{{ cardNumber }}</text>
        <image class="avatar" mode="scaleToFill" :src="avatar" />
      </view>
      <view v-else class="back-side">
        <text class="contact-title fs-20">紧急联系人</text>
        <text class="contact-value fs-20 c-black">
          {{ info.emergencyContact }}
        </text>
        <text class="phone-number-title fs-20">联系电话</text>
        <text class="phone-number-value fs-20 c-black">
          {{ info.emergencyPhone }}
        </text>
        <text class="remark-title fs-20">
          备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注
        </text>
        <text class="organization-title fs-20">发证机关</text>
        <text class="organization-value fs-20 c-black">
          {{ info.licenceAuthority }}
        </text>
        <text class="date-title fs-20">发证日期</text>
        <text class="date-value fs-20 c-black">
          {{ dateFilter(info.licenceDate) }}
        </text>
        <text class="remark-value fs-20 c-black">{{ info.memo }}</text>
        <text class="copyright fs-16">
          中国老龄协会老年人才信息中心&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制
        </text>
        <canvas canvas-id="qr-code-card" id="qr-code-card" class="qr-code" />
      </view>
      <view class="buttom">
        <image
          class="icon-trans"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/trans_icon.png"
        />
        <text class="watch-btn" @click="watchBg">{{
          frontCard ? "查看背面" : "查看正面"
        }}</text>
      </view>
    </view>

    <scan-or-input-popup ref="popup" :showImg="true" />
    <show-points ref="showPoints" @success_flag="success_flag" />
  </view>
</template>

<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
import generator from "uniapp-qrcode";
import ScanOrInputPopup from "@/components/pop-entry-method/pop-entry-method.vue";
import { showPoints } from "./showPoints.vue";
import { desensitizeName, desensitizeInfo } from "@/utils/desensitization.js";
export default {
  components: { ScanOrInputPopup, showPoints },
  props: {},
  data() {
    return {
      // 卡状态1：已授权已激活 2：未授权已激活 3：未激活 4.审核中 5.审核失败 6.其它渠道已经领取，在老龄委使用，需要进行用户授权
      cardStatus: 0,
      // 实名状态 0:未认证 1:实名、实人认证 2：实名认证
      crtfStas: 0,
      // 证件正面
      frontCard: true,
      loading: false,
      // // 是否展示条形码大图
      // showsBarCode: false,
      // // 是否展示二维码大图
      // showsQRCode: false,
      // 自动刷新定时器
      timer: null,
      // 用户信息
      info: {},
      // 提交审核时间
      submitTime: "",
      // 电子证号
      cardNumber: "",
      // 头像
      avatar: "",
      // // 拨打电话弹窗选项
      // actionSheetItems: []
    };
  },
  mounted() {
    this.initData();
    console.log("---ces--", this.$refs.showPoints);
  },
  methods: {
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      return dayjs(value).format("YYYY年MM月DD日");
    },
    watchBg() {
      this.frontCard = !this.frontCard;
      generator.qrcode("qr-code-card", this, this.cardNumber, 112, 112);
    },
    success_flag(successFlag) {
      // this.$emit("success_flag",successFlag)
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
    /**
     * 初始化事件
     */
    init() {
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo.crtfStas !== "2") {
        this.$refs.popup.open("1");
        return;
      }
    },
    /**
     * 立即领取点击事件
     */
    handleGetButtonClick() {
      this.$uni.showToast("系统升级中！");
      // const userInfo = uni.getStorageSync("userInfo");
      // if (userInfo.crtfStas !== "2") {
      //   this.$refs.popup.open("1");
      //   return;
      // }
      // this.$refs.popup.open(2);
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
    // 查询是否弹出过500积分
    findPopoverList() {
      api.findPopoverList({
        data: { userId: this.userInfo.uactId },
        success: (res) => {
          let msgId = "";
          const popStatus = res.some((popItem, popIndex) => {
            if (popItem.popoverType === "0") {
              msgId = popItem.msgId;
              return true;
            }
          });
          if (popStatus) {
            // 弹出弹框
            api.checkLogOutUser({
              data: { uactId: this.userInfo.uactId },
              success: (data) => {
                console.log("===是否注销过---", data);
                if (!data) {
                  this.handlePopShow(msgId);
                }
              },
            });
          }
        },
      });
    },
    async initData() {
      this.loading = false;
      const userinfor = await this.getUserInfo();
      uni.setStorageSync("userInfo", userinfor);
      this.userInfo = userinfor;
      // 检查用户是否实名
      this.crtfStas = this.userInfo.crtfStas;
      // if (this.crtfStas !== '2') {
      //   // 未实名, 展示立即领取界面
      //   this.hasCard = false
      //   return
      // }
      // 检查用户信息中是否存在 authCode
      // 不存在 authCode, 请求获取卡状态接口
      api.getCertificateState({
        data: {
          appId: "53928a083adb4a7dad2eecf05564873f",
          idType: "身份证",
          userName: this.userInfo.psnName,
          idNo: this.userInfo.idCard,
        },
        success: (data) => {
          const authState = data.authState;
          this.cardStatus = data.authState;
          // 判断卡状态
          if (authState === "1") {
            // 卡状态为 1, 无需操作
            const aucode = data.authCode;
            const getuserinfor = uni.getStorageSync("userInfo");
            getuserinfor["authCode"] = aucode;
            uni.setStorageSync("userInfo", getuserinfor);
            // 获取用户证件信息
            this.requestData();
            // 查询是否弹出过500积分
            this.findPopoverList();
            this.loading = true;
          } else if (authState === "2") {
            // 卡状态为 2, 请求获取授权码接口
            api.getAuthorizationCode({
              data: {
                uactId: this.userInfo.uactId,
                psnName: this.userInfo.psnName,
                certNo: this.userInfo.idCard,
                appId: "53928a083adb4a7dad2eecf05564873f",
              },
              success: (data) => {
                // 授权成功
                this.userInfo.authCode = data.authCode;
                uni.setStorageSync("userInfo", this.userInfo);
                // 获取用户证件信息
                this.requestData();
                // 查询是否弹出过500积分
                this.findPopoverList();
                this.loading = true;
              },
              fail: (err) => {
                console.log(err);
                this.loading = true;
              },
            });
          } else if (authState === "3") {
            // 卡状态为 3, 显示立即领取
            // this.hasCard = false;
            this.loading = true;
          } else if (authState === "4") {
            this.submitTime = data.submitTime;
            this.loading = true;
            // // 卡状态为 4, 提示正在审核
            // this.$uni.showAlert({
            //   content: "您的申领请求正在审核中请耐心等待",
            // });
            // this.hasCard = false;
          } else if (authState === "5") {
            this.submitTime = data.submitTime;
            this.loading = true;
            // // 卡状态为 4, 提示正在审核
            // this.$uni.showAlert({
            //   content: "您的申领请求正在审核中请耐心等待",
            // });
            // this.hasCard = false;
          } else {
            this.loading = true;
          }
        },
        fail: (err) => {
          console.log(err);
          this.loading = true;
        },
      });
    },
    /**
     * 请求数据 获取证接口
     */
    requestData() {
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo.authCode) {
        // 已领证已授权
        api.getCertificateInfo({
          data: {
            chnlId: "53928a083adb4a7dad2eecf05564873f",
            authCode: userInfo.authCode,
          },
          success: (data) => {
            this.cardNumber = data.ecShowCardNo;
            this.avatar = data.ecCertPhoto;
            this.info = data.ecCertExtendDTO;
            generator.qrcode("qr-code-card", this, this.cardNumber, 112, 112);
          },
        });
      }
    },
  },
  onHide() {},
};
</script>

<style lang="scss" scoped>
.show-card {
  // padding-bottom: 120rpx;
  .need-known {
    position: relative;
    width: 686rpx;
    margin-bottom: 48rpx;
    .need-img {
      width: 100%;
      height: 306rpx;
      position: relative;
      z-index: 2;
    }
    .text {
      position: absolute;
      left: 50%;
      bottom: -166rpx;
      box-sizing: border-box;
      transform: translateX(-50%);
      width: 686rpx;
      height: 502rpx;
      padding: 336rpx 32rpx 32rpx;
      text-align: justify;
      color: #333;
      line-height: 50rpx;
      font-size: 36rpx;
      padding-bottom: 58rpx;
      z-index: 1;
      box-shadow: 0px 6rpx 20rpx 0px rgba(0, 0, 0, 0.12);
    }
    .fail-reason {
      width: 686rpx;
      margin: 0 auto;
      line-height: 50rpx;
      border-radius: 24rpx;
      .label {
        flex-shrink: 0;
        width: 156rpx;
      }
    }
    .c-333 {
      color: #333;
    }
    .c-666 {
      color: #666;
    }
  }
  .btn-box {
    position: fixed;
    width: 100vw;
    height: 108rpx;

    left: 0;
    bottom: 42rpx;
    .agree-button {
      width: 686rpx;
      height: 108rpx;
      line-height: 108rpx;
      background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
      border-radius: 54rpx;
      margin: 0 auto;
    }
  }
  .electronic-certificate {
    margin-bottom: 48rpx;
    height: 532rpx;
    background: #faf9f9;
    border-radius: 16rpx;
    .front-side,
    .back-side {
      @include size(686, 434);
      position: relative;
      margin-bottom: 0;
      background-image: url("https://ggllstatic.hpgjzlinfo.com/static/certificate/bg-certificate-card.png");
      background-size: 100% 100%;
      .national-emblem {
        @include size(90, 94);
        position: absolute;
        top: 34rpx;
        left: 54rpx;
      }
      .title {
        position: absolute;
        top: 62rpx;
        left: 152rpx;
        color: #2860a6;
        letter-spacing: 8rpx;
      }
      .name-title {
        position: absolute;
        top: 158rpx;
        left: 0;
        width: 152rpx;
        text-align: right;
        color: #2860a6;
      }
      .name-value {
        position: absolute;
        top: 158rpx;
        left: 164rpx;
      }
      .birthday-title {
        position: absolute;
        top: 214rpx;
        left: 0;
        width: 152rpx;
        text-align: right;
        color: #2860a6;
      }
      .birthday-value {
        position: absolute;
        top: 214rpx;
        left: 164rpx;
      }
      .id-card-number-title {
        position: absolute;
        top: 270rpx;
        left: 0;
        width: 152rpx;
        text-align: right;
        color: #2860a6;
      }
      .id-card-number-value {
        position: absolute;
        top: 270rpx;
        left: 164rpx;
      }
      .address-title {
        position: absolute;
        top: 324rpx;
        left: 0;
        width: 152rpx;
        text-align: right;
        color: #2860a6;
      }
      .address-value {
        position: absolute;
        top: 324rpx;
        left: 164rpx;
      }
      .gender-title {
        position: absolute;
        top: 158rpx;
        left: 384rpx;
        color: #2860a6;
      }
      .gender-value {
        position: absolute;
        top: 158rpx;
        left: 434rpx;
      }
      .blood-type-title {
        position: absolute;
        top: 216rpx;
        left: 384rpx;
        color: #2860a6;
      }
      .blood-type-value {
        position: absolute;
        top: 216rpx;
        left: 434rpx;
      }
      .card-number-title {
        position: absolute;
        top: 394rpx;
        left: 434rpx;
        color: #2860a6;
      }
      .card-number-value {
        position: absolute;
        top: 394rpx;
        left: 482rpx;
      }
      .avatar {
        @include size(120, 164);
        position: absolute;
        top: 132rpx;
        left: 520rpx;
      }
      .contact-title {
        position: absolute;
        top: 48rpx;
        left: 0;
        width: 152rpx;
        text-align: right;
        color: #2860a6;
      }
      .contact-value {
        position: absolute;
        top: 48rpx;
        left: 164rpx;
      }
      .phone-number-title {
        position: absolute;
        top: 102rpx;
        left: 0;
        width: 152rpx;
        text-align: right;
        color: #2860a6;
      }
      .phone-number-value {
        position: absolute;
        top: 102rpx;
        left: 164rpx;
      }
      .remark-title {
        position: absolute;
        top: 156rpx;
        left: 0;
        width: 152rpx;
        text-align: right;
        color: #2860a6;
      }
      .remark-value {
        position: absolute;
        top: 156rpx;
        left: 164rpx;
        max-width: 512rpx;
      }
      .organization-title {
        position: absolute;
        top: 290rpx;
        left: 342rpx;
        color: #2860a6;
      }
      .organization-value {
        position: absolute;
        top: 290rpx;
        left: 436rpx;
      }
      .date-title {
        position: absolute;
        top: 342rpx;
        left: 342rpx;
        color: #2860a6;
      }
      .date-value {
        position: absolute;
        top: 342rpx;
        left: 436rpx;
      }
      .qr-code {
        @include square(112);
        position: absolute;
        top: 248rpx;
        left: 92rpx;
      }
      .copyright {
        position: absolute;
        top: 390rpx;
        left: 496rpx;
        color: #2860a6;
      }
    }
    .buttom {
      height: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon-trans {
        width: 80rpx;
        height: 80rpx;
      }
      .watch-btn {
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 50rpx;
      }
    }
  }
}
</style>

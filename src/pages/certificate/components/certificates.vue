//老年证 10月14日 确认最新
<template>
  <view class="show-card">
    <view class="need-known bg-white" v-if="cardStatus == 3 || cardStatus == 2">
      <image
        class="need-img mb-8"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/card-need-known.png"
        mode="widthFix"
      />
      <view class="text br-24"
        >遵循自愿申领，即时办结的原则。需要申领电子老年人证的老年人。</view
      >
    </view>
    <view class="need-known bg-white br-24" v-if="cardStatus == 5">
      <image
        class="need-img mb-8"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/card-fail.png"
        mode="widthFix"
      />
      <view class="text fail-reason">
        <view class="flex-h flex-s-s mb-8">
          <view class="label c-666">申领时间:</view>
          <view class="c-333" v-if="submitTime">{{
            dateFilter(submitTime)
          }}</view>
        </view>
        <view class="flex-h flex-s-s">
          <view class="label c-666">失败原因:</view>
          <view class="c-333">证件照未通过，请重新拍照并申请</view>
        </view>
      </view>
    </view>
    <view class="need-known bg-white br-24" v-if="cardStatus == 4">
      <image
        class="need-img mb-8"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/card-checking.png"
        mode="widthFix"
      />
      <view class="text fail-reason">
        <view class="flex-h flex-s-s mb-8 c-333"
          >您的电子老年人证正在审核中</view
        >
        <view class="flex-h flex-s-s">
          <view class="label c-666">申领时间:</view>
          <view class="c-333" v-if="submitTime">{{
            dateFilter(submitTime)
          }}</view>
        </view>
      </view>
    </view>

    <view class="electronic-certificate" v-if="cardStatus == 1">
      <view class="front-side m-32">
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
      <view class="back-side m-32">
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

      <action-sheet
        ref="actionSheet"
        :items="actionSheetItems"
        @click="handleActionSheetItemClick"
      />
    </view>
    <view class="btn-box">
      <button
        class="agree-button fs-44 fw-bold c-white"
        v-if="cardStatus == 3 || cardStatus == 2"
        @click="handleGetButtonClick"
      >
        立即领取
      </button>
      <button
        class="agree-button fs-44 fw-bold c-white"
        v-if="cardStatus == 5"
        @click="handleGetButtonClick"
      >
        重新申领
      </button>
      <button
        class="agree-button fs-44 fw-bold c-white"
        v-if="cardStatus == 1"
        @click="handleManageButtonClick"
      >
        证照管理
      </button>
    </view>
    <action-sheet
      ref="actionSheet"
      :items="actionSheetItems"
      @click="handleActionSheetItemClick"
    />
  </view>
</template>

<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
import generator from "uniapp-qrcode";
import ActionSheet from "@/components/common/action-sheet";
// import ScanOrInputPopup from '@/components/pop-entry-method/pop-entry-method.vue'
import { desensitizeName, desensitizeInfo } from "@/utils/desensitization.js";
export default {
  components: { ActionSheet },
  props: {},
  data() {
    return {
      // 卡状态1：已授权已激活 2：未授权已激活 3：未激活 4.审核中 5.审核失败 6.其它渠道已经领取，在老龄委使用，需要进行用户授权
      cardStatus: 3,
      // 实名状态 0:未认证 1:实名、实人认证 2：实名认证
      crtfStas: 0,
      // 是否展示条形码大图
      showsBarCode: false,
      // 是否展示二维码大图
      showsQRCode: false,
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
      // 拨打电话弹窗选项
      actionSheetItems: [],
    };
  },
  onReady() {},
  onUnload() {
    // 退出页面时销毁定时器
    if (this.timer) {
      console.log("执行onUnload");
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 姓名过滤器, 用于姓名脱敏
    nameFilter(value) {
      return desensitizeName(value) || "";
    },
    // 身份证号过滤器, 用于身份证号脱敏
    idCardNumberFilter(value) {
      return desensitizeInfo(value) || "";
    },
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      return dayjs(value).format("YYYY年MM月DD日");
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
      // TODO  去掉立即领取 亮证区域
      // 解耦版本 接入国办h5
      // this.$uni.showToast('功能建设中，敬请期待。')
      this.$emit("getLicense");
    },
    /**
     * 证件管理点击事件
     */
    handleManageButtonClick() {
      this.actionSheetItems = [
        "证照信息变更",
        "更改绑定手机号",
        "添加赡养扶养人关系",
      ];
      this.$refs.actionSheet.open();
    },
    /**
     * action sheet 弹窗点击回调
     */
    handleActionSheetItemClick(index) {
      switch (this.actionSheetItems[index]) {
        case "证照信息变更":
          this.$uni.showToast("功能建设中，敬请期待。");
          break;
        case "更改绑定手机号":
          uni.navigateTo({
            url: "/pages/user-center/modify-phone-number",
          });
          break;
        case "添加赡养扶养人关系":
          uni.navigateTo({
            url: "/pages/support/index",
          });
          break;
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
    async initData() {
      const userinfor = await this.getUserInfo();
      uni.setStorageSync("userInfo", userinfor);
      this.userInfo = userinfor;
      // 检查用户是否实名
      this.crtfStas = this.userInfo.crtfStas;
      if (this.crtfStas !== "2") {
        // 未实名, 展示立即领取界面
        this.hasCard = false;
        return;
      }
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
            api.findPopoverList({
              data: {
                userId: this.userInfo.uactId,
              },
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
                  this.$emit("handlePopShow", msgId);
                }
              },
            });
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
                api.findPopoverList({
                  data: {
                    userId: this.userInfo.uactId,
                  },
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
                      this.$emit("handlePopShow", msgId);
                    }
                  },
                });
              },
            });
          } else if (authState === "3") {
            // 卡状态为 3, 显示立即领取
            // this.hasCard = false;
          } else if (authState === "4") {
            this.submitTime = data.submitTime;
            // // 卡状态为 4, 提示正在审核
            // this.$uni.showAlert({
            //   content: "您的申领请求正在审核中请耐心等待",
            // });
            // this.hasCard = false;
          } else if (authState === "5") {
            this.submitTime = data.submitTime;
            // // 卡状态为 4, 提示正在审核
            // this.$uni.showAlert({
            //   content: "您的申领请求正在审核中请耐心等待",
            // });
            // this.hasCard = false;
          }
        },
      });
    },
    /**
     * 请求数据 获取证接口
     */
    requestData() {
      const userInfo = uni.getStorageSync("userInfo");
      console.log("=====子组件的接口---", userInfo);
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
  padding-bottom: 120rpx;
  .need-known {
    position: relative;
    width: 686rpx;
    height: auto;
    margin: 32rpx auto;
    .need-img {
      width: 100%;
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
    padding-bottom: 30rpx;
    .front-side,
    .back-side {
      @include size(686, 434);
      position: relative;
      background: url("https://ggllstatic.hpgjzlinfo.com/static/certificate/bg-certificate-card.png");
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
  }
}
</style>

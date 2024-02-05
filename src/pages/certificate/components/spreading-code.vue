//展码 10月14日确认最新
<template>
  <view class="qr-code">
    <view class="no-card bg-white br-24" v-if="cardStatus == 3">
      <view class="flex-h flex-c-s title">
        <image
          class="img-logo"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/img-logo.png"
          mode="scaleToFill"
        />
        <text class="text">电子老年人证</text>
      </view>
      <view class="need-apply">
        <image
          class="img-apply"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/img-apply.png"
          mode="scaleToFill"
        />
        <view class="text">
          <view>您还未申领电子老年人证</view>
          <view>暂不可使用该功能</view>
        </view>
      </view>

      <view class="btn-box">
        <button
          class="agree-button fs-44 fw-bold c-white"
          @click="handleGetButtonClick"
        >
          立即领取
        </button>
      </view>
    </view>

    <view class="card flex-v mt-32 p-32 br-16" v-if="cardStatus !== 3">
      <image
        class="bg-code"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/show-code-bg.png"
        mode="widthFix"
      />
      <view class="title flex-h flex-c-s mb-28 par_demo">
        <image
          class="img-logo mr-16"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/img-logo.png"
          mode="scaleToFill"
        />
        <!-- TODO shili -->
        <image
          class="demo"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/shili.png"
          mode="scaleToFill"
        />
        <view class="fs-40 c-white">
          <view class="text fs-48 lh-72 fw-bold">中华人民共和国老年人证</view>
          <view class="text fs-36 made">中国老龄协会老年人才信息中心监制</view>
        </view>
      </view>
      <view class="info fs-36 c-white">
        姓名：{{ nameFilter(userInfo.psnName) }}
      </view>
      <view class="info fs-36 c-white">
        身份证：{{ idCardNumberFilter(userInfo.idCard) }}
      </view>

      <view
        class="container flex-v flex-c-s bg-white br-16 p-32"
        v-if="cardStatus == 1 && !showsBarCode && !showsQRCode"
      >
        <view
          class="flex-h flex-c-c bar-code-text"
          @click="showNumber = !showNumber"
        >
          {{ showNumber ? info.ecQrCode : "点击可查看数字条形码" }}</view
        >
        <view v-show="closeModalS" class="flex-v flex-c-s">
          <canvas
            canvas-id="bar-code"
            id="bar-code"
            class="bar-code"
            @click="handleShowsBarCode"
          />
          <canvas
            canvas-id="qr-code"
            id="qr-code"
            class="qr-code"
            @click="handleShowsQRCode"
          />
        </view>

        <view class="flex-h flex-c-c" v-if="!twoSecond">
          <text class="fs-40 c-lightgrey">每分钟自动</text>
          <!-- @click="handleRefreshClick" -->
          <button
            class="button fs-40 c-primary ml-16"
            hover-class="none"
            @click="handleRefreshClick_demo"
          >
            刷新
          </button>
        </view>
        <view class="flex-h flex-c-c" v-if="twoSecond">
          <button class="button fs-40 c-primary" hover-class="none">
            已刷新
          </button>
        </view>
      </view>
      <view
        class="container flex-v flex-c-c bg-white"
        v-if="cardStatus == 4 || cardStatus == 5"
      >
        <image
          class="icon-tip"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-tip.png"
          mode="scaleToFill"
        />
        <view class="un-use" v-if="cardStatus == 5">电子老年人证申领失败</view>
        <view class="un-use" v-if="cardStatus == 4">电子老年人证审核中</view>
        <view class="un-use">暂时无法使用</view>
      </view>
    </view>

    <view
      class="preview-bar-code bg-white flex-h flex-c-c"
      v-if="showsBarCode"
      :style="{ display: true ? 'flex' : 'none' }"
      @click="closeBarCode"
    >
      <view class="before-bar-code flex-v flex-c-c" v-if="!sureSave">
        <image
          class="icon-save"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-save.png"
          mode="scaleToFill"
        />
        <view class="keep-warn"
          >二维码用于身份认证和支付结算时向商家出示，请不要将二维码及数字发送给他人</view
        >
        <view class="btn-know flex-h flex-c-c" @click.stop="handleSave"
          >知道了</view
        >
      </view>
      <view class="after-save flex-v flex-c-c" v-if="sureSave">
        <view class="codeNum">{{ info.ecQrCode }}</view>

        <canvas canvas-id="bar-code-big" id="bar-code-big" class="image" />
      </view>
    </view>

    <view
      class="preview-qr-code bg-white flex-h flex-c-c"
      v-if="showsQRCode"
      :style="{ display: true ? 'flex' : 'none' }"
      @click="closeQRCode"
    >
      <canvas canvas-id="qr-code-big" id="qr-code-big" class="image" />
    </view>
    <view class="bottom_bg">
      <image
        class="img_bottom"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/card_bottom.png"
        mode="scaleToFill"
      />
    </view>
    <modal-know ref="noticeModal" @close="closeModal"></modal-know>
    <!-- <pop-entry-method  ref="popup" :showImg="showImg" /> -->
  </view>
</template>

<script>
import api from "@/apis/index.js";
import generator from "uniapp-qrcode";
import { debounce } from "@/utils/utils.js";
import { desensitizeName, desensitizeInfo } from "@/utils/desensitization.js";
import ModalKnow from "@/pages/certificate/components/modal-know.vue";
export default {
  components: { ModalKnow },
  props: {},
  data() {
    return {
      closeModalS: false,
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
      userInfo: {},

      info: {}, // 展码的数据

      showNumber: false, // 展示条形码数字

      sureSave: false, // 是否点击我知道

      twoSecond: false, // 刚刷新老年码未过两秒
    };
  },
  filters: {},
  onLoad() {},
  mounted() {
    this.$refs.noticeModal.open();
    // 模拟条码注释,后续删除
    // generator.barcode('bar-code', this, '11111888888889999999', 560, 128)
    // generator.qrcode('qr-code', this, '11111888888889999999', 500, 500)

    // this.initData()
    // cardStatus == 1 && !showsBarCode && !showsQRCode
    this.cardStatus = 1;
    this.showsBarCode = false;
    this.showsQRCode = false;
    this.userInfo.psnName = "赵宝华";
    this.userInfo.idCard = "150**********102X";
    this.info.ecQrCode = "11118888899999";
  },
  onReady() {
    // this.handleRefreshClick();
  },
  onUnload() {
    // 退出页面时销毁定时器
    if (this.timer) {
      console.log("执行onUnload");
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  destroyed() {
    if (this.timer) {
      console.log("执行onUnload");
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  watch: {
    info(n, o) {
      if (this.showsBarCode && this.info.ecQrCode) {
        generator.barcode("bar-code-big", this, this.info.ecQrCode, 1120, 256);
      }
      if (this.showsQRCode && this.info.ecQrCode) {
        generator.qrcode("qr-code-big", this, this.info.ecQrCode, 720, 720);
      }
    },
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
    closeModal(flag) {
      if (flag == 1) {
        this.closeModalS = true;
        this.$nextTick(() => {
          this.handleRefreshClick_demo();
        });
        console.log("===关闭监听---", this.closeModalS);
      }
    },
    /**
     * 展示大条形码
     */
    handleShowsBarCode() {
      this.sureSave = false;
      this.showsBarCode = true;
    },
    /**
     * 关闭大条形码
     */
    closeBarCode() {
      this.sureSave = false;
      this.showsBarCode = false;
      setTimeout(() => {
        generator.barcode("bar-code", this, this.info.ecQrCode, 560, 128);
        generator.qrcode("qr-code", this, this.info.ecQrCode, 500, 500);
      }, 100);
    },
    /**
     * 关闭大二维码
     */
    closeQRCode() {
      this.showsQRCode = false;
      setTimeout(() => {
        generator.barcode("bar-code", this, this.info.ecQrCode, 560, 128);
        generator.qrcode("qr-code", this, this.info.ecQrCode, 500, 500);
      }, 100);
    },

    /**
     * 点击我知道了
     */
    handleSave() {
      this.sureSave = true;
      this.showsBarCode = true;
      setTimeout(() => {
        generator.barcode("bar-code-big", this, this.info.ecQrCode, 1120, 256);
      }, 100);
    },
    /**
     * 展示大二维码
     */
    handleShowsQRCode() {
      this.showsQRCode = true;
      setTimeout(() => {
        generator.qrcode("qr-code-big", this, this.info.ecQrCode, 720, 720);
      }, 100);
    },
    // handleRefreshClick  特殊刷新 TODO 最后删除
    handleRefreshClick_demo() {
      generator.barcode(
        "bar-code",
        this,
        "11111888888889999999" + Math.random() * 10,
        560,
        128
      );
      generator.qrcode(
        "qr-code",
        this,
        "11111888888889999999" + Math.random() * 10,
        500,
        500
      );
    },
    /**
     * 刷新点击事件
     */
    handleRefreshClick: debounce(function () {
      this.setTimer();
      this.requestData();
    }, 200),
    /**
     * 立即领取点击事件
     */
    handleGetButtonClick() {
      // TODO  去掉立即领取 亮证区域
      // this.$uni.showToast('功能建设中，敬请期待。')
      this.$emit("getLicense");
    },
    /**
     * 请求数据   展二维码
     */
    requestData() {
      console.log("");
      const userInfo = uni.getStorageSync("userInfo");
      // TODO 之后放开
      // if (!userInfo.authCode) {
      //   return false
      // }
      // 展二维码
      api.getQRCodeInfo({
        showsLoading: false,
        data: {
          appId: "53928a083adb4a7dad2eecf05564873f",
          authCode: userInfo.authCode,
        },
        success: (data) => {
          this.info = data;
          generator.barcode("bar-code", this, "11111888888889999999", 560, 128);
          generator.qrcode("qr-code", this, "11111888888889999999", 500, 500);
          // generator.barcode('bar-code', this, data.ecQrCode, 560, 128)
          // generator.qrcode('qr-code', this, data.ecQrCode, 500, 500)
          this.twoSecond = true;
          setTimeout(() => {
            this.twoSecond = false;
          });
          // generator.qrcode('qr-code-big', this, data.ecQrCode, 720, 720)
        },
      });
    },
    /**
     * 设置定时器
     */
    setTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.requestData();
      }, 60000);
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
      console.log("====初始化44455---", this.userInfo, this.hasCard);
      // 检查用户是否实名
      if (this.userInfo.crtfStas !== "2") {
        // 未实名, 展示立即领取界面
        this.hasCard = false;
        return;
      }

      // 查询卡状态
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
            console.log("====缓存里面放入authcodoe--", getuserinfor);
            uni.setStorageSync("userInfo", getuserinfor);
            // 获取展码数据
            this.handleRefreshClick();
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
                this.userInfo.authCode = data.authCode;
                uni.setStorageSync("userInfo", this.userInfo);
                this.cardStatus = "1";
                // 获取展码数据
                this.handleRefreshClick();
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
            // // 卡状态为 4, 提示正在审核
            // this.$uni.showAlert({
            //   content: "您的申领请求正在审核中请耐心等待",
            // });
            // this.hasCard = false;
          }
        },
      });
    },
  },
  onHide() {},
};
</script>

<style lang="scss" scoped>
.qr-code {
  .img_bottom {
    width: 785rpx;
    height: 238rpx;
  }
  .no-card {
    width: 686rpx;
    height: auto;
    margin: 32rpx auto;
    padding-bottom: 58rpx;
    box-shadow: 0px 6rpx 20rpx 0px rgba(0, 0, 0, 0.12);
    .title {
      padding: 28rpx 24rpx;
      .img-logo {
        flex-shrink: 0;
        width: 64rpx;
        height: 64rpx;
        margin-right: 12rpx;
      }
      .text {
        font-size: 40rpx;
        font-weight: bold;
        color: #333333;
        line-height: 56rpx;
      }
    }
    .need-apply {
      position: relative;
      text-align: center;
      margin-top: 92rpx;
      margin-bottom: 126rpx;
      font-size: 0;
      .img-apply {
        width: 440rpx;
        height: 212rpx;
        margin: 0 auto;
        margin-bottom: 44rpx;
      }
      .text {
        width: 440rpx;
        font-size: 36rpx;
        margin: 0 auto;
        color: #666;
        line-height: 50rpx;
      }
    }
    .btn-box {
      width: 100%;
      height: 108rpx;
      .agree-button {
        width: 628rpx;
        height: 108rpx;
        line-height: 108rpx;
        background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
        border-radius: 54rpx;
        margin: 0 auto;
      }
    }
  }
  .card {
    position: relative;
    .demo {
      position: absolute;
      width: 197rpx;
      height: 198rpx;
      right: 0;
      top: 144rpx;
    }
    .bg-code {
      position: absolute;
      width: 100%;
      z-index: -1;
      left: 0;
      top: 0;
    }
    .title {
      .img-logo {
        width: 102rpx;
        height: 102rpx;
        flex-shrink: 0;
      }
      .made {
        line-height: 50rpx;
      }
    }
    .info {
      line-height: 50rpx;
      margin-bottom: 18rpx;
    }
    .container {
      margin-top: 32rpx;
      height: 808rpx;
      background: #ffffff;
      box-shadow: 0px 6rpx 20rpx 0px rgba(0, 0, 0, 0.12);
      border-radius: 24rpx;
      .bar-code-text {
        font-size: 36rpx;
        color: #666666;
        line-height: 50rpx;
        margin-bottom: 14rpx;
      }
      .bar-code {
        @include size(560, 128);
      }
      .qr-code {
        @include square(500);
      }
      .button {
        height: 40rpx;
        line-height: 40rpx;
      }
      .icon-code {
        width: 220rpx;
        height: 220rpx;
        margin: 160rpx auto 32rpx;
      }
      .qr-code-tip {
        font-size: 40rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 56rpx;
        text-align: center;
        margin-bottom: 40rpx;
      }
      .btn-get-code {
        width: 520rpx;
        height: 100rpx;
        line-height: 100rpx;
        background: linear-gradient(117deg, #ff8800 0%, #ff5000 100%);
        border-radius: 50rpx;
        color: #ffffff;
        margin-bottom: 204rpx;
      }
      .icon-tip {
        width: 100rpx;
        height: 98rpx;
        flex-shrink: 0;
        margin-bottom: 30rpx;
      }
      .un-use {
        flex-shrink: 0;
        width: 420rpx;
        font-size: 40rpx;
        text-align: center;
        color: #333333;
        line-height: 56rpx;
      }
    }
  }
  .preview-bar-code {
    position: fixed;
    top: 0;
    left: -50vw;
    width: 200vw;
    height: 100vh;
    z-index: 100;
    .before-bar-code {
      transform: rotate(90deg);
      .icon-save {
        flex-shrink: 0;
        width: 100rpx;
        height: 120rpx;
        margin-bottom: 42rpx;
      }
      .keep-warn {
        flex-shrink: 0;
        width: 750rpx;
        font-size: 40rpx;
        color: #333;
        line-height: 56rpx;
      }
      .btn-know {
        flex-shrink: 0;
        width: 396rpx;
        height: 108rpx;
        background: #eaeaea;
        border-radius: 54rpx;
        color: #ff5500;
        font-size: 44rpx;
        margin-top: 42rpx;
      }
    }
    .after-save {
      // background-color: #ff5000;
      .keep-warn {
        font-size: 52rpx;
        line-height: 74rpx;
      }
      .image {
        // transform-origin: center;
        // transform: rotate(90deg);
        @include size(1120, 256);
      }
    }
  }
  .preview-qr-code {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    .image {
      @include square(720);
    }
  }
}
</style>

<template>
  <view class="qr-code">
    <view class="card flex-v m-32 p-32 br-16">
      <text class="title fs-40 c-white mb-32">中华人民共和国老年人证</text>
      <text class="info fs-40 c-white mb-32">
        姓名：{{ nameFilter(info.userName) }}
      </text>
      <text class="info fs-36 c-white mb-32">
        身份证：{{ idCardNumberFilter(info.idNo) }}
      </text>
      <view
        v-if="info && info.userName"
        class="container flex-v flex-c-s bg-white br-16 p-32"
      >
        <canvas
          canvas-id="bar-code"
          id="bar-code"
          class="bar-code"
          @click="showsBarCode = true"
        />
        <canvas
          canvas-id="qr-code"
          id="qr-code"
          class="qr-code mb-80"
          @click="showsQRCode = true"
        />
        <view class="flex-h flex-c-c">
          <text class="fs-40 c-lightgrey">每隔1分钟自动</text>
          <button
            class="button fs-40 c-primary ml-16"
            hover-class="none"
            @click="handleRefreshClick"
          >
            刷新
          </button>
        </view>
      </view>
      <view v-else class="container flex-v flex-c-s bg-white br-16 p-32">
        <image
          class="icon-code"
          src="https://ggllstatic.hpgjzlinfo.com/static/show-qrcode/icon-code-bg.png"
          mode="scaleToFill"
        />
        <view class="qr-code-tip">
          <view>领取电子证照老年人证后</view>
          <view>可以使用更多功能</view>
        </view>
        <view class="flex-h flex-c-c">
          <button
            class="button fs-40 ml-16 btn-get-code"
            hover-class="none"
            @click="handleReceive"
          >
            立即领取
          </button>
        </view>
      </view>
    </view>
    <view
      class="preview-bar-code bg-white flex-h flex-c-c"
      :style="{ display: showsBarCode ? 'flex' : 'none' }"
      @click="showsBarCode = false"
    >
      <canvas canvas-id="bar-code-big" id="bar-code-big" class="image" />
    </view>
    <view
      class="preview-qr-code bg-white flex-h flex-c-c"
      :style="{ display: showsQRCode ? 'flex' : 'none' }"
      @click="showsQRCode = false"
    >
      <canvas canvas-id="qr-code-big" id="qr-code-big" class="image" />
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import generator from "uniapp-qrcode";
import { desensitizeName, desensitizeInfo } from "@/utils/desensitization.js";
export default {
  data() {
    return {
      // 是否展示条形码大图
      showsBarCode: false,
      // 是否展示二维码大图
      showsQRCode: false,
      // 自动刷新定时器
      timer: null,
      // 用户信息
      info: {},
    };
  },
  onLoad() {
    this.handleRefreshClick();
  },
  onUnload() {
    // 退出页面时销毁定时器
    this.timer = null;
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
    // 立即领取
    handleReceive() {
      this.$emit("receiveClick");
    },
    /**
     * 刷新点击事件
     */
    handleRefreshClick() {
      this.setTimer();
      this.requestData();
    },
    /**
     * 请求数据
     */
    requestData() {
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo.authCode) return;
      api.getQRCodeInfo({
        showsLoading: false,
        data: {
          appId: "53928a083adb4a7dad2eecf05564873f",
          authCode: userInfo.authCode,
        },
        success: (data) => {
          this.info = data;
          generator.barcode("bar-code", data.ecQrCode, 560, 128);
          generator.barcode("bar-code-big", data.ecQrCode, 1120, 256);
          generator.qrcode("qr-code", data.ecQrCode, 500, 500);
          generator.qrcode("qr-code-big", data.ecQrCode, 720, 720);
        },
      });
    },
    /**
     * 设置定时器
     */
    setTimer() {
      this.timer = null;
      this.timer = setInterval(() => {
        this.requestData();
      }, 60000);
    },
  },
};
</script>

<style lang="scss" scoped>
.qr-code {
  .card {
    background: linear-gradient(to bottom, $color-secondary, $color-primary);
    .title {
      line-height: 40rpx;
    }
    .info {
      line-height: 36rpx;
    }
    .container {
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
    }
  }
  .preview-bar-code {
    position: fixed;
    top: 0;
    left: -50vw;
    width: 200vw;
    height: 100vh;
    .image {
      @include size(1120, 256);
      transform: rotate(90deg);
    }
  }
  .preview-qr-code {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    .image {
      @include square(720);
    }
  }
}
</style>

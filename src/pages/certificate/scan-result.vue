<template>
  <view class="scan-result pt-32">
    <view class="container flex-v flex-c-s bg-white m-0-32">
      <text class="title fs-40 c-black m-32-0">{{ info.org_name }}</text>
      <view class="line" />
      <image
        class="avatar mt-40 mb-88"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-avatar.png"
      />
      <image
        class="success-icon"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-scan-success.png"
      />
      <view class="line" />
      <view class="info flex-v p-32">
        <view class="row flex-h flex-c-s mb-32">
          <text class="fs-40 c-lightgrey">出示信息</text>
        </view>
        <view class="row flex-h flex-c-s mb-24">
          <text class="fs-36 c-black">
            姓名：{{ nameFilter(info.psn_name) }}
          </text>
        </view>
        <view class="row flex-h flex-c-s mb-24">
          <text class="fs-36 c-black">
            身份证号：{{ idCardNumberFilter(info.psn_id) }}
          </text>
        </view>
        <view class="row flex-h flex-c-s mb-24">
          <text class="fs-36 c-black">年龄：{{ info.psn_age }}岁</text>
        </view>
        <view class="row flex-h flex-c-s mb-24">
          <text class="fs-36 c-black">核验时间：{{ info.time }}</text>
        </view>
      </view>
    </view>
    <image
      class="signature"
      mode="scaleToFill"
      src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-signature.png"
    />
    <button class="return-button fs-40 c-white">返回</button>
  </view>
</template>

<script>
import dayjs from "dayjs";
import { desensitizeName, desensitizeInfo } from "@/utils/desensitization.js";
export default {
  data() {
    return {
      // 扫描结果
      info: {},
    };
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
  },
  onLoad(e) {
    if (e.info) {
      this.info = JSON.parse(e.info);
      const time = this.info.check_time;
      this.info.time = dayjs(time).format("YYYY年MM月DD日 HH:mm:ss");
    }
  },
};
</script>

<style lang="scss" scoped>
.scan-result {
  min-height: calc(100vh - 32rpx);
  background: #fbf9f7;
  .container {
    position: relative;
    .line {
      width: 100%;
      height: 2rpx;
      background: #e5e5e5;
    }
    .avatar {
      @include square(240);
    }
    .success-icon {
      @include square(84);
      position: absolute;
      top: 360rpx;
    }
    .info {
      width: calc(100% - 64rpx);
    }
  }
  .signature {
    @include square(160);
    position: relative;
    float: right;
    margin-top: -80rpx;
    margin-right: 32rpx;
  }
  .return-button {
    @include size(686, 100);
    margin: 128rpx 32rpx 0;
    line-height: 100rpx;
    border-radius: 50rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>

// 遗嘱证
<template>
  <view class="will-card">
    <image
      v-if="userInfo.crtfStas !== '2'"
      class="icon-will"
      src="https://ggllstatic.hpgjzlinfo.com/static/user-center/will-no-receive.png"
      mode="scaleToFill"
      @click="openRealName"
    />
    <template v-else>
      <image
        v-if="isEmpty(willInfo)"
        class="icon-will"
        src="https://ggllstatic.hpgjzlinfo.com/static/user-center/will-no-take.png"
        mode="scaleToFill"
        @click="goSubscribeRegister"
      />
      <view v-if="!isEmpty(willInfo)" class="card-wrap">
        <image
          class="icon-will-bg"
          src="https://ggllstatic.hpgjzlinfo.com/static/user-center/will-card-bg.png"
          mode="scaleToFill"
        />
        <view class="content">
          <view class="row">
            <view class="lable">立遗嘱人：<text></text></view>
            <view class="cont">{{ willInfo.realName }}</view>
          </view>
          <view class="row">
            <view class="lable">遗嘱证号：<text></text></view>
            <view class="cont">{{ willInfo.testamentNo }}</view>
          </view>
          <view class="row">
            <view class="lable">订立日期：<text></text></view>
            <view class="cont">{{ willInfo.testamentDate }}</view>
          </view>
          <view class="row">
            <view class="lable">见证人 ：<text></text></view>
            <view class="cont">{{ willInfo.witness }}</view>
          </view>
          <view class="row">
            <view class="lable">代书人 ： <text></text></view>
            <view class="cont">{{ willInfo.scrivener }}</view>
          </view>
        </view>
      </view>
    </template>

    <scan-or-input-popup ref="popup" :showImg="true" />
    <!-- <show-points ref="showPoints" @success_flag="success_flag" /> -->
  </view>
</template>

<script>
// import api from "@/apis/index.js";
import ScanOrInputPopup from "@/components/pop-entry-method/pop-entry-method.vue";
export default {
  components: { ScanOrInputPopup },
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    },
    willInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    openRealName() {
      if (this.userInfo.crtfStas !== "2") {
        this.$refs.popup.open("1");
        return;
      }
      this.$refs.popup.open(2);
    },
    success_flag(successFlag) {
      // this.$emit("success_flag",successFlag)
    },
    goSubscribeRegister() {
      uni.navigateTo({ url: "/pages/services/subscribe" });
    },
    isEmpty(obj) {
      const arr = Object.keys(obj);
      return arr.length == 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.will-card {
  .icon-will {
    width: 684rpx;
    height: 306rpx;
  }
  .card-wrap {
    width: 684rpx;
    height: 420rpx;
    position: relative;
    .icon-will-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 684rpx;
      height: 420rpx;
    }
    .content {
      z-index: 10;
      position: absolute;
      font-family: PingFangSC-Medium, PingFang SC;
      top: 122rpx;
      left: 34rpx;
      .row {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        .lable {
          width: 170rpx;
          text-align: justify;
          height: 44rpx;
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
          line-height: 44rpx;
          text {
            display: inline-block;
            padding-left: 100%;
          }
        }
        .cont {
          height: 44rpx;
          font-size: 32rpx;
          font-weight: 400;
          color: #333333;
          line-height: 44rpx;
        }
      }
    }
  }
}
</style>

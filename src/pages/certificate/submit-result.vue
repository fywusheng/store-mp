//自己给自己领取结果页面
<template>
  <view class="submit-result">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar title="申请结果" :shows-back-button="true" />
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="flex-v flex-c-s">
      <image
        class="result-icon mt-80"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-submit-success.png"
      />
      <text class="fs-50 c-primary mt-32">恭喜您</text>
      <text class="fs-50 c-primary">您的申领已提交成功</text>
      <text class="fs-40 c-grey mt-32" v-if="isForSelf">
        电子证照已提交申领审核
      </text>
      <text class="fs-40 c-primary" v-if="isForSelf">
        审核通过后您将获赠300积分
      </text>
      <text class="fs-40 c-grey mt-32" v-if="!isForSelf">
        预计将在2个工作日内完成审核
      </text>
      <text class="fs-40 c-grey">请您耐心等待</text>
      <button
        class="button fs-44 c-white"
        hover-class="none"
        @click="handleBackToHomeClick"
      >
        {{ isForSelf ? "我知道了" : "返回首页" }}
      </button>
      <text class="fs-36 c-primary mt-32" v-if="isForSelf">
        温馨提示：积分可以兑换各种惠老服务哦！
      </text>
    </view>
    <view
      class="credits-popup flex-v flex-c-c"
      v-if="showsCreditsPopup"
      @click="detailPoint"
      @touchmove.stop="touchmove"
    >
      <image
        class="credits-image"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/family-account/image-common-credits-300.png"
      />
      <image
        class="close-icon mt-32"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-popup-close.png"
        @click="showsCreditsPopup = false"
      />
    </view>
    <modal
      ref="confirmpop"
      cancelText="放弃添加"
      confirmText="立刻添加"
      @cancel="cancel"
      @confirm="confirm"
    >
      <template v-slot:text>
        <view class="mainMin" v-if="reFale == 1">
          <view class="content">
            <text
              >您确定不添加赡养扶养关系吗？<text class="wen"
                >这将会影响您在本平台享有的权益和服务</text
              ></text
            >
          </view>
        </view>
        <view class="main" v-if="isForSelf && reFale != 1">
          <view class="content">
            <text
              >根据<text class="wen">《中华人民共和国老年人权益保障法》</text
              >,建议您添加"赡养抚养关系",否则将会影响您在本平台享有的权益和服务。</text
            >
          </view>
          <text class="infor">提示：添加"赡养抚养关系"可再拿100积分</text>
        </view>
      </template>
    </modal>
  </view>
</template>

<script>
import NavigationBar from "../../components/common/navigation-bar.vue";
import Modal from "@/components/common/modal.vue";
export default {
  components: { NavigationBar, Modal },
  data() {
    return {
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 是否为自己申领
      isForSelf: true,
      // 是否显示积分弹窗
      showsCreditsPopup: false,
      time: 3,
      reFale: null, // 1-返回
    };
  },
  onLoad() {
    // this.statrTime();
  },
  methods: {
    detailPoint() {
      uni.navigateTo({ url: "/pages/user-center/my-points" });
    },
    clear() {
      clearInterval(this.timer);
    },
    loading() {
      this.time--;
    },
    statrTime() {
      this.loading();
      this.timer = setInterval(() => {
        if (this.time === 1) {
          this.clear();
          this.showsCreditsPopup = false;
        } else {
          this.loading();
        }
      }, 1000);
    },

    cancel() {
      this.$refs.confirmpop.close();
      console.log("/pages/index/index");
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
    confirm() {
      this.$refs.confirmpop.close();
      console.log("/pages/support/index");
      uni.navigateTo({
        url: "/pages/support/index",
      });
    },
    /**
     * 导航栏返回键的点击事件
     */
    handleNavigationBack() {
      this.reFale = 1; // 返回
      if (this.isForSelf) {
        this.$refs.confirmpop.open();
      }
    },
    /**
     * 返回首页点击事件  我知道了
     */
    handleBackToHomeClick() {
      this.reFale = 0; // 我知道了
      if (this.isForSelf) {
        this.$refs.confirmpop.open();
      } else {
        // 不会出现我给他人领取的情况  暂时留存
        uni.reLaunch({
          url: "/pages/index/index",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 180px;
  padding-left: 15px;
  padding-right: 10px;
}
.mainMin {
  height: 130px;
  padding-left: 15px;
  padding-right: 10px;
}
.content {
  font-size: 18px;
  .wen {
    color: #ff5500;
  }
  padding-bottom: 20px;
}
.infor {
  font-size: 15px;
  color: #cdcdcd;
  height: 20px;
  line-height: 20px;
}
.submit-result {
  .result-icon {
    @include size(220, 176);
  }
  .button {
    @include size(686, 108);
    margin-top: 200rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    border: 2rpx solid $color-primary;
    box-sizing: border-box;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
  .credits-popup {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    .credits-image {
      @include size(604, 808);
    }
    .close-icon {
      @include square(72);
    }
  }
}
</style>

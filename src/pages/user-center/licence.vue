<template>
  <view class="licence">
    <!-- <view class="card-wrapper" @click="handleClick(1)"> -->
    <certificates-card></certificates-card>
    <!-- <image class="img" :src="icon.old" mode="scaleToFill" /> -->
    <!-- <view class="opreate">立即领取</view> -->
    <!-- </view> -->
    <view class="m-b-48">
      <will-card :user-info="userInfo" :will-info="willInfo"></will-card>
    </view>

    <view class="card-wrapper" @click="handleClick(2)">
      <image class="img" :src="icon.electronic" mode="scaleToFill" />
      <!-- <view class="opreate">添加并使用</view> -->
    </view>
    <view class="card-wrapper" @click="handleClick(3)">
      <image class="img" :src="icon.insuranceCard" mode="scaleToFill" />
      <!-- <view class="opreate">添加并使用</view> -->
    </view>
    <view class="card-wrapper" @click="handleClick(4)">
      <image class="img" :src="icon.healthy" mode="scaleToFill" />
      <!-- <view class="opreate">添加并使用</view> -->
    </view>

    <modal-know ref="noticeModal" />
  </view>
</template>

<script>
import api from "@/apis/index.js";
import ModalKnow from "@/pages/user-center/common/modal-know.vue";
import CertificatesCard from "./common/certificates-card.vue";
import WillCard from "./common/will-card.vue";
export default {
  components: { ModalKnow, CertificatesCard, WillCard },
  data() {
    return {
      icon: {
        // 老年卡
        old: "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-old-card-new.png",
        // 电子凭证
        electronic:
          "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-electronic-card-new.png",
        // 医保卡
        insuranceCard:
          "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-insurance-card-new.png",
        // 健康码
        healthy:
          "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-healthy-card-new.png",
      },
      // 用户信息
      userInfo: {},
      // 遗嘱证信息
      willInfo: {},
    };
  },
  async mounted() {
    await this.getUserInfo();
    this.getWIllInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      return new Promise((resolve, reject) => {
        api.getUserInfo({
          data: {
            accessToken: uni.getStorageSync("token"),
          },
          success: (data) => {
            this.userInfo = data;
            resolve(data);
          },
          fail: (error) => {
            reject(error);
          },
        });
      });
    },
    // 遗嘱证信息
    getWIllInfo() {
      api.getWillInfoByPhone({
        data: { phone: this.userInfo.tel },
        success: (data) => {
          if (data) {
            this.willInfo = data;
          }
        },
        fail: () => {
          // this.loading = false;
        },
      });
    },
    handleClick() {
      //    this.$refs.noticeModal.open();
      // https://api.hpgjzlinfo.com/nepsp-api/nun/api/family/removeFamily
      this.$uni.showToast({
        title: "当前所在地区功能开通中",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.licence {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .card-wrapper {
    width: 686rpx;
    height: 306rpx;
    border-radius: 16rpx;
    margin-bottom: 48rpx;
    .img {
      width: 100%;
      height: 100%;
    }
  }
  .m-b-48 {
    margin-bottom: 48rpx;
  }
}
</style>

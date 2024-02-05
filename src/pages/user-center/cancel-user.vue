<template>
  <view class="cancel">
    <image
      class="_img"
      src="https://ggllstatic.hpgjzlinfo.com/static/user-center/cancel_infor.png"
      mode="widthFix"
    />
    <view class="footer">
      点击【申请注销】即代表您已经同意《<text class="xy" @click="agreement"
        >用户注销协议</text
      >》
    </view>
    <view class="apply" @click="openModel">申请注销</view>
    <modal
      ref="tipModal"
      cancelText="取消"
      title="风险提示"
      confirmText="继续申请"
      @cancel="handleCancel"
      @confirm="confirm"
    >
      <template v-slot:text>
        <view class="confirm-main" style="height: auto; line-height: 1.5">
          <view class="content">
            <text class="c-code" @click="handleUserAgreementClick"
              >账号注销后，将无法找回，请再次确认，是否继续申请注销国家老龄服务平台账号</text
            >
          </view>
        </view>
      </template>
    </modal>
  </view>
</template>

<script>
import Modal from "@/components/common/modal.vue";
import api from "@/apis/index.js";

export default {
  components: { Modal },
  data() {
    return {};
  },
  computed: {},
  onLoad(e) {},
  events: {},

  methods: {
    agreement() {
      const url = "https://ggll.hpgjzlinfo.com/#/agreement?type=5";
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    handleCancel() {
      this.$refs.tipModal.close();
    },
    openModel() {
      this.$refs.tipModal.open();
    },
    confirm() {
      const userInfo = uni.getStorageSync("userInfo");
      api.cancel({
        data: { uactId: userInfo.uactId },
        success: (data) => {
          this.$refs.tipModal.close();
          if (data) {
            Store.dispatch("login");
            uni.navigateTo({ url: "/pages/user-center/result?type=1" });
          } else {
            uni.navigateTo({ url: "/pages/user-center/result?type=2" });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cancel {
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
  ._img {
    width: 100%;
  }
  .footer {
    padding: 24rpx 32rpx 24rpx 32rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    .xy {
      color: #1890ff;
    }
  }
  .apply {
    width: 80%;
    height: 108rpx;
    background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
    border-radius: 54rpx;
    border: 2rpx solid #ff5500;
    font-size: 44rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 108rpx;
    text-align: center;
    margin: 0 auto;
  }
}
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
</style>

<template>
  <view class="select-type">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar
      title="亲情账号"
      title-color="#ffffff"
      background-color="linear-gradient(to right, #ff8800, #ff5000)"
      back-button-style="white"
      :alpha="1"
      :shows-back-button="true"
    />
    <!-- #endif -->
    <view class="background" />
    <view class="blank" style="height: 200rpx" />
    <text class="title fs-40 fw-500 c-white ml-32">亲友账号专享权益</text>
    <image
      class="rights-instructions bg-white br-16"
      mode="scaleToFill"
      src="https://ggllstatic.hpgjzlinfo.com/static/family-account/image-family-account-rights-instructions.png"
    />
    <text class="type-title fs-40 fw-500 c-black">
      请选择亲情账号绑定方式
    </text>
    <image
      @click="imgRead"
      class="illustration m-0-32"
      mode="scaleToFill"
      src="https://ggllstatic.hpgjzlinfo.com/static/family-account/banner-family-account-illustration.png"
    />
    <view class="types">
      <view
        class="type flex-h flex-c-b m-32 br-16"
        @click="selectedTypeIndex = 0"
      >
        <image
          class="state-icon m-0-32"
          mode="scaleToFill"
          :src="getStateIconURL(0)"
        />
        <text class="fs-40 fw-500 c-black flex-1">被绑定人有手机号</text>
        <image
          class="phone-icon mr-40"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-family-account-phone.png"
        />
      </view>
      <text class="_line"
        >被绑定人无手机号请下载国家老龄服务平台APP进行添加</text
      >
      <!-- <view class="type flex-h flex-c-b m-32 br-16"
            @click="selectedTypeIndex = 1">
        <image class="state-icon m-0-32" mode="scaleToFill"
               :src="getStateIconURL(1)" />
        <text class="fs-40 fw-500 c-black flex-1">被绑定人无手机号</text>
        <image class="phone-icon mr-40" mode="scaleToFill"
               src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-family-account-no-phone.png" />
      </view> -->
    </view>
    <view class="blank" style="height: 200rpx" />
    <view class="footer bg-white">
      <button
        class="add-button fs-44 fw-500 c-white m-0-32"
        @click="handleAddButtonClick"
      >
        添加亲友
      </button>
    </view>
    <modal
      text=""
      ref="popup"
      :cancelText="modal.cancelText"
      :confirmText="modal.confirmText"
      @cancel="cancel"
      @confirm="confirm"
    >
      <template v-slot:text>
        <view class="main">
          <text>您还可以绑定您的【亲情账号】，再拿100积分！</text>
          <text class="warn">积分可以兑换各种惠老服务哦</text>
        </view>
      </template>
    </modal>
  </view>
</template>

<script>
import NavigationBar from "../../components/common/navigation-bar.vue";
import api from "@/apis/index.js";
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
      // 选中的绑定方式下标
      selectedTypeIndex: -1,
      // 模态框参数
      modal: {
        title: "",
        text: "",
        modImg: 1,
      },
      // 自定义弹框内容
      modal: {
        cancelText: "放弃绑定",
        confirmText: "立即绑定",
      },
    };
  },
  onLoad(options) {
    // if (options.family === '1') {
    // } else {
    //   this.findFamilyMemberList()
    // }
    uni.setStorageSync("reflash", true);
  },
  methods: {
    imgRead() {
      const url = `https://ggll.hpgjzlinfo.com/#/agreement?type=4&relation=1`;
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    /**
     * 获取亲情账号列表
     */
    findFamilyMemberList() {
      return new Promise((resolve, reject) => {
        api.findFamilyMemberList({
          data: {
            uactId: uni.getStorageSync("userInfo").uactId,
            pageNum: 1,
            pageSize: 20,
          },
          showLoading: true,
          success: (res) => {
            resolve();
            console.log("接口所得res：", res);
            // if (res.list) {
            //   this.list = res.list
            // }
            if (res.list.length > 0) {
              uni.redirectTo({
                url: "/pages/family-account/index",
              });
            }

            //
          },
        });
      });
    },
    /**
     * 添加亲友点击事件
     */
    handleAddButtonClick() {
      uni.navigateTo({
        url: "/pages/family-account/add?type=" + this.selectedTypeIndex,
      });
    },
    /**
     * 是否已添加过情亲
     */
    findUserIsAddSup() {
      api.findUserIsAddSup({
        data: {
          selectType: "1",
        },
        success: (res) => {
          // 已添加过返回true ,未添加返回false
          if (res) {
            uni.redirectTo({
              url: "/pages/family-account/index",
            });
          }
        },
      });
    },
    /**
     * 自定义导航栏返回点击事件
     */
    handleNavigationBack() {
      // uni.navigateBack()
      // 是否已添加过情亲
      const data = {
        selectType: "1",
      };
      api.findUserIsAddSup({
        data,
        success: (res) => {
          // this.canBind = res
          console.log("是否已添加过亲情:", res);
          if (!res) {
            this.modal = {
              cancelText: "放弃绑定",
              confirmText: "立即绑定",
            };
            this.$refs.popup.open();
          } else {
            uni.navigateBack();
          }
        },
      });

      // if (!this.canBind) {
      //   this.$uni.showConfirm({
      //     content:
      //       '您确定不添加赡养扶养关系吗？这将会影响您在本平台享有的权益和服务',
      //     confirmText: '立刻添加',
      //     cancelText: '放弃添加',
      //     cancel: () => {
      //       uni.navigateBack()
      //     },
      //   })
      // }else{
      //   uni.navigateBack()
      // }
      // this.$uni.showToast('拦截到返回事件')
    },
    /**
     * 绑定方式是否选中的图标路径
     */
    getStateIconURL(index) {
      if (index === this.selectedTypeIndex) {
        return "https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-selected.png";
      } else {
        return "https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-unselect.png";
      }
    },
    // 点击确定
    confirm() {
      this.$refs.popup.close();
    },
    // 点击取消
    cancel() {
      this.$refs.popup.close();
      uni.reLaunch({
        url: "/pages/index/mine?index=4",
      });
    },
    // 监听事件
    event(e) {
      console.log("监听事件:", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-type {
  ._line {
    font-size: 27rpx;
    margin-left: 32rpx;
  }
  .background {
    @include size(750, 362);
    position: absolute;
    top: 0;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
  .title {
    position: relative;
  }
  .rights-instructions {
    @include size(686, 328);
    position: relative;
    margin: 16rpx 32rpx;
    box-shadow: 0 8rpx 24rpx 0 rgba(0, 0, 0, 0.12);
  }
  .type-title {
    display: block;
    margin: 32rpx 32rpx 24rpx;
  }
  .illustration {
    @include size(686, 182);
  }
  .types {
    .type {
      height: 108rpx;
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
      .state-icon {
        @include square(52);
      }
      .phone-icon {
        @include size(66, 58);
      }
    }
  }
  .footer {
    position: fixed;
    width: 100vw;
    bottom: 0;
    display: flex;
    justify-content: center;
    .add-button {
      margin-bottom: 66rpx;
      width: 686rpx;
      height: 108rpx;
      line-height: 108rpx;
      border-radius: 54rpx;
      background: linear-gradient(to right, $color-secondary, $color-primary);
    }
  }
  .main {
    text-align: center;
    // width: 552rpx;
    font-size: 40rpx;
    margin: 0 54rpx;
    color: #333333;
    line-height: 50rpx;
    .warn {
      color: #ff5500;
    }
  }
}
</style>

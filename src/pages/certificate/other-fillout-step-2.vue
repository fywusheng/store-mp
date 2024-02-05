<template>
  <view class="fillout-step-2">
    <step-progress-bar :step="2" />
    <view
      class="section"
      v-for="(item, index) in params.contactList"
      :key="index"
    >
      <view class="section-header flex-h flex-c-s p-0-32">
        <image
          class="section-header__icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-contact-info.png"
        />
        <text class="fs-44 c-black ml-16">紧急联系人</text>
      </view>
      <view class="form m-0-32">
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__indicator">*</text>
          <text class="row__label fs-40 c-black mr-48">姓名(必填)</text>
          <input
            class="fs-40 c-black flex-1"
            placeholder="请输入联系人姓名"
            placeholder-class="placeholder"
            v-model="item.name"
          />
        </view>
        <view class="row flex-h flex-c-s p-20-0">
          <text class="row__indicator">*</text>
          <text class="row__label fs-40 c-black mr-48">联系电话(必填)</text>
          <input
            class="fs-40 c-black flex-1"
            type="number"
            maxlength="11"
            placeholder="请输入联系电话"
            placeholder-class="placeholder"
            v-model="item.phoneNumber"
          />
        </view>
        <button
          class="delete-button fs-40"
          hover-class="none"
          v-if="params.contactList.length > 1"
          @click="handleDeleteClick(index)"
        >
          删除
        </button>
      </view>
      <view
        class="section-footer"
        v-if="params.contactList.length > 1 && index === 0"
      />
    </view>
    <view
      class="add-button flex-h flex-c-c"
      v-if="params.contactList.length < 2"
      @click="handleAddClick"
    >
      <image
        class="add-button__icon"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-add-primary.png"
      />
      <text class="fs-40 c-primary ml-20">添加</text>
    </view>
    <view style="width: 100vw; height: 336rpx"></view>
    <view class="footer bg-white">
      <view class="tips">
        <text class="fs-36" style="color: #424141">我承诺</text>
        <text class="fs-36" style="color: #0097fe">
          以上填写信息为真实有效信息具有法律效益
        </text>
      </view>
      <view class="actions flex-h flex-c-b mt-32">
        <button
          class="action fs-44 c-primary bg-white border"
          @click="handlePreviousStepClick"
        >
          上一步
        </button>
        <button
          class="action fs-44 c-white bg-primary"
          @click="handleNextStepClick"
        >
          下一步
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import StepProgressBar from "./components/step-progress-bar.vue";
import { validatePhoneNumber } from "@/utils/validation.js";
import NavigationBar from "../../components/common/navigation-bar.vue";
import api from "@/apis/index.js";
export default {
  components: { StepProgressBar, NavigationBar },
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
      params: {
        contactList: [{ name: "", phoneNumber: "" }],
      },
    };
  },
  onLoad() {
    this.setData();

    uni.$on("didFilloutStepBack", this.handleFilloutStepBack);
  },
  methods: {
    // 返回上一页
    handleNavigationBack() {
      this.$uni.showConfirm({
        content: "您确定要中断申领电子老年人证吗?",
        confirmText: "继续申领",
        cancelText: "放弃申领",
        title: "",
        cancel: () => {
          uni.navigateBack({
            delta: 1,
          });
        },
      });
    },
    handleFilloutStepBack(params) {
      this.params = params;
      console.log("获取的参数2params：", params);
    },
    /**
     * 删除点击事件
     */
    handleDeleteClick(index) {
      this.params.contactList.splice(index, 1);
    },
    /**
     * 添加点击事件
     */
    handleAddClick() {
      this.params.contactList.push({ name: "", phoneNumber: "" });
    },
    /**
     * 上一步点击事件
     */
    handlePreviousStepClick() {
      uni.$emit("didFilloutStepBack", this.params);
      uni.navigateBack();
    },
    /**
     * 下一步点击事件  先直接处理申领动作  改动点 //TODO
     */
    handleNextStepClick() {
      console.log("====this.checkInput()---", this.checkInput());
      if (!this.checkInput()) return;
      console.log("====打印所有的参数---", this.params);
      uni.navigateTo({
        url: "/pages/certificate/other-fillout-step-3",
        success: (res) => {
          console.log("成功res:", res);
          res.eventChannel.emit("didOpenPageFinish", this.params);
        },
        complete: (com) => {
          console.log("完成com:", com);
        },
        fail: (err) => {
          console.log("出错err:", err);
        },
      });
    },

    /**
     * 设置数据 TODO 查看初始上一步的值
     */
    setData() {
      const eventChannel = this.getOpenerEventChannel();
      if (!eventChannel.on) return;
      eventChannel.on("didOpenPageFinish", (data) => {
        console.log("==拿到前一步的数据--", data);
        this.params = { ...this.params, ...data };
        console.log("==拿到前一步的数据3333--", this.params);
      });
    },
    /**
     * 输入信息校验
     */
    checkInput() {
      return this.params.contactList.every((item, index) => {
        if (!item.name) {
          this.$uni.showToast("请输入联系人姓名");
          return false;
        } else if (index > 0 && item.name === this.params.contactList[0].name) {
          this.$uni.showToast("不能添加相同的紧急联系人");
          return false;
        } else if (!item.phoneNumber) {
          this.$uni.showToast("请输入联系电话");
          return false;
        } else if (!validatePhoneNumber(item.phoneNumber)) {
          this.$uni.showToast("联系电话格式不正确");
          return false;
        } else if (
          index > 0 &&
          item.phoneNumber === this.params.contactList[0].phoneNumber
        ) {
          this.$uni.showToast("不能添加相同的联系电话");
          return false;
        }
        return true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fillout-step-2 {
  background-color: #fff;
  height: 100vh;
  .section {
    &-header {
      height: 120rpx;
      &__icon {
        @include square(48);
      }
    }
    &-footer {
      width: 100vw;
      height: 16rpx;
      background: #f5f5f5;
    }
    .form {
      .row {
        min-height: 120rpx;
        border-bottom: 2rpx solid $color-line;
        box-sizing: border-box;
        &__indicator {
          width: 24rpx;
          text-align: center;
          color: #eb3030;
        }
        &__label {
          width: 200rpx;
          &--small {
            width: 160rpx;
          }
        }
      }
      .delete-button {
        height: 92rpx;
        line-height: 92rpx;
        color: #eb3030;
      }
    }
  }
  .add-button {
    @include size(200, 72);
    margin: 32rpx calc((100vw - 200rpx) / 2);
    border-radius: 36rpx;
    border: 2rpx solid $color-primary;
    box-sizing: border-box;
    &__icon {
      @include square(36);
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    z-index: 100;
    width: calc(100vw - 64rpx);
    padding: 32rpx 32rpx 64rpx;
    border-top: 2rpx solid $color-line;
    .actions {
      .action {
        @include size(328, 108);
        line-height: 108rpx;
        border-radius: 54rpx;
      }
      .border {
        border: 2rpx solid $color-primary;
        box-sizing: border-box;
      }
    }
  }
}
</style>

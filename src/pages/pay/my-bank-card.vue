<template>
  <view class="my-bank-card">
    <view class="bg"></view>
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1" backgroundColor="">
      <template v-slot:title1>
        <view class="bar-height">
          <view
            class="navigation-bar flex-h flex-c-s"
            :style="{ height: '44px' }"
          >
            <text class="navigation-bar__title fs-44 c-black flex-1">{{
              title
            }}</text>
          </view>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view class="bar-height" style="margin-top: -12%">
          <view
            class="navigation-bar flex-h flex-c-s"
            :style="{ height: '44px' }"
          >
            <image
              class="back-icon"
              @click="handleNavBack"
              src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-arrow-left.png"
              mode="scaleToFill"
            />
            <text class="navigation-bar__title fs-44 c-black flex-1">{{
              title
            }}</text>
          </view>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <view
      class="blank"
      :style="{ height: (128 || navigationBarHeight) + 'px' }"
    />

    <!-- 我的银行卡 -->
    <view class="page-header mt-16">
      <view class="title">
        <image
          v-if="bankList.length > 1"
          class="icon-circle icon-add"
          :src="icon.sort"
          @click="goSort"
        />
        <image class="icon-circle icon-sort" :src="icon.add" @click="goAdd" />
        <text>我的银行卡（{{ bankList.length }}）</text>
      </view>
      <view class="status-box flex-v flex-c-s" v-if="bankList.length === 0">
        <image
          class="icon-img"
          src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/no-order.png"
          mode="scaleToFill"
        />
        <view class="gray">暂未添加银行卡</view>
      </view>
      <view
        v-for="(item, index) in bankList"
        :key="item.recordId"
        class="bank-card"
        @click="goCardDetail(item)"
        :style="{ background: item.cardColor }"
      >
        <image
          class="icon-bg"
          src="https://ggllstatic.hpgjzlinfo.com/static/pay/icon-bank-pattern.png"
          mode="scaleToFill"
        />
        <view class="bank-name">
          <view class="icon-wrapper">
            <image class="icon-bank" :src="item.bankIcon" />
          </view>
          <view class="bank-txt">{{ item.bankName }}</view>
          <view v-if="index === 0" class="default">默认</view>
        </view>
        <view class="bank-no">{{ formatBankNum(item.bankCardNum) }}</view>
      </view>
    </view>

    <!-- 推荐绑卡 -->
    <!-- <view class="page-header mt-16">
      <view class="title" style="margin-bottom:32rpx">
        <text>推荐绑卡</text>
      </view>
      <view class="bank-card bind-card">
        <view  class="bank-name">
          <image class="icon-bank" :src="icon.auth" />
          <view class="bank-txt">
            <view class="name">中国招商银行</view>
            <view class="benifit">绑定最高可赢1888元</view>
          </view>
        </view>
        <view class="bank-no">
          <image class="icon-arrow" :src="icon.arrow"/>
          <view class="txt">一键绑卡</view>
        </view>
      </view>
       <view class="bank-card bind-card">
        <view  class="bank-name">
          <image class="icon-bank" :src="icon.auth" />
          <view class="bank-txt">
            <view class="name">中国招商银行</view>
            <view class="benifit">绑定最高可赢1888元</view>
          </view>
        </view>
        <view class="bank-no">
          <image class="icon-arrow" :src="icon.arrow"/>
          <view class="txt">一键绑卡</view>
        </view>
      </view>
    </view> -->

    <!-- <view class="more-questions">绑定银行卡常见问题解答></view> -->

    <view class="page-footer">
      <button class="btn btn-warning" @click="goAdd">
        <image class="icon-add-plus" :src="icon.addPlus" />
        添加银行卡
      </button>
    </view>

    <!-- 绑卡未完成提示 -->
    <modal
      ref="tipModal"
      cancelText="仍要返回"
      confirmText="继续绑卡"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    >
      <view slot="text">
        <view class="confirm-main" style="height: auto; line-height: 1.5">
          <view class="content"
            >绑卡尚未完成，将无法在国家老龄服务平台APP使用该卡，是否确认返回？</view
          >
        </view>
      </view>
    </modal>

    <!-- 预留手机号说明 -->
    <modal
      ref="phoneModal"
      cancelText=" "
      confirmText="知道了"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    >
      <template v-slot:text>
        <view class="confirm-main" style="height: auto; line-height: 1.5">
          <view class="content"
            >该银行预留手机号为网银签约手机号，可通过网银个人客户基本资料中预留手机号码或者联系银行客服更新处理。</view
          >
        </view>
      </template>
    </modal>

    <real-name-pop ref="realpop" @succFlag="succFlag" />
  </view>
</template>

<script>
import NavigationBar from "./components/navigation-bar.vue";
import Modal from "@/components/common/modal.vue";
import RealNamePop from "@/pages/real-name-pop/real-name-pop.vue";
import api from "@/apis/index.js";
import { getBankBg } from "@/utils/utils.js";

// import { hideRule } from '@/utils/desensitization.js'
export default {
  components: { NavigationBar, Modal, RealNamePop },
  data() {
    return {
      title: "银行卡",
      // 银行卡列表
      bankList: [],
      // iconPath
      checked: true,
      icon: {
        sort: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-sort.png",
        add: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-add.png",
        addPlus:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-add-white-plus.png",
        auth: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-warn-circle-blue.png",
        delete:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-input-delete.png",
        circleGre:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-warn-circle.png",
        checked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png",
        noChecked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-default.png",
        arrow:
          "https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png",
      },
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 状态栏高度
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      backUrl: "",
    };
  },
  onLoad(e) {
    if (e.back) {
      this.backUrl = e.back;
    }
    this.getBankList();
  },
  onShow() {},
  onBackPress(e) {
    // uni.redirectTo({
    //     url: `/pages/index/index`,
    // });
  },
  methods: {
    formatBankNum(bankNum) {
      const val = bankNum;
      const front = 4;
      const back = 4;
      let placeholder = 8;
      const length = val.length;
      placeholder = placeholder || length - front - back;

      if (length > front + back) {
        const frontVal = val.slice(0, front);
        const backVal = back ? val.slice(-back) : "";
        return frontVal + " " + "*".repeat(placeholder) + " " + backVal;
      }

      return val;
    },
    // 获取银行卡背景
    getBankBg(name) {
      return getBankBg(name);
    },
    // 银行列表
    getBankList() {
      api.getBankList({
        data: {},
        success: (res) => {
          this.bankList = res.splice(0, 2);
          this.payCardInfo = this.bankList[0];
        },
      });
    },
    handlePopPhoneModal() {
      this.$refs.tipModal.open();
      // this.$refs.phoneModal.open()
    },
    // 返回上一页
    handleNavBack() {
      // TODO 支付宝没有返回操作  微信的返回，此时无法返回到收银台页面(h5),h5发起到这个页面经历过5个页面中转，中途有页面回跳的情况，2，个人中心有绑卡入口，无法区分是否是要下订单的返回
      // uni.navigateBack();

      if (this.backUrl) {
        if (this.backUrl == 1) {
          uni.navigateBack();
          return;
        } else {
          uni.reLaunch({
            url: this.backUrl,
          });
        }
        return;
      } else {
        uni.reLaunch({
          url: "/pages/index/index",
        });
      }
    },
    // 返回首页
    handleHomeBack() {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
    // 排序
    goSort() {
      uni.navigateTo({
        url: "/pages/pay/set-card-no",
      });
    },
    // 添加银行卡
    async goAdd() {
      // const userInfo = uni.getStorageSync('userInfo')
      this.$uni.showToast("系统升级中");
      // const userInfo = await this.getUserInfo();
      // if (userInfo.crtfStas === "0") {
      //   this.$refs.realpop.open();
      // } else {
      //   uni.navigateTo({
      //     url: "/pages/pay/add-bank-card?source=1",
      //   });
      // }
    },
    // 实名认证成功
    async succFlag(flag) {
      if (flag == 1) {
        const userInfo = await this.getUserInfo();
        uni.setStorageSync("userInfo", userInfo);
        this.$refs.realpop.close();
        uni.navigateTo({
          url: `/pages/user-center/real-name-result2?back=${"/pages/pay/add-bank-card"}&index=2`,
        });
      }
    },
    /**
     * 获取用户信息 getUserAccount
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
    // 银行卡详情
    goCardDetail(item) {
      uni.navigateTo({
        url: `/pages/pay/my-bank-card-detail?recordId=${item.recordId}`,
      });
    },
    handleCheckXieyi() {
      this.checked = !this.checked;
    },
    hideRule(val, front, back, placeholder) {
      const length = val.length;
      placeholder = placeholder || length - front - back;

      if (length > front + back) {
        const frontVal = val.slice(0, front);
        const backVal = back ? val.slice(-back) : "";
        return frontVal + " " + "*".repeat(placeholder) + " " + backVal;
      }

      return val;
    },
  },
};
</script>

<style lang="scss" scoped>
.status-box {
  padding-top: 150rpx;
  .icon-img {
    width: 440rpx;
    height: 270rpx;
    margin-bottom: 24rpx;
  }
  .status-text {
    height: 50rpx;
    color: $color-grey;
  }
  .gray {
    color: #999999;
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
.my-bank-card {
  background: #f5f5f5;
  height: 100vh;
  position: relative;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 308rpx;
    background: linear-gradient(180deg, #ff8800 0%, #ff5500 100%);
  }
  .bar-height {
    // height: 308rpx;
    // padding-top: 12%;
    // background: linear-gradient(180deg, #ff8800 0%, #ff5500 100%);
  }
  // 头部
  .navigation-bar {
    box-sizing: border-box;
    padding-left: 24rpx;
    width: 100vw;
    height: 100%;

    .back-icon {
      flex-shrink: 0;
      width: 44rpx;
      height: 44rpx;
      margin-right: 48rpx;
      position: relative;
      z-index: 10;
    }
    .icon-desc {
      flex-shrink: 0;
      // width: 40rpx;
      // height: 40rpx;
      margin-left: 24rpx;
      position: relative;
      z-index: 10;
    }
    .desc {
      color: #666666;
    }
    .navigation-bar__title {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      color: #ffffff;
    }
    .navigation-bar__complete {
      position: absolute;
      right: 36rpx;
    }
  }
  .page-header {
    z-index: 1000;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 32rpx 0;
    margin-bottom: 32rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    .title {
      font-size: 44rpx;
      color: #333333;
      font-weight: 500;
      width: 100%;
      text-align: left;
      position: relative;
      .icon-sort {
        position: absolute;
        top: 8rpx;
        right: 0;
        width: 40rpx;
        height: 40rpx;
      }
      .icon-add {
        position: absolute;
        top: 8rpx;
        right: 70rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
    .bank-card {
      width: 638rpx;
      height: 200rpx;
      border: 2rpx solid #eeeeee;
      border-radius: 16rpx;
      margin-top: 32rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      position: relative;
      &.bind-card {
        height: 146rpx;
        border: none;
        flex-direction: row;
        margin: 0;
        border-radius: 0;
        border-top: 2rpx solid #eeeeee;
        &:first-child {
          margin-top: 32rpx;
        }
        &:last-child {
          border-bottom: 2rpx solid #eeeeee;
        }
        .bank-name {
          margin: 0;
          .icon-bank {
            width: 78rpx;
            height: 78rpx;
            margin-left: 16rpx;
          }
          .bank-txt {
            .name {
              font-size: 40rpx;
              font-weight: 400;
            }
            .benifit {
              color: #ff9500;
              font-size: 32rpx;
              font-weight: 400;
            }
          }
        }
        .bank-no {
          display: flex;
          flex: 1;
          flex-direction: row-reverse;
          align-items: center;
          font-size: 32rpx;
          .icon-arrow {
            width: 36rpx;
            height: 36rpx;
          }
        }
      }
      .bank-name {
        display: flex;
        align-items: center;
        margin: 32rpx 0 32rpx 24rpx;
        font-size: 40rpx;
        color: #ffffff;
        font-weight: 500;
        .default {
          width: 80rpx;
          height: 40rpx;
          background: #ff9500;
          border-radius: 4rpx;
          font-size: 32rpx;
          color: #ffffff;
          text-align: center;
          line-height: 40rpx;
          margin-left: 16rpx;
        }
        .icon-wrapper {
          width: 60rpx;
          height: 60rpx;
          border-radius: 30rpx;
          margin-right: 12rpx;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-bank {
            width: 48rpx;
            height: 48rpx;
          }
        }
      }
      .bank-no {
        text-align: center;
        font-size: 40rpx;
        color: #ffffff;
      }
      .icon-bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  .page-content {
    border-bottom: 2rpx solid #eeeeee;
    border-top: 2rpx solid #eeeeee;
    padding: 0 32rpx;
    .item {
      display: flex;
      justify-content: space-between;
      font-weight: 32rpx;
      color: #333333;
      height: 120rpx;
      border-bottom: 2rpx solid #eeeeee;
      display: flex;
      font-size: 40rpx;
      .label {
        line-height: 120rpx;
        width: 226rpx;
      }
      .cont {
        line-height: 120rpx;
        flex: 1;
        position: relative;
        &.gre {
          color: #999999;
        }
        .input-phone {
          height: 100%;
        }
        .icon-delete {
          width: 32rpx;
          height: 32rpx;
          position: absolute;
          top: 44rpx;
          right: 58rpx;
          z-index: 100;
        }
        .icon-circle-gre {
          width: 32rpx;
          height: 32rpx;
          position: absolute;
          top: 44rpx;
          right: 0;
          z-index: 100;
        }
      }
    }
  }
  .more-questions {
    color: #999999;
    font-size: 32rpx;
    width: 100%;
    text-align: center;
    margin-top: 100rpx;
  }
  .page-footer {
    margin: 20rpx 0;
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    .btn {
      width: 100%;
      height: 108rpx;
      line-height: 108rpx;
      border: 2rpx solid #dcdee0;
      border-radius: 54rpx;
      font-size: 44rpx;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon-add-plus {
        width: 48rpx;
        height: 48rpx;
        margin-right: 36rpx;
      }
      &-default {
        border: 2rpx solid #dcdee0;
        color: #333333;
      }
      &-warning {
        border: none;
        color: #ffffff;
        background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
      }
    }
  }
}
</style>

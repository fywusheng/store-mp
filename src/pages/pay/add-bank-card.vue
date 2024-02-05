<template>
  <view class="add-bank-card">
    <!-- 导航栏 -->
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <!-- <view class="back-icon"></view>
          <image class="icon-desc"
          @click="handleHomeBack"
                 src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-index.png"
                 mode="scaleToFill" /> -->

          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            title
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
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
      </template>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="_cont" v-if="isRealName === '1'">
      <!-- 内容区域 -->
      <view class="page-header mt-16">
        <view class="input-item">
          <input
            v-model="preCardNo"
            maxlength="23"
            class="input-card"
            type="text"
            :focus="focus"
            :adjust-position="false"
            placeholder-class="placeholder"
            placeholder="点击输入本人的银行卡号"
            @input="handleChange"
          />
          <view class="tip" @click="handlePhone">
            <image class="icon-camera" :src="icon.camera" />
            <view class="desc">拍照添卡</view>
          </view>
          <view class="delete" v-if="cardNo.length > 0">
            <image class="icon-delete" :src="icon.delete" @click="handleDel" />
          </view>
        </view>
        <view class="input-txt"
          >请添加您本人的银行卡，享受更便捷的银联服务</view
        >
        <button
          class="btn-next"
          :style="{ opacity: enabledNext ? 1 : 0.5 }"
          @click="handleNext"
          :disabled="!enabledNext"
        >
          下一步
        </button>
        <!-- <view class="middle">
              <view class="txt">或选择</view>
            </view> -->
      </view>

      <!-- <view class="page-content">
          <view class="bind-card">无需手动输入卡号，一键绑定卡号</view>
          <view class="search-card">已和以下银行合作，可查询本人卡号</view>
          <view class="more-bank"><text>更多银行</text><image class="icon-arrow" :src="icon.arrow"/></view>
          </view>
          <view class="page-footer">
            <view class="list-item">
              <image class="icon-bank" :src="icon.arrow" />
              <view class="bank-name">农业银行</view>
              <view class="right">
                <text class="benefit">绑定最高可赢1888元</text>
                <image class="bank-arrow" :src="icon.bankArrow" />
              </view>
            </view>
            <view class="list-item">
              <view class="more-txt">查找更多银行</view>
            </view>
          </view> -->
    </view>
    <canvas class="canvas" id="canvas" canvas-id="canvas" />
    <real-name-pop
      ref="realpop"
      @succFlag="succFlag"
      :closeGoUrl="closeUrl"
      :maskClick="maskClick"
    />
  </view>
</template>

<script>
import NavigationBar from "@/components/common/navigation-bar.vue";
import api from "@/apis/index.js";
import { debounce, getLessLimitSizeImage } from "@/utils/utils.js";
import RealNamePop from "@/pages/real-name-pop/real-name-pop.vue";

export default {
  components: { NavigationBar, RealNamePop },
  data() {
    return {
      maskClick: false,
      isRealName: "",
      title: "添加银行卡",
      imgHeight: 750,
      imgWidth: 750,
      canvas: { height: "", width: "" },
      // 卡号
      cardNo: "",
      preCardNo: "",
      focus: false,
      // iconPath
      icon: {
        camera: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-camera.png",
        arrow: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-arrow.png",
        bankArrow:
          "https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-arrow-rightward-grey.png",
        delete:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-input-delete.png",
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
      cashId: "",
      // TODO 之后改为演示环境  https://ggll.hpgjzlinfo.com/  202203234910000206
      closeUrl: "",
      userinfor: {},
      source: "",
      secenType: "", // 场景类型值
    };
  },
  onLoad(e) {
    if (e.cashId) {
      this.cashId = e.cashId;
      this.closeUrl = `https://api.hpgjzlinfo.com/#/checkstand?cashId=${this.cashId}`;
    }
    if (e.secenType) {
      this.secenType = e.secenType;
    }
    // 0 :收银台 1 :我的银行卡
    this.source = e.source;
    uni.setStorageSync("bing-card-source", e.source);
    if (e.isRealName == "1") {
      this.isRealName = "1";
    }
  },
  created() {},
  mounted() {
    api.getUserInfo({
      data: {
        accessToken: uni.getStorageSync("token"),
      },
      success: (data) => {
        this.userinfor = data;
        if (this.userinfor.crtfStas === "0") {
          this.isRealName = "2";
          this.title = "实名认证";
          this.$nextTick(() => {
            this.$refs.realpop.open();
          });
        } else {
          this.isRealName = "1";
        }
      },
    });
  },
  onShow() {},
  computed: {
    enabledNext() {
      return this.cardNo.length > 12;
    },
  },
  methods: {
    succFlag(flag) {
      if (flag == 1) {
        this.$refs.realpop.close();
        this.isRealName = "1";
        // 去实名成功结果页面
        uni.redirectTo({
          url: `/pages/user-center/real-name-result2?back=${"/pages/pay/add-bank-card?isRealName='1'"}`,
        });
      }
    },
    handleChange: debounce(function (e) {
      this.preCardNo = e.target.value
        .replace(/[^\d]/g, "")
        .replace(/\s/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ");
      this.cardNo = this.preCardNo.replace(/\s*/g, "");
    }, 200),
    // 返回上一页
    handleNavBack() {
      console.log("====alipay--");
      // const source = uni.getStorageSync('bind-card-source')
      const info = uni.getStorageSync("supermarketInfo");
      // 0 :收银台 1 :我的银行卡  之前代码判断使用source 不知为何，故改为this
      if (this.source === "0") {
        if (this.secenType === 0) {
          // 进入去付款页面
          uni.navigateTo({
            url: "/pages/supermarket/market?info=" + encodeURIComponent(info),
          });
        } else {
          const url = `https://api.hpgjzlinfo.com/#/checkstand?cashId=${this.cashId}`;
          uni.redirectTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
          });
        }
      } else {
        uni.navigateBack();
      }
    },
    // 返回首页
    handleHomeBack() {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
    // 清空卡号
    handleDel() {
      this.preCardNo = "";
      this.cardNo = "";
      this.focus = true;
    },
    // 拍照
    handlePhone() {
      this.focus = false;

      uni.chooseImage({
        sourceType: ["camera", "album"],
        success: (res) => {
          const file = res.tempFilePaths[0];
          getLessLimitSizeImage(
            "canvas",
            file,
            0.1,
            750,
            (imagePath) => {
              uni.getFileSystemManager().readFile({
                filePath: imagePath,
                encoding: "base64",
                success: (rs) => {
                  this.getBankInfoByImg(rs.data);
                  console.log("---图片---", rs.data);
                },
                fail: (erro) => {
                  console.log("---异常拿到---", erro);
                },
              });
            },
            this
          );
        },
      });
    },
    getBankInfoByImg(image64) {
      uni.showLoading({ title: "识别中" });
      api.getBankCardInfoByImage({
        data: { image64 },
        success: (resinfo) => {
          uni.hideLoading();
          if (!resinfo.vertifyFlag) {
            this.$uni.showToast("识别失败，请重新拍照");
            return;
          }
          uni.setStorageSync("add_card_base64_img", image64);
          uni.navigateTo({
            url: `/pages/pay/confirm-card-no?cardInfo=${encodeURIComponent(
              JSON.stringify(resinfo)
            )}`,
          });
        },
        fail: (res) => {
          uni.hideLoading();
          console.log(res);
        },
      });
    },
    // 下一步，开通在线支付
    handleNext() {
      const no = this.cardNo;
      if (no.length === 13) {
        this.$uni.showToast("银行卡号格式错误!");
        return false;
      }
      if (no.length > 13) {
        // 校验业务
        api.getBankByCardByNo({
          data: { bankCardNum: no },
          showsLoading: true,
          success: function (res) {
            if (!res) {
              this.$uni.showToast("【该银行卡不支持本业务请换银行卡试试!】");
              return false;
            }
            res.realBankCardNum = no;
            uni.navigateTo({
              url:
                "/pages/pay/open-online-pay?cardInfo=" +
                encodeURIComponent(JSON.stringify(res)),
            });
          },
        });
      }
    },
  },
  filters: {
    // 格式化银行账户
    formatAccNo: function (accNo) {
      let result = "";
      let index = 0;
      if (accNo != undefined && accNo != null) {
        for (let i = 0; i < accNo.length; i++) {
          result += accNo.charAt(i);
          index++;
          if (index == 4 && i + 1 != accNo.length) {
            result += " ";
            index = 0;
          }
        }
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.canvas {
  position: absolute;
  top: -750px;
  width: 750px;
  height: 750px;
  left: 0;
  opacity: 0;
}
.add-bank-card {
  background-color: #fff;
  height: 100vh;
  padding: 0 32rpx;
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
    }
    .navigation-bar__complete {
      position: absolute;
      right: 36rpx;
    }
  }
  .page-header {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .input-item {
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 120rpx;
      box-sizing: border-box;
      border-radius: 8rpx;
      border: 2rpx solid #ff711a;
      padding: 2rpx;
      .input-card {
        width: 69%;
        height: 100%;
        padding-left: 20rpx;
        font-size: 40rpx;
      }
      .delete {
        position: absolute;
        top: 0;
        right: 150rpx;
        height: 100%;
        display: flex;
        align-items: center;
        z-index: 1000;
        .icon-delete {
          width: 32rpx;
          height: 32rpx;
        }
      }
      .tip {
        position: absolute;
        top: 0;
        right: 24rpx;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        z-index: 1000;
        .icon-camera {
          width: 48rpx;
          height: 44rpx;
          margin-bottom: 10rpx;
        }
        .desc {
          color: #333333;
          font-size: 28rpx;
        }
      }
    }
    .input-txt {
      color: #999999;
      font-size: 32rpx;
      line-height: 44rpx;
      margin: 24rpx 0 48rpx 0;
    }
    .btn-next {
      width: 100%;
      height: 108rpx;
      line-height: 108rpx;
      border-radius: 54rpx;
      color: #ffffff;
      opacity: 0.5;
      background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
    }
    .middle {
      width: 100%;
      height: 2rpx;
      border-top: 2rpx solid #eeeeee;
      position: relative;
      display: flex;
      align-items: center;
      margin: 70rpx 0;
      .txt {
        position: absolute;
        top: -20rpx;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 32rpx;
        color: #999999;
      }
    }
  }
  .page-content {
    font-size: 32rpx;
    color: #999999;
    border-bottom: 2rpx solid #e5e5e5;
    padding-bottom: 32rpx;
    .bind-card {
      color: #333333;
      font-size: 40rpx;
      font-weight: 500;
    }
    .search-card {
      margin: 0 0 16rpx 0;
    }
    .more-bank {
      color: #1890ff;
      display: flex;
      align-items: center;
      .icon-arrow {
        width: 36rpx;
        height: 36rpx;
      }
    }
  }
  .page-footer {
    .list-item {
      height: 120rpx;
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 2rpx solid #e5e5e5;
      &:last-child {
        border-bottom: none;
      }
      .icon-bank {
        width: 46rpx;
        height: 46rpx;
        margin-right: 14rpx;
      }
      .bank-name {
        font-size: 40rpx;
        color: #333333;
      }
      .right {
        margin-left: auto;
        display: flex;
        align-items: center;
        .benefit {
          color: #ff9500;
          font-size: 32rpx;
          margin-right: 10rpx;
        }
        .bank-arrow {
          width: 36rpx;
          height: 36rpx;
        }
      }
      .more-txt {
        font-size: 32rpx;
        color: #1890ff;
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>

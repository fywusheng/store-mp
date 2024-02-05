<template>
  <view class="add-success">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :shows-back-button="true" back-button-style="white" />
    <!-- #endif -->
    <image
      class="background"
      src="https://ggllstatic.hpgjzlinfo.com/static/family-account/bg-support-bind-success.png"
      mode="scaleToFill"
    />
    <view class="blank" style="height: 430rpx" />
    <view class="card flex-v flex-c-c bg-white br-24">
      <image
        class="avatar"
        v-if="uactId === ''"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-support-avatar-send.png"
      />
      <image
        class="avatar"
        v-if="uactId !== ''"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/family-account/icon-support-avatar-success.png"
      />
      <text class="fs-44 c-black mt-20">{{ title }}</text>
      <text v-if="names.length > 0" class="message fs-36 c-lightgrey mt-16">
        已给
        <view v-for="(item, index) in names" :key="index">
          <text class="c-primary">【{{ item }}】</text>
          <text :key="'pause-' + index" v-if="index !== names.length - 1">
            、
          </text>
        </view>
        发送添加请求，待对方短信确认后即可绑定成功
      </text>
      <text v-if="subtitle" class="message fs-36 c-lightgrey mt-16">
        {{ subtitle }}
      </text>
    </view>
    <button class="button fs-44 fw-400 c-white" @click="handleButtonClick">
      {{ buttonText }}
    </button>
    <view
      class="credits-popup flex-v flex-c-c"
      v-if="showsCreditsPopup"
      @touchmove.stop="touchmove"
    >
      <image
        class="credits-image"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/family-account/image-common-credits2-100.png"
      />
      <image
        class="close-icon mt-32"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-popup-close.png"
        @click="showsCreditsPopup = false"
      />
    </view>
  </view>
</template>

<script>
import NavigationBar from "../../components/common/navigation-bar.vue";
import { startFacialRecognitionVerify } from "@/utils/utils.js";
import api from "@/apis/index.js";
import dayjs from "dayjs";
import staticData from "@/utils/dataBase64.js";
export default {
  components: { NavigationBar },
  data() {
    return {
      // 标题
      title: "",
      // 副标题
      subtitle: "",
      // 姓名列表
      names: [],
      // 按钮文字
      buttonText: "",
      // 关联账户id(无手机号id
      uactId: "",
      // 关联账户id（无手机号姓名
      name: "",
      // 关联账户id（无手机号身份证
      idCard: "",
      // 是否已领卡(0-未领 1-已领)
      isReceive: "1",
      // 本次操作是否领取到积分 (0-没领到积分 1-已领到)
      isItgl: "0",
      // 是否显示积分弹窗
      showsCreditsPopup: false,
    };
  },
  onLoad(e) {
    // 有手机号添加
    const options = JSON.parse(e.info);
    console.log("option:", options);

    if (options.names !== undefined) {
      // 有手机号绑定(赡养绑定)（需要等待短信验证）

      this.title = "已发送";
      this.buttonText = "知道了";
      this.names = options.names.split(",");
      console.log("this.names:", this.names);
    } else {
      // 无手机号绑定  （立刻绑定成功
      this.name = options.name;
      this.uactId = options.uactId;
      this.idCard = options.idCard;
      this.isReceive = options.isReceive;
      this.isItgl = options.isItgl; //  (0-没领到积分 1-已领到)
      if (this.isItgl === "1") {
        const userInfo = uni.getStorageSync("userInfo");
        api.checkLogOutUser({
          data: { uactId: userInfo.uactId },
          success: (data) => {
            console.log("===是否注销过---", data);
            if (!data) {
              this.showsCreditsPopup = true;
            }
          },
        });
        setTimeout(() => {
          this.showsCreditsPopup = false;
        }, 2000);
      }
      this.title = "恭喜您绑定亲友成功";
      if (this.isReceive === "1") {
        // 是否已领卡(0-未领 1-已领)

        this.subtitle = "您现在可以享受亲友账号专属权利哦";

        this.buttonText = "知道了";
      } else {
        // 无手机号添加, 可领取

        this.subtitle = "对方还未领取电子老年人证，请为对方领取";
        this.buttonText = "为他领取电子老年人证";
      }
    }

    // this.buttonText = "为ta领取电子老年人证";

    // 无手机号添加, 已领取
    // this.title = "恭喜您绑定亲友成功";
    // this.subtitle = "您现在可以享受亲友账号专属权利哦";
    // this.buttonText = "知道了";
  },
  methods: {
    pointDetail() {
      uni.navigateTo({ url: "/pages/user-center/my-points" });
    },
    /**
     * 按钮点击事件
     */
    handleButtonClick() {
      // 根据不同情况进行不同处理
      if (this.names.length > 0) {
        console.log("点击1");
        // 有手机号（点击【返回】【知道了】按钮，进入【我的】页面
        uni.reLaunch({
          url: "/pages/index/index?index=4",
        });
      } else if (this.isReceive === "1") {
        // 是否已领卡(0-未领 1-已领)
        // 已领 点击【返回】【知道了】按钮，进入【我的】页面

        uni.reLaunch({
          url: "/pages/index/mine?index=4",
          fail: (err) => {
            console.log(err);
          },
        });
      } else if (this.isReceive === "0") {
        console.log("点击3");
        // 未领 点击【返回】【知道了】按钮，进入【我的】页面
        this.$uni.showToast("功能建设中");
        return;

        const params = {
          name: this.name,
          idCard: this.idCard,
          returnUrl: "",
        };
        const birthday = dayjs(this.idCard.substring(6, 14)).format(
          "YYYY-MM-DD"
        );
        // 人脸识别成功
        params.success = () => {
          console.log("人脸识别成功：");
          // #ifdef MP-WEIXIN
          // uni.getFileSystemManager().readFile({
          //   filePath: require('./static/05f08ce3a4c8ce77b5c0af61c35619c.jpg'),
          //   encoding: 'base64',
          //   success: (res) => {

          //   },
          // })

          api.clearBg({
            data: { photoBase64: staticData.faceImg },
            showsLoading: true,
            success: (resInfo) => {
              // 保存第一次人脸识别图片
              uni.setStorageSync(
                "other-first-face-img",
                JSON.stringify(resInfo)
              );
              // 拿到头像图片
              // 进入帮领证流程
              const data = {
                name: this.name,
                uactId: this.uactId,
                idCardNumber: this.idCard,
                gender: this.idCard.substring(16, 17) % 2,
                nation: "",
                birthday: birthday,
                city: "",
                address: "",
              };
              const info = {
                ...data,
                faceImg: staticData.faceImg,
              };
              // 去背景图片

              uni.navigateTo({
                url: "/pages/certificate/avatar-confirm-other",
                success: (res) => {
                  res.eventChannel.emit("didOpenPageFinish", info);
                },
              });
            },
          });
          // #endif

          // #ifdef MP-ALIPAY
          api.clearBg({
            data: { photoBase64: staticData.faceImg },
            showsLoading: true,
            success: (resInfo) => {
              // 保存第一次人脸识别图片
              uni.setStorageSync(
                "other-first-face-img",
                JSON.stringify(resInfo)
              );
              // 拿到头像图片
              // 进入帮领证流程
              const data = {
                name: this.name,
                uactId: this.uactId,
                idCardNumber: this.idCard,
                gender: this.idCard.substring(16, 17) % 2,
                nation: "",
                birthday: birthday,
                city: "",
                address: "",
              };
              console.log("傳輸的数据：", data);
              const info = {
                ...data,
                faceImg: staticData.faceImg,
              };
              // 去背景图片

              uni.navigateTo({
                url: "/pages/certificate/avatar-confirm-other",
                success: (res) => {
                  res.eventChannel.emit("didOpenPageFinish", info);
                },
              });
            },
          });
          // #endif
        };

        // 开启人脸识别
        console.log("开启人脸");
        startFacialRecognitionVerify(params);
      }
    },
    /**
     * 自定义导航栏返回点击事件
     */
    handleNavigationBack() {
      uni.reLaunch({
        url: "/pages/index/mine?index=4",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-success {
  .background {
    @include size(750, 676);
    position: absolute;
    top: 0;
  }
  .card {
    position: relative;
    margin: 0 32rpx 0;
    height: 522rpx;
    box-shadow: 0px 6rpx 12rpx 0px rgba(221, 143, 56, 0.1);
    .avatar {
      @include size(194, 210);
    }
    .message {
      width: 550rpx;
      text-align: center;
    }
  }
  .button {
    margin: 64rpx 32rpx 0;
    width: 686rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
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

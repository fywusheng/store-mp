<template>
  <view v-if="hasLoading" class="mine">
    <canvas
      canvas-id="canvas"
      id="canvas"
      class="canvas"
      :width="imgWidth"
      :height="imgHeight"
    ></canvas>
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="user-info flex-h flex-c-s">
      <view class="imgbox" @click="handleChooseImageClick">
        <image class="avatar" mode="scaleToFill" :src="header" />
        <image
          class="photo"
          src="https://ggllstatic.hpgjzlinfo.com/static/mine/icon-photo2x.png"
          mode="scaleToFill"
        />
      </view>
      <view v-if="!userInfo.tel" @click="login">
        <text class="fs-60 c-black ml-12"> 请登录 </text>
      </view>
      <view
        class="flex-v ml-12"
        v-else-if="userInfo.tel && userInfo.crtfStas === '0'"
      >
        <text class="fs-60 c-black">{{ phoneNumberFilter(userInfo.tel) }}</text>
        <text class="fs-36 no-certi">未实名</text>
      </view>
      <view
        class="flex-v ml-12"
        v-else-if="userInfo.tel && userInfo.crtfStas !== '0'"
      >
        <text class="fs-60 c-black">{{ nameFilter(userInfo.psnName) }}</text>
        <text class="fs-32 has-certi"> 已实名 </text>
      </view>
    </view>
    <view @click="setting" class="iconSet">
      <image
        class="icon_set"
        src="https://ggllstatic.hpgjzlinfo.com/static/life/shezhi.png"
      />
    </view>

    <view class="service">
      <view class="area_top">
        <view class="_item" @click="handleServiceClick(5)">
          <img
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/mine/huilao.png"
            mode="scaleToFill"
          />
          <text class="text cards">惠老钱包</text>
        </view>
        <view class="_item" @click="handleIntegralClick">
          <img
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/mine/jifeng.png"
            mode="scaleToFill"
          />
          <text class="text cards">我的积分</text>
        </view>
        <view class="_item" @click="handleServiceClick(6)">
          <img
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/life/cardSF_w.png"
            mode="scaleToFill"
          />
          <text class="text family">我的券包</text>
        </view>
        <view class="_item" @click="handleServiceClick(7)">
          <img
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/life/order_icon.png"
            mode="scaleToFill"
          />
          <text class="text family">我的订单</text>
        </view>
      </view>
    </view>

    <view class="user flex-h flex-c-s flex-wrap m-0-32">
      <view class="user-item flex-v flex-c-c" @click="handleServiceClick(2)">
        <image
          class="img"
          src="https://ggllstatic.hpgjzlinfo.com/static/mine/qinqin.png"
          mode="scaleToFill"
        />
        <text>亲情账号</text>
      </view>
      <view class="user-item flex-v flex-c-c" @click="handleUserClick(2)">
        <image
          class="img"
          src="https://ggllstatic.hpgjzlinfo.com/static/mine/icon-invoice2x.png"
          mode="scaleToFill"
        />
        <text>我的发票</text>
      </view>
      <view class="user-item flex-v flex-c-c" @click="handleUserClick(3)">
        <image
          class="img"
          src="https://ggllstatic.hpgjzlinfo.com/static/mine/icon-news2x.png"
          mode="scaleToFill"
        />
        <text>消息中心</text>
      </view>
    </view>

    <view class="user flex-h flex-c-s flex-wrap m-0-32">
      <view class="user-item flex-v flex-c-c" @click="handleUserClick(4)">
        <image
          class="img"
          src="https://ggllstatic.hpgjzlinfo.com/static/mine/icon-collection2x.png"
          mode="scaleToFill"
        />
        <text>收藏中心</text>
      </view>
      <view class="user-item flex-v flex-c-c" @click="handleServiceClick(1)">
        <image
          class="img"
          src="https://ggllstatic.hpgjzlinfo.com/static/mine/shanyang.png"
          mode="scaleToFill"
        />
        <text>赡养扶养</text>
      </view>
      <view class="user-item flex-v flex-c-c" @click="handleFeedbackClick()">
        <image
          class="img"
          src="https://ggllstatic.hpgjzlinfo.com/static/mine/icon-tip2x.png"
          mode="scaleToFill"
        />
        <text>意见反馈</text>
      </view>
    </view>

    <pop-entry-method ref="popup" :showImg="showImg" />
    <real-name-pop
      ref="realpop"
      @succFlag="succFlag"
      :headImg="'https://ggllstatic.hpgjzlinfo.com/static/common/loginAttest.png'"
    ></real-name-pop>
    <!-- 首次登录 -->
    <real-name-pop
      ref="firstLogin"
      @succFlag="loginSuccess"
      :headImg="'https://ggllstatic.hpgjzlinfo.com/static/common/firstLogin-top-bg.png'"
    >
    </real-name-pop>
  </view>
</template>

<script>
import PopEntryMethod from "@/components/pop-entry-method/pop-entry-method.vue";
import api from "@/apis/index.js";
import { desensitizeName, desensitizeInfo } from "@/utils/desensitization.js";
import RealNamePop from "@/pages/real-name-pop/real-name-pop.vue";
import { reportCmPV } from "@/plugins/cloudMonitorHelper";
export default {
  components: { PopEntryMethod, RealNamePop },
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

      userInfo: {},
      // 图片地址，控件展示条件
      url: "",
      // 获取默认头像
      header:
        "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-default-avatar.png",
      // 积分
      score: "",
      // 录入方式是否有图片
      showImg: false,

      // canvas的宽高
      imgWidth: "",
      imgHeight: "",
      hasLoading: false,
    };
  },
  mounted() {
    // 监听登录回调
    uni.$on("didLogin", this.handleLogin);
    this.getUserInfoByToken();
  },
  destroyed() {
    uni.$off("didLogin");
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
    // 手机号过滤器, 用于手机号脱敏
    phoneNumberFilter(value) {
      return desensitizeInfo(value);
    },
    setting() {
      reportCmPV({ title: "设置" });
      uni.navigateTo({
        url: `/pages/user-center/setting`,
      });
    },
    imgRead() {
      const url = `https://ggll.hpgjzlinfo.com/#/agreement?type=4`;
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    loginSuccess(loginfirst) {
      if (loginfirst == 1) {
        const data = {
          uactId: this.userInfo.uactId,
          pageNum: 1,
          pageSize: 5,
        };
        api.findFamilyMemberList({
          data,
          success: (res) => {
            if (res.list.length > 0) {
              uni.navigateTo({
                url: `/pages/user-center/real-name-result2?back=${"/pages/family-account/index"}`,
              });
            } else {
              uni.navigateTo({
                url: `/pages/user-center/real-name-result2?back=${"/pages/family-account/select-type"}`,
              });
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      }
    },
    // 实人认证
    succFlag(attest) {
      if (attest == 1) {
        uni.navigateTo({
          url: `/pages/user-center/real-name-result2?back=${"/pages/index/mine"}`,
        });
      }
    },
    /**
     * 检查用户状态
     */
    checkUserState(handler) {
      console.log("handle()");
      // 检查用户是否实名
      if (this.userInfo.crtfStas === "0") {
        // 未实名, 弹窗提示去领取
        this.showImg = true;
        this.$refs.firstLogin.open();
        return;
      } else {
        console.log("handle()");
        handler();
      }
    },
    // 点击设置
    handleSetting() {
      uni.navigateTo({
        url: "/pages/user-center/setting",
      });
    },
    // 点击裁剪确定按钮
    onok(ev) {
      this.path = ev.path;
      console.log("ev:", ev);
      this.header = ev.path;
      this.url = "";
    },
    // 点击裁剪取消按钮
    oncancle() {
      // url设置为空，隐藏控件
      this.url = "";
    },

    // 更换头像
    updateUserHeader(url) {
      api.updateUserInfo({
        data: {
          psnId: this.userInfo.psnId,
          uactId: this.userInfo.uactId,
          userIcon: url,
        },
        success: (res) => {
          const userInfo = uni.getStorageSync("userInfo");
          uni.setStorageSync("userInfo", { ...userInfo, userIcon: url });
        },
      });
    },
    /**
     * 获取亲情账号列表
     */
    findFamilyMemberList() {
      return new Promise((resolve, reject) => {
        const data = {
          uactId: this.userInfo.uactId,
          pageNum: 1,
          pageSize: 5,
        };
        uni.showLoading({
          title: "加载中",
        });
        api.findFamilyMemberList({
          data,
          success: (res) => {
            resolve();
            console.log("接口所得res：", res);
            uni.hideLoading();
            if (res.list.length > 0) {
              uni.navigateTo({
                url: "/pages/family-account/index",
              });
            } else {
              uni.navigateTo({
                url: "/pages/family-account/select-type",
              });
            }

            //
          },
          fail: (err) => {
            reject();
            console.log("错误err：", err);
            uni.hideLoading();
            uni.showToast(err.message);
          },
        });
      });
    },

    // 登录
    login() {
      reportCmPV({ title: "请登录" });
      uni.navigateTo({
        url: "/pages/user-center/login",
      });
    },

    // 点击积分
    handleIntegralClick() {
      if (!this.userInfo.tel) {
        // 未登录, 跳转到登录页面
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      reportCmPV({ title: "我的积分" });
      uni.navigateTo({
        url: "/pages/user-center/my-points",
      });
    },

    // 获取用户积分
    handleScoreInfo() {
      api.scoreInfo({
        data: {
          userId: this.userInfo.uactId,
        },
        success: (res) => {
          this.score = res.score;
        },
      });
    },

    /**
     * 点击上传头像
     */
    handleChooseImageClick() {
      reportCmPV({ title: "照片上传" });
      uni.chooseImage({
        sourceType: ["album", "camera"],
        count: 1,
        success: (res) => {
          // this.url = res.tempFilePaths[0]
          // 图片转base64
          console.log("res:", res);
          // 名称
          const imageName = res.tempFilePaths[0].split("/").pop();
          const arr = imageName.split(".");
          // 后缀
          const imageExt = arr[arr.length - 1];

          // #ifdef MP-WEIXIN

          uni.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0],
            encoding: "base64",
            success: (rs) => {
              // console.log('rs:', rs)
              //   const par = {
              //         base64String: base64,
              //         imageName,
              //         imageExt,
              //       }
              //       const res = await Axios.post('https://api.hpgjzlinfo.com/nepsp-api/cms/iep/web/cms/imgUpload', par)
              //       console.log("===结果---", res)

              api.imgUpload({
                data: {
                  base64String: rs.data,
                  imageName,
                  imageExt,
                },
                showsLoading: true,
                success: (imgres) => {
                  console.log("图片上传成功res：", imgres);
                  this.header = imgres.absoluteUrl;
                  this.updateUserHeader(imgres.absoluteUrl);
                },
              });
            },
          });

          // #endif

          // #ifdef MP-ALIPAY
          my.getImageInfo({
            src: res.tempFilePaths[0],
            success: (resImg) => {
              console.log("图片数据resImg：", resImg);
              this.imgWidth = resImg.width;
              this.imgHeight = resImg.height;
              const canvas = my.createCanvasContext("canvas");
              canvas.drawImage(
                res.tempFilePaths[0],
                0,
                0,
                this.imgWidth,
                this.imgHeight
              );
              // 1. 绘制图片至canvas
              // 绘制完成后执行回调
              canvas.draw(false, () => {
                console.log("绘制完成后执行回调");
                canvas
                  .toDataURL({
                    width: this.imgWidth,
                    height: this.imgHeight,
                    quality: 1,
                  })
                  .then(async (baseImg) => {
                    console.log("图片baseImg：", baseImg);
                    // let base64 = baseImg.replace("data:image/png;base64,", "");
                    const base64 = baseImg.split(",")[1];
                    console.log("图片base64：", base64);
                    // const par = {
                    //   base64String: base64,
                    //   imageName,
                    //   imageExt,
                    // }
                    // const res = await Axios.post('https://api.hpgjzlinfo.com/nepsp-api/cms/iep/web/cms/imgUpload', par)
                    // console.log("===结果---", res)

                    api.imgUpload({
                      data: {
                        base64String: base64,
                        imageName,
                        imageExt,
                      },
                      showsLoading: true,
                      success: (imgres) => {
                        console.log("图片上传成功res：", imgres);
                        this.header = imgres.absoluteUrl;
                        this.updateUserHeader(imgres.absoluteUrl);
                      },
                    });
                  });
                //  console.log("图片base64：",base64)
                // base64 = base64.replace("data:image/png;base64,", "");
                // 身份证识别
              });
            },
          });
          // #endif
        },
      });
    },

    /**
     * 登录回调
     */
    handleLogin(userInfo) {
      if (userInfo) {
        this.userInfo = userInfo;
        uni.setStorageSync("userInfo", userInfo);
      } else {
        api.getUserInfo({
          data: {
            accessToken: uni.getStorageSync("token"),
          },
          success: (data) => {
            this.userInfo = data;
            uni.setStorageSync("userInfo", data);
            // this.userInfo = uni.getStorageSync('userInfo')
            if (this.userInfo.tel) {
              this.handleScoreInfo();
            }
            this.header =
              this.userInfo.userIcon ||
              "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-default-avatar.png";
            // 没有实名
            // if (this.userInfo.crtfStas !== '2') {
            //   this.$refs.firstLogin.open()
            //   return
            // }
          },
          fail: () => {
            uni.removeStorageSync("token");
            uni.removeStorageSync("userInfo");
          },
        });
      }
    },
    // 获取用户信息
    getUserInfoByToken() {
      const accessToken = uni.getStorageSync("token");

      if (accessToken) {
        this.hasLoading = false;
        uni.showLoading({ title: "加载中" });
        api.getUserInfo({
          data: { accessToken },
          success: (data) => {
            this.userInfo = data;
            uni.setStorageSync("userInfo", data);
            if (this.userInfo.tel) {
              // this.handleScoreInfo()
            }
            this.header =
              this.userInfo.userIcon ||
              "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-default-avatar.png";
            this.hasLoading = true;
            uni.hideLoading();

            // 没有实名
            // if (this.userInfo.crtfStas !== '2') {
            //   this.$nextTick(() => {
            //     this.$refs.firstLogin.open()
            //   })
            // }
          },
          fail: () => {
            uni.hideLoading();
            uni.removeStorageSync("token");
            uni.removeStorageSync("userInfo");
          },
        });
      } else {
        this.hasLoading = true;
      }
    },
    // 点击赡养扶养,亲情账号，我的券包，我的订单7
    handleServiceClick(type) {
      // 检查用户是否登录
      if ([1, 2, 4, 5, 6, 7].includes(type) && !uni.getStorageSync("token")) {
        // 未登录, 跳转到登录页面
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      switch (type) {
        case 1:
          reportCmPV({ title: "赡养抚养" });
          this.checkUserState(() => {
            uni.navigateTo({
              url: "/pages/support/index",
              error: function (res) {
                console.log("console13", res);
              },
            });
          });
          break;
        case 2:
          reportCmPV({ title: "亲情账号" });
          this.checkUserState(() => {
            this.findFamilyMemberList();
          });
          break;
        case 3:
          // 消息中心
          this.$uni.showToast("功能尚未开放，敬请期待");
          break;
        case 4:
          uni.navigateTo({
            url: "/pages/supermarket/myOrder",
          });
          break;
        case 5:
          reportCmPV({ title: "惠老钱包" });
          uni.navigateTo({
            url: "/pages/pay/my-bank-card",
          });
          break;
        case 6:
          reportCmPV({ title: "我的券包" });
          uni.navigateTo({
            url: "/sub-pages/me/my-coupon/main",
          });
          break;

        case 7:
          reportCmPV({ title: "我的订单" });
          uni.navigateTo({
            url: "/pages/order/orderList",
          });
          break;
        default:
          break;
      }
    },
    // 点击实名认证,积分兑换,消息中心，收藏中心
    handleUserClick(type) {
      // 检查用户是否登录
      if (!this.userInfo.tel) {
        // 未登录, 跳转到登录页面
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      switch (type) {
        case 1:
          if (this.userInfo.crtfStas !== "0") {
            this.$uni.showToast("您已完成实名认证，无需重复认证");
            return;
          }
          this.showImg = false;
          this.$refs.realpop.open();
          break;
        case 2:
          reportCmPV({ title: "我的发票" });
          uni.navigateTo({
            url: "/pages/supermarket/myInvoice",
          });
          break;
        case 3:
          reportCmPV({ title: "消息中心" });
          uni.navigateTo({
            url: "/pages/user-center/message-center",
          });
          break;
        case 4:
          // 收藏中心
          reportCmPV({ title: "收藏中心" });
          uni.navigateTo({
            url: "/pages/user-center/collect-center",
          });
          break;
        default:
          break;
      }
    },
    /**
     * 意见反馈点击事件
     */
    handleFeedbackClick() {
      // 备注：目前只有登录后才可以进行问题填报
      if (!this.userInfo.tel) {
        // 未登录, 跳转到登录页面
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      reportCmPV({ title: "意见反馈" });
      uni.navigateTo({
        url: "/pages/user-center/feedback",
      });
    },
  },
  onShow() {
    const curPages = getCurrentPages()[0];
    if (typeof curPages.getTabBar === "function" && curPages.getTabBar()) {
      curPages.getTabBar().setData({
        tabIndex: 4, // 表示当前菜单的索引，该值在不同的页面表示不同
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.mine {
  min-height: 100vh;
  background: #f2f2f2;
  background-image: url("https://ggllstatic.hpgjzlinfo.com/static/mine/icon-mine-bg.png");
  .iconSet {
    position: absolute;
    right: 50rpx;
    width: 48rpx;
    height: 48rpx;
    top: 180rpx;
    .icon_set {
      width: 100%;
      height: 100%;
    }
  }
  .illustration {
    @include size(680, 260);
    margin-bottom: 160rpx;
  }
  .has-certi {
    width: 112rpx;
    height: 48rpx;
    line-height: 48rpx;
    background: #6ac54d;
    border-radius: 8rpx;
    color: #ffffff;
    text-align: center;
  }
  .no-certi {
    width: 112rpx;
    height: 48rpx;
    line-height: 48rpx;
    background: #666666;
    border-radius: 8rpx;
    color: #ffffff;
    text-align: center;
  }
  & ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
    display: none;
  }
  position: relative;
  .canvas {
    position: absolute;
    z-index: -1000;
    // top: 500px;
    opacity: 0;
  }
  .setting {
    height: 100%;
    padding-left: 32rpx;
    .img {
      width: 48rpx;
      height: 46rpx;
    }
  }
  .c-grey {
    color: #999;
  }
  .mine-bg {
    position: fixed;
    top: 0;
    left: 0;
    height: 712rpx;
    width: 100vw;
    z-index: 0;
  }
  .user-info {
    margin: 0 0 58rpx 20rpx;
    margin-bottom: 58rpx;
    position: relative;
    .integral {
      position: absolute;
      top: 22rpx;
      right: 0;
      height: 68rpx;
      background: linear-gradient(180deg, #5f4705 0%, #403001 100%);
      border-radius: 34rpx 0 0 34rpx;
      padding-left: 26rpx;
      color: #fdeedb;
      line-height: 68rpx;
    }
    .imgbox {
      flex-shrink: 0;
      position: relative;
      border: 6rpx solid #fff;
      @include square(148);
      box-sizing: border-box;
      border-radius: 50%;
      .avatar {
        @include square(136, 68);
      }
      .photo {
        position: absolute;
        bottom: -4rpx;
        right: 0rpx;
        @include square(48);
      }
    }
  }
  .service {
    margin-bottom: 20rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
    .area_top {
      background-image: url("https://ggllstatic.hpgjzlinfo.com/static/mine/minebg.png");
      display: flex;
      justify-content: space-around;
      padding-top: 56rpx;
      padding-bottom: 60rpx;
      border-radius: 20rpx;
      background-size: 100% 100%;
      padding-left: 40rpx;
      padding-right: 40rpx;
      ._item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .img {
          width: 122rpx;
          height: 122rpx;
        }
        .text {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 56rpx;
          margin-top: 16rpx;
        }
      }
    }
    &-item {
      @include size(330, 160);
      position: relative;
      padding: 24rpx 20rpx;
      box-sizing: border-box;
      .img {
        position: absolute;
        @include size(330, 160);
        top: 0;
        left: 0;
      }
      .text {
        font-size: 40rpx;
        font-weight: 500;
        line-height: 56rpx;
        position: relative;
        z-index: 1;
        &.support {
          color: #ffffff;
        }
        &.family {
          // color: #752f31;
          color: #ffffff;
        }
        &.cards {
          color: #ffffff;
        }
        &.orders {
          color: #ffffff;
        }
      }
    }
  }
  .user {
    // height: 480rpx;
    box-sizing: border-box;
    // padding-top: 16rpx;
    // box-shadow: 0px 4rpx 14rpx 0px rgba(0, 0, 0, 0.08);
    // border-radius: 16rpx;
    // margin-bottom: 40rpx;
    display: flex;
    // justify-content: space-between;
    &-item {
      width: 214rpx;
      height: 208rpx;
      // padding-top: 14rpx;
      margin-bottom: 24rpx;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 16px;
      margin-right: 20rpx;
      font-size: 38rpx;
      color: #333333;
      font-weight: 500;
      &:last-child {
        margin-right: 0;
      }
      .img {
        @include size(92, 92);
        margin-bottom: 2rpx;
      }
      .text {
        height: 56rpx;
        font-size: 40rpx;
        font-weight: 500;
        color: #333333;
        line-height: 56rpx;
        text-align: center;
      }
    }
  }
  .cropper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
  }
}
</style>

<template>
  <view>
    <swiper
      class="swiper"
      vertical
      :interval="interval"
      :duration="duration"
      @animationfinish="animationfinish"
    >
      <swiper-item v-for="(item, index) in list[0]" :key="index">
        <view class="swiper-item uni-bg-red" @click="saveplay('video' + index)">
          <view>
            <video
              object-fit="contain"
              class="video"
              :id="'video' + index"
              @pause="stop('video' + index)"
              @play="start('video' + index)"
              @waiting="waiting"
              play-btn-position="center"
              :controls="false"
              :show-center-play-btn="true"
              :show-play-btn="true"
              :show-fullscreen-btn="false"
              @error="videoErrorCallback"
              :src="item.mediaUrl"
            ></video>
          </view>
          <view class="info">
            <view class="_float">
              <view class="desc">{{ item.ttl }}</view>
            </view>
          </view>
          <view class="audio">
            <view class="text-group">
              <view class="text"></view>
            </view>
          </view>
        </view>
        <view class="buttons">
          <view class="header_group" @click="goType(item)">
            <image mode="aspectFill" class="header" :src="item.logoUrl" />
          </view>
          <view class="button">
            <image
              @click="collect(item, index)"
              mode="widthFix"
              class="icon"
              :src="collectIcon(item.colFlag)"
            />
            <view>收藏</view>
          </view>
          <view class="button">
            <image
              @click="share(index)"
              mode="widthFix"
              class="icon"
              src="https://ggllstatic.hpgjzlinfo.com/static/find/fenxiang.png"
            />
            <view>分享</view>
          </view>
        </view>
      </swiper-item>
      <!-- <view class="netError" v-if="loading == 3">
				<view class="text_center">
					<image class="noData" src="../find/static/no-data.png" mode="scaleToFill" />
					<view class="err_info">视频加载失败</view>
					<view class="try" @click="retry">点击重试</view>
				</view>
			</view>  -->
    </swiper>
    <uni-popup class="popup" ref="popup" type="bottom" :mask-click="true">
      <view class="share-pop pt-32">
        <view class="title fs-36">分享到</view>
        <view class="flex-h list fs-36">
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-wechat.png"
              mode="scaleToFill"
            />
            <text>微信好友</text>
          </button>
          <!-- #ifdef MP-ALIPAY -->
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-qq.png"
              mode="scaleToFill"
            />
            <text>QQ好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-alipay.png"
              mode="scaleToFill"
            />
            <text>支付宝好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-message.png"
              mode="scaleToFill"
            />
            <text>短信</text>
          </button>
          <!-- #endif -->
          <button class="item flex-v flex-c-c" @click="handleCopyClick">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-link.png"
              mode="scaleToFill"
            />
            <text>复制链接</text>
          </button>
        </view>
        <view class="btn">
          <view
            @click="handleCloseClick"
            class="cancle bg-white flex-h flex-c-c fs-44"
            >取消</view
          >
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import api from "@/apis/index.js";
export default {
  name: "small-video",
  props: {
    shareIcon: {
      type: String,
      default: "https://ggllstatic.hpgjzlinfo.com/static/find/fenxiang.png",
    },
  },
  data() {
    return {
      loading: 1,
      current: 0,
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      list: [[]],
      pageNum: 1,
      pageSize: 5,
      categoryName: "",
      logoUrl: "",
      playState: {},
    };
  },
  created() {
    console.log("===created--");
    uni.onNetworkStatusChange((res) => {
      if (res.isConnected) {
        console.log("===链接状态---", res.isConnected);
        this.loading = 2;
        const params = {
          contId: this.list[0][this.current].contId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        };
        this.videoList(params);
      } else {
        this.$uni.showToast("没有网络");
        this.loading = 33;
      }
    });
    uni.getNetworkType({
      success: (res) => {
        if (res.networkType != "none") {
          console.log();
        } else {
          this.loading = 3;
          this.$uni.showToast("没有网络");
        }
      },
    });
    this.playVideo();
  },
  onLoad(e) {
    console.log(
      "--onload---transInfor--",
      JSON.parse(decodeURIComponent(e.transInfor))
    );
    if (e.transInfor) {
      const videoItem = JSON.parse(decodeURIComponent(e.transInfor));
      videoItem["isStart"] = true;
      this.categoryName = videoItem["categoryName"];
      this.logoUrl = videoItem["logoUrl"];
      this.list[0].push(videoItem);
      const params = {
        contId: videoItem.contId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      console.log("===去请求");
      this.videoList(params);
    }
  },
  // 分享好友
  onShareAppMessage(res) {
    return {
      title: this.list[0][this.current].ttl,
      path:
        "/pages/find/video-swiper?transInfor=" +
        encodeURIComponent(JSON.stringify(this.list[0][this.current])),
      imageUrl: "https://ggllstatic.hpgjzlinfo.com/static/common/bg-share.png",
      success(res) {
        this.$uni.showToast({
          title: "分享成功",
        });
      },
      fail(res) {
        this.$uni.showToast({
          title: "分享失败",
          icon: "none",
        });
      },
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.list[0].ttl,
      path: "/pages/find/video-swiper",
      query:
        "transInfor=" +
        encodeURIComponent(JSON.stringify(this.list[0][this.current])),
      imageUrl: "https://ggllstatic.hpgjzlinfo.com/static/common/bg-share.png",
      success(res) {
        uni.showToast({
          title: "分享成功",
        });
      },
      fail(res) {
        uni.showToast({
          title: "分享失败",
          icon: "none",
        });
      },
    };
  },
  methods: {
    collectIcon(status) {
      const icons = {
        1: "https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-collected.png",
        0: "https://ggllstatic.hpgjzlinfo.com/static/map/mr_sc.png",
      };
      return icons[status];
    },
    retry() {
      uni.getNetworkType({
        success: (res) => {
          if (res.networkType != "none") {
            console.log();
          } else {
            this.loading = 3;
            this.$uni.showToast("没有网络");
          }
        },
      });
    },
    waiting() {
      console.log("---视频在加载waiting----");
    },
    stop(id) {
      this.playState[id] = false;
    },
    start(id) {
      this.playState[id] = true;
    },
    saveplay(id) {
      const state = this.playState[id];
      if (state) {
        uni.createVideoContext(id, this).pause();
      } else {
        uni.createVideoContext(id, this).play();
      }
    },
    goType(item) {
      uni.redirectTo({
        url:
          "/pages/find/small-video-class?contId=" +
          item.contId +
          "&categoryName=" +
          this.categoryName +
          "&logoUrl=" +
          this.logoUrl,
      });
    },
    playVideo() {
      const _this = this;
      const currentId = "video" + this.current;
      this.videoContent = uni.createVideoContext(currentId, _this).play();
      const trailer = this.list[0];
      trailer.forEach((item, index) => {
        if (item.mediaUrl != null && item.mediaUrl != "") {
          const temp = "video" + index;
          if (temp != currentId) {
            uni.createVideoContext(temp, _this).pause();
          }
        }
      });
    },
    // 分享
    share() {
      this.$refs.popup.open();
    },
    // 关闭分享
    handleCloseClick() {
      this.$refs.popup.close();
    },

    // 点击复制链接
    handleCopyClick() {
      // 复制链接 需要h5支持 TODO
      return;
      uni.setClipboardData({
        data:
          "https://ggll.hpgjzlinfo.com/#/discovery/app-detail/" +
          this.list[this.shareIndex].contId,
        success: (res) => {
          uni.getClipboardData({
            success: (resp) => {
              this.$refs.popup.close();
              uni.showToast({ title: "已复制到剪贴板" });
            },
          });
        },
      });
    },
    // 收藏
    collect(item, index) {
      if (!uni.getStorageSync("token")) {
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      if (item.colFlag === "0") {
        api.saveCollect({
          data: {
            colId: item.contId,
            colType: "5",
          },
          success: (data) => {
            this.list[0][index].colFlag = "1";
            this.$uni.showToast("收藏成功");
          },
        });
      } else {
        api.updateCollect({
          data: {
            requestColSingleDTOList: [
              {
                delFlag: "1",
                colId: item.contId,
              },
            ],
          },
          success: (data) => {
            this.list[0][index].colFlag = "0";
            this.$uni.showToast("取消收藏");
          },
        });
      }
    },
    // 视频错误信息回调
    videoErrorCallback(e) {
      console.log("===视频错误信息回调---");
    },
    animationfinish(e) {
      console.log("===化东--", e);
      this.current = e.detail.current;
      this.playVideo();
      const start = this.list[0][e.detail.current]["isStart"];
      const end = this.list[0][e.detail.current]["isLoad"];
      if (start) {
        uni.navigateBack();
      }
      if (end) {
        const params = {
          contId: this.list[0][e.detail.current].contId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        };
        this.videoList(params);
      }
    },
    videoList(params) {
      const userInfo = uni.getStorageSync("userInfo") || {};
      uni.getNetworkType({
        success: (res) => {
          if (res.networkType != "none") {
            console.log();
          } else {
            this.$uni.showToast("没有网络");
          }
        },
      });
      api.getRandomVideo({
        data: {
          userId: userInfo.uactId ? userInfo.uactId : "",
          contId: params.contId,
          pageNum: params.pageNum,
          pageSize: params.pageSize,
        },
        success: (res) => {
          this.loading = 2;
          const list = res.list || [];
          list[list.length - 1]["isLoad"] = true;
          if (list.length > 0) {
            this.$set(this.list, 0, this.list[0].concat(list));
            this.pageNum++;
          }
        },
        fail: (error) => {
          console.log(error);
          this.$uni.showToast("服务器异常,稍后再试");
        },
      });
    },
  },
};
</script>

<style lang="scss">
.swiper {
  position: relative;
  width: 100%;
  // height:100vh;
  //去除tabbar高度
  //  height: calc(100vh - 120rpx);
  height: 100vh;
  .swiper-item {
    width: 100%;
    height: 100%;
    .info {
      z-index: 1;
      position: absolute;
      // bottom: 80rpx;
      top: calc(100vh - 120rpx);
      color: white;
      // text-indent: 1em;
      font-size: 30upx;
      left: 36rpx;
      .title {
        width: auto;
        height: 60rpx;
        font-size: 44rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 60rpx;
      }
      ._float {
        display: flex;
        .desc {
          width: 686rpx;
          // height: 100rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 500;
          color: #e7e7e7;
          line-height: 50rpx;
          // margin-top: 16rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        // ._end{
        // 	flex-direction: column;
        //     align-self: flex-end;
        // }
      }
    }
    .audio {
      position: absolute;
      bottom: 20upx;
      z-index: 1;
      text-indent: 1em;
      color: white;
      font-size: 30upx;
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      @-webkit-keyframes move {
        0% {
          left: 100vw;
        }

        100% {
          left: -50vw;
        }
      }

      @-moz-keyframes move {
        0% {
          left: 100vw;
        }

        100% {
          left: -50vw;
        }
      }

      @-ms-keyframes move {
        0% {
          left: 100vw;
        }

        100% {
          left: -50vw;
        }
      }

      @keyframes move {
        0% {
          left: 100vw;
        }

        100% {
          left: -50vw;
        }
      }
      .text-group {
        position: relative;
        width: 50vw;
        height: 40upx;

        overflow: hidden;
        .text {
          position: absolute;
          top: 0upx;
          white-space: nowrap;
          /*文本不会换行，文本会在在同一行上继续*/
          -webkit-animation: 10s move infinite;
          -moz-animation: 10s move infinite;
          -ms-animation: 10s move infinite;
          animation: 10s move infinite;
          width: 50vw;
          left: 100vw;
        }
      }

      .icon {
        width: 60upx;
        height: 60upx;
        border-radius: 60upx;
        animation: turn 3s linear infinite;
        margin-right: 5vw;
        border: 10upx solid white;
      }

      @keyframes turn {
        0% {
          -webkit-transform: rotate(0deg);
        }

        25% {
          -webkit-transform: rotate(90deg);
        }

        50% {
          -webkit-transform: rotate(180deg);
        }

        75% {
          -webkit-transform: rotate(270deg);
        }

        100% {
          -webkit-transform: rotate(360deg);
        }
      }
    }
    .video {
      width: 100%;
      z-index: 0;
      height: 100vh;
      background: black;
      // height: calc(100vh - 120rpx);
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 5vw;
    bottom: 18vh;
    color: white;
    text-align: center;
    justify-content: center;
    z-index: 1;
    .header_group {
      margin-bottom: 44rpx;
      height: 120rpx;
      width: 56px;
      position: relative;
      .header {
        // border: 2px solid white;
        border-radius: 90rpx;
        height: 120rpx;
        width: 120rpx;
      }
    }

    .button {
      text-align: center;
      font-size: 36rpx;
      margin-bottom: 54rpx;

      .icon {
        margin: 20rpx;
        width: 80rpx;
        margin-bottom: 0;
        height: 80rpx;
      }
    }
  }
  .netError {
    position: absolute;
    top: 0;
    width: 750rpx;
    height: 100vh;
    color: #fff;
    background: #000000;
    .text_center {
      text-align: center;
      color: #fff;
      padding-top: 253rpx;
      .noData {
        width: 440rpx;
        height: 214rpx;
      }
      .try {
        color: #fff;
        font-size: 36rpx;
        border-radius: 36rpx;
        line-height: 108rpx;
        margin: 0 auto;
        margin-top: 106rpx;
        width: 610rpx;
        height: 108rpx;
        background: #292828;
        border-radius: 54rpx;
      }
      .err_info {
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #c7c7c7;
        margin-top: 42rpx;
      }
    }
  }
}
.share-pop {
  background-color: #f2f2f2;
  border-radius: 16px 16px 0px 0px;
  color: #333333;
  .title {
    text-align: center;
    line-height: 50rpx;
  }
  .list {
    // #ifdef MP-ALIPAY
    justify-content: flex-start;
    // #endif

    // #ifdef MP-WEIXIN
    justify-content: center;
    // #endif

    align-items: center;

    padding: 24rpx 74rpx;
    flex-wrap: wrap;
    .item {
      height: 192rpx;
      flex-shrink: 0;
      width: 33.3%;
      margin-bottom: 28rpx;
      image {
        flex-shrink: 0;
        width: 134rpx;
        height: 134rpx;
        margin-bottom: 8rpx;
      }
      text {
        line-height: 50rpx;
      }
    }
  }
  .btn {
    padding: 24rpx 74rpx;
    box-sizing: border-box;
    .cancle {
      height: 108rpx;
      border-radius: 54rpx;
      color: #666;
      font-weight: 500;
    }
  }
}
</style>

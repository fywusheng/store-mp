<template>
  <view class="article-detail">
    <view class="title">{{ detail.ttl }}</view>
    <view class="audio">
      <view class="audio-content flex-c-c">
        <view class="left flex-c-c">
          <cu-progress
            ref="cuProgress"
            :value="progress"
            @dragging="dragging"
            @dragstart="dragstart"
            @dragged="dragged"
            :current="current"
            :duration="duration"
            @dragcancel="dragcancel"
          >
          </cu-progress>
        </view>
        <view class="right">
          <view
            class="flex-h flex-c-c article-content"
            @click.stop="handleNoimg()"
          >
            <image
              v-if="!play"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/find/horn2x.png"
            ></image>
            <image
              v-if="play && !paused"
              class="playimg"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/find/list-stop2x.png"
            ></image>
            <image
              v-if="play && paused"
              class="playimg"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/find/list-play2x.png"
            ></image>
            <text v-if="!play">听文章</text>
            <text class="play" v-if="play && !paused">暂停</text>
            <text class="play" v-if="play && paused">播放</text>
          </view>
        </view>
      </view>
    </view>
    <view class="text-p">
      <rich-text :nodes="nodes" space="nbsp"></rich-text>
    </view>
    <!-- <image class="max"
         mode="widthFix"
         src="https://ggllstatic.hpgjzlinfo.com/static/home/image-home-article-default.png"
         @error="handleImageLoadFail"
         alt=""> -->
    <view v-if="isShare == 'true'" class="flex-c-c share-bot">
      <view class="share-item" @click="handleCollect">
        <image
          class="cole"
          mode="scaleToFill"
          v-if="detail.colFlag === '1'"
          src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-collected.png"
        />
        <image
          class="cole"
          mode="scaleToFill"
          v-else
          src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-uncollect.png"
        />
        <text>收藏</text>
      </view>
      <view class="share-item" @click="handleShareClick">
        <image
          class="share"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-share2x.png"
        />
        <text>分享</text>
      </view>
    </view>

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
import cuProgress from "./components/cu-progress.vue";
import parse from "mini-html-parser2";

export default {
  components: { cuProgress },
  data() {
    return {
      isShare: "true",
      // 文章id
      contId: "",
      // 播放比例
      progress: 0,
      // 当前时间
      current: 0,
      // 总时长
      duration: 0,
      // 详情
      detail: {},
      // 富文本节点
      nodes: "",
      // 是否播放
      play: false,
      // 是否暂停
      paused: false,
      // 详情的图片
      imgs: null,
    };
  },
  watch: {},
  onLoad(option) {
    console.log("===kan---", option);
    this.contId = option.contId;
    this.isShare = option.isShare;
    if (option.imgs) {
      this.imgs = JSON.parse(option.imgs);
    } else {
      this.imgs = null;
    }

    console.log("this.imgs:", this.imgs);
  },
  onShow() {
    this.getContById();
  },
  methods: {
    // 获取文章详情
    getContById() {
      let userId = "";
      if (uni.getStorageSync("userInfo")) {
        userId = uni.getStorageSync("userInfo").uactId;
      }
      const data = {
        contId: this.contId,
        userId: userId,
      };
      uni.showLoading({
        title: "加载中",
      });
      // if(this.pageNum>1){
      //     this.bottomTips = "loading"
      // }
      api.getContById({
        data,
        success: (res) => {
          uni.hideLoading();
          if (res) {
            this.detail = res;
            // const nodesList = []

            console.log("this.nodes:", this.nodes);
            const handlerStr = res.cont || ""; // mode="aspectFill"
            const s = handlerStr.replace(
              /<img/g,
              '<img style="width:100%" mode="scaleToFill"'
            );
            var regEx = /\s+/g;
            const ab = s.replace(regEx, " ").replace(/&nbsp;/g, "\xa0");
            const res2 = ab.replace(/0em/g, "2em");
            // 消除支付宝 br 引起的多个空行问题
            res.cont = res2
              .replace(/<br>/g, '<br style="display:none">')
              .replace(/&nbsp;/g, "\xa0");
            parse(res.cont, (err, nodesList) => {
              // console.log(res.cont);
              this.nodes = res.cont;
              // 创建音频播放实例
              this.innerAudioContext = uni.createInnerAudioContext();
              // this.innerAudioContext.autoplay = true

              // #ifdef MP-WEIXIN
              this.innerAudioContext.src = this.detail.mediaUrl;
              // #endif

              // #ifdef MP-ALIPAY
              this.innerAudioContext.src =
                this.detail.youkuUrl || this.detail.mediaUrl;
              // #endif

              this.innerAudioContext.onPlay(() => {});

              // 监听播放事件
              this.innerAudioContext.onTimeUpdate(() => {
                // 音频播放进度更新事件
                console.log("音频播放进度更新事件");
                this.progress =
                  (this.innerAudioContext.currentTime /
                    this.innerAudioContext.duration) *
                  100;
                this.current = this.innerAudioContext.currentTime;
                this.duration = this.innerAudioContext.duration;
                // console.log('音频播放进度更新事件',(this.innerAudioContext.currentTime/this.innerAudioContext.duration)*100);
              });
              // 监听播放出错事件
              this.innerAudioContext.onError((res) => {
                console.log("播放出错", res.errMsg);
              });
              // 监听自然播放结束事件
              this.innerAudioContext.onEnded((res) => {
                console.log("监听自然播放结束事件");
                this.progress = 0;
                // 是否播放
                this.play = false;
                // 是否暂停
                this.paused = false;
                this.current = 0;
              });
              // 监听暂停事件
              this.innerAudioContext.onPause((res) => {});
              // 监听音频停止事件
              this.innerAudioContext.onStop((res) => {});
              // 监听音频停止事件
              this.innerAudioContext.onPlay((res) => {
                this.paused = false;
              });
              // 监听音频跳转事件
              this.innerAudioContext.onSeeking((res) => {
                console.log("监听音频跳转事件");
              });
              // 监听音频跳转事件结束
              this.innerAudioContext.onSeeked((res) => {
                console.log("监听音频跳转事件结束");
                this.innerAudioContext.src; // 天坑。如果不执行这行就不能继续执行onTimeUpdate方法！！！！！！！
                this.innerAudioContext.play();
              });
            });
          }
          //
        },
        fail: (err) => {
          console.log(err);
          uni.hideLoading();
        },
      });
    },
    // 开始拖动
    dragstart(data) {
      console.log("开始拖动：", data);
    },
    // 拖动中
    dragging(data) {
      console.log("拖动中：", data);
    },
    // 拖动结束
    dragged(data) {
      console.log("拖动结束：", data);
      console.log("总时长", this.duration);
      console.log(
        "播放位置：",
        typeof ((this.duration * data.value) / 100).toFixed(0)
      );
      this.innerAudioContext.seek(
        Number(((this.duration * data.value) / 100).toFixed(0))
      );
    },
    // 取消拖动
    dragcancel(data) {
      console.log("取消拖动：", data);
    },
    // 图片加载失败
    handleImageLoadFail() {
      // 图片加载失败时显示默认图片
      this.detail.image =
        "https://ggllstatic.hpgjzlinfo.com/static/home/image-home-article-default.png";
    },
    handleNoimg() {
      if (!this.play) {
        this.innerAudioContext.play();
        this.play = true;
      } else if (this.play && !this.paused) {
        this.innerAudioContext.pause();
        this.paused = true;
      } else if (this.play && this.paused) {
        this.innerAudioContext.play();
        this.paused = false;
      }
    },
    /**
     * 点击收藏按钮事件
     */
    handleCollect() {
      if (!uni.getStorageSync("token")) {
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      if (this.detail.colFlag === "0") {
        api.saveCollect({
          data: {
            colId: this.contId,
            colType: "4",
          },
          success: (data) => {
            this.detail.colFlag = "1";
            this.$uni.showToast("收藏成功");
          },
        });
      } else {
        api.updateCollect({
          data: {
            requestColSingleDTOList: [
              {
                delFlag: "1",
                colId: this.contId,
              },
            ],
          },
          success: (data) => {
            this.detail.colFlag = "0";
            this.$uni.showToast("取消收藏");
            uni.setStorageSync("colId", this.contId);
          },
        });
      }
    },
    // 点击复制链接
    handleCopyClick() {
      uni.setClipboardData({
        data:
          "https://ggll.hpgjzlinfo.com/#/discovery/app-detail/" + this.contId,
        success: (res) => {
          console.log(res);
          uni.getClipboardData({
            success: (resp) => {
              this.$refs.popup.close();
              console.log("resp:", resp);
              uni.showToast({
                title: "已复制到剪贴板",
              });
            },
          });
        },
      });
    },
    // 点击分享
    handleShareClick() {
      if (!uni.getStorageSync("token")) {
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      this.$refs.popup.open();
    },
    // 关闭分享
    handleCloseClick() {
      this.$refs.popup.close();
    },
    /**
     * 获取收藏列表
     */
    getCollect() {
      if (uni.getStorageSync("token")) {
        api.findListByParmas({
          data: {
            pageNum: 1,
            pageSize: 100,
            colType: "4",
            isDistanceOrder: true,
          },
          success: (data) => {
            if (data) {
              data.finalList.some((item) => {
                if (item.colId == this.dataDetail.rid) {
                  this.dataDetail["isCollected"] = 1;
                  return true;
                }
              });
            }
          },
          fail: (data) => {},
        });
      }
    },
  },
  onUnload() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }
  },
  // 分享好友
  onShareAppMessage(res) {
    return {
      title: this.detail.ttl,
      path: "/pages/find/article-detail?contId=" + this.contId,
      imageUrl: this.imgs ? this.imgs[0] : "",
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
      title: this.detail.ttl,
      path: "/pages/find/article-detail",
      query: "contId=" + this.contId,
      imageUrl: this.imgs
        ? this.imgs[0]
        : "https://ggllstatic.hpgjzlinfo.com/static/common/bg-share.png",
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
};
</script>

<style lang="scss" scoped>
.article-detail {
  background-color: #fff;
  .title {
    padding: 32rpx;
    font-weight: 500;
    color: #333333;
    line-height: 50rpx;
    font-size: 48rpx;
  }
  .audio {
    padding: 0 32rpx 0;
    .audio-content {
      width: 686rpx;
      height: 160rpx;
      background: #f2f2f2;
      border-radius: 16rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .left {
        flex-shrink: 0;
        width: 420rpx;
      }
      .right {
        flex-shrink: 0;
        width: 212rpx;
        margin-left: 18rpx;
        .article-content {
          width: 212rpx;
          height: 72rpx;
          border-radius: 36rpx;
          // border: 2rpx solid #999999;
          font-size: 36rpx;
          color: #333333;
          background-color: #fff;
          image {
            flex-shrink: 0;
            width: 48rpx;
            height: 40rpx;
            &.playimg {
              width: 32rpx;
              height: 32rpx;
            }
          }
          .play {
            color: #ff5500;
          }
          text {
            margin-left: 18rpx;
          }
        }
      }
    }
  }
  .max {
    width: 100vw;
  }
  .text-p {
    padding: 32rpx 0 54rpx;
    margin: 0 auto;
    width: 686rpx;
    // text-indent: 2em;
    font-size: 40rpx;
    color: #333333;
    line-height: 60rpx;
  }
  .share-bot {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 134rpx;
    padding-bottom: 20rpx;
    background-color: #fff;
    .share-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36rpx;
      color: #333333;
      line-height: 50rpx;
      image {
        margin-right: 24rpx;
      }
      .cole {
        width: 48rpx;
        height: 48rpx;
      }
      .share {
        height: 40rpx;
        width: 40rpx;
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
}
</style>

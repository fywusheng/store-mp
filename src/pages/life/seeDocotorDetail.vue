<template>
  <view class="article-detail">
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
      <rich-text :nodes="nodes"></rich-text>
    </view>
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
      menuName: "",
    };
  },
  watch: {},
  onLoad(option) {
    console.log("===kan---", option);
    if (option.menuName) {
      this.menuName = option.menuName;
    }
    this.$uni.setTitle(this.menuName);
  },
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
    // return {
    //   title:'看病详情',
    //   path:
    //     "/pages/common/webpage?url=${encodeURIComponent('https://ggll.hpgjzlinfo.com/#/'+`${item.route}`)}",
    // };
  },
  onShow() {
    this.getDetailInfos();
  },
  methods: {
    getDetailInfos() {
      const data = {
        name: this.menuName,
      };
      uni.showLoading({
        title: "加载中",
      });

      api.getDetailInfos({
        data,
        success: (res) => {
          uni.hideLoading();
          if (res) {
            this.detail = res;
            const nodesList = [];
            const content = res.content;
            const handlerStr = content.replace(
              /<img/g,
              '<img style="width:100%; mode="widthFix"'
            );
            parse(handlerStr, (err, nodesList) => {
              this.nodes = nodesList;
              // 创建音频播放实例
              this.innerAudioContext = uni.createInnerAudioContext();
              // this.innerAudioContext.autoplay = true

              // #ifdef MP-WEIXIN
              this.innerAudioContext.src = this.detail.mp3;
              // #endif

              // #ifdef MP-ALIPAY
              console.log("===播放资源---", this.detail.mp3);
              this.innerAudioContext.src = this.detail.mp3 || this.detail.mp3;
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
  },
  onUnload() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }
  },
};
</script>

<style lang="scss" scoped>
.article-detail {
  padding-bottom: 140rpx;
  background-color: #fff;
  .title {
    padding: 54rpx 32rpx 32rpx;
    font-weight: 500;
    color: #333333;
    line-height: 50rpx;
    font-size: 48rpx;
  }
  .audio {
    padding: 0 32rpx 32rpx;
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
    padding: 0 32rpx 54rpx;
    text-indent: 2em;
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

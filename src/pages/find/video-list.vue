<template>
  <view class="video-list">
    <view class="video-item" v-for="(item, index) in list" :key="index">
      <video
        class="videoplay"
        @play="saveplay('video' + item.contId)"
        :id="'video' + item.contId"
        :title="item.ttl"
        :play-btn-position="center"
        :show-play-btn="true"
        :show-center-play-btn="true"
        :src="item.mediaUrl"
        :poster="item.imgs[0]"
        :show-fullscreen-btn="true"
        :mobilenet-hint-type="1"
        :autoplay="index === 0"
      ></video>
      <!-- <view class="videoImg" >
                <image src="https://ggllstatic.hpgjzlinfo.com/static/find/video-bg2x.png" mode="widthFix"  class="videobg"  />
                <image mode="widthFix" src="https://ggllstatic.hpgjzlinfo.com/static/find/audio2x.png" class="play"/>
            </view> -->
      <view class="video-text">{{ item.ttl }}</view>
      <view class="video-share">
        <view class="share-item" @click="handleCollect(item, index)">
          <image
            class="cole"
            v-if="item.colFlag === '1'"
            src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-collected.png"
            mode="scaleToFill"
          />
          <image
            class="cole"
            v-else
            src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-uncollect.png"
            mode="scaleToFill"
          />
          <view>收藏</view>
        </view>
        <view class="share-item" @click="handleShareClick(index)">
          <image
            class="share"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-share2x.png"
          />
          <view>分享</view>
        </view>
      </view>
    </view>
    <view class="bottomTips" v-if="bottomTips">
      <view class="loading" v-if="bottomTips == 'loading'">
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
      </view>
      <view>{{ judgeBottomTips(bottomTips) }}</view>
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

export default {
  data() {
    return {
      firstVideo: {},
      list: [],
      lowerThreshold: 30,
      bottomTips: "",
      isAllowPullDown: false, // 是否触发下拉刷新
      contId: undefined, // 类目id
      pageNum: 1, // 当前页数
      pageSize: 20, // 每页条数
      current: "",
      shareIndex: 0,
    };
  },
  watch: {},
  onLoad(e) {
    this.firstVideo = JSON.parse(decodeURIComponent(e.firstVideo));
    this.contId = this.firstVideo.contId;
    this.getVideoList();
  },
  mounted() {},
  onShow() {
    this.pageNum = 1;
    this.list = [];
    // this.getVideoList()
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
    console.log("用户把这个页面上拉100时触发我的");
    this.getVideoList();
  },
  methods: {
    // 判断底部提示文字
    judgeBottomTips(type) {
      switch (type) {
        case "nomore":
          return "没有更多数据了";
          break;
        case "loading":
          return "正在努力加载中...";
          break;
        case "more":
          return "上拉加载更多";
          break;
        default:
          break;
      }
    },
    // 获取视频列表
    getVideoList() {
      let userId = "";
      if (uni.getStorageSync("userInfo")) {
        userId = uni.getStorageSync("userInfo").uactId;
      }
      const data = {
        contId: this.contId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userId: userId,
        theatreFlag: 1,
      };
      // if(this.pageNum>1){
      //     this.bottomTips = "loading"
      // }
      api.getVideoList({
        data,
        showsLoading: true,
        success: (res) => {
          if (res.list) {
            if (data.pageNum === 1) {
              this.list.push(this.firstVideo);
            }
            res.list.map((items, indexs) => {
              this.list.push(items);
            });

            this.pageNum = this.pageNum + 1;
          } else {
            if (this.pageNum > 0) {
              this.bottomTips = "nomore";
              // setTimeout(()=>{
              //     this.bottomTips = ""
              // },2000)
            }
          }

          //
        },
        fail: (err) => {},
      });
    },
    // 点击播放
    saveplay(name) {
      console.log("点击播放视频：", this.current, name);
      if (this.current && name != this.current) {
        // console.log('被暂停了')
        this.videoContext = uni.createVideoContext(this.current, this);
        console.log("被暂停了", this.videoContext);
        this.videoContext.pause();
      }
      this.current = name;
    },
    /**
     * 点击收藏按钮事件
     */
    handleCollect(item, index) {
      if (!uni.getStorageSync("token")) {
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      if (this.list[index].colFlag === "0") {
        api.saveCollect({
          data: {
            colId: item.contId,
            colType: "4",
          },
          success: (data) => {
            this.list[index].colFlag = "1";
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
            this.list[index].colFlag = "0";
            this.$uni.showToast("取消收藏");
          },
        });
      }
    },
    // 点击复制链接
    handleCopyClick() {
      uni.setClipboardData({
        data:
          "https://ggll.hpgjzlinfo.com/#/discovery/app-detail/" +
          this.list[this.shareIndex].contId,
        success: (res) => {
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
    handleShareClick(index) {
      if (!uni.getStorageSync("token")) {
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      this.shareIndex = index;
      this.$refs.popup.open();
    },
    // 关闭分享
    handleCloseClick() {
      this.$refs.popup.close();
    },
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log("触发refresh");
    setTimeout(() => {
      uni.stopPullDownRefresh();
    });
  },
  // 分享好友
  onShareAppMessage(res) {
    return {
      title: this.list[this.shareIndex].ttl,
      path:
        "/pages/find/video-list?firstVideo=" +
        encodeURIComponent(JSON.stringify(this.firstVideo)),
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
      path: "/pages/find/video-list",
      query:
        "firstVideo=" + encodeURIComponent(JSON.stringify(this.firstVideo)),
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
  filters: {},
};
</script>

<style lang="scss" scoped>
.video-list {
  background-color: #f2f2f2;
  .video-item {
    position: relative;
    font-size: 0;
    .videoplay {
      width: 750rpx;
      height: 400rpx;
    }
    .videoImg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 750rpx;
      height: 400rpx;
      .videobg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 750rpx;
        height: 400rpx;
      }
      .play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 128rpx;
        height: 128rpx;
      }
    }
    .video-text {
      padding: 24rpx 32rpx 0;
      font-size: 40rpx;
      font-weight: 500;
      color: #333333;
      line-height: 50rpx;
      white-space: pre-wrap;
      background-color: #fff;
    }
    .video-share {
      height: 112rpx;
      padding-bottom: 4rpx;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background-color: #fff;
      .share-item {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36rpx;
        color: #333333;
        line-height: 50rpx;
        padding: 0 32rpx 0 16rpx;
        image {
          margin-right: 16rpx;
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
  }
  .bottomTips {
    width: 100%;
    height: 80rpx;
    font-size: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .loading {
      width: 110rpx;
      height: 110rpx;
      position: relative;
      transform: scale(0.4);
      margin-right: -20rpx;
      .list {
        width: 15rpx;
        height: 15rpx;
        border-radius: 30px;
        background: #090909;
        position: absolute;
        animation: opaticyAnimation linear 0.7s infinite;
        -webkit-animation: opaticyAnimation linear 0.7s infinite;
      }
      .list:nth-child(1) {
        left: 24px;
        top: 2px;
        animation-delay: 0s;
      }
      .list:nth-child(2) {
        left: 40px;
        top: 8px;
        animation-delay: 0.1s;
      }
      .list:nth-child(3) {
        left: 47px;
        top: 24px;
        animation-delay: 0.2s;
      }
      .list:nth-child(4) {
        left: 40px;
        top: 40px;
        animation-delay: 0.3s;
      }
      .list:nth-child(5) {
        left: 24px;
        top: 47px;
        animation-delay: 0.4s;
      }
      .list:nth-child(6) {
        left: 8px;
        top: 40px;
        animation-delay: 0.5s;
      }
      .list:nth-child(7) {
        left: 2px;
        top: 24px;
        animation-delay: 0.6s;
      }
      .list:nth-child(8) {
        left: 8px;
        top: 8px;
        animation-delay: 0.7s;
      }
      @keyframes opaticyAnimation {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
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
}
</style>

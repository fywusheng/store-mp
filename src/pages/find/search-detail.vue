<template>
  <view class="article-detail">
    <view class="title">{{ detail.ttl }}</view>
    <view class="line-audio">
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
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/find/list-stop2x.png"
            ></image>
            <image
              v-if="play && paused"
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

    <!-- <image class="max"
         mode="widthFix"
         src="https://ggllstatic.hpgjzlinfo.com/static/home/image-home-article-default.png"
         @error="handleImageLoadFail"
         alt=""> -->
    <view class="flex-c-c share-bot">
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
          <button class="item flex-v flex-c-c ml-56" @click="handleCopyClick">
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
    <!-- 音频组件控制模块 -->
    <view class="bg-black" v-if="!closeAudio" @click="closeAudio = true"></view>
    <view class="audio" v-if="showAudion">
      <Yaudio
        @handleClose="handleClose"
        ref="yaudio"
        @prePlay="prePlay"
        @handleSwitchPlay="handleSwitchPlay"
        @nextPlay="nextPlay"
        :title="title"
        @mounted="handleMounted"
        :stopPlay="stopPlay"
        :videoBg="videoBg"
        :closeAudio="closeAudio"
        @triggleBg="triggleBg"
      ></Yaudio>
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import cuProgress from "./components/cu-progress.vue";
import Yaudio from "./components/audio";
import parse from "mini-html-parser2";

export default {
  components: { cuProgress, Yaudio },
  data() {
    return {
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
      // 音频背景板是否关闭
      closeAudio: true,
      // 控制音频显示
      showAudion: false,
      // 音频文章标题
      title: "",
      // 设置默认图片
      videoBg: "https://ggllstatic.hpgjzlinfo.com/static/find/process_bg2x.png",
      // 播放音频的下标
      playindex: null,
      // 暂停播放
      stopPlay: false,
      // 已经执行完成上一篇
      prefun: true,
      // 已经执行完成下一篇
      nextfun: true,

      // 当前文章所在index
      index: 0,
      // 获取传过来的process值
      process: 0,
    };
  },
  watch: {},
  onLoad(option) {
    console.log("option:", option);
    this.options = option;
    this.contId = option.contId;

    // 作为分享的图片
    if (option.imgs) {
      this.imgs = JSON.parse(option.imgs);
    } else {
      this.imgs = null;
    }

    // 不是从分享 进入页面（有当前文章的列表和文章下标）
    if (option.index !== undefined) {
      this.list = uni.getStorageSync("singleList");
      this.index = parseInt(option.index);
    }

    //  是否有播放的音频（包含暂停和正在播放两种情况
    if (option.playindex !== undefined) {
      this.list = uni.getStorageSync("singleList");

      this.showAudion = true; // 展示播放器

      console.log("option:", option);
      this.playindex = parseInt(option.playindex); // 文章在列表的索引
      this.innerAudioContext = uni.getBackgroundAudioManager(); // 获取背景音乐
      this.title = this.list[this.playindex].ttl; // 播放器标题
      console.log("音频播放进度更新事件this.$refs:", this.$refs);
      //  this.$refs.yaudio.process  = parseInt(option.process)      // 进度(这里无法设置，因为子组件未加载完成，只能靠子组件的mounted)

      // 设置播放背景图
      if (this.list[this.playindex].imgs) {
        this.videoBg = this.list[this.playindex].imgs[0];
        this.innerAudioContext.coverImgUrl = this.list[this.playindex].imgs[0];
      } else {
        this.videoBg =
          "https://ggllstatic.hpgjzlinfo.com/static/find/process_bg2x.png";
        this.innerAudioContext.coverImgUrl =
          "https://ggllstatic.hpgjzlinfo.com/static/find/process_bg2x.png";
      }
      console.log("到碗里来");
      // 判断当前是否在暂停
      if (this.innerAudioContext.paused) {
        this.stopPlay = false;
        if (this.index === this.playindex) {
          this.paused = true;
        }
      } else {
        this.stopPlay = true;
        if (this.index === this.playindex) {
          this.paused = false;
        }
      }
      // 监听播放事件（如果详情的是正在播放的文章
      if (this.index === this.playindex) {
        this.progress = option.process; // 进度
        this.innerAudioContext.onTimeUpdate(() => {
          // 音频播放进度更新事件
          console.log("音频播放进度更新事件this.$refs:", this.$refs);
          this.$refs.yaudio.process =
            (this.innerAudioContext.currentTime /
              this.innerAudioContext.duration) *
            100;
          this.progress =
            (this.innerAudioContext.currentTime /
              this.innerAudioContext.duration) *
            100;
          this.current = this.innerAudioContext.currentTime;
          this.duration = this.innerAudioContext.duration;
          this.play = true; // 详情展示已播放

          // console.log('音频播放进度更新事件',(this.innerAudioContext.currentTime/this.innerAudioContext.duration)*100);
        });
      } else {
        // （详情不是正在播放的文章
        this.innerAudioContext.onTimeUpdate(() => {
          // 音频播放进度更新事件
          this.$refs.yaudio.process =
            (this.innerAudioContext.currentTime /
              this.innerAudioContext.duration) *
            100;
          // console.log('音频播放进度更新事件',(this.innerAudioContext.currentTime/this.innerAudioContext.duration)*100);
        });
      }

      // 监听播放出错事件
      this.innerAudioContext.onError((res) => {
        console.log("播放出错", res.errMsg);
      });
      // 监听自然播放结束事件
      this.innerAudioContext.onEnded((res) => {
        console.log("监听自然播放结束事件");
        this.$refs.yaudio.process = 0;
        this.stopPlay = false;
        this.nextPlay();
      });
      // 监听暂停事件
      this.innerAudioContext.onPause((res) => {
        console.log("监听暂停事件");
      });
      // 监听音频停止事件
      this.innerAudioContext.onStop((res) => {
        console.log("监听音频停止事件");
      });
    }

    console.log("this.imgs:", this.imgs);
  },
  onShow() {
    this.getContById();
  },
  methods: {
    // 子组件加载完成
    handleMounted() {
      // 如果有音频对象，并且被暂停就渲染进度（如果在播放的话，那么在播放监听里面会更新进度）
      if (this.innerAudioContext && this.innerAudioContext.paused) {
        this.$refs.yaudio.process = parseInt(this.options.process); // 进度
      }
    },

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
      api.getContById({
        data,
        showsLoading: true,
        success: (res) => {
          if (res) {
            this.detail = res;
            console.log("this.nodes:", this.nodes);

            parse(res.cont, (err, nodesList) => {
              this.nodes = nodesList;
            });
          }
          //
        },
        fail: (err) => {},
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
      this.detail.image = "/static/home/image-home-article-default.png";
    },
    handleNoimg() {
      // 如果播放器显示,并且详情没有被播放或者没有显示播放器(可能播放的是列表页面带下来的)
      if ((this.showAudion && !this.play) || !this.showAudion) {
        console.log("执行1");
        this.handleListenArticleclick(this.index);
      } else if (this.showAudion && this.play) {
        // 如果播放器显示,并且详情已被播放(则当前播放的是详情页的文章)
        // 此时背景音乐存在，切换暂停和播放
        if (this.innerAudioContext.paused) {
          console.log("执行2");
          this.innerAudioContext.play();
          this.paused = false;
          this.stopPlay = true;
        } else {
          console.log("执行3");
          this.innerAudioContext.pause();
          this.paused = true;
          this.stopPlay = false;
        }
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
     * 播放
     */
    handleListenArticleclick(index) {
      // 展示音频空控件
      this.showAudion = true;

      // 获取当前播放的文章所在列表的下标
      const oldIndex = this.playindex;

      // 获取即将播放的文章所在列表的下标
      this.playindex = index;

      // 如果不是当前详情，重置样式
      console.log("this.index:", this.index);
      console.log("index:", index);

      if (this.index !== index) {
        console.log("重置样式");
        this.progress = 0;
        this.current = 0;
        this.play = false;
      } else {
        this.play = true;
        this.paused = false;
      }

      if (oldIndex !== null) {
        // 如果已有播放音频，去掉对应文章显示的样式
        this.list[oldIndex].play = false;
      }

      // 创建背景音乐实例（拿到播放路径会自动播放
      this.innerAudioContext = uni.getBackgroundAudioManager();
      this.innerAudioContext.title = this.list[index].ttl;

      // #ifdef MP-WEIXIN
      this.innerAudioContext.src = this.list[index].mediaUrl;
      // #endif
      // #ifdef MP-ALIPAY
      this.innerAudioContext.src = this.list[index].mediaUrl.youkuUrl;
      // #endif

      this.title = this.list[index].ttl;
      console.log(
        "当前音频是否是暂停或者停止状态:",
        this.innerAudioContext.paused
      );
      // 设置播放背景图
      if (this.list[index].imgs) {
        this.videoBg = this.list[index].imgs[0];
        this.innerAudioContext.coverImgUrl = this.list[index].imgs[0];
      } else {
        this.videoBg =
          "https://ggllstatic.hpgjzlinfo.com/static/find/process_bg2x.png";
        this.innerAudioContext.coverImgUrl =
          "https://ggllstatic.hpgjzlinfo.com/static/find/process_bg2x.png";
      }

      this.innerAudioContext.onPlay(() => {});

      // 显示正在播放图标（||）
      this.stopPlay = true;
      // 当前播放的文章显示特殊样式
      this.list[index].play = true;

      uni.setStorageSync("singleList", this.list);
      // 监听播放事件
      this.innerAudioContext.onTimeUpdate(() => {
        // 音频播放进度更新事件
        console.log("音频播放进度更新事件");
        this.$refs.yaudio.process =
          (this.innerAudioContext.currentTime /
            this.innerAudioContext.duration) *
          100;
        this.process =
          (this.innerAudioContext.currentTime /
            this.innerAudioContext.duration) *
          100;
        if (this.index === index) {
          this.progress =
            (this.innerAudioContext.currentTime /
              this.innerAudioContext.duration) *
            100;
          this.current = this.innerAudioContext.currentTime;
          this.duration = this.innerAudioContext.duration;
          this.play = true; // 详情展示已播放
        }
        // console.log('音频播放进度更新事件',(this.innerAudioContext.currentTime/this.innerAudioContext.duration)*100);
      });
      // 监听播放出错事件
      this.innerAudioContext.onError((res) => {
        console.log("播放出错", res.errMsg);
      });
      // 监听自然播放结束事件
      this.innerAudioContext.onEnded((res) => {
        console.log("监听自然播放结束事件");
        this.$refs.yaudio.process = 0;
        this.stopPlay = false;
        this.nextPlay();
      });
      // 监听暂停事件
      this.innerAudioContext.onPause((res) => {
        console.log("监听暂停事件");
      });
      // 监听音频停止事件
      this.innerAudioContext.onStop((res) => {
        console.log("监听音频停止事件");
      });
    },
    /**
     * 前一篇音频按钮事件
     * 第一个参数表示prePlay已经执行过一次，没有找到可播放文件，现在执行第二次
     * 第二个参数表示将要从触发循环，从最后一条开始播放
     */
    prePlay(times, loop) {
      // 防止重复触发
      if (!this.prefun) {
        return;
      }
      this.prefun = false;
      // 播放音频的下标
      const playindex = this.playindex;
      console.log("假想下标：", this.loopIndex);
      console.log("定时器：", this.timer);
      // 如果没有这个参数，则取当前播放音频的下标
      if (!times) {
        this.loopIndex = playindex;
      }

      // 获取当前列表长度
      const length = this.list.length;

      // 触发循环，假象下标为列表长
      if (loop) {
        this.loopIndex = length;
      }
      // 如果当前假象播放对象下标不是第一个
      if (this.loopIndex > 0) {
        // 是文章
        this.prefun = true;
        if (this.list[this.loopIndex - 1].artiType === "0") {
          this.handleListenArticleclick(this.loopIndex - 1);
          console.log("执行1");
        } else {
          // 不是文章
          this.loopIndex = this.loopIndex - 1;
          this.prePlay(true);
          console.log("执行2");
        }
      } else {
        // 如果当前假象播放对象下标=0 请求新数据
        this.prefun = true;
        this.prePlay(true, true);
      }
    },
    /**
     * 切换音频播放按钮事件
     */
    handleSwitchPlay() {
      console.log("当前音频:", this.innerAudioContext.paused);
      // console.log("当前音频是否是暂停或者停止状态:",this.innerAudioContext.paused)
      if (this.innerAudioContext.paused) {
        this.innerAudioContext.play();
        this.stopPlay = true;
        if (this.index === this.playindex) {
          this.paused = false;
        }
      } else {
        this.innerAudioContext.pause();
        this.stopPlay = false;
        if (this.index === this.playindex) {
          this.paused = true;
        }
      }
    },
    /**
     * 后一篇音频按钮事件
     * 第一个参数表示prePlay已经执行过一次，没有找到可播放文件，现在执行第二次
     * 第二个参数表示将要从触发循环，从最后一条开始播放
     */
    nextPlay(times, loop) {
      console.log();
      if (!this.nextfun) {
        return;
      }

      this.nextfun = false;
      // 播放音频的下标
      const playindex = this.playindex;

      // 如果没有这个参数，则取当前播放音频的下标.本次为第一次执行
      if (!times) {
        this.loopIndex = playindex;
      }

      // 触发循环，假象下标为列表长
      if (loop) {
        this.loopIndex = -1;
      }

      // 获取当前列表长度
      const length = this.list.length;
      console.log("珍惜长度:", length);

      // 如果假象播放对象不是列表最后一个
      if (this.loopIndex < length - 1) {
        this.nextfun = true;
        console.log("珍惜:", this.loopIndex + 1);
        if (this.list[this.loopIndex + 1].artiType === "0") {
          this.handleListenArticleclick(this.loopIndex + 1);
        } else {
          this.loopIndex = this.loopIndex + 1;
          this.nextPlay(true);
        }
      } else {
        this.nextfun = true;
        this.nextPlay(true, true);
      }
    },
    /**
     * 点音频关闭按钮事件
     */
    handleClose() {
      if (!this.innerAudioContext) {
        return;
      }
      // this.innerAudioContext.destroy()
      this.innerAudioContext.stop();
      this.showAudion = false;

      // 获取当前播放的文章所在列表的下标
      const playindex = this.playindex;
      if (playindex !== null) {
        // 去掉当前播放样式
        this.list[playindex].play = false;
        uni.setStorageSync("singleList", this.list);
      }
      if (this.playindex === this.index) {
        this.progress = 0;
        this.play = false;
        this.paused = false;
      }

      this.closeAudio = true;
    },

    /**
     * 切换音频背景
     */
    triggleBg(data) {
      console.log("切换音频背景:", data);
      this.closeAudio = data;
    },
  },
  onUnload() {
    uni.setStorageSync("audio", {
      process: this.process, // 播放的进度
      playindex: this.playindex, // 播放的音频下标
      showAudion: this.showAudion, // 是否展示播放器
      stopPlay: this.stopPlay, // 是否在播放
    });
  },
  // 分享好友
  onShareAppMessage(res) {
    return {
      title: this.detail.ttl,
      path: "/pages/find/article-detail?contId=" + this.contId,
      imageUrl: this.imgs
        ? this.imgs[0]
        : "https://ggllstatic.hpgjzlinfo.com/static/common/bg-share.png",
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
  padding-bottom: 140rpx;
  .title {
    padding: 54rpx 32rpx 32rpx;
    font-weight: 500;
    color: #333333;
    line-height: 50rpx;
    font-size: 48rpx;
  }
  .line-audio {
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
            width: 45rpx;
            height: 45rpx;
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
  .audio {
    position: fixed;
    bottom: 100rpx;
    left: 32rpx;
    z-index: 2;
  }
  .bg-black {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.06);
  }
}
</style>

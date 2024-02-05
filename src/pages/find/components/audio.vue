<template>
  <view class="audio">
    <view @click="triggle" class="process-wraper">
      <cmd-progress
        class="process"
        type="circle"
        :percent="process"
        status="success"
        :showInfo="false"
      ></cmd-progress>
    </view>
    <view class="circle" @click="triggle">
      <image class="audioBg" :src="videoBg" mode="scaleToFill" />
      <view class="black">
        <image
          v-if="stopPlay"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/find/audio_gif.gif"
        ></image>
        <image
          v-if="!stopPlay"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/find/audio-stop2x.png"
        ></image>
      </view>
    </view>
    <view
      class="box"
      :style="{
        width: closeAudio ? '0rpx' : '87vw',
        paddingLeft: closeAudio ? '0rpx' : '150rpx',
      }"
    >
      <view class="box-title">{{ title }}</view>
      <view class="box-audio">
        <view class="control" @click="prePlay">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/find/pre.png"
            mode="scaleToFill"
          ></image>
          <text>上一条</text>
        </view>
        <view class="control" @click="handleSwitchPlay">
          <image
            v-if="!stopPlay"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/find/play.png"
          ></image>
          <image
            v-if="stopPlay"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/find/stop.png"
          ></image>
          <text>播放</text>
        </view>

        <view class="control" @click="nextPlay">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/find/next.png"
            mode="scaleToFill"
          ></image>
          <text>下一条</text>
        </view>
        <view class="control" @click="handleClose">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/find/delete.png"
            mode="scaleToFill"
          ></image>
          <text>关闭</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import cmdProgress from "./cmd-progress.vue";
import { debounce } from "@/utils/utils.js";
export default {
  components: { cmdProgress },
  props: {
    title: {
      type: String,
      default: "",
    },
    stopPlay: {
      type: Boolean,
      default: true,
    },
    closeAudio: {
      type: Boolean,
      default: true,
    },
    videoBg: {
      type: String,
      default: "https://ggllstatic.hpgjzlinfo.com/static/find/process_bg2x.png",
    },
  },
  data() {
    return {
      process: 0,
    };
  },
  mounted() {
    uni.$emit("mounted");
    // this.timer=setInterval(()=>{
    //     this.process=this.process+2;
    //     if(this.process>100){
    //         this.process=0;
    //     }
    // },100);
  },
  methods: {
    /*
     * 前一篇文章按钮点击事件
     */
    // prePlay() {
    //   this.$emit("prePlay")
    // },
    prePlay: debounce(function () {
      this.$emit("prePlay");
    }, 400),
    /*
     * 暂停文章按钮点击事件
     */
    handleSwitchPlay() {
      this.$emit("handleSwitchPlay");
    },
    /*
     * 后一篇文章按钮点击事件
     */
    nextPlay: debounce(function () {
      this.$emit("nextPlay");
    }, 400),
    /*
     * 关闭按钮事件
     */
    handleClose() {
      this.$emit("handleClose");
    },
    /*
     * 切换背景板隐藏展示
     */
    triggle() {
      console.log("切换背景板");
      this.$emit("triggleBg", !this.closeAudio);
    },
  },
};
</script>
<style lang="scss" scoped>
.process {
  z-index: 150;
  position: absolute;
}
.audio {
  width: 160rpx;
  height: 160rpx;
  .process-wraper {
    position: absolute;
    z-index: 99;
  }
}
.circle {
  left: 8rpx;
  top: 8rpx;
  z-index: 100;
  position: absolute;
  width: 144rpx;
  height: 144rpx;
  background: url("https://ggllstatic.hpgjzlinfo.com/static/find/process_bg2x.png")
    no-repeat;
  background-size: 100% 100%;
  background-position: center;
  border-radius: 50%;
  overflow: hidden;
  .audioBg {
    position: absolute;
    top: 0;
    left: 0;
    width: 144rpx;
    height: 144rpx;
    z-index: -1;
  }
  .black {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    image {
      width: 50rpx;
      height: 50rpx;
    }
  }
}
.box {
  box-sizing: border-box;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 32rpx;
  // width: 600rpx;
  height: 160rpx;
  background: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.24);
  border-radius: 86rpx;
  box-sizing: border-box;
  padding-left: 150rpx;
  overflow: hidden;
  .box-title {
    width: 100%;
    height: 50rpx;
    line-height: 50rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 72rpx;
    box-sizing: border-box;
  }
  .box-audio {
    display: flex;
    width: 100%;
    padding-top: 20rpx;
    padding-right: 60rpx;
    box-sizing: border-box;
    .control {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      image {
        width: 32rpx;
        height: 32rpx;
      }
      text {
        color: #666666;
        font-size: 32rpx;
      }
    }
  }
}
</style>

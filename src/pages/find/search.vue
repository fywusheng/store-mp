<template>
  <view class="search">
    <!-- 顶部搜索模块 -->
    <view class="search-view flex-h flex-c-b bg-white p-0-32">
      <view class="search-bar flex-h flex-c-b flex-1 p-0-32">
        <input
          v-model="keyword"
          :focus="false"
          mode="scaleToFill"
          :maxlength="maxlength"
          class="search-bar__input fs-36 c-black flex-1"
          placeholder="搜你想看的"
        />
        <image
          v-if="keyword"
          mode="scaleToFill"
          class="search-bar__icon ml-8"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-input-clear.png"
          @click="keyword = ''"
        />
        <template>
          <view class="search-bar__line" />
          <image
            class="search-bar__voice ml-16"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-voice-grey.png"
            @click="handleVoiceInputClick"
          />
        </template>
      </view>
      <button
        class="cancel-button fs-36 c-black ml-24"
        hover-class="none"
        @click="handleSearchClick"
      >
        搜索
      </button>
    </view>
    <!-- 历史记录模块 -->
    <view class="histroy" v-if="!keyword && list.length === 0">
      <!-- 热搜 -->
      <view class="histroy-top" v-if="!keyword && hotList.length > 0">
        <hot-search :list="hotList" @keyWord="setKeyword"></hot-search>
      </view>
      <!-- 搜索历史 -->
      <view class="histroy-serach" v-if="histroySearch.length > 0">
        <text class="histroy-serach-left">搜索历史</text>
        <view class="histroy-serach-right" @click="clearHistory">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/map/delete2x.png"
            mode="scaleToFill"
          >
          </image>
          <text>清空</text>
        </view>
      </view>
      <view
        class="histroy-item"
        v-for="(item, index) in histroySearch"
        @click="setHistory(index)"
        :key="index"
      >
        <text class="histroy-item-left">{{ item }}</text>
        <view class="histroy-item-right" @click.stop="deleteKey(index)">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/find/delete2x.png"
            mode="scaleToFill"
          ></image>
        </view>
      </view>
    </view>
    <!-- 搜索提示模块 -->
    <view class="hoot" v-if="!isResult">
      <view
        class="hoot-item"
        v-for="(item, index) in findList"
        :key="index"
        @click="handleHoot(item)"
      >
        <view class="hoot-left">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-search-around.png"
            mode="scaleToFill"
          ></image>
          <!-- <text>{{item}}</text> -->
        </view>
        <rich-text
          class="richtext"
          :nodes="changeNode(item, keyword)"
        ></rich-text>
        <view class="hoot-right">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/find/topLeft2x.png"
            mode="scaleToFill"
          ></image>
        </view>
      </view>
    </view>
    <!-- 搜索结果显示模块 -->
    <view class="result" v-if="isResult">
      <result
        ref="result"
        :list="list"
        :isResult="isResult"
        :keyword="keyword"
        :stopPlay="stopPlay"
        @handleNoimg="handleNoimg"
        @handleSwitchPlay="handleSwitchPlay"
        @goDetail="goDetail"
        @goVedio="goVedio"
        @loadMore="loadMore"
      ></result>
    </view>
    <!-- 音频组件控制模块 -->
    <view class="bg-black" v-if="!closeAudio" @click="closeAudio = true"></view>
    <view class="audio" v-if="showAudion">
      <Yaudio
        ref="yaudio"
        @handleClose="handleClose"
        @prePlay="prePlay"
        @handleSwitchPlay="handleSwitchPlay"
        @nextPlay="nextPlay"
        :title="title"
        :stopPlay="stopPlay"
        :closeAudio="closeAudio"
        @triggleBg="triggleBg"
      ></Yaudio>
    </view>
    <!-- 语音弹出层模块 -->
    <uni-popup ref="popup" type="bottom">
      <view class="popup-top">
        <view>您可以试试这样说</view>
        <view class="popup-text">按摩椅/保温杯/养生产品</view>
      </view>
      <view class="bottom-view flex-v flex-c-c">
        <text class="bottom-view__text fs-40 c-grey">{{ tips }}</text>
        <image
          class="bottom-view__image"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/voice/icon-voice-input-button.png"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        />
      </view>
    </uni-popup>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import hotSearch from "@/pages/find/components/hot-search";
import result from "@/pages/find/components/result";
import Yaudio from "./components/audio";

export default {
  components: { uniPopup, result, hotSearch, Yaudio },
  data() {
    return {
      // 搜索关键字
      keyword: "",
      // 搜索结果列表
      list: [],
      // 最大长度限制
      maxlength: 64,
      // 正在说话
      tips: "按住说话",
      // 语音转文字插件实例
      manager: null,
      // 是否显示关键字联想词
      isResult: false,
      // 热搜列表
      hotList: [],
      // 历史搜索列表(放在缓存里)
      histroySearch: [],
      // 联想词列表
      findList: [],
      // 页码
      pageNum: 1,
      // 每页条数
      pageSize: 20,
      // 暂停播放
      stopPlay: true,
      // 音频背景板是否关闭
      closeAudio: true,
      // 音频文章标题
      title: "",
      // 播放音频的下标
      playindex: null,
      // 控制音频显示
      showAudion: false,
      // 组件触发上拉加载
      overpage: false,
      // 作为循环播放时改变的下标
      loopIndex: 0,
      voice: null,
    };
  },
  watch: {
    /**
     * 搜索框检索事件根据keyword变化立马检索
     */
    keyword(newVal, oldVal) {
      const unChinese = this.isKeyword(newVal);
      console.log("unChinese:", unChinese);
      if (!unChinese) {
        this.maxlength = 23;
      } else {
        this.maxlength = 63;
      }
      if (newVal) {
        this.isResult = false;
      }

      // 请求联想接口
      if (newVal === "") {
        this.list = [];
        this.findList = [];
        this.isResult = false;
      } else {
        this.findLenWord(newVal);
      }
    },
    /**
     * 搜索框检索事件根据keyword变化立马检索
     */
    overpage(n, o) {
      console.log("新的：", n);
      console.log("旧的：", o);
    },
  },
  onReady() {
    // #ifdef MP-ALIPAY
    this.initAlipay();
    // #endif

    // #ifdef MP-WEIXIN
    this.initRecordRecognitionManager();
    // #endif
  },
  onLoad(option) {
    console.log("---onload---");
    this.voice = option.voice;
    this.getHot();
    // #ifdef MP-WEIXIN
    if (option.voice == 1) {
      this.$refs.popup.open("top");
      this.initRecordRecognitionManager();
    }
    if (uni.getStorageSync("histroySearch")) {
      this.histroySearch = uni.getStorageSync("histroySearch");
    }
    // #endif
  },
  mounted() {
    // #ifdef MP-ALIPAY
    if (this.voice == 1) {
      this.$refs.popup.open("top");
      this.initAlipay();
    }
    if (uni.getStorageSync("histroySearch")) {
      this.histroySearch = uni.getStorageSync("histroySearch");
    }
    // #endif
  },
  methods: {
    // 初始化支付宝语音
    initAlipay() {
      const recorderManager = my.getRecorderManager();
      const innerAudioContext = my.createInnerAudioContext();
      const fs = my.getFileSystemManager();

      // 监听录音开始事件
      recorderManager.onStart(() => {
        console.log("recorder start");
      });
      // 监听录音暂停事件
      recorderManager.onPause(() => {
        console.log("recorder pause");
      });
      // 监听录音继续事件
      recorderManager.onResume(() => {
        console.log("recorder resume");
      });

      // 监听录音停止事件
      recorderManager.onStop((res) => {
        console.log("===支付宝开始---", res);
        fs.saveFile({
          tempFilePath: res["tempFilePath"],
          filePath: `${my.env.USER_DATA_PATH}/temb1.mp3`,
          success: (res1) => {
            console.log("读文件----", res1.savedFilePath);
            // my.alert({ content: res1.savedFilePath })

            fs.readFile({
              filePath: res1.savedFilePath,
              encoding: "base64",
              success: (rs) => {
                this.getVoiceContent(rs.data);
                //  my.alert({ content: 'recorder onStop' + JSON.stringify(rs.data)});
              },
              fail: (r) => {
                my.alert({ content: "recorder error" + JSON.stringify(r) });
              },
            });
            setTimeout(() => {
              innerAudioContext.src = res1.savedFilePath;
              innerAudioContext.play();
            }, 1000);
          },
        });
      });
      // 监听录音错误事件
      recorderManager.onError((res) => {
        console.log("recorder error", res);
      });

      this.manager = recorderManager;
    },
    // 语音识别
    getVoiceContent(base64) {
      console.log("----识别---", base64);

      api.getVoiceResult({
        data: {
          audioBase64: base64,
          videoType: "mp3",
        },
        success: (data) => {
          this.keyword = data.text;
          console.log(this.keyword, "语音识别结果");
        },
      });
    },
    // 加载跟多
    loadMore() {
      this.overpage = true;
      this.handleSearchClick();
    },
    // 设置关键词
    setKeyword(data) {
      this.keyword = data;
      this.pageNum = 1;
      this.overpage = false;
      this.handleSearchClick();
    },

    // 清空
    clearHistory() {
      uni.showModal({
        title: "",
        content: "确认删除全部搜索历史？",
        cancelText: "取消",
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            this.histroySearch = [];
            uni.setStorageSync("histroySearch", this.histroySearch);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    // 删除历史
    deleteKey(index) {
      this.histroySearch.splice(index, 1);
      uni.setStorageSync("histroySearch", this.histroySearch);
    },
    // 点击历史查询
    setHistory(index) {
      this.keyword = this.histroySearch[index];
      this.histroySearch.splice(index, 1);
      this.histroySearch.unshift(this.keyword);
      uni.setStorageSync("histroySearch", this.histroySearch);
      this.pageNum = 1;
      this.overpage = false;
      this.handleSearchClick();
    },
    /**
     * 关键词联想接口
     */
    findLenWord(keyword) {
      const data = {
        keyWord: keyword,
      };
      this.findList = [];

      api.findFilterVideoWord({
        data,
        success: (res) => {
          if (res) {
            this.findList = res.map((item, index) => {
              return item;
            });
            console.log("this.findList:", this.findList);
          }
        },
        fail: (err) => {},
      });
    },
    /**
     * 语音输入图标点击事件
     */
    handleVoiceInputClick() {
      this.$refs.popup.open("top");
    },

    /**
     * 麦触摸事件
     */
    handleTouchStart() {
      uni.showLoading();
      this.tips = "正在说话";
      this.manager.start({
        format: "mp3",
        sampleRate: "16000",
        encodeBitRate: "96000",
      });
    },
    /**
     * 麦触摸事件
     */
    handleTouchEnd() {
      uni.hideLoading();
      this.tips = "按住说话";
      this.manager.stop();
      this.$refs.popup.close();
    },
    /**
     * 初始化微信语音转文字插件
     */
    initRecordRecognitionManager() {
      const plugin = requirePlugin("WechatSI");
      const manager = plugin.getRecordRecognitionManager();
      const self = this;
      manager.onStart = function (res) {
        console.log("语音输入开始");
        self.reply = "";
      };
      manager.onRecognize = function (res) {
        self.content = res.result;
      };
      manager.onStop = function (res) {
        console.log("语音输入结束");
        self.keyword = res.result;
      };
      manager.onError = function (res) {
        console.error("语音输入报错: ", res.msg);
      };
      this.manager = manager;
    },
    /**
     * 点击搜索事件
     */
    handleSearchClick() {
      // TODO
      if (!this.keyword) {
        this.$uni.showToast("请输入您要搜索的词");
        return;
      }
      const data = {
        keyWord: this.keyword,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      // 是否在历史中已存在
      const a = this.histroySearch.find((value, index, arr) => {
        return value == this.keyword;
      });
      // 不存在就新增
      if (a === undefined && this.keyword && this.histroySearch.length < 20) {
        this.histroySearch.unshift(this.keyword);
      } else if (
        a === undefined &&
        this.keyword &&
        this.histroySearch.length >= 20
      ) {
        this.histroySearch.pop();
        this.histroySearch.unshift(this.keyword);
      }
      uni.setStorageSync("histroySearch", this.histroySearch);
      if (this.overpage) {
        this.$refs.result.bottomTips = "loading";
      }
      api.selectArtiListByKeyWord({
        data,
        success: (res) => {
          console.log("搜索数据this.overpage：", this.overpage);
          const list = res.list || [];
          if (list.length > 0) {
            list.map((item, index) => {
              this.list.push(Object.assign(item, { play: false }));
              this.pageNum = this.pageNum + 1;
            });
            console.log("结果数据1111111111111111：", this.list);
          } else {
            this.pageNum = 1;
            if (this.overpage) {
              this.$refs.result.bottomTips = "nomore";
            }
          }
          this.isResult = true;
        },
        fail: (err) => {},
      });
    },
    /**
     * 点击联想词
     */
    handleHoot(item) {
      console.log("点击联想词----：", item);
      this.keyword = item;
      this.list = [];
      this.pageNum = 1;
      this.overpage = false;
      this.handleSearchClick();
      // this.isResult = true
    },
    /**
     * 获取热搜
     */
    getHot() {
      const data = {};
      api.getCmsHotList({
        data,
        success: (res) => {
          if (res) {
            this.hotList = res;
          }
        },
      });
    },
    /**
     * 返回到上一级页面
     */
    navigateBack(items) {
      uni.navigateBack({
        success: () => {
          const data = {
            keyword: this.keyword,
            results: items,
          };
          uni.$emit("didMapSearchFinish", data);
        },
      });
    },
    /**
     * 列表判断同名高亮显示
     */
    getHighline(str) {
      return str.replace(
        new RegExp(this.keyword, "g"),
        `<text style="color: #0059FF;display:inline">${this.keyword}</text>`
      );
    },
    /**
     * 文章详情
     */
    goDetail(e, index) {
      // 关闭语音播报
      this.handleClose();
      console.log(index);
      console.log(this.list);
      console.log(this.list[index]);
      this.list[index].clikCnt = this.list[index].clikCnt + 1;
      uni.navigateTo({
        url: `/pages/find/article-detail?contId=` + e.currentTarget.dataset.id,
      });
    },
    /**
     * 视频详情
     */
    goVedio(e, index) {
      // 关闭语音播报
      this.handleClose();
      this.list[index].clikCnt = this.list[index].clikCnt + 1;
      uni.navigateTo({
        url: `/pages/find/video-list?contId=` + e.currentTarget.dataset.id,
      });
    },
    /**
     * 点击听文章没图片模块事件
     */
    handleNoimg(index) {
      this.showAudion = true;

      if (this.innerAudioContext) {
        // 销毁音频实例
        this.innerAudioContext.destroy();
      }
      // 获取当前播放的文章所在列表的下标
      const playindex = this.playindex;
      if (playindex !== null) {
        this.list[playindex].play = false;
      }
      // 创建音频播放实例
      this.innerAudioContext = uni.createInnerAudioContext();
      this.innerAudioContext.autoplay = true;
      this.innerAudioContext.src = this.list[index].mediaUrl;
      this.title = this.list[index].ttl;
      this.innerAudioContext.onPlay(() => {});

      // 当前播放音频所在列表的index
      this.playindex = index;

      // 显示正则播放图标（||）
      this.stopPlay = true;
      // 当前播放的文章显示特殊样式
      this.list[index].play = true;

      // 监听播放事件
      this.innerAudioContext.onTimeUpdate(() => {
        // 音频播放进度更新事件
        // console.log('音频播放进度更新事件')
        // console.log(' this.$refs.yaudio：', this.$refs)
        this.$refs.yaudio.process =
          (this.innerAudioContext.currentTime /
            this.innerAudioContext.duration) *
          100;
      });
      // 监听播放出错事件
      this.innerAudioContext.onError((res) => {
        console.log("播放出错", res.errMsg);
        console.log(res.errCode);
      });
      // 监听自然播放结束事件
      this.innerAudioContext.onEnded((res) => {
        console.log("监听自然播放结束事件");
        this.$refs.yaudio.process = 0;
        this.stopPlay = false;
        this.nextPlay();
        uni.setStorageSync("play", false);
      });
      // 监听暂停事件
      this.innerAudioContext.onPause((res) => {
        uni.setStorageSync("play", false);
        console.log("监听暂停事件");
      });
      // 监听音频停止事件
      this.innerAudioContext.onStop((res) => {
        uni.setStorageSync("play", false);
        console.log("监听音频停止事件");
      });
    },
    /**
     * 前一篇音频按钮事件
     */
    prePlay() {
      // 播放音频的下标
      const playindex = this.playindex;

      // 如果没有这个参数，则取当前播放音频的下标
      if (!times) {
        this.loopIndex = playindex;
      }

      // 获取当前列表长度
      const length = this.list.length;
      console.log("length:", length);
      if (this.loopIndex > 0) {
        if (this.list[this.loopIndex - 1].artiType === "0") {
          this.handleNoimg(this.loopIndex - 1);
        } else {
          this.this.loopIndex = this.loopIndex - 1;
          this.prePlay();
        }
      } else {
        this.$uni.showToast({
          title: "已经没有更多文章了",
          duration: 2000,
        });
      }
    },
    /**
     * 切换音频播放按钮事件
     */
    handleSwitchPlay() {
      console.log("当前音频是否是暂停或者停止状态");
      if (this.innerAudioContext.paused) {
        this.innerAudioContext.play();
        this.stopPlay = true;
      } else {
        this.innerAudioContext.pause();
        this.stopPlay = false;
      }
    },
    /**
     * 后一篇音频按钮事件
     */
    nextPlay() {
      // 播放音频的下标
      const playindex = this.playindex;
      // 获取当前列表长度
      const length = this.list.length;
      console.log("length:", length);

      if (playindex < length - 1) {
        if (this.list[playindex + 1].artiType === "0") {
          this.list[playindex].play = false;
          this.handleNoimg(playindex + 1);
        } else {
          this.playindex = playindex + 1;
          this.nextPlay();
        }
      } else {
        this.$uni.showToast({
          title: "已经是最后一篇文章了",
          duration: 2000,
        });
      }
    },
    /**
     * 点音频关闭按钮事件
     */
    handleClose() {
      if (!this.innerAudioContext) {
        return;
      }
      this.innerAudioContext.destroy();
      this.showAudion = false;

      // 获取当前播放的文章所在列表的下标
      const playindex = this.playindex;
      if (playindex !== null) {
        // 去掉当前播放样式
        this.list[playindex].play = false;
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
    // 转成数组富文本
    changeNode(item, keyword) {
      const arr = item.split(keyword);

      const last = {
        name: "div",
        attrs: {
          class: "div-class",
          style: "overflow:hidden;white-space:nowrap;text-overflow:ellipsis;",
        },
        children: [],
      };
      const textArr = [];
      arr.map((item, index) => {
        if (index < arr.length - 1) {
          textArr.push({
            name: "span",
            children: [
              {
                type: "text",
                text: item,
              },
            ],
          });
          textArr.push({
            name: "span",
            attrs: {
              style: "color:#0059FF",
            },
            children: [
              {
                type: "text",
                text: keyword,
              },
            ],
          });
        } else {
          textArr.push({
            name: "span",
            children: [
              {
                type: "text",
                text: item,
              },
            ],
          });
        }
      });
      last.children = textArr;
      console.log("last:", last);
      return [last];
    },
    /**
     * 判断全汉字
     */
    isKeyword(str) {
      let len = 0;
      let num = true;
      for (var i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        // 单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          len++;
          num = true;
        } else {
          len += 2;
          num = false;
          return false;
        }
      }
      return num;
      // return blen;
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
.search {
  min-height: 100vh;
  background: #fff;
  position: relative;
  .search-view {
    width: 100%;
    height: 112rpx;
    .search-bar {
      height: 80rpx;
      border-radius: 40rpx;
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
      &__input {
        height: 74rpx;
        padding: 0;
      }
      &__icon {
        @include square(32);
        border-radius: 16rpx;
        margin: 0 8rpx;
      }
      &__line {
        @include size(2, 24);
        background: #c9c9c9;
      }
      &__voice {
        @include square(48);
      }
    }
    .cancel-button {
      margin-left: 24rpx;
    }
  }
  .histroy {
    background: #fff;
    padding: 0 32rpx;
    // position: absolute;
    // top: 112rpx;
    // left: 0;
    // right: 0;
    // z-index: 1;
    max-height: calc(100vh - 112rpx);

    .histroy-top {
      line-height: 90rpx;
      width: 100%;
      height: 90rpx;
      border-bottom: 2rpx solid #eeeeee;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      // font-size: 36rpx;
    }
    .histroy-serach {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 90rpx;
      .histroy-serach-left {
        font-size: 40rpx;
        font-weight: bold;
        color: #333333;
      }
      .histroy-serach-right {
        display: flex;
        align-items: center;
        image {
          width: 40rpx;
          height: 40rpx;
        }
        text {
          margin-left: 10rpx;
          color: #999999;
          font-size: 36rpx;
        }
      }
    }
    .histroy-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 90rpx;
      border-bottom: 2rpx solid#EEEEEE;
      .histroy-item-left {
        flex-shrink: 0;
        width: 480rpx;
        font-size: 40rpx;
        color: #333333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 90rpx;
        height: 90rpx;
      }
      .histroy-item-right {
        display: flex;
        align-items: center;
        image {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }
  .hoot {
    padding: 0 32rpx;
    background: #fff;
    position: absolute;
    top: 112rpx;
    left: 0;
    right: 0;
  }
  .hoot-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 90rpx;
    border-bottom: 2rpx solid#EEEEEE;
    .hoot-left {
      display: flex;
      image {
        width: 40rpx;
        height: 40rpx;
      }
      text {
        margin-left: 20rpx;
      }
    }
    .richtext {
      flex: 1;
      padding: 0 24rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hoot-right {
      image {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}
.popup-top {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 200rpx;
  font-size: 25rpx;
  margin-top: 100rpx;
}
.popup-text {
  font-size: 25rpx;
  text-align: center;
  margin-top: 15rpx;
  color: rgb(209, 204, 204);
}
.bottom-view__image {
  width: 150rpx;
  height: 150rpx;
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
</style>

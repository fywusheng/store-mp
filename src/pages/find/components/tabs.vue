<template>
  <view>
    <scroll-view
      class="nav-scroll"
      :enable-flex="true"
      scroll-with-animation
      :throttle="false"
      :scroll-left="scrollToLeft"
      scroll-x
      @scroll="handleScroll"
    >
      <view class="nav uni-nav">
        <view
          class="nav-item"
          :class="swiperIndex == index ? 'nav-item-act' : ''"
          :key="index"
          v-for="(item, index) in classList"
          @click="taggleNav(index)"
        >
          {{ item.colName }}
        </view>
        <view class="nav-line" :style="style"></view>
      </view>
    </scroll-view>
    <view class="swiper">
      <!-- 插入自己的数据-->
      <view class="swiper-bg"></view>
      <view class="content">
        <!-- 置顶模块 -->
        <view
          class="content-top"
          v-for="(topItem, topIndex) in topList"
          @click="topDetail($event)"
          :data-id="topItem.contId"
          :key="topIndex"
        >
          <view class="top-left">置顶</view>
          <view class="top-right">{{ topItem.ttl }}</view>
        </view>
        <block v-for="(artItem, artIndex) in list" :key="artIndex">
          <!-- 听文章没图片模块 -->
          <view
            @click="goDetail($event, index, artIndex)"
            :data-id="artItem.contId"
            :class="['content-noimg ', artItem.play ? 'play' : '']"
            v-if="artItem.imgs === null && artItem.artiType === '0'"
          >
            <view class="noimg-title text-2">{{ artItem.ttl }}</view>
            <view class="noimg-bottom">
              <view class="left">
                <text class="left-time">{{ artItem.releasedTime }}</text>
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
              <view
                class="right"
                @click.stop="
                  handleNoimg(artIndex, index, artItem.play ? '1' : '2')
                "
              >
                <image
                  v-if="!artItem.play"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/horn2x.png"
                  mode="scaleToFill"
                >
                </image>
                <image
                  v-if="artItem.play && stopPlay"
                  class="playimg"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-stop2x.png"
                  mode="scaleToFill"
                ></image>
                <image
                  v-if="artItem.play && !stopPlay"
                  class="playimg"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-play2x.png"
                  mode="scaleToFill"
                ></image>
                <text v-if="!artItem.play">听文章</text>
                <text v-if="artItem.play && stopPlay">暂停</text>
                <text v-if="artItem.play && !stopPlay">播放</text>
              </view>
            </view>
          </view>
          <!-- 听文章一张图片模块 -->
          <view
            @click="goDetail($event, index, artIndex)"
            :data-id="artItem.contId"
            :class="['content-oneimg ', artItem.play ? 'play' : '']"
            v-else-if="artItem.imgs.length === 1 && artItem.artiType === '0'"
          >
            <view class="oneimg-title">
              <text class="text-3">{{ artItem.ttl }}</text>
              <image
                :src="imgItem"
                mode="scaleToFill"
                @error="
                  handleArticleImageLoadFail(index, artIndex, imgIndex, 1)
                "
                v-for="(imgItem, imgIndex) in artItem.imgs"
                :key="imgIndex"
              ></image>
            </view>
            <view class="oneimg-bottom">
              <view class="left">
                <text class="left-time">{{ artItem.releasedTime }}</text>
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
              <view
                class="right"
                @click.stop="
                  handleNoimg(artIndex, index, artItem.play ? '1' : '2')
                "
              >
                <image
                  v-if="!artItem.play"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/horn2x.png"
                  mode="scaleToFill"
                >
                </image>
                <image
                  v-if="artItem.play && stopPlay"
                  class="playimg"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-stop2x.png"
                  mode="scaleToFill"
                ></image>
                <image
                  v-if="artItem.play && !stopPlay"
                  class="playimg"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-play2x.png"
                  mode="scaleToFill"
                ></image>
                <text v-if="!artItem.play">听文章</text>
                <text v-if="artItem.play && stopPlay">暂停</text>
                <text v-if="artItem.play && !stopPlay">播放</text>
              </view>
            </view>
          </view>
          <!-- 听文章多张图片显示模块 -->
          <view
            @click="goDetail($event, index, artIndex)"
            :data-id="artItem.contId"
            :class="['content-noimg ', artItem.play ? 'play' : '']"
            v-else-if="artItem.imgs.length > 1 && artItem.artiType === '0'"
          >
            <view class="noimg-title">{{ artItem.ttl }}</view>
            <view class="img-center">
              <template v-for="(imgItem, imgIndex) in artItem.imgs">
                <image
                  v-if="false"
                  :src="imgItem"
                  mode="scaleToFill"
                  @error="
                    handleArticleImageLoadFail(index, artIndex, imgIndex, 2)
                  "
                  :key="imgIndex"
                >
                </image>
              </template>
            </view>
            <view class="noimg-bottom">
              <view class="left">
                <text class="left-time">{{ artItem.releasedTime }}</text>
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
              <view
                class="right"
                @click.stop="
                  handleNoimg(artIndex, index, artItem.play ? '1' : '2')
                "
              >
                <image
                  v-if="!artItem.play"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/horn2x.png"
                  mode="scaleToFill"
                >
                </image>
                <image
                  v-if="artItem.play && stopPlay"
                  class="playimg"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-stop2x.png"
                  mode="scaleToFill"
                ></image>
                <image
                  v-if="artItem.play && !stopPlay"
                  class="playimg"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-play2x.png"
                  mode="scaleToFill"
                ></image>
                <text v-if="!artItem.play">听文章</text>
                <text v-if="artItem.play && stopPlay">暂停</text>
                <text v-if="artItem.play && !stopPlay">播放</text>
              </view>
            </view>
          </view>
          <!-- 视频模块-->
          <view
            @click="goVedio($event, index, artIndex)"
            :data-id="artItem.contId"
            class="content-noimg"
            v-else-if="artItem.artiType === '1'"
          >
            <view class="audio-title text-2">{{ artItem.ttl }}</view>
            <view class="audio-center">
              <!-- <image class="bg" src="https://ggllstatic.hpgjzlinfo.com/static/find/video2x.png"   /> -->
              <image
                class="bg"
                :src="artItem.imgs[0]"
                @error="
                  handleArticleImageLoadFail(index, artIndex, imgIndex, 1)
                "
                v-for="(imgItem, imgIndex) in artItem.imgs"
                :key="imgIndex"
                mode="scaleToFill"
              />
              <image
                class="play"
                mode="scaleToFill"
                src="https://ggllstatic.hpgjzlinfo.com/static/find/audio2x.png"
              ></image>
            </view>
            <view class="noimg-bottom">
              <view class="left">
                <text class="left-time">{{ artItem.releasedTime }}</text>
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
            </view>
          </view>
        </block>
        <bottom-tips ref="bottomTips" :bottomTips="bottomTips"></bottom-tips>
        <block v-if="list.length === 0 && topList.length === 0">
          <view class="flex-v flex-c-c status-box">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"
              mode="scaleToFill"
            />
            <view class="flex-c-c status-text">暂无内容</view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import bottomTips from "./bottom-tips";
export default {
  components: { bottomTips },
  props: {
    classList: {
      type: Array,
      default: [],
    },
    topList: {
      type: Array,
      default: [],
    },
    list: {
      type: Array,
      default: [],
    },
    stopPlay: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      swiperIndex: 0, // 当前的swiperindex
      navItemWidth: "", // 选中下划线的宽度
      navItemLeft: 0, // 选中下划线的显示位置
      scrollToLeft: 0, // scrollview需要滚动的距离
      navInfos: [], // 所有navitem的节点信息
      parentLeft: 0, // nav盒子的节点信息
      componentWidth: 0, // nav盒子的宽度
      refreStatus: false, // 状态
      bottomTips: "", // 加载文字
      newLoading: false, // 是否加长页面
      currentPage: 1, // 当前页码
    };
  },
  computed: {
    style() {
      return `width:${this.navItemWidth}px; left:${this.navItemLeft}px`;
    },
  },
  mounted() {
    // console.log("mounted执行初始化：",this.list)
    // this.init();
  },
  updated() {
    // console.log("updated执行：",this.list)
    // #ifdef MP-ALIPAY
    // this.init();
    // #endif
  },
  onLoad() {
    // this.getExampleData();
  },
  methods: {
    // 图片加载失败
    handleArticleImageLoadFail(tab, index, imgIndex, type) {
      this.$emit("handleArticleImageLoadFail", tab, index, imgIndex, type);
    },
    // 获取数据
    getExampleData(type) {
      this.$emit("refreshData");
    },
    // 自定义上拉加载更多
    loadMore() {
      console.log("加载更多");
      // this.currentPage++;

      this.bottomTips = "loading";
      this.$emit("loadMore");
      // setTimeout(() => {
      // 	// this.bottomTips = "more";
      // 	this.bottomTips = "more";
      // },1000)
    },
    // 自定义下拉刷新
    refresh() {
      this.getExampleData(1);
    },
    // 获取dom信息
    init() {
      const query = uni.createSelectorQuery().in(this);
      query.select(".uni-nav").fields({ rect: true, size: true }, (res) => {
        this.parentLeft = res.left;
        this.componentWidth = res.width;
        console.log("res==>", res);
      });
      query
        .selectAll(".nav-item")
        .fields({ rect: true, size: true }, (data) => {
          console.log("domdata:", data);
          data.forEach((item, index) => {
            if (index == 0) {
              this.navItemWidth = item.width;
              this.navItemLeft = item.left;
            }
            this.navInfos.push({ width: item.width, left: item.left });
          });
        });
      query.exec();
      // setTimeout(()=>{
      //   this.taggleNav(1)
      // },100)
    },
    // 点击导航切换swiper
    taggleNav(val) {
      this.swiperIndex = val;
      this.$emit("currentIndex", this.swiperIndex);
      this.bottomTips = "";
      if (this.nomore && this.list.length > 4) {
        this.bottomTips = "nomore";
      }
      // #ifdef MP-ALIPAY
      this.scrollDom();
      // #endif
    },
    // 滚动tabs以及移动下划线
    scrollDom() {
      const info = this.navInfos[this.swiperIndex];
      console.log("获取元素：", info);
      const offsetLeft = info.left - this.parentLeft;
      const scrollLeft = offsetLeft - (this.componentWidth - info.width) / 2;
      this.scrollToLeft = scrollLeft < 0 ? 0 : scrollLeft;
      this.navItemLeft = this.navInfos[this.swiperIndex].left;
      setTimeout(() => {
        this.navItemWidth = info.width;
      }, 50);
    },
    // swiper的index变动
    swiperChange(e) {
      this.swiperIndex = e.detail.current;
      this.$emit("currentIndex", this.swiperIndex);
      if (
        this.list[this.swiperIndex].nomore &&
        this.list[this.swiperIndex].content.length > 4
      ) {
        this.bottomTips = "nomore";
      } else {
        this.bottomTips = "";
      }
      this.scrollDom();
    },
    // tabs-scrollview触底
    handleScroll(e) {
      this.scrollDom();
    },
    // 滚动到底部
    bindscrolltolower(e) {
      console.log(e);
    },
    // swiper-ScrollLower触底
    swiperScrollLower() {
      uni.showToast({
        icon: "none",
        title: `此时为${this.list[this.swiperIndex].title}触底`,
      });
      setTimeout(() => {
        // this.getData();
      }, 500);
    },
    // 生成列表数据
    getData() {
      uni.showLoading({
        title: "加载中",
      });
      setTimeout(() => {
        for (let index = 0; index < 10; index++) {
          const arr = this.list[this.swiperIndex].content;
          this.$set(
            arr,
            arr.length,
            Math.random() + "-" + index + this.list[this.swiperIndex].title
          );
        }
        uni.hideLoading();
      }, 1000);
      console.log(this.list[this.swiperIndex]);
    },
    // 下拉事件
    handleRefre() {
      this.refreStatus = true;
      uni.showLoading({
        title: "下拉加载中",
      });
      setTimeout(() => {
        this.list[this.swiperIndex].content = [];
        for (var i = 0; i < 5; i++) {
          this.list[this.swiperIndex].content.push([
            this.list[this.swiperIndex].title + "下拉-" + i,
          ]);
        }
        uni.hideLoading();
      }, 1000);
      setTimeout(() => {
        this.refreStatus = false;
      }, 1000);
    },
    /*
     * 点击听文章事件
     */
    handleNoimg(index, tab, type) {
      console.log("点击播放音频type：", uni.getStorageSync("network"));
      if (uni.getStorageSync("network")) {
        // 已授权
        if (type == 2) {
          this.$emit("handleNoimg", index, tab);
        } else {
          // 切换播放和暂停
          this.$emit("handleSwitchPlay");
        }
      } else {
        // 点击播放
        uni.getNetworkType({
          success: (res) => {
            if (res.networkType != "wifi") {
              uni.showModal({
                title: "",
                content: "当前为非wif环境，是否使用流量播放",
                cancelText: "暂停播放",
                confirmText: "继续播放",
                success: (res) => {
                  if (res.confirm) {
                    if (type == 2) {
                      uni.setStorageSync("network", true);
                      this.$emit("handleNoimg", index, tab);
                    } else {
                      // 切换播放和暂停
                      this.$emit("handleSwitchPlay");
                    }
                  } else if (res.cancel) {
                  }
                },
              });
            } else {
              if (type == 2) {
                this.$emit("handleNoimg", index, tab);
              } else {
                // 切换播放和暂停
                this.$emit("handleSwitchPlay");
              }
            }

            console.log(res.networkType);
          },
        });
      }
    },
    // 置顶详情
    topDetail(e) {
      uni.navigateTo({
        url: `/pages/find/article-detail?contId=` + e.currentTarget.dataset.id,
      });
    },
    // 点击文章详情
    goDetail(e, tab, index) {
      this.$emit("goDetail", e, tab, index);
    },
    // 点击视频详情
    goVedio(e, tab, index) {
      this.$emit("goVedio", e, tab, index);
      // console.log("e:",e)
    },
  },
  watch: {
    classList: {
      // immediate:true,
      handler(n, o) {
        if (n.length > o.length) {
          this.init();
        }
        // console.log(n)
        console.log("新数据的长度：", n.length);
        console.log("旧数据的长度：", o.length);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.text-2 {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.text-3 {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.nav-scroll {
  // display: flex;
  // justify-content: center;
}
.nav-item {
  display: inline-block;
  margin: 0 16upx;
  text-align: center;
  transition: color 0.3s ease;
  font-size: 40rpx;
  color: #999999;
}

.nav {
  white-space: nowrap;
  position: relative;
  height: 50upx;
  padding: 20upx 16rpx;
}

/* #ifndef APP-NVUE */
::-webkit-scrollbar {
  display: none;
}
/* #endif */

/* #ifdef H5 */
// 通过样式穿透，隐藏H5下，scroll-view下的滚动条
scroll-view ::v-deep ::-webkit-scrollbar {
  display: none;
}
/* #endif */

.nav-item-act {
  color: #000;
  font-weight: bolder;
  position: relative;
  &::after {
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    bottom: -18rpx;
    transform: translateX(-50%);
    width: 64rpx;
    height: 8rpx;
    background: #ff711a;
    border-radius: 5rpx;
  }
}

// .nav-line {
//   position: absolute;
//   bottom: 2rpx;
//   height: 8upx;
//   border-radius: 10upx;
//   background-color: #ff711a;
//   transition: left 0.3s ease;
// }

swiper {
  height: calc(100vh - 212rpx) !important;
}

.swiper-item {
  color: #000;
  // position: relative;
  background-color: #fff;
  overflow-y: scroll;
  height: calc(100vh - 212rpx);
}
// swiper-item {
// 	overflow-y: scroll;
// }
.swiper-item-list {
  height: 400upx;
  line-height: 400upx;
}
.swiper-scroll {
  //height: 100%;
}
.swiper-bg {
  width: 100%;
  height: 16rpx;
  background: #f5f5f5;
}
.content {
  padding: 32rpx;
  padding-top: 0;
  padding-bottom: 0;
  .content-top {
    display: flex;
    width: 100%;
    border-bottom: 2rpx solid #f5f5f5;
    padding: 20rpx 0;
    .top-left {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100rpx;
      height: 60rpx;
      background: #ff9a00;
      border-radius: 8rpx;
      font-size: 36rpx;
      color: #fff;
    }
    .top-right {
      width: 100%;
      color: #323233;
      margin-left: 10rpx;
      font-size: 40rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .content-noimg {
    width: 100%;
    margin-top: 30rpx;
    padding-bottom: 12rpx;
    border-bottom: 2rpx solid #f5f5f5;
    &.play {
      .noimg-title {
        color: #ff5500;
      }
      .noimg-bottom {
        .right {
          border: 2rpx solid #ff5500;
          color: #ff5500;
        }
      }
    }
    .noimg-title {
      width: 100%;
      color: #333333;
      font-size: 40rpx;
    }
    .img-center {
      display: flex;
      width: 100%;
      height: 170rpx;
      image {
        flex: 1;
        height: 170rpx;
        margin: 20rpx 0rpx 0 10rpx;
        border-radius: 10rpx;
      }
    }
    .noimg-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100rpx;
      // border-bottom: 2rpx solid #f5f5f5;
      margin-top: 20rpx;
      .left {
        display: flex;
        align-items: center;
        width: 100%;
        color: #999999;
        font-size: 36rpx;
        .left-number {
          margin-left: 20rpx;
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 0 20rpx;
        height: 72rpx;
        border-radius: 36rpx;
        border: 2rpx solid #999999;
        box-sizing: border-box;
        font-size: 36rpx;
        color: #333333;
        image {
          flex-shrink: 0;
          width: 48rpx;
          height: 40rpx;
          margin-right: 16rpx;
          &.playimg {
            width: 32rpx;
            height: 32rpx;
          }
        }
        text {
          font-size: 36rpx;
        }
      }
    }

    .audio-title {
      width: 100%;
      color: #333333;
      font-size: 40rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .audio-center {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 380rpx;
      border-radius: 10rpx;
      // background: url("https://ggllstatic.hpgjzlinfo.com/static/logo.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 12rpx;
      overflow: hidden;
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
      }
      .play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 120rpx;
        height: 120rpx;
      }
    }
  }
  .content-oneimg {
    padding: 30rpx 0 12rpx;
    border-bottom: 2rpx solid #f5f5f5;
    &.play {
      .oneimg-title {
        color: #ff5500;
      }
      .oneimg-bottom {
        .right {
          border: 2rpx solid #ff5500;
          color: #ff5500;
        }
      }
    }
    .oneimg-title {
      display: flex;
      width: 100%;
      color: #333333;
      font-size: 40rpx;
      text {
        width: 100%;
        display: block; /* Fallback for non-webkit */
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      image {
        flex-shrink: 0;
        width: 260rpx;
        height: 160rpx;
        border-radius: 10rpx;
      }
    }
    .oneimg-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100rpx;
      // border-bottom: 2rpx solid #f5f5f5;
      .left {
        display: flex;
        align-items: center;
        width: 100%;
        color: #999999;
        font-size: 36rpx;
        .left-number {
          margin-left: 20rpx;
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 0 20rpx;
        height: 72rpx;
        border-radius: 36rpx;
        border: 2rpx solid #999999;
        box-sizing: border-box;
        font-size: 36rpx;
        color: #333333;
        image {
          flex-shrink: 0;
          width: 48rpx;
          height: 40rpx;
          margin-right: 16rpx;
          &.playimg {
            width: 32rpx;
            height: 32rpx;
          }
        }
        text {
          margin-left: 4rpx;
        }
      }
    }
  }
  .swiper-bottom {
    width: 100%;
    height: 150rpx;
  }
  .status-box {
    padding-top: 300rpx;
    image {
      width: 440rpx;
      height: 234rpx;
      margin-bottom: 24rpx;
    }
    .status-text {
      height: 50rpx;
      color: $color-grey;
    }
  }
}
</style>

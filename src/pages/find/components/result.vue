<template>
  <div>
    <hr-pull-load
      @refresh="refresh"
      @loadMore="loadMore"
      :height="-2"
      :pullHeight="50"
      :maxHeight="100"
      :lowerThreshold="30"
      :bottomTips="bottomTips"
      :isAllowPull="false"
      :isTab="true"
      ref="hrPullLoad"
    >
      <!-- 插入自己的数据-->
      <view class="swiper-bg"></view>
      <view class="content">
        <block v-for="(artItem, artIndex) in list" :key="artIndex">
          <!-- 听文章没图片模块 -->
          <view
            @click="goDetail($event, artIndex)"
            :data-id="artItem.contId"
            :class="['content-noimg ', artItem.play ? 'play' : '']"
            v-if="artItem.imgs === undefined && artItem.artiType == '0'"
          >
            <!-- <view class="noimg-title" v-html="changeColor(artItem.ttl, keyword)"></view> -->
            <rich-text
              class="noimg-title"
              :nodes="changeNode(artItem.ttl, keyword)"
            ></rich-text>
            <view class="noimg-bottom">
              <view class="left">
                <text class="left-time">{{ artItem.releasedTime }}</text>
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
              <view
                class="right"
                @click.stop="handleNoimg(artIndex, artItem.play ? '1' : '2')"
              >
                <image
                  v-if="!artItem.play"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/horn2x.png"
                />
                <image
                  v-if="artItem.play && stopPlay"
                  class="playimg"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-stop2x.png"
                />
                <image
                  v-if="artItem.play && !stopPlay"
                  class="playimg"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-play2x.png"
                />
                <text v-if="!artItem.play">听文章</text>
                <text v-if="artItem.play && stopPlay">暂停</text>
                <text v-if="artItem.play && !stopPlay">播放</text>
              </view>
            </view>
          </view>
          <!-- 听文章一张图片模块 -->
          <view
            @click="goDetail($event, artIndex)"
            :data-id="artItem.contId"
            :class="['content-oneimg ', artItem.play ? 'play' : '']"
            v-else-if="artItem.artiType == '0' && artItem.imgs.length === 1"
          >
            <view class="oneimg-title">
              <!-- <text>{{artItem.ttl}}</text> -->
              <rich-text
                class="left-text"
                :nodes="changeNode(artItem.ttl, keyword)"
              ></rich-text>
              <image
                :src="imgItem"
                v-for="(imgItem, imgIndex) in artItem.imgs"
                mode="scaleToFill"
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
                @click.stop="handleNoimg(artIndex, artItem.play ? '1' : '2')"
              >
                <image
                  v-if="!artItem.play"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/horn2x.png"
                />
                <image
                  v-if="artItem.play && stopPlay"
                  class="playimg"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-stop2x.png"
                />
                <image
                  v-if="artItem.play && !stopPlay"
                  class="playimg"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-play2x.png"
                />
                <text v-if="!artItem.play">听文章</text>
                <text v-if="artItem.play && stopPlay">暂停</text>
                <text v-if="artItem.play && !stopPlay">播放</text>
              </view>
            </view>
          </view>
          <!-- 听文章多张图片显示模块 -->
          <view
            @click="goDetail($event, artIndex)"
            :data-id="artItem.contId"
            :class="['content-noimg ', artItem.play ? 'play' : '']"
            v-else-if="artItem.artiType === '0' && artItem.imgs.length > 1"
          >
            <rich-text
              class="noimg-title"
              :nodes="changeNode(artItem.ttl, keyword)"
            ></rich-text>
            <view class="img-center">
              <template v-for="(imgItem, imgIndex) in artItem.imgs">
                <image
                  v-if="imgIndex < 3"
                  :src="imgItem"
                  mode="scaleToFill"
                  @error="
                    handleArticleImageLoadFail(index, artIndex, imgIndex, 2)
                  "
                  :key="imgIndex"
                />
              </template>
            </view>
            <view class="noimg-bottom">
              <view class="left">
                <text class="left-time">{{ artItem.releasedTime }}</text>
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
              <view
                class="right"
                @click.stop="handleNoimg(artIndex, artItem.play ? '1' : '2')"
              >
                <image
                  v-if="!artItem.play"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/horn2x.png"
                />
                <image
                  v-if="artItem.play && stopPlay"
                  class="playimg"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-stop2x.png"
                />
                <image
                  v-if="artItem.play && !stopPlay"
                  class="playimg"
                  mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/find/list-play2x.png"
                />
                <text v-if="!artItem.play">听文章</text>
                <text v-if="artItem.play && stopPlay">暂停</text>
                <text v-if="artItem.play && !stopPlay">播放</text>
              </view>
            </view>
          </view>
          <!-- 视频模块  v-else-if="artItem.artiType === '1'"-->
          <!-- 小视频视频模块不上暂时屏蔽 -->
          <view
            @click="goVedio($event, artIndex)"
            :data-id="artItem.contId"
            class="content-noimg"
            v-if="false"
          >
            <!-- <view class="audio-title">{{artItem.ttl}}</view> -->
            <view class="video-text">
              <rich-text
                class="audio-title"
                :nodes="changeVideo(artItem.ttl, keyword)"
              >
              </rich-text>
            </view>
            <view class="audio-center">
              <image
                class="bg"
                src="https://ggllstatic.hpgjzlinfo.com/static/find/video2x.png"
                mode="scaleToFill"
              />
              <image
                class="play"
                mode="scaleToFill"
                src="https://ggllstatic.hpgjzlinfo.com/static/find/audio2x.png"
              />
            </view>
            <view class="noimg-bottom">
              <view class="left">
                <text class="left-time">{{ artItem.releasedTime }}</text>
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
            </view>
          </view>
        </block>
        <block v-if="list.length === 0 && isResult">
          <view class="flex-v flex-c-c status-box">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"
              mode="scaleToFill"
            />
            <view class="flex-c-c status-text"
              >没有找到相关资讯，换个词搜搜看吧</view
            >
            <!-- <view class="flex-c-c status-text">没有找到相关资讯，换个词搜搜看吧</view> -->
          </view>
        </block>
      </view>
    </hr-pull-load>
  </div>
</template>

<script>
import hrPullLoad from "@/components/hr-pull-load/hr-pull-load.vue";
export default {
  components: { hrPullLoad },
  props: {
    list: {
      default: [],
      type: Array,
    },
    stopPlay: {
      type: Boolean,
      default: true,
    },
    keyword: {
      type: String,
      default: "",
    },
    isResult: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      exampleInfo: [],
      bottomTips: "",
      currentPage: 1,
    };
  },
  methods: {
    changeColor(item, keyword) {
      const res = new RegExp("(" + keyword + ")", "g");
      item = item.replace(
        res,
        "<text style='color:red;'>" + keyword + "</text>"
      );
      return item;
    },
    // 点击文章详情
    goDetail(e, index) {
      this.$emit("goDetail", e, index);
    },
    // 点击视频详情
    goVedio(e, index) {
      this.$emit("goVedio", e, index);
      // console.log("e:",e)
    },
    /*
     * 点击听文章事件
     */
    handleNoimg(index, type) {
      console.log("点击播放音频type：", type);
      // 已授权
      if (uni.getStorageSync("network")) {
        if (type == 2) {
          this.$emit("handleNoimg", index);
        } else {
          // 切换播放和暂停
          this.$emit("handleSwitchPlay");
        }
      } else {
        // 点击播放
        uni.getNetworkType({
          success: (res) => {
            console.log("networkType:", res.networkType);
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
                      this.$emit("handleNoimg", index);
                    } else {
                      this.$emit("handleSwitchPlay");
                    }
                  } else if (res.cancel) {
                  }
                },
              });
            } else {
              if (type == 2) {
                this.$emit("handleNoimg", index);
              } else {
                this.$emit("handleSwitchPlay");
              }
            }

            console.log(res.networkType);
          },
        });
      }
    },
    // 获取数据
    getExampleData(type) {},
    // 自定义上拉加载更多
    loadMore() {
      this.$emit("loadMore", "load");
    },
    // 自定义下拉刷新
    refresh() {
      // this.currentPage = 1;
      // this.getExampleData(1);
    },
    // 转成数组富文本
    changeNode(item, keyword) {
      const arr = item.split(keyword);
      // let last = {
      //   name: 'div',
      //   attrs: {
      //     class: 'div-class',
      //     style: 'overflow:hidden;white-space:nowrap;text-overflow:ellipsis;',
      //   },
      //   children: [],
      // }
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
      // last.children = textArr
      // console.log('last:', last)
      return textArr;
    },

    // 视频标题
    changeVideo(item, keyword) {
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
      // console.log('last:', last)
      return [last];
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 32rpx;
  background: #fff;
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
          margin-left: 4rpx;
        }
      }
    }
    .video-text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
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
    .oneimg-title {
      display: flex;
      width: 100%;
      color: #333333;
      font-size: 40rpx;
      .left-text {
        width: 100%;
        display: block; /* Fallback for non-webkit */
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
      image {
        flex-shrink: 0;
        width: 260rpx;
        height: 160rpx;
        border-radius: 10rpx;
      }
    }
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
    .oneimg-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100rpx;
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

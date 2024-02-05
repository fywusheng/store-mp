<template>
  <view class="small_video_class">
    <view class="top_header">
      <view v-if="showDefault" class="imgBg bg"></view>
      <image
        class="imgBg"
        mode="scaleToFill"
        @error="defaultImg"
        src="https://ggllstatic.hpgjzlinfo.com/static/find/head_icon.png"
      />
      <view>
        <image class="classIcon" :src="logoUrl" />
        <view class="classTitle">{{ categoryName }}</view>
      </view>
    </view>
    <view class="type_center">
      <small-video
        :datalist="list[0]"
        :showBottom="false"
        @return_data="reurnData"
      ></small-video>
    </view>
    <view v-if="loading != 2">
      <view class="flex-v flex-c-c" v-if="loading === 1">
        <image
          class="status-box"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/business_loading.gif"
          mode="scaleToFill"
        />
        <view class="flex-c-c status-text">{{ loading_test[loading] }}</view>
      </view>
      <view class="flex-v flex-c-c" v-if="loading == 3">
        <image
          class="noData"
          src="https://ggllstatic.hpgjzlinfo.com/static/find/no-data.png"
          mode="scaleToFill"
        />
        <view class="flex-c-c status-text">{{ loading_test[loading] }}</view>
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
  </view>
</template>

<script>
import smallVideo from "@/pages/find/small-video.vue";
import api from "@/apis/index.js";
export default {
  components: {
    smallVideo,
  },
  data() {
    return {
      list: [[]],
      pageNum: 1,
      pageSize: 20,
      contId: "",
      categoryName: "",
      logoUrl: "",
      showDefault: false,
      bottomTips: "",
      loading_test: { 22: "暂无数据", 3: "加载失败" },
      loading: 1,
    };
  },
  onLoad(e) {
    console.log("---type娃哈哈---", e);
    this.categoryName = e.categoryName || "";
    this.logoUrl = e.logoUrl || "";
    if (e.contId) {
      this.contId = e.contId || "";
      this.getTypeList(this.contId);
    }
  },
  onReachBottom() {
    // 上拉加载
    this.getTypeList(this.contId);
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.getTypeList(this.contId);
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
    defaultImg() {
      this.showDefault = true;
    },
    reurnData(data) {
      console.log("---data---", data);
      uni.redirectTo({
        url:
          "/pages/find/video-swiper?transInfor=" +
          `${encodeURIComponent(JSON.stringify(data))}`,
      });
    },
    getTypeList(contId) {
      uni.showLoading({
        title: "加载中",
      });
      // const userInfo = uni.getStorageSync('userInfo') || {}
      api.getCategoryList({
        data: {
          // userId: userInfo.uactId ? userInfo.uactId : '',
          contId: contId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        success: (res) => {
          this.loading = 2;
          const getList = res.list || [];
          getList.map((v) => {
            v["logoUrl"] = this.logoUrl;
          });
          if (getList.length > 0) {
            this.$set(this.list, 0, this.list[0].concat(getList));
            this.pageNum++;
            this.bottomTips = "";
          } else {
            this.bottomTips = "nomore";
          }
          uni.stopPullDownRefresh();
          uni.hideLoading();
        },
        fail: (error) => {
          uni.showToast(error.message);
          uni.stopPullDownRefresh();
          uni.hideLoading();
          this.bottomTips = "";
          this.loading = 3;
        },
      });
    },
  },
};
</script>

<style lang="scss">
.small_video_class {
  .top_header {
    position: relative;
    width: 750rpx;
    height: 346rpx;
    margin-bottom: 40rpx;
    .imgBg {
      width: 100%;
      height: 100%;
    }
    .bg {
      background-color: #333;
    }
    .classIcon {
      width: 164rpx;
      height: 164rpx;
      border-radius: 50%;
      position: absolute;
      top: 222rpx;
      left: 32rpx;
      //    border:1rpx solid #cdcdcd
    }
    .classTitle {
      position: absolute;
      left: 216rpx;
      font-size: 48rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      bottom: 24rpx;
    }
  }
  .type_center {
    padding: 22rpx;
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
  .noData {
    width: 440rpx;
    height: 234rpx;
    margin-bottom: 24rpx;
    padding-top: 119rpx;
  }
  .status-text {
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
  .status-box {
    width: 198rpx;
    height: 202rpx;
    padding-top: 17%;
    box-sizing: border-box;
  }
}
</style>

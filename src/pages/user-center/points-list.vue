//我的积分
<template>
  <view class="my-points">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar title="积分明细" title-color="#ffffff" />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar
      title="积分明细"
      title-color="#ffffff"
      :alpha="0"
      back-button-style="white"
      :shows-back-button="true"
    />
    <!-- #endif -->

    <view
      class="blank flex-v flex-c-c"
      :style="{ paddingTop: navigationBarHeight + 'px' }"
    >
      <view class="canuse">当前剩余可用积分</view>
      <view class="num">{{ score }}</view>
    </view>
    <view class="points-detail">
      <view class="tab-bar flex-h flex-c-s">
        <view
          class="tab animated"
          :class="{ 'tab--selected': selectedIndex === 2 }"
          @click="handleTabClick(2)"
        >
          全部
        </view>
        <view
          class="tab animated"
          :class="{ 'tab--selected': selectedIndex === 1 }"
          @click="handleTabClick(1)"
        >
          增加
        </view>
        <view
          class="tab animated"
          :class="{ 'tab--selected': selectedIndex === 0 }"
          @click="handleTabClick(0)"
        >
          减少
        </view>
        <view
          class="indicator bg-primary br-6 animated"
          :class="indicatorClass"
        />
      </view>
      <view class="list">
        <view class="point-list p-32" v-if="list.length > 0">
          <view
            class="point-item flex-h flex-c-b pl-24 pr-20 mb-32"
            v-for="(item, index) in list"
            :key="index"
          >
            <view class="point-item-left flex-v">
              <view class="mb-24">{{ item.taskDscr }}</view>
              <view class="time">{{ dateFilter(item.crteTime) }}</view>
            </view>
            <view class="point-item-right">
              <view v-if="item.chgType === '1'">+{{ item.chgScore }}</view>
              <view class="reduce" v-else>-{{ item.chgScore }}</view>
            </view>
          </view>
        </view>
        <view class="no-data flex-v flex-c-c" v-else>
          <image
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/support/icon-support-no-data.png"
            mode="scaleToFill"
          />
          <view class="text">暂无内容</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import NavigationBar from "../../components/common/navigation-bar.vue";
import api from "@/apis/index.js";
import dayjs from "dayjs";
import RealNamePop from "@/pages/real-name-pop/real-name-pop.vue";
export default {
  components: { NavigationBar, RealNamePop },
  data() {
    return {
      headImg: "",
      clickId: "",
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // // 当前可用积分进度条宽度
      // progressBarWidth: 234,
      // 选中的下标
      selectedIndex: 2,
      // 赚积分任务列表
      list: [],
      // 可用积分
      score: "0",
      // 最高积分
      fixScore: "0",
      // 页码
      pageNum: 1,
      // 页数
      pageSize: 10,
    };
  },
  computed: {
    indicatorClass() {
      return ["indicator--left", "indicator--mid", "indicator--right"][
        this.selectedIndex
      ];
    },
    progressBarWidth() {
      // 当前可用积分进度条宽度
      return Math.ceil((this.score / 1000) * 636);
    },
  },
  onLoad() {
    this.userInfo = uni.getStorageSync("userInfo");
    this.handleScoreInfo();
    this.handleScoreList();
    // this.setData();
  },
  onShow() {
    // this.handleScoreInfo()
    // this.getUserTaskInfoByPage()
  },
  methods: {
    /**
     * tab 点击事件
     */
    handleTabClick(index) {
      if (index === this.selectedIndex) return;
      this.selectedIndex = index;
      this.pageNum = 1;
      this.list = [];
      this.handleScoreList();
    },
    // 获取用户积分
    handleScoreInfo() {
      api.scoreInfo({
        data: {
          userId: this.userInfo.uactId,
        },
        success: (res) => {
          console.log("用户积分：", res);
          this.score = res.score;
          this.fixScore = res.fixScore;
        },
      });
    },

    // 获取积分数据
    handleScoreList() {
      api.getScoreList({
        showsLoading: true,
        data: {
          userId: this.userInfo.uactId,
          chgType: this.selectedIndex < 2 ? this.selectedIndex + "" : "", // 变更类型(0-减少 1新增)
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        success: (res) => {
          console.log("res.length", res);
          if (res.list.length > 0) {
            res.list.map((item, index) => {
              this.list.push(item);
            });
            this.pageNum = this.pageNum + 1;
          } else {
            if (this.pageNum > 1) {
              this.$uni.showToast("暂无更多数据");
            } else {
              this.$uni.showToast("暂无数据");
            }
          }
        },
      });
    },
    // 日期过滤器, 用于格式化日期
    dateFilter(time) {
      return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  onReachBottom() {
    this.handleScoreList();
  },
};
</script>

<style lang="scss" scoped>
.my-points {
  .blank {
    box-sizing: border-box;
    @include size(750, 436);
    // position: fixed;
    // top: 0;
    background: linear-gradient(to bottom, #ff8800, #ff5500);
    .canuse {
      font-size: 36rpx;
      color: #ffffff;
      line-height: 50rpx;
      text-align: center;
    }
    .num {
      font-size: 96rpx;
      font-weight: 500;
      color: #ffffff;
      line-height: 134rpx;
    }
  }

  .points-detail {
    background-color: #f5f5f5;
    position: relative;
    min-height: calc(100vh - 436rpx);
    .tab-bar {
      position: relative;
      width: 100vw;
      height: 108rpx;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tab {
        flex: 1;
        line-height: 108rpx;
        font-size: 40rpx;
        color: #969799;
        text-align: center;
        position: relative;
        &--selected {
          color: #323233;
          font-weight: bold;
          &::after {
            content: "";
            display: block;
            width: 80rpx;
            height: 8rpx;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            background: #ff5000;
            border-radius: 4rpx;
          }
        }
      }
    }
    .list {
      .point-list {
        box-sizing: border-box;
        .point-item {
          box-sizing: border-box;
          width: 100%;
          height: 194rpx;
          background: #ffffff;
          border-radius: 16rpx;
          &-left {
            font-size: 40rpx;
            color: #333333;
            line-height: 56rpx;
            .time {
              font-size: 36rpx;
              color: #999999;
              line-height: 50rpx;
            }
          }
          &-right {
            font-size: 48rpx;
            font-weight: 500;
            color: #ff711a;
            line-height: 66rpx;
            .reduce {
              color: #333333;
            }
          }
        }
      }
      .no-data {
        height: calc(100vh - 544rpx);
        .img {
          flex-shrink: 0;
          width: 440rpx;
          height: 234rpx;
          margin-bottom: 24rpx;
        }
        .text {
          font-size: 36rpx;
          color: #666666;
          line-height: 50rpx;
        }
      }
    }
  }
}
</style>

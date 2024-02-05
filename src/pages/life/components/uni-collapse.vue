<template>
  <view class="uni-collapse" id="col">
    <view class="header">
      <view class="header-title">{{ title }}</view>
      <view class="header-tab" @click="handleFold">
        <view>{{ fold ? "收起" : "展开全部科室" }}</view>
        <image
          class="icon"
          v-if="fold"
          src="https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/icon-arrow-top.png"
          mode="scaleToFill"
        />
        <image
          class="icon"
          v-else
          src="https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/icon-arrow-bottom.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="content">
      <view
        class="label-item"
        :class="{ active: index === i }"
        v-for="(item, i) in labelList"
        :key="item.i"
        @click="tabClick(i)"
      >
        <view class="label-item-text">{{ item.departmentName }}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "UniCollapse",
  props: {
    title: {
      type: String,
      default: "科室",
    },
    tabList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      index: 0,
      fold: false,
      labelList: [],
    };
  },
  created() {
    // this.labelList = this.tabList.slice(0, 6)
  },
  watch: {
    tabList: {
      handler: function (list) {
        this.labelList = this.tabList.slice(0, 6);
        this.getHeight();
      },
      deep: true,
    },
  },
  methods: {
    tabClick(i) {
      this.index = i;
      this.$emit("tab-click", i);
    },
    handleFold() {
      this.fold = !this.fold;
      if (this.fold) {
        this.labelList = this.tabList;
      } else {
        this.labelList = this.tabList.slice(0, 6);
      }
      this.getHeight();
    },
    getHeight() {
      this.$nextTick(() => {
        //#ifdef MP-ALIPAY
        const query = uni.createSelectorQuery();
        //#endif
        //#ifdef MP-WEIXIN
        const query = uni.createSelectorQuery().in(this);
        //#endif

        query
          .select("#col")
          .boundingClientRect((data) => {
            console.log("得到布局位置信息" + JSON.stringify(data));
            // this.$emit("resize", data.height)
          })
          .exec();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.uni-collapse {
  background: #ffffff;
  padding: 10rpx 32rpx;
  // position: fixed;
  // top: 0;
  // left: 0;
  // z-index: 10;
  // max-height: 90vh;
  overflow: scroll;
  transition: all 0.3s linear;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Medium, PingFang SC;
    .header-title {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
    }
    .header-tab {
      font-size: 32rpx;
      font-weight: 400;
      color: #ff5500;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        margin-left: 8rpx;
        width: 18rpx;
        height: 12rpx;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 22rpx;
    // max-height: 40vh;
    // overflow: auto;
    .label-item {
      width: 220rpx;
      height: 80rpx;
      background: #eeeeee;
      border-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 24rpx;
      margin-right: 12rpx;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &.active {
        color: #ff5500;
        background: rgba(255, 73, 0, 0.11);
      }
      .label-item-text {
        width: 200rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-overflow: ellipsis;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
</style>


<template>
  <div class="swiper-tab">
    <scroll-view class="nav-scroll" :enable-flex="true" scroll-with-animation :throttle="false"
      :scroll-left="scrollToLeft" scroll-x @scroll="handleScroll">
      <view class="nav uni-nav">
        <view class="nav-item" :class="tabIndex == index ? 'nav-item-act' : ''" :key="index"
          v-for="(item, index) in tabList" @click="handleClick(item, index)">
          {{ item.name }}
        </view>
      </view>
    </scroll-view>
  </div>
</template>
<script>

export default {
  name: 'swiper-tab',
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    tabClickIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tabIndex: 0,
      scrollToLeft: 0, // scrollview需要滚动的距离
      navInfos: [], // 所有navitem的节点信息
      parentLeft: 0, // nav盒子的节点信息
      componentWidth: 0 // nav盒子的宽度
    }
  },
  watch: {
    tabList: {
      handler() {
        this.getDomInfo()
      },
      immediate: true
    }
  },
  mounted() {
    console.log("===里面得到只--", this.tabClickIndex)
    this.tabIndex = this.tabClickIndex
  },
  methods: {
    handleScroll() {
      // this.scrollDom()
    },
    // 滚动tabs以及移动下划线
    scrollDom() {
      const info = this.navInfos[this.tabIndex]
      console.log('获取元素：', info)
      const offsetLeft = info.left - this.parentLeft
      const scrollLeft = offsetLeft - (this.componentWidth - info.width) / 2
      this.scrollToLeft = scrollLeft < 0 ? 0 : scrollLeft
    },
    // 获取Dom信息
    getDomInfo() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.uni-nav').fields({ rect: true, size: true }, (res) => {
        this.parentLeft = res.left
        this.componentWidth = res.width
      }).exec()
      query.selectAll('.nav-item').fields({ rect: true, size: true }, (data) => {
        this.navInfos = []
        data.forEach((item, index) => {
          if (index == 0) {
            this.navItemWidth = item.width
            this.navItemLeft = item.left
          }
          this.navInfos.push({ width: item.width, left: item.left })
        })
      }).exec()
    },
    // tab点击
    handleClick(item, index) {
      this.tabIndex = index
      this.scrollDom()
      this.$emit('onTap', item)
    },
    setIndex(index) {
      this.tabIndex = Number(index)
    }
  }
}
</script>
<style lang="scss">
.swiper-tab {
  .nav-scroll ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
    display: none;
  }
  .nav {
    white-space: nowrap;
    position: relative;
    height: 128rpx;
    padding: 24rpx 0rpx;
    .nav-item {
      display: inline-block;
      // margin: 0 16rpx;
      margin-right: 24rpx;
      min-width: 176rpx;
      padding: 18rpx 26rpx;
      background: #eeeeee;
      border-radius: 40rpx;
      text-align: center;
      transition: color 0.3s ease;
      font-size: 40rpx;
      color: #333333;
      &:first-child {
        margin-left: 24rpx;
      }
    }
    .nav-item-act {
      background: rgba(255, 73, 0, 0.11);
      color: #ff5500;
      font-weight: 500;
    }
  }
}
</style>

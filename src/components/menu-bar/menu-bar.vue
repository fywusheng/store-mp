<template>
  <!-- is_lhp判断是否为刘海屏在main.js里，好像uniapp有一个css变量获取刘海屏的安全区域 -->
  <view class="menuBar_list">
    <view class="menu-item" @click="jump(index)"
      :class="[item.voice ?'voice-item':'',selectedIndex === index ? 'active' : '']"
      v-for="(item,index) in list" :key="index">
      <view v-if="!item.voice">{{item.menu}}</view>
      <image v-if="item.voice" class="voice"
        src="https://ggllstatic.hpgjzlinfo.com/static/home/menu-voice.png" mode="scaleToFill" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'MenuBar',
  props: {
    // 被激活菜单的索引
    selectedIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 菜单数据
      list: [
        {
          menu: '首页',
          voice: false,
          path: '/pages/home/home'
        },
        {
          menu: '优惠',
          voice: false,
          path: '/pages/find'
        },
        {
          menu: '语音',
          voice: true,
          path: '/pages/voice/voice-search'
        },
        {
          menu: '发现',
          voice: false,
          path: '/pages/index/orderList'
        },
        {
          menu: '我的',
          voice: false,
          path: '/pages/index/mine'
        }
      ]
    }
  },
  onLoad() { },
  methods: {
    // 页面跳转
    jump(index) {
      if (this.list[index]['voice']) {
        uni.navigateTo({
          url: this.list[index]['path']
        })
      } else {
        this.$emit('changeIndex', index)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.menuBar_list {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 158rpx;
  z-index: 111;
  display: flex;
  justify-content: space-around;
  // align-items: center;
  background-color: #fff;
  box-shadow: 0px -1px 0px 0px #d9dee8;
  &.gray {
    .menu-item {
      .voice {
        filter: grayscale(100%);
      }
      &.active {
        color: #333333;
        &::after {
          background-color: #333333;
        }
      }
    }
  }

  .menu-item {
    height: 108rpx;
    flex-shrink: 0;
    color: #606266;
    font-size: 40rpx;
    line-height: 80rpx;
    font-weight: 400;
    position: relative;
    &.active {
      color: #ff5500;
      font-weight: 500;
      &::after {
        content: '';
        display: block;
        @include size(68, 6, 3);
        background-color: #ff5500;
        position: absolute;
        bottom: 28rpx;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .voice {
      @include size(168, 168);
      position: absolute;
      top: -60rpx;
      left: 0;
      right: 0;
    }
  }
  .voice-item {
    flex-shrink: 0;
    width: 168rpx;
  }
}
</style>

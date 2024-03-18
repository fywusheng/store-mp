<template>
  <view>
    <view class='bottomTips' v-if="bottomTips">
      <view class="loading" v-if="bottomTips=='loading'">
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
      </view>
      <view>{{bottomTips | judgeBottomTips}}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    bottomTips: {
      type: String,
      default: ''
    }

  },
  created() {

  },
  filters: {
    // 判断底部提示文字
    judgeBottomTips(type) {
      switch (type) {
        case 'nomore':
          return '暂无更多内容'
        // break
        case 'loading':
          return '正在努力加载中...'
        // break
        case 'more':
          return '上拉加载更多'
        // break
        default:
          return ''
        // break
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
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
.heightAnimation {
  transition: all 0.2s linear;
}

.bottomTips {
  width: 100%;
  height: 80rpx;
  font-size: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loadingRotate {
  display: inline-block;
  font-size: 40rpx;
  animation: loadingAnimation 1s linear infinite;
}
@keyframes loadingAnimation {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

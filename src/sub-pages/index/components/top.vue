<template>
  <div class="top-layout" v-show="showContainer" :style="{bottom: bottom + 'rpx'}">
    <button class="menu" v-show="showShop" open-type="contact" @click="goBuy">
      <img class="icon  icon-service"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/common/bug.png">
    </button>
    <div class="menu" v-show="showTop" @click="toTop">
      <img class="icon icon-top"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/common/top.png">
    </div>
    <button class="menu" v-show="showContact" open-type="contact">
      <img class="icon  icon-service"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/common/service.png">
    </button>
  </div>
</template>
<script>
export default {
  props: {
    bottom: {
      type: Number,
      default: 60
    },
    showContact: {
      type: Boolean,
      default: true
    },
    showTop: {
      type: Boolean,
      default: true
    },
    showShop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showContainer: false
    }
  },
  methods: {
    goBuy() {
      wx.navigateTo({
        url: '/sub-pages/index/index/main?index=4&sceneType=' + '积分兑换'
      })
    },
    show(flag) {
      this.showContainer = flag
    },
    toTop() {
      this.$emit('toTop')
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  async created() {

  }
}
</script>

<style lang="scss">
@import '@/styles/base';

.top-layout {
  position: fixed;
  right: rpx(30);
  bottom: rpx(80);
  z-index: 1000;
  .menu {
    position: relative;
    width: rpx(75);
    height: rpx(75);
    border-radius: 50%;
    margin-top: rpx(20);
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    &:after {
      border: none;
    }
    .icon {
      @include middle-center();
    }
    .icon-top {
      width: rpx(33);
      height: rpx(41);
    }
    .icon-service {
      width: rpx(49);
      height: rpx(49);
    }
  }
}
</style>

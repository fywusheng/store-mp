<template>
  <view class="bottom-tab">
    <view :class="item.center==true?'bottom-tab-item-center':'bottom-tab-item-sider' "
      @click="changeTap(item)" v-for="(item,index) in tabList" :key="index">
      <image v-if="tabIndex==item.id" class="first-img" :src="item.imgOn"></image>
      <image v-if="tabIndex!=item.id" class="first-img" :src="item.imgOff"></image>
      <text :class="tabIndex==item.id?'text-position text-on':'text-position'">{{item.name}}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'wyg-bottom-tab-withcenter',
  props: {
    tabIndex: {
      // 图片的尺寸
      type: String,
      default: '1'
    },
    tabListParent: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // curTab:1,
      tabList: []
    }
  },
  created() {
    // this.curTab=new Number(this.tabIndex);
    if (this.tabListParent.length > 0) {
      this.tabList = this.tabListParent
    }
  },
  methods: {
    $redirect(_url) {
      uni.redirectTo({
        'url': _url
      })
    },
    changeTap(e) {
      this.curTab = e.id
      this.$emit('onClick', e)
      uni.pageScrollTo({ scrollTop: 0 })
      // this.$redirect(e.url)
    }

  }
}

</script>

<style lang="scss">
.bottom-tab {
  position: fixed;
  background-color: #fdfdfd;
  bottom: 0%;
  left: 0%;
  width: 100%;
  height: 226rpx;
  font-size: 36rpx;
  padding-bottom: 92rpx;
  box-shadow: inset 0rpx 1rpx 0px 0px #d9dee8;

  display: flex;
  align-items: center;
  justify-content: space-around;
  .bottom-tab-item-center {
    width: 24%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .first-img {
      width: 56rpx;
      height: 56rpx;
      margin-top: -0.8rem;

      border-radius: 50%;
      border: 0.01rem solid #c0c4cc;
    }
    .text-position {
      margin-top: 0rem;
      font-size: 0.6rem;
      color: #757575;
    }
    .text-on {
      color: #ffb400;
    }
  }
  .bottom-tab-item-sider {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .first-img {
      width: 56rpx;
      height: 56rpx;
    }
    .text-position {
      margin-top: 0rem;
      color: #757575;
    }
    .text-on {
      color: #ff5500;
    }
  }
}
</style>

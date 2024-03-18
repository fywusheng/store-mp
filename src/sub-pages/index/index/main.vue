<template>
  <view class="page-item">
    <pop-index v-if="index === 1" ref="oldHome"></pop-index>
    <category v-if="index === 2"></category>
    <pop-cart v-if="index === 4"></pop-cart>
    <!-- <pop-me v-if="index === 4"></pop-me> -->
    <pop-order v-if="index === 5" ref="order"></pop-order>

    <bottom-tab :tabIndex="index" :tabListParent="tabList" @onClick="handleTabClick"></bottom-tab>
  </view>
</template>

<script>
import PopIndex from './components/index/index.vue'
import Category from './components/category/main.vue'
import PopCart from './components/cart/main.vue'
// import PopMe from './components/me/main.vue'
import PopOrder from './components/order/main.vue'
import BottomTab from './components/bottom-tab/wyg-bottom-tab-withcenter.vue'
export default {
  data() {
    return {
      index: 0,
      tabList: [
        {
          id: 1,
          name: '首页',
          imgOff: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/home.png',
          imgOn: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/home-active.png',
          'url': '/sub-pages/index/index/main'
        },
        {
          id: 2,
          name: '分类',
          imgOff: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/category.png',
          imgOn: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/category-active.png',
          'url': '/sub-pages/index/cate'
        },
        {
          id: 3,
          name: '语音',
          imgOff: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/voice.png',
          imgOn: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/voice.png',
          'url': '/pages/index/cart'
        },
        {
          id: 4,
          name: '购物车',
          imgOff: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/cart.png',
          imgOn: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/cart-active.png',
          'url': '/pages/index/cart'
        },
        {
          id: 5,
          name: '订单',
          imgOff: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/order.png',
          imgOn: 'https://ggllstatic.hpgjzlinfo.com/static/images/footer/order-active.png',
          'url': '/pages/index/user'
        }
      ]

    }
  },
  components: {
    PopIndex,
    Category,
    PopCart,
    // PopMe,
    PopOrder,
    BottomTab
  },
  onLoad(e) {
    const index = e.index || 1
    this.index = Number(index)
    uni.setNavigationBarTitle({ title: this.tabList[this.index - 1].name })
  },
  onShow() {
    const tempIndex = Number(this.index)
    this.index = 0
    setTimeout(() => {
      this.index = tempIndex
    }, 300)
    // this.$refs.oldHome.setCity()
    // console.log("---外层show--")
  },
  // 上拉加载
  onReachBottom() {
    if (this.index === 1) {
      this.$refs.oldHome.getProdList()
    } else if (this.index === 5) {
      this.$refs.order.loadData()
    }
  },
  methods: {
    handleTabClick(e) {
      if (e.id === 3) {
        uni.navigateTo({ url: '/pages/voice/voice-search' })
      } else {
        this.index = e.id
        uni.setNavigationBarTitle({ title: e.name })
      }
    }

  }

}
</script>

<style lang="scss">
.page-item {
  padding-bottom: rpx(150);
  background: #fff;
}
</style>

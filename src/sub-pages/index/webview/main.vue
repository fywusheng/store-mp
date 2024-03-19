<template>
  <div class="page-webview">
    <web-view class="webview" :src="link"></web-view>
    <top ref="toTop"></top>
  </div>
</template>

<script>
import Top from '@/sub-pages/index/components/top.vue'

export default {
  data() {
    return {
      link: ''
    }
  },
  components: {
    Top
  },
  methods: {

  },
  onPageScroll(e) {
    this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight)
  },
  async mounted() {
    this.link = decodeURIComponent(this.$root.$mp.query.link)
    wx.setNavigationBarTitle({
      title: this.$root.$mp.query.title || ''
    })
  }
}
</script>

<style lang="scss">
</style>

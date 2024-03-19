<template>
  <div class="page-topic">
    <layout ref="layout" v-if="id" :page-id="id" @change="change" @changeView="changeView"></layout>
    <top ref="toTop" :bottom="80" @toTop="toTop" :showContact="false"></top>
  </div>
</template>

<script>
import Layout from '@/sub-pages/index/components/layout'
import Top from '@/sub-pages/index/components/top.vue'

export default {
  data() {
    return {
      id: null,
      title: '',
      viewIndex: '',
      scrollTop: 0
    }
  },
  components: {
    Layout,
    Top
  },
  onShareAppMessage() {
    return {}
  },
  methods: {
    scroll(e) {
      this.$refs.toTop.show(e.mp.detail.scrollTop > App.systemInfo.screenHeight)
    },
    change(data) {
      console.info(data)
      this.title = data.page_title || data.page_name
      wx.setNavigationBarTitle({
        title: data.page_title || data.page_name
      })
    }
  },
  onPageScroll(e) {
    uni.$emit('pageScroll')
  },
  onUnload() {
    this.id = ''
    this.$refs.layout.reset()
  },
  onShow() {
    if (!Store.getters.isLogin) {
      Store.dispatch('login')
    }
    wx.showLoading()
    if (this.$root.$mp.query.id !== this.id) {
      this.id = this.$root.$mp.query.id
    } else {
      if (this.title) {
        wx.setNavigationBarTitle({
          title: this.title
        })
      }
    }
    wx.hideLoading()
  }
}
</script>

<style lang="scss">
@import '~@/styles/base';

.page-topic {
  height: 100vh;
}
</style>

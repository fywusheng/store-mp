<template>
  <web-view :webview-styles="webviewStyles" :src="url" />
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 要加载的 webview URL
      url: '',
      // webview 样式
      webviewStyles: {
        // 加载进度条样式
        progress: {
          color: '#4077F4'
        }
      }
    }
  },
  onLoad(e) {
    // #ifdef MP-ALIPAY
    this.url = e.url
    // #endif
    // #ifdef MP-WEIXIN
    this.url = decodeURIComponent(e.url)
    // #endif
  }
}
</script>

<style lang="scss" scoped></style>

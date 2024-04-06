<template>
  <view class="show-pay-code">
    <web-view :src="url" class="web"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  onLoad(e) {
    // this.url = 'http://localhost:9081/#/checkstand'
    this.url = decodeURIComponent(e.url) 
  },
  onShow(){
    
  },
   onShareAppMessage() {
    return {
      title:'',
      path:
        "/pages/index/index?index=0",
    };
  },
  methods: {
      // 返回上一页
    handleNavBack() {
      uni.navigateBack();
    },
      // 返回首页
    handleHomeBack() {
      uni.reLaunch({
         url: '/pages/index/index'
      });
    },
  },
}
</script>

<style  lang="scss" scoped>
.web{
  margin-top: 100px;
}
</style>
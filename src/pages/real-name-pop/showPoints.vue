<template>
  <view class="credits-popup flex-v flex-c-c" v-if="showsCreditsPopup" @touchmove.stop="touchmove">
    <image class="credits-image" mode="scaleToFill" @click="detailPoint" :src="imgUrl" />
    <image class="close-icon mt-32" mode="scaleToFill"
      src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-popup-close.png"
      @click="showsCreditsPopup = false" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      showsCreditsPopup: false
    }
  },
  props: {
    imgUrl: {
      type: String,
      default: 'https://ggllstatic.hpgjzlinfo.com/static/real-name/real-name-success.png'
    }
  },
  methods: {
    detailPoint() {
      uni.navigateTo({ url: '/pages/user-center/my-points' })
    }
  },
  watch: {
    showsCreditsPopup(n, o) {
      if (n) {
        setTimeout(() => {
          this.showsCreditsPopup = false
          this.$emit('success_flag', 1)
        }, 2000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.credits-popup {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  .credits-image {
    @include size(604, 808);
  }
  .close-icon {
    @include square(72);
  }
}
</style>

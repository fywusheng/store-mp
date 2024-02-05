<template>
  <view class="insurance">
    <image
      class="icon"
      src="https://ggllstatic.hpgjzlinfo.com/static/life/icon-premium.png"
      mode="widthFix"
    />
    <image
      class="icon bottom"
      src="https://ggllstatic.hpgjzlinfo.com/static/life/icon-premium-bottom.png"
      mode="widthFix"
    />
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.insurance {
  .icon {
    width: 100%;
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
  }
}
</style>

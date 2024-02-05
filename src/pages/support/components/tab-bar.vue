<template>
  <view class="tab-bar flex-h flex-c-b bg-white">
    <button
      v-for="(item, index) in tabs"
      :key="index"
      class="tab flex-1 fs-40 animated"
      hover-class="none"
      :class="selectedIndex === index ? 'c-primary' : 'c-black'"
      @click="handleTabClick(index)"
    >
      {{ item }}
    </button>
    <view class="indicator animated" :style="indicatorStyle"></view>
  </view>
</template>

<script>
export default {
  props: {
    // 所有 tab 信息
    tabs: Array,
    // 初始下标
    initialIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    // 底部指示器样式
    indicatorStyle() {
      const current = this.selectedIndex;
      const total = this.tabs.length;
      const left = ((current * 2 + 1) / (total * 2)) * 750 - 32;
      return `left: ${left}rpx;`;
    },
  },
  data() {
    return {
      // 当前选中的下标
      selectedIndex: 0,
    };
  },
  onReady() {
    this.selectedIndex = this.initialIndex;
    this.$emit("change", this.selectedIndex);
  },
  methods: {
    /**
     * tab 点击事件
     */
    handleTabClick(index) {
      if (this.selectedIndex === index) return;
      this.selectedIndex = index;
      this.$emit("change", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-bar {
  position: relative;
  height: 120rpx;
  .tab {
    line-height: 120rpx;
  }
  .indicator {
    @include size(64, 8, 4);
    position: absolute;
    bottom: 0;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>

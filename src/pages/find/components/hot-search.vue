<template>
  <swiper
    class="swiper flex-1"
    :autoplay="true"
    :circular="true"
    :interval="4000"
    :vertical="true"
  >
    <swiper-item
      class="swiper-item flex-h flex-c-s"
      v-for="(item, index) in list"
      :key="index"
      @touchmove.stop="stopTouchMove"
    >
      <view
        @click="handleBulletinClick(index)"
        class="swiper-item__text fs-36 c-black text-hide"
        >{{ item.ttl }}</view
      >
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  props: {
    list: {
      default: [],
      type: Array,
    },
  },

  data() {
    return {};
  },
  methods: {
    // 获取数据
    handleBulletinClick(index) {
      this.$emit("keyWord", this.list[index].ttl);
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper {
  height: 88rpx;
  .text-hide {
    line-height: 88rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<template>
  <view class="action-sheet">
    <uni-popup ref="popup" type="bottom" :mask-click="showsCancel">
      <view class="popup bg-white">
        <text class="title h-114 fs-48 fw-600 c-black" v-if="title">
          {{ title }}
        </text>
        <button
          class="row h-114 fs-40 fw-400 c-black"
          v-for="(item, index) in items"
          :key="index"
          @click="handleItemClick(index)"
        >
          {{ item }}
        </button>
        <button
          class="row h-114 fs-40 fw-400 c-black cancel"
          v-if="showsCancel"
          @click="handleCancelClick"
        >
          取消
        </button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import UniPopup from "../uni-popup/uni-popup.vue";
export default {
  components: { UniPopup },
  props: {
    title: {
      type: String,
      default: "",
    },
    showsCancel: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    /**
     * 选项点击事件
     */
    handleItemClick(index) {
      this.$refs.popup.close();
      this.$emit("click", index);
    },
    /**
     * 取消点击事件
     */
    handleCancelClick() {
      this.$refs.popup.close();
    },
    /**
     * 给外部调用的方法
     */
    open() {
      this.$refs.popup.open();
    },
  },
};
</script>

<style lang="scss" scoped>
.action-sheet {
  .popup {
    border-radius: 16rpx 16rpx 0 0;
    .h-114 {
      height: 114rpx;
      line-height: 114rpx;
    }
    .title {
      display: block;
      text-align: center;
    }
    .row {
      border-top: 2rpx solid #ebedf0;
    }
    .cancel {
      border-top: 16rpx solid #f5f5f5;
    }
  }
}
</style>

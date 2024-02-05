<template>
  <div class="c-number-wrap">
    <div class="btn-operation">
      <img
        class="img"
        mode="widthFix"
        @click="reduce"
        v-if="number === min"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/number/reduce_h.png"
      />
      <img
        @click="reduce"
        class="img"
        mode="widthFix"
        v-else
        src="https://ggllstatic.hpgjzlinfo.com/static/images/number/reduce_n.png"
      />
    </div>
    <div class="number">{{ number }}</div>
    <div class="btn-operation">
      <img
        @click="add"
        mode="widthFix"
        class="img"
        v-if="number === max"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/number/add_h.png"
      />
      <img
        class="img"
        @click="add"
        mode="widthFix"
        v-else
        src="https://ggllstatic.hpgjzlinfo.com/static/images/number/add_n.png"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      default: 1,
    },
    current: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      number: 1,
    };
  },
  watch: {
    current() {
      this.number = this.current;
    },
  },
  methods: {
    reduce() {
      if (this.number === this.min) {
        this.$uni.showToast("最少购买" + this.min + "件");
        return false;
      }
      this.number--;
      this.$emit("change", this.number);
    },
    add() {
      if (this.number === this.max) {
        this.$uni.showToast("最多可购" + this.max + "件");
        return false;
      }
      this.number++;
      this.$emit("change", this.number);
    },
  },
  async mounted() {},
};
</script>

<style lang="scss" scoped>
// @import "../../../../../styles/base";

.c-number-wrap {
  display: flex;
  align-items: center;
  border: rpx(1) solid #e5e5e5;
  border-radius: rpx(5);
  width: rpx(260);
  .btn-operation,
  .number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rpx(80);
    height: rpx(60);
    .img {
      width: rpx(30);
    }
  }
  .btn-operation {
    &:first-child {
      border-right: rpx(1) solid #e5e5e5;
    }
    &:last-child {
      border-left: rpx(1) solid #e5e5e5;
    }
  }
  .number {
    font-size: rpx(28);
    width: rpx(100);
  }
}
</style>

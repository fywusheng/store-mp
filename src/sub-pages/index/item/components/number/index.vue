<template>
  <div class="c-number-wrap">
    <div class="btn-operation">
      <img @click="reduce" mode="widthFix" v-if="number === min"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/minus.png">
      <img @click="reduce" mode="widthFix" v-else
        src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/minus.png">
      <!-- <img @click="reduce" mode="widthFix" v-if="number === min"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/number/reduce_n.png">
      <img @click="reduce" mode="widthFix" v-else
        src="https://ggllstatic.hpgjzlinfo.com/static/images/number/reduce_h.png"> -->
    </div>
    <div class="number">{{number}}</div>
    <div class="btn-operation">
      <img @click="add" mode="widthFix" v-if="number === max"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/add.png">
      <img @click="add" mode="widthFix" v-else
        src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/add.png">
      <!-- <img @click="add" mode="widthFix" v-if="number === max"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/number/add_n.png">
      <img @click="add" mode="widthFix" v-else
        src="https://ggllstatic.hpgjzlinfo.com/static/images/number/add_h.png"> -->
    </div>
  </div>
</template>

<script>
import wx from 'utils/wx'
export default {
  props: {
    min: {
      type: Number,
      default: 1
    },
    current: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      number: 1
    }
  },
  watch: {
    current() {
      this.number = this.current
    }
  },
  methods: {
    reduce() {
      if (this.number === this.min) {
        wx.showToast('最少购买' + this.min + '件')
        return false
      }
      this.number--
      this.$emit('change', this.number)
    },
    add() {
      if (this.number === this.max) {
        wx.showToast('最多可购' + this.max + '件')
        return false
      }
      this.number++
      this.$emit('change', this.number)
    }
  },
  async mounted() {

  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/base';

.c-number-wrap {
  display: flex;
  align-items: center;
  border: rpx(2) solid #cdcdcd;
  border-radius: rpx(5);
  width: rpx(260);
  .btn-operation,
  .number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rpx(80);
    height: rpx(60);
    img {
      width: rpx(30);
    }
  }
  .btn-operation {
    &:first-child {
      border-right: rpx(2) solid #cdcdcd;
    }
    &:last-child {
      border-left: rpx(2) solid #cdcdcd;
    }
  }
  .number {
    font-size: rpx(28);
    width: rpx(100);
  }
}
</style>

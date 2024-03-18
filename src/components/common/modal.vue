<template>
  <view>
    <uni-popup ref="popup" type="center">
      <view class="modal-container showValue" @touchmove.stop @click.stop='cancel(2)'>
        <view class="modal-content">
          <slot name='title'>
            <view class="modal-title" :class="{'modal-title-padding': !text}" v-if='title'>
              {{title}}
            </view>
          </slot>
          <slot name='text'>
            <view class="modal-article">
              <!-- text 文本信息 -->
            </view>
          </slot>

        </view>
        <view class="modal-row">
          <view class="modal-col" :style="cancelStyle" hover-class="modal-hover"
            v-if="cancelText !== ' '" @click.stop='cancel(1)'>
            {{cancelText}}
          </view>
          <view class="modal-col modal-confirm" :style="confirmStyle" hover-class="modal-hover"
            @click.stop='confirm'>
            {{confirmText}}
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
export default {
  components: { uniPopup },
  props: {
    title: {
      type: String,
      default: '提示'
    },
    text: {
      type: String,
      default: ''
    },
    modImg: {
      type: String,
      default: '0' // ''0':领证；'1':赡养抚养'2':亲情 ；'4'：不展示图片
    },
    cancelText: {
      type: String,
      default: '放弃添加'
    },
    confirmText: {
      type: String,
      default: '立刻添加'
    },
    confirmStyle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    confirm() {
      // const msg = { from: 'confirm', confirm: true }
      this.$emit('confirm')
      // this.$emit('event', msg)
    },
    cancel(type) {
      // this.$refs.popup.close()
      this.$emit('cancel')
      // this.$emit('event', msg)
    },
    // 关闭弹框
    close() {
      this.$refs.popup.close()
    },
    // 打开弹框
    open() {
      this.$refs.popup.open()
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-container {
  width: 620rpx;
  min-height: 368rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0;
  font-size: 0;
  position: relative;
  .modal-content {
    width: 100%;
    // min-height: 360rpx;
    border-radius: 16rpx;
    background: #fff;
    padding-top: 64rpx;
    padding-bottom: 122rpx;
    // overflow: hidden;
    position: relative;
    box-sizing: border-box;
  }
  .modal-title {
    position: relative;
    font-weight: bold;
    font-size: 44rpx;
    text-align: center;
    color: #333;
    transform: translateY(-30rpx);
  }
  .modal-row {
    display: flex;
    text-align: center;
    font-size: 44rpx;
    line-height: 100rpx;
    font-weight: 500;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: #404040;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      border-top: 1px solid #e5e5e5;
      transform: scaleY(0.36);
    }
    .modal-col {
      flex: 1;
      width: 100%;
      position: relative;
    }
    .modal-col:first-child::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      border-right: 1px solid #e5e5e5;
      transform: scaleX(0.36);
    }
    .modal-confirm {
      color: #ff5500;
      font-weight: bold;
    }
    .modal-hover {
      background: #f2f2f2;
    }
  }
}
</style>

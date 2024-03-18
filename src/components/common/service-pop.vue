//首页弹框提示
<template>
  <view>
    <uni-popup ref="popup" type="center">
      <view class="modal-container showValue" @touchmove.stop @click.stop='cancel(2)'>
        <view class="modal-content">
          <image v-if="modImg === '0'" class="modal-img modal-img1"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/modal-card2x.png"
            mode="scaleToFill" />
          <image v-if="modImg === '2'" class="modal-img modal-img2"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/modal-support2x.png"
            mode="scaleToFill" />
          <image v-if="modImg === '1'" class="modal-img modal-img3"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/modal-family2x.png"
            mode="scaleToFill" />
          <view class="modal-main modImg">
            <view class="main" v-if="modImg === '0'">
              <text>您尚未申领电子老年人证，</text>
              <text class="warn">这将会影响您在本平台享有的权益和服务，现在申领还可领500积分！</text>
            </view>
            <view class="main" v-if="modImg == '2'">
              <text>您尚未添加赡养抚养人，</text>
              <text class="warn">这将会影响您在本平台享有的权益和服务，现在添加还可领100积分！</text>
            </view>
            <view class="main" v-if="modImg == '1'">
              <text>您尚未绑定亲情账号，</text>
              <text class="warn">这将会影响您在本平台享有的权益和服务，现在绑定还可领300积分！</text>
            </view>

          </view>
          <view class="modal-row">
            <view class="modal-col" :style="cancelStyle" hover-class="modal-hover" v-if="!noCancel"
              @click='cancel(1)'>
              {{cancelText}}
            </view>
            <view class="modal-col modal-confirm" :style="confirmStyle" hover-class="modal-hover"
              @click='confirm'>
              {{confirmText}}
            </view>
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
    modImg: {
      type: String,
      default: '0' // ''0':领证；'2':赡养抚养'1':亲情 ；'4'：不展示图片
    },
    cancelText: {
      type: String,
      default: '放弃添加'
    },
    confirmText: {
      type: String,
      default: '立刻添加'
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    confirm() {
      // this.showValue = false
      const msg = { from: 'confirm', confirm: true }
      this.$emit('confirm', msg)
      // this.$emit('event', msg)
    },
    cancel(type) {
      this.$refs.popup.close()
      // if (this.prevent && type === 2) {
      //   return
      // }
      // this.showValue = false
      // let msg = { from: type === 1 ? 'cancel' : 'mask' }
      // type === 1 ? (msg.cancel = true) : (msg.mask = true)
      // this.$emit('cancel', msg)
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
  height: 524rpx;
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
    padding-top: 154rpx;
    height: 524rpx;
    // overflow: hidden;
    position: relative;
    box-sizing: border-box;
    .modal-img {
      width: 312rpx;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      &.modal-img1 {
        top: -114rpx;
        height: 234rpx;
      }
      &.modal-img2 {
        top: -118rpx;
        height: 238rpx;
      }
      &.modal-img3 {
        top: -114rpx;
        height: 234rpx;
      }
    }
    .modal-main {
      height: 270rpx;
      .main {
        text-align: justify;
        // width: 552rpx;
        font-size: 40rpx;
        margin: 0 34rpx;
        color: #333333;
        line-height: 50rpx;
        .warn {
          color: #ff5500;
        }
      }
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
}
</style>

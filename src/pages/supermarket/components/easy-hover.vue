<template>
  <view class="hover-wrapper"
        :style="{'width':width+'rpx','height':height+'rpx','border-radius':circle?'50%':'0','top':top+'px','left':left+'px'}"
        @touchmove.prevent="touchmove"
        @touchend="touchend"
        @tap="doTap"
        @touchstart.prevent="touchstart">
    <image :src="iconUrl"
           mode="aspectFill"
           class="icon"
           :style="{'width':width+'rpx','height':height+'rpx','border-radius':circle?'50%':'0'}"></image>
  </view>
</template>

<script>
export default {
  name: 'easy-hover',
  props: {
    /**
     * 初始化方向
     */
    initSide: {
      type: String,
      default: 'right',
    },
    /**
     * 初始化距离上部距离rpx
     */
    initMarginTop: {
      type: Number,
      default: 100,
    },
    /**
     * 图标地址
     */
    iconUrl: {
      type: String,
      default: '',
    },
    /**
     * 宽度
     */
    width: {
      type: Number,
      default: 216,
    },
    /**
     * 高度
     */
    height: {
      type: Number,
      default: 216,
    },
    /**
     * 是否是圆形
     */
    circle: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否贴边
     */
    stickSide: {
      type: Boolean,
      default: true,
    },
    // 是否能拖动
    enableDrag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      screenWidthMax: 0,
      screenHeightMax: 0,
      widthMiddle: 0,
      xOffset: 0,
      yOffset: 0,
      menuHeight: 0,
      isMove: false,
      top: 0,
      left: 0,
      animation: {},
      animationData: {},
      initTouchX: 0,
      initTouchY: 0,
      // 导航栏高度
      //#ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      //#endif
      //#ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      //#endif
    }
  },
  methods: {
    /**
     * 初始化参数封装，主要处理界面参数
     */
    initParams() {
      let phoneParam = uni.getSystemInfoSync()
      this.screenWidthMax = phoneParam.windowWidth
      this.screenHeightMax = phoneParam.windowHeight
      console.log('===phoneParam==:', phoneParam)
      // this.screenHeightMax = phoneParam.screenHeight
      this.widthMiddle = phoneParam.windowWidth / 2
      this.menuHeight = phoneParam.windowHeight - phoneParam.windowHeight
      //计算偏移量
      this.xOffset = (this.width * phoneParam.windowWidth) / 750
      this.yOffset = (this.height * phoneParam.windowWidth) / 750
      //计算top和left
      console.log('this.menuHeight:', this.menuHeight)
      console.log('phoneParam.windowHeight :', phoneParam.windowHeight)
      this.top = this.menuHeight + (phoneParam.windowHeight - 288)
      // this.bottom = this.menuHeight + (this.initMarginTop * phoneParam.screenWidth / 750)
      this.left =
        this.initSide === 'left'
          ? this.xOffset
          : this.initSide === 'right'
          ? this.screenWidthMax - this.xOffset
          : 0
      // this.left = this.initSide === 'left' ? (this.xOffset / 2) : this.initSide === 'right' ? (this.screenWidthMax - this
      // 	.xOffset / 2) : 0
    },

    /**
     * 长按拖动
     */
    touchstart(e) {
      if(this.enableDrag) return
      let touch = e.touches[0] || e.changedTouches[0]
      this.initTouchX = touch.clientX
      this.initTouchY = touch.clientY
    },
    /**
     * 长按拖动
     */
    touchmove(e) {
      if(this.enableDrag) return
      this.isMove = true
      let touch = e.touches[0] || e.changedTouches[0]
      // 计算移动的水平距离
      let distanceX = touch.clientX - this.initTouchX
      // 计算将会到达水平的位置
      let newOffsetX = this.left + distanceX
      // 计算移动的垂直距离
      let distanceY = touch.clientY - this.initTouchY
      // 计算将会到达垂直的位置
      let newOffsetY = this.top + distanceY

      if (0 <= newOffsetX && newOffsetX <= this.screenWidthMax - this.xOffset) {
        this.left = newOffsetX
      } else if (newOffsetX < 0) {
        this.left = 0
      } else if (newOffsetX > this.screenWidthMax - this.xOffset) {
        this.left = this.screenWidthMax - this.xOffset
      }
      this.initTouchX = touch.clientX

      if (
        this.navigationBarHeight <= newOffsetY &&
        newOffsetY <= this.screenHeightMax - this.yOffset
      ) {
        this.top = newOffsetY
      } else if (newOffsetY < this.navigationBarHeight) {
        this.top = this.navigationBarHeight
      } else if (newOffsetY > this.screenHeightMax - this.yOffset) {
        this.top = this.screenHeightMax - this.yOffset
      }
      this.initTouchY = touch.clientY
    },
    /**
     * 长按结束
     * 计算贴什么边,如果开启贴边则计算，否则不计算
     * 计算时注意下边和右边要减去一半的偏移量
     * 贴边计算时因为质心为中心，需要加上偏移量
     */
    touchend(e) {
      //超过边界放置于边界，不属于贴边，属于通用
      // let touch = e.touches[0] || e.changedTouches[0];
      //开启贴边，贴边原则，只要一遍碰到边就，只要过中线也贴
      if(this.enableDrag) return
      if (this.stickSide) {
        //x方向小于贴边
        if (this.left < (this.screenWidthMax - this.xOffset) / 2) {
          this.left = 0
        } else {
          this.left = this.screenWidthMax - this.xOffset
        }
      } else {
      }
    },
    /**
     * 显示动画
     */
    doAnimation(param, derection) {},
    /**
     * 被点击
     */
    doTap() {
      console.log('执行点击')
      this.$emit('taped')
    },
  },
  created() {
    this.initParams()
  },
}
</script>

<style lang="scss" scoped>
.hover-wrapper {
  z-index: 1000;
  position: fixed;
  overflow: hidden;
  display: flex;
  // transform: translate(-50%, 0);
  justify-content: center;
  align-items: center;
}
</style>
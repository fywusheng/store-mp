<template>
  <view :style="styles">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view
      class="navigation-bar"
      :style="{ height: titleBarHeight + 'px', 'line-height': titleBarHeight + 'px' }"
    >
      <view v-if="showsBackButton" class="back-button" @click="handleBackClick">
        <image class="back-button__image" mode="scaleToFill" :src="backButtonIconURL" />
      </view>
      <slot name="title1">
        <!-- <view class="container">
          <text class="title" :style="{ color: titleColor }">{{ title }}</text>
        </view> -->
      </slot>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      // 导航栏透明度, 取值范围为 0 ~ 1, 默认为 0
      alpha: {
        type: Number,
        default: 0,
        validator: (value) => value >= 0 && value <= 1,
      },
      // 背景色, 默认为 #ffffff
      backgroundColor: {
        type: String,
        default: '#ffffff',
        validator: (value) => {
          const isColor = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(value);
          const isGradient = value.indexOf('linear-gradient') !== -1;
          return isColor || isGradient;
        },
      },
      // 导航栏标题, 默认为空
      title: {
        type: String,
        default: '',
      },
      // 标题颜色, 默认为黑色
      titleColor: {
        type: String,
        default: '#000000',
        validator: (value) => /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(value),
      },
      // 是否显示返回 button, 默认为 false
      showsBackButton: {
        type: Boolean,
        default: false,
      },
      // 返回 button 样式, 可选值为 black 或 white, 默认为 black
      backButtonStyle: {
        type: String,
        default: 'black',
        validator: (value) => value === 'black' || value === 'white',
      },
    },
    data() {
      return {
        // 状态栏高度
        statusBarHeight: uni.getSystemInfoSync().statusBarHeight,

        // #ifdef MP-WEIXIN
        titleBarHeight: 44,
        // #endif
        // #ifdef MP-ALIPAY
        titleBarHeight: uni.getSystemInfoSync().titleBarHeight,
        // #endif
      };
    },
    computed: {
      // 动态计算导航栏样式
      styles() {
        return `
        position: fixed;
        background: ${this.background};
        width: 100%;
        top:0;
        left:0;
        z-index: 999;
      `;
      },
      // 计算后的背景色
      background() {
        if (this.backgroundColor.indexOf('linear-gradient') !== -1) {
          return this.backgroundColor;
        } else if (this.backgroundColor.length === 4) {
          const redValue = this.backgroundColor.slice(1, 2);
          const red = parseInt(`0x${redValue}${redValue}`);
          const greenValue = this.backgroundColor.slice(2, 3);
          const green = parseInt(`0x${greenValue}${greenValue}`);
          const blueValue = this.backgroundColor.slice(3, 4);
          const blue = parseInt(`0x${blueValue}${blueValue}`);
          return `rgba(${red}, ${green}, ${blue}, ${this.alpha})`;
        } else {
          const red = parseInt(`0x${this.backgroundColor.slice(1, 3)}`);
          const green = parseInt(`0x${this.backgroundColor.slice(3, 5)}`);
          const blue = parseInt(`0x${this.backgroundColor.slice(5, 7)}`);
          return `rgba(${red}, ${green}, ${blue}, ${this.alpha})`;
        }
      },
      // 返回 button 图标路径
      backButtonIconURL() {
        return this.backButtonStyle === 'white'
          ? 'http://192.168.1.187:10088/static/common/icon-common-back-white.png'
          : 'http://192.168.1.187:10088/static/common/icon-common-back-black.png';
      },
    },
    methods: {
      /**
       * 返回 button 点击事件
       */
      handleBackClick() {
        // 如果父组件定义了 handleNavigationBack 方法, 则调用该方法, 否则返回上一级页面, 主要用于拦截返回事件
        if (this.$parent.handleNavigationBack) {
          this.$parent.handleNavigationBack();
        } else {
          uni.navigateBack();
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .navigation-bar {
    position: relative;
    // height: 44px;
    line-height: 44px;
    .back-button {
      position: absolute;
      left: 4px;
      width: 44px;
      height: 44px;
      z-index: 9;
      &__image {
        margin: 13px auto 13px 11px;
        width: 10px;
        height: 18px;
      }
    }
    .container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      .title {
        margin-top: -8rpx;
        font-size: 44rpx;
      }
    }
    .title1 {
      height: 44px;
    }
  }
</style>

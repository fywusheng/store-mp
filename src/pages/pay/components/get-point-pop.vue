<template>
  <!-- 积分领取 -->
  <div class="get-point">
    <uni-popup ref="popup" background="none">
      <view class="pop-content">
        <view class="content" @click="getPoint">
          <!-- <view class="title">{{content.popUpTitle}}</view>
          <view class="cont" v-for="(item, index) in popCont" :key="index">{{item}}</view> -->
          <image class="get-point-bg" :src="content.popUpImg" mode="scaleToFill" />
        </view>

        <image class="icon-close" @click="close" :src="icon.close" mode="scaleToFill" />
      </view>
    </uni-popup>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        icon: {
          bg: 'http://192.168.1.187:10088/static/images/common/icon-get-point.png',
          close: 'http://192.168.1.187:10088/static/common/icon-close.png',
        },
        content: {
          popUpTitle: '领积分,抵现金',
          popUpDesc: '加入官方本地福利群，领积分领福利',
          popUpImg: 'http://192.168.1.187:10088/static/images/common/icon-get-point.png',
          popUpTargetUrl: '',
          popUpTimes: 0,
        },
      };
    },
    computed: {
      popCont() {
        return this.content.popUpDesc.split('，');
      },
    },
    methods: {
      getPoint() {
        uni.navigateTo({ url: `/pages/common/webpage?url=${this.content.popUpTargetUrl}` });
      },
      open(data) {
        Object.keys(this.content).map((key) => {
          if (data[key]) {
            this.content[key] = data[key];
          }
        });
        this.$refs.popup.open();
      },
      close() {
        this.$refs.popup.close();
      },
    },
  };
</script>

<style lang="scss" scope>
  .pop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .content {
      width: 560rpx;
      height: 650rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: red;
      .title {
        font-size: 50rpx;
        font-weight: 500;
        margin-top: 40rpx;
        margin-bottom: 32rpx;
      }
      .cont {
        font-size: 36rpx;
      }
      .get-point-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 560rpx;
        height: 650rpx;
        z-index: -1;
      }
    }
    .icon-close {
      width: 72rpx;
      height: 72rpx;
      margin-top: 36rpx;
    }
  }
</style>

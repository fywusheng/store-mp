<script>
  import UUID from 'uuid-js';
  import wx from 'utils/wx';
  export default {
    async onLaunch() {
      console.log('tiaozhu');
      // console.log('app created')
      // console.log('App Launch')
      // 将用户授权流量播放音频的操作重置
      uni.setStorageSync('network', false);

      wx.init();
      const deviceInfo = uni.getSystemInfoSync();
      App.systemInfo = deviceInfo;
      const isIphoneX = /iPhone X/i.test(deviceInfo.model);
      // iPhone X or iPhone XS
      const isIphoneXS =
        deviceInfo.platform === 'ios' &&
        deviceInfo.pixelRatio === 3 &&
        deviceInfo.screenWidth === 375 &&
        deviceInfo.screenHeight === 812;
      // iPhone XS Max
      const isIphoneXSMAX =
        deviceInfo.platform === 'ios' &&
        deviceInfo.pixelRatio === 3 &&
        deviceInfo.screenWidth === 414 &&
        deviceInfo.screenHeight === 896;
      // iPhone XR
      const isIphoneXR =
        deviceInfo.platform === 'ios' &&
        deviceInfo.pixelRatio === 2 &&
        deviceInfo.screenWidth === 414 &&
        deviceInfo.screenHeight === 896;
      App.isIphoneHair = isIphoneX || isIphoneXS || isIphoneXSMAX || isIphoneXR;
      if (!uni.getStorageSync('deviceNumber')) {
        uni.setStorageSync('deviceNumber', UUID.create(4).toString());
      }
    },
    onShow() {
      const updateManager = uni.getUpdateManager();
      if (!updateManager) {
        return;
      }
      // 新版本更新
      if (uni.canIUse('getUpdateManager')) {
        // 判断当前微信版本是否支持版本更新
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            // 请求完新版本信息的回调
            updateManager.onUpdateReady(function () {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  }
                },
              });
            });
            updateManager.onUpdateFailed(function () {
              uni.showModal({
                // 新的版本下载失败
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索(国家老龄服务平台)打开哟~',
              });
            });
          }
        });
      } else {
        uni.showModal({
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          title: '提示',
          content: '当前微信版本过低，部分功能无法使用，请升级到最新微信版本后重试。',
        });
      }
    },
  
  };
</script>

<style>
	/* @import url("@/plugin/animate/animate.min.css"); */
	@import 'static/css/base.css';
	@import 'static/iconfont/iconfont.css';
	@import 'static/css/guildford.css';
	@import 'static/css/style.scss';
  /*每个页面公共css */
  button {
    margin: 0;
    padding: 0;
    background: transparent;
    border: none;
  }
  button::after {
    border: none;
  }
  .placeholder {
    font-size: 40rpx;
    color: #999999;
  }
  .uni-button-color{
  	color: #FF5500!important;
  }
  .uni-select{
	  border:none!important;
	  height:56rpx!important;
  }
  .uni-select__input-text{
	  font-size:24rpx!important;
	  color: #444!important;
  }
  .uni-select__input-placeholder{
	   color: #999!important;
  }
  .input-value{
	  border:none!important;
  }
  .item-text-overflow{
	  text-align: left;
  }
  .selected-area{
	  display: none;
  }
  .check{
	  border-color: #FF5500;
  }
 .uni-calendar-item--multiple{
	  background-color: #FCC8AD!important;

  }
  .uni-calendar-item--isDay-text{
  	  color: #FF5500!important ;
  }
  .uni-calendar-item--checked,.uni-calendar-item--isDay,.uni-calendar-item--before-checked{
	   background-color: #FF5500!important;
	   color: #fff!important;
  }
  .uni-calendar-item--after-checked{
	    background-color: #FF5500!important;
		color: #fff!important;
  }


  /* #ifdef MP-WEIXIN */
  wx-swiper .wx-swiper-dot {
    width: 16rpx;
    height: 16rpx;
    background-color: rgba(255, 255, 255, 0.43);
  }
  wx-swiper .wx-swiper-dot-active {
    background-color: rgba(255, 255, 255, 1);
    width: 32rpx;
    border-radius: 8rpx;
  }
  /* #endif */
</style>
